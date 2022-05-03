const router = require('express').Router()
const Subscription = require('../models/subscription.model')
const { Account } = require('../models/account.model')
const { Customer } = require('../models/customer.model')



router.route('/').get(async(req, res) => {
    await Subscription.find()
            .then(subscriptions => res.json(subscriptions))
            .catch(err =>  res.json("Error: " + err))

})

router.route('/add').post(async(req, res) => {
    const { customer, invitedByPhoneNumber, accountEmail, accountProfileCode, price, duration, month, startingDate, endingDate } = req.body
    const maxUsersPerProfile = 4
    // check if required fields are filled up
    
    try {
        if( !customer || !accountEmail || !price || !month  || !accountProfileCode){
            throw {
                error:  {
                    error: "Champs obligatoire manquants",
                    message: "Remplissez tous les champs obligatoires svp."
                }
            }
        }
        // check if account exists
        const account = await Account.findOne({email: accountEmail}).exec()
        console.log(account)
        if (!account){
            throw {
                error: {
                    error: "Compte Non Trouvé",
                    message: "Désolé cet email n'est pas enrigistré à la base de données."
                }
            }
        }

        // check if account has available spots
        if (account?.customers.length >= maxUsersPerProfile * account?.profiles.length){
            throw {
                error: {
                    error: "compte plein",
                    message: "Ce Compte est plein d'utilisateur. Essayez sur un autre compte."
                }
            }
        }

        // check account profile avaible spot and also if profile code exists and if users is already in this account
        const all_profiles = account?.profiles
        const other_profiles = []
        let prof_exists = false
        if (all_profiles.length){
            for (let i=0; i<all_profiles.length; i++){
                // console.log(all_profiles[i].profileCode , ' ---- ',  accountProfileCode)
                if (all_profiles[i].profileCode === accountProfileCode){
                    prof_exists = true
                    let active_users = all_profiles[i].users.filter(us => us.active)
                    if(active_users.length >= maxUsersPerProfile){
                        throw {
                            error: {
                                error: "profile plein",
                                message: "Profile Plein, essayer sur un autre profile"
                            }
                        }
                        
                    }
                }
                else {
                    other_profiles.push(all_profiles[i])
                }
            }
        }

        if(!prof_exists){
            throw {
                error: {
                    error: "profile inconnu",
                    message: "Profile Inconnu, aucun profile de ce compte a ce code."
                }
            }
            
        }

        // check if user exist and create  it if not
        const {fullName , phoneNumber} = customer
        
        const user = await  Customer.findOne({phoneNumber}).exec()
        let registered_customer
        if (!user){
            try {
                registered_customer = new Customer({
                                        fullName,
                                        phoneNumber,
                                        startingDate: startingDate,
                                        lastSubscriptionTermination: endingDate
                                    })
                await registered_customer.save()
                console.log('new user added')
            }catch(err){
                throw {
                    error: {
                        error: err,
                        message: "Nous sommes désolé on n'a pas pu enrigistrer ce nouveau client."
                    }
                }
            }            
        }
        else {
            // check if user is already in this account and if user is active
            registered_customer = user
            if(user?.active){
                try {
                    const userPhoneNumber = user?.phoneNumber
                    const abonnement = await Subscription.findOne({"customer.phoneNumber" : userPhoneNumber })
                    console.log("Abonnement: ", abonnement)
                    if(!abonnement) {
                        throw {
                            error: {
                                error:  "Error",
                                message: "Aucun Abonnement trouvé"
                            } 
                        }
                        // console.log("error: ")
                    }
                    else {
                        console.log("NOUVEAU ABONNEMENT: ", new Date(abonnement.endingDate))
                        console.log("ANCIEN ABONNEMENT: ", new Date(endingDate))
                        console.log("MAINTENANT: ", new Date())
                        console.log("NOUVEAU ABONNEMENT > ANCIEN ABONNEMENT: ", new Date(endingDate) > new Date())
                        // if the current subscription deadline is longer than the current subscription deadline
                        if (new Date(abonnement.endingDate) >= new Date(endingDate)){
                            throw {
                                error: {
                                    error: "Abonnement en cours",
                                    message: `L'abonnement du client n'est pas encore fini. Prochaine renouvellement - ${(abonnement?.endingDate).toDateString()}`
                                }
                            }                            
                        }
                        else {
                            // Update Customer lastSubscriptionTermination
                            await Customer.updateOne({phoneNumber: abonnement.customer.phoneNumber}, {
                                $set: {
                                    lastSubscriptionTermination: endingDate
                                }
                            })
                            
                            // terminate current subscription
                            try{
                                Subscription.updateOne({"customer.phoneNumber" : userPhoneNumber },
                                {
                                    $set: {
                                        endingDate: new Date()
                                    }
                                })
                                const invitedCustomer = null
                                if (invitedByPhoneNumber){
                                    invitedCustomer = await Customer.find({phoneNumber: invitedByPhoneNumber}).exec()
                                }
                                try {
                                    const new_sub = await new Subscription({
                                        customer: registered_customer,
                                        account,
                                        price,
                                        invitedBy: invitedCustomer,
                                        startingDate,
                                        endingDate
                                    })
                                    new_sub.save()
                                    
                                    res.json({
                                        message: "Customer Subscription Updated successfully!"
                                    })
                                    return
                                }catch(err){
                                    throw {
                                        error: {
                                            error: err,
                                            message: "Could not create a new subscriton."
                                        }
                                    }
                                }
                                
                                // subscription.startingDate = endingDate
                                // subscription.endingDate = endingDate
                                // subscription.save()
                            }
                            catch(err){
                                throw {
                                    error: {
                                        error: err,
                                        message: "Could not update customer."
                                    }
                                }
                            }


                        }
                    }

                }catch(err){
                    throw err
                }
            }
            
            if (all_profiles.length){
                for (let i=0; i<all_profiles.length; i++){
                    // console.log(all_profiles[i].profileCode , ' ---- ',  accountProfileCode)
                    if(all_profiles[i].users){
                        for(let j=0; j<all_profiles[i].users.length; j++){
                            if(all_profiles[i].users[j].phoneNumber === customer.phoneNumber){
                                if (all_profiles[i].users[j].active){
                                    await Customer.updateOne({phoneNumber: all_profiles[i].users[j].phoneNumber},{
                                        $set: {
                                            active: true,
                                            lastSubscriptionTermination: endingDate
                                        }
                                    }).then(() =>{
                                        console.log('Customer Status updated!')
                                    }).catch(() =>{
                                        throw {
                                            error: {
                                                error: "mise a jour echouée",
                                                message: "Le Status du client n'as pas etre mis a jour."
                                            }
                                        }
                                    })
                                }
                                throw {
                                    error: {
                                        error: "Utilisateur deja abonné.",
                                        message: `l'Abonnement de cet tilisateur se termine: ${(new Date(all_profiles[i].users[j].lastSubscriptionTermination)).toDateString()}`
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        // invited client
        const invitedCustomer = null
        if (invitedByPhoneNumber){
            invitedCustomer = await Customer.find({phoneNumber: invitedByPhoneNumber}).exec()
        }

        // make subscription
        const subscription = new Subscription({
            customer: registered_customer,
            account,
            duration,
            price,
            invitedBy: invitedCustomer,
            month,
            startingDate,
            endingDate
        })
        
        console.log('++++++++++++++++++++')
        console.log(account)
        const doc_profiles = account?.profiles
        const profileName = account?.profileName
        const profileCode = accountProfileCode
        let new_profile_users = []
        for (let i=0; i<doc_profiles.length; i++){
            if(doc_profiles[i].profileCode === accountProfileCode){
                new_profile_users = [registered_customer, ...doc_profiles[i].users]
            }
        }
        console.log("------")
        console.log(new_profile_users)
        
        try {
            const sub = await subscription.save()
            if (sub){
                try {
                    await Account.updateOne({_id: account._id},
                    {
                        $set: {
                            profiles: [
                                ...other_profiles,
                                {
                                    profileName,
                                    profileCode,
                                    users: new_profile_users
                                }
                            ]
                        }
                    })
                    try{
                        Customer.updateOne({_id: registered_customer._id},
                            {
                                $set: {
                                    lastSubscriptionTermination: endingDate
                                }
                            })
        
                        res.json({
                            message: "Abonnement sauvegardé!",
                            _id: subscription?._id,
                            account: subscription?.account,
                            invitedBy: subscription?.invitedBy,
                            price: subscription?.price,
                            month: subscription?.month
                        })

                    }catch(err) {
                        throw {
                            error: {
                                error: err,
                                message: "Désolé nous avons pas pu mettre a jour les données du client."
                            }
                        }
                    }

                }catch(err) {
                    throw {
                        error: {
                            error: err,
                            message: "Désolé nous avons pas pu mettre a jour les données du compte netflix."
                        }
                    }
                }

            }
            else {
                throw {
                    error: {
                        error: err,
                        message: "Dèsolé on n'a pas pu ajouter cet  utilisateur sur le compte netflix."
                    }
                }
            }



        }catch(err){
            throw err
        }




    }catch(error){
        console.log("Error Catched ->", error.error )
        res.json(error)
        /* res.json({
            error: {
                error: "Compte Non Trouvé",
                message: "Désolé cet email n'est pas enrigistré à la base de données."
            }
        }) */
    }

    /* // check if account exists
    const account = await Account.findOne({email: accountEmail}).exec()
    if (!account){
        res.json({
            error: {
                error: "Compte Non Trouvé",
                message: "Désolé cet email n'est pas enrigistré à la base de données."
            }
        })
        return 
    }
    console.log(account) */

    /* // check if account has available spots
    if (account?.customers.length >= maxUsersPerProfile * account?.profiles.length){
        res.json({
            error: {
                error: "compte plein",
                message: "Ce Compte est plein d'utilisateur. Essayez sur un autre compte."
            }
        })
        return
    } */

    /* // check account profile avaible spot and also if profile code exists and if users is already in this account
    const all_profiles = account?.profiles
    const other_profiles = []
    let prof_exists = false
    if (all_profiles.length){
        for (let i=0; i<all_profiles.length; i++){
            console.log(all_profiles[i].profileCode , ' ---- ',  accountProfileCode)
            if (all_profiles[i].profileCode === accountProfileCode){
                prof_exists = true
                let active_users = all_profiles[i].users.filter(us => us.active)
                if(active_users.length >= maxUsersPerProfile){
                    res.json({
                        error: {
                            error: "profile plein",
                            message: "Profile Plein, essayer sur un autre profile"
                        }
                    })
                    return
                }
            }
            else {
                other_profiles.push(all_profiles[i])
            }
        }
    }

    if(!prof_exists){
        res.json({
            error: {
                error: "profile inconnu",
                message: "Profile Inconnu, aucun profile de ce compte a ce code."
            }
        })
        return
    } */

    

    /* // check if user exist and create  it if not
    const {fullName , phoneNumber} = customer
    
    const user = await  Customer.findOne({phoneNumber}).exec()
    
    if (!user){
        try {
            registered_customer = Customer.create({
                fullName,
                phoneNumber,
                startingDate: startingDate,
                lastSubscriptionTermination: endingDate
            })
            console.log('new user added')
        }catch(err){
            res.json({
                error: {
                    error: err,
                    message: "Nous sommes désolé on n'a pas pu enrigistrer ce nouveau client."
                }
            })
        }

        
    }
    else {
        // check if user is already in this account and if user is active
        const registered_customer = user
        if(user?.active){
            const abonnement = await Subscription.findOne({ customer : user}).exec()
            if(!abonnement) {
                res.status(201).json({
                    error: {
                        error:  "Error",
                        message: "Error: "
                    } 
                })
                console.log("error: ")
            }
            else {
                res.status(200).json({
                    error: {
                        message: `L'abonnement du client n'est pas encore fini. - ${abonnement?.price}`
                    }
                })
            }
        }
        
        if (all_profiles.length){
            for (let i=0; i<all_profiles.length; i++){
                // console.log(all_profiles[i].profileCode , ' ---- ',  accountProfileCode)
                if(all_profiles[i].users){
                    for(let j=0; j<all_profiles[i].users.length; j++){
                        if(all_profiles[i].users[j].phoneNumber === customer.phoneNumber){
                            if (all_profiles[i].users[j].active){
                                await Customer.updateOne({phoneNumber: all_profiles[i].users[j].phoneNumber},{
                                    $set: {
                                        active: true,
                                        lastSubscriptionTermination: endingDate
                                    }
                                }).then(() =>{
                                    console.log('Customer Status updated!')
                                }).catch(() =>{
                                    res.json({
                                        error: {
                                            error: "mise a jour echouée",
                                            message: "Le Status du client n'as pas etre mis a jour."
                                        }
                                    })
                                })
                            }
                            res.json({
                                error: {
                                    error: "Utilisateur deja abonné.",
                                    message: `l'Abonnement de cet tilisateur se termine: ${(new Date(all_profiles[i].users[j].lastSubscriptionTermination)).toDateString()}`
                                }
                            })
                            return
                        }
                    }
                }
            }
        }
    } */

    /* // invited client
    const invitedCustomer = null
    if (invitedByPhoneNumber){
        invitedCustomer = await Customer.find({phoneNumber: invitedByPhoneNumber}).exec()
    } */


    /* // make subscription
    const subscription = new Subscription({
        customer: registered_customer,
        account,
        duration,
        price,
        invitedBy: invitedCustomer,
        month,
        startingDate,
        endingDate
    }) */

    // update liste of users
    // const doc = await Account.findOne({_id: account._id})
    /* console.log('++++++++++++++++++++')
    console.log(account)
    const doc_profiles = account?.profiles
    const profileName = account?.profileName
    const profileCode = accountProfileCode
    let new_profile_users = []
    for (let i=0; i<doc_profiles.length; i++){
        if(doc_profiles[i].profileCode === accountProfileCode){
            new_profile_users = [registered_customer, ...doc_profiles[i].users]
        }
    }
    console.log("------")
    console.log(new_profile_users) */

    /* await subscription.save()
        .then(() => {
            Account.updateOne({_id: account._id},
                {
                    $set: {
                        profiles: [
                            ...other_profiles,
                            {
                                profileName,
                                profileCode,
                                users: new_profile_users
                            }
                        ]
                    }
                }).then(() => {
                    res.json({
                        message: "Abonnement sauvegardé!",
                        _id: subscription?._id,
                        account: subscription?.account,
                        invitedBy: subscription?.invitedBy,
                        price: subscription?.price,
                        month: subscription?.month
                    })
                }).catch(err => {
                    res.status(401).json({
                        error: {
                            error: err,
                            message: "Dèsolé on n'a pas pu ajouter cet  utilisateur sur le compte netflix."
                        }
                    })
                }) */
            
           /*
            res.json({
                message: "Abonnement sauvegardé!",
                _id: subscription?._id,
                account: subscription?.account,
                invitedBy: subscription?.invitedBy,
                price: subscription?.price,
                month: subscription?.month
            })
            
           return
        }).catch(err => {
            res.json({
                error:  {
                    error: err,
                    message: "Nous somme désolé l'abonnement n'a pas pu etre enrigistré."
                }
            })
        })
        */
    

    
})




module.exports = router