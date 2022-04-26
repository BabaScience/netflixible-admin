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
    if( !customer || !accountEmail || !price || !month  || !accountProfileCode){
        res.json({
            error:  {
                error: "Champs obligatoire manquants",
                message: "Remplissez tous les champs obligatoires svp.",
                customer,
                accountEmail,
                price,
                duration,
                month,
                accountProfileCode
            }
        })
        return
    }



    // check if account exists
    const account = await Account.findOne({email: accountEmail})
    if (!account){
        res.json({
            error: {
                error: "Compte Non Trouvé",
                message: "Désolé cet email n'est pas enrigistré à la base de données."
            }
        })
        return 
    }
    console.log(account)

    // check if account has available spots
    if (account?.customers.length >= maxUsersPerProfile * account?.profiles.length){
        res.json({
            error: {
                error: "compte plein",
                message: "Ce Compte est plein d'utilisateur. Essayez sur un autre compte."
            }
        })
        return
    }

    // check account profile avaible spot and also if profile code exists and if users is already in this account
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
    }

    

    // check if user exist and create  it if not
    const {fullName , phoneNumber} = customer
    
    const user = await  Customer.findOne({phoneNumber})
    const registered_customer = user
    if (!user){
        const registered_customer = new Customer({
            fullName,
            phoneNumber,
            startingDate: startingDate,
            lastSubscriptionTermination: endingDate
        })

        await registered_customer.save()
                .then(() => {
                    /*
                    res.json({
                        message: "utilisateur ajouté.",
                        _id: registered_customer?._id,
                        fullName: registered_customer?.fullName,
                        phoneNumber: registered_customer?.phoneNumber
                    })
                    */
                   console.log('new user added')
                   // console.log(registered_customer)
                }).catch(err => {
                    res.json({
                        error: {
                            error: err,
                            message: "Nous sommes désolé on n'a pas pu enrigistrer ce nouveau client."
                        }
                    })
                    return 
                })
    }
    else {
        // check if user is already in this account and if user is active 
        if (all_profiles.length){
            for (let i=0; i<all_profiles.length; i++){
                // console.log(all_profiles[i].profileCode , ' ---- ',  accountProfileCode)
                if(all_profiles[i].users){
                    for(let j=0; j<all_profiles[i].users.length; j++){
                        if(all_profiles[i].users[j].phoneNumber === customer.phoneNumber){
                            if (all_profiles[i].users[j].active){
                                Customer.updateOne({phoneNumber: all_profiles[i].users[j].phoneNumber},{
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
    }

    // invited client
    const invitedCustomer = null
    if (invitedByPhoneNumber){
        invitedCustomer = await Customer.find({phoneNumber: invitedByPhoneNumber})
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

    // update liste of users
    // const doc = await Account.findOne({_id: account._id})
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

    await subscription.save()
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
                })
            
           /*
            res.json({
                message: "Abonnement sauvegardé!",
                _id: subscription?._id,
                account: subscription?.account,
                invitedBy: subscription?.invitedBy,
                price: subscription?.price,
                month: subscription?.month
            })
            */
        }).catch(err => {
            res.json({
                error:  {
                    error: err,
                    message: "Nous somme désolé l'abonnement n'a pas pu etre enrigistré."
                }
            })
        })
    

    
})




module.exports = router