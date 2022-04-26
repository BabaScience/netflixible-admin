const router = require('express').Router()
const {Account} = require('../models/account.model')
const {Customer} = require('../models/customer.model')


router.route('/').get(async(req, res) => {
    console.log("fetching accounts")
    await Account.find()
        .then(accounts => res.json(accounts))
        .catch(err => res.json({
            error: {
                error: "Error: " + err,
                message: "Error while cheking accounts collections"
            }
        }))
})

router.route('/add').post(async(req, res) => {
    const { email, password, profiles, users, startingDate } = req.body 

    // check if all the fields are filled up
    if(email &&  password && profiles && startingDate){
        // check if account already exists
        const account = await Account.findOne({email})
        if (!account){
            const new_account = new Account({email, password, profiles , users, startingDate})
            await new_account.save()
                    .then(() => res.json({
                        email: new_account?.email,
                        password: new_account?.password,
                        profiles: new_account?.profiles,
                        customers: new_account?.customers,
                        startingDate: new_account?.startingDate
                        
                    }))
                    .catch(err => res.json({
                        error: {
                            error: err,
                            message: "Database Issue: Réessayez Plus Tards"
                        }
                    }))
            return
        }
        else {
            res.json({
                error: {
                    error: "Ce Compte exist deja",
                    message: "Ce Compte exist deja, essayez sur un nouveau Email."
                }})
            return
        }

    }
    else {
        res.json({
            error: {
                error: "Champs obligatoires manquants.",
                message: "Remplissez tout les champs svp."
        }})
        return 
    }
})

router.route('/delete/:id').delete(async(req, res) => {
    const { id } = req.params
    const account = await Account.findOne({ id })
    if (account){
        Account.deleteOne({id})
            .then(() => res.json("account deleted"))
            .catch(err => res.status(401).json('Error: ' + err) )
    }
    else {
        res.status(401).json('Error while deleting.')
    }
})

router.route('/adduser/:email').post(async(req, res) => {
    const { email } = req.params
    const { phoneNumber } = req.body
    
    //check fields
    if(!phoneNumber){
        res.status(401).json("Please fill up all fields.")
        return
    }

    // check if account exits
    const account = await Account.findOne({email})
    if(account) {
        // get user
        const user = await Customer.findOne({phoneNumber})
        if (user){
            Account.updateOne({_id: account._id},
                {
                    $push: {
                        users: user
                    }
                }).then(() => {
                    res.json('User Added to account')
                }).catch(err => {
                    res.status(401).json("Error while adding user to account")
                })
        }
        else{
            res.status(401).json("Customer does not exits")
        }

    }
    else {
        res.status(401).json("Account does not exits")
        return 
    }
})






module.exports = router