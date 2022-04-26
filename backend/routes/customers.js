const router = require('express').Router()
const { Customer } = require('../models/customer.model')


router.route('/').get(async(req, res) => {
    Customer.find()
        .then(customers => res.json(customers))
        .catch(err => res.status(401).json("Error: " + err))
})

router.route('/add').post(async(req, res) => {
    const { fullName, phoneNumber, startingDate, lastSubscriptionTermination } = req.body
    // check the fileds
    if(!phoneNumber || !fullName || !startingDate || !lastSubscriptionTermination){
        res.status(401).json({
            error: {
                error: "error",
                message: "Please fill up all the required fields"
            }
        })
        return 
    }

    // check if customer already exist
    const customer = await Customer.findOne({phoneNumber})
    if (customer){
        res.status(401).json({
            error : {
                error: "error",
                message: "User already exists"
            }
        })
        return 
    }

    // create new customer
    const new_customer = new Customer({fullName, phoneNumber, startingDate ,lastSubscriptionTermination})

    await new_customer.save()
            .then(() => res.json({
                _id: new_customer?.id,
                fullName: new_customer?.fullName,
                phoneNumber: new_customer?.phoneNumber,
                lastSubscriptionTermination: new_customer?.lastSubscriptionTermination,
                startingDate: new_customer?.startingDate,
                active: new_customer?.active
            }))
            .catch(err => res.status(401).json("Error: " + err))
})



router.route('/delete/:id').get(async(req, res) => {
    const { id } = req.params
    console.log(id)
    // check id
    if (!id){
        res.status(401).json("Please Specify the Id in url params")
        return 
    }
    
    // check if customer is in database
    const customer =  await Customer.findOne({id})
    if (!customer){
        res.status(401).json("User does not exists")
        return 
    }

    // delete customer
    console.log(customer)
    await Customer.remove({_id: customer?._id})
        .then(() => res.json("Customer deleted"))
        .catch(err => res.json('Error: '+ err))
})

module.exports = router