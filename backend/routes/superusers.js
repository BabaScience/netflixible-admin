const router = require('express').Router()

const SuperUser = require('../models/superuser.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = require('../functions/token')





router.route('/').get((req, res) => {
    SuperUser.find()
        .then(accounts => res.json(accounts))
        .catch(err => res.status(400).json({
            error: {
                error: err,
                message: "Error"
            }
        }))
})



router.route('/add').post(async(req, res) => {
    const { username , fullName, password } = req.body
    
    // check if all fields are filled up
    if (!username || !fullName || !password){
        res.status(201).json({
            error: {
                error: "error",
                message: 'Please fill all the required fields.'
            }
        })
        return
    }
    else {

        // check is username already exists 
        const user = await SuperUser.findOne({username: username})
        if (user?.username){
            res.status(201).json({
                error: {
                    error: "error",
                    message: "User Already Exists. "
                }
            })
            return
        }
        else {            
                // hash password
                var salt = await bcrypt.genSalt(10);
                var hashedPassword = await bcrypt.hash(password, salt);
            
                // save to database
                const newSuperUser = new SuperUser({
                    username, 
                    fullName,
                    password: hashedPassword
                })
            
                newSuperUser.save()
                    .then(() => res.status(200).json({
                        message:'SuperUser Added successfully',
                        _id: newSuperUser?.id,
                        fullName: newSuperUser?.fullName,
                        hashedPassword: newSuperUser?.password,
                        token: generateToken(newSuperUser?._id),
                    }))
                    .catch(err => res.status(400).json("Err: " + err))
        }
    }
})


router.route('/login').post(async(req, res) => {
    const { username, password } = req.body

    // check if username && password are given
    if(!username || !password){
        res.status(201).json({
            error: {
                error: "error",
                message: "Please Fill up all the required fields."
            }
        })
        return 
    }
    
    // cheks if data contains username
    const user = await SuperUser.findOne({username})
    if (user && (await bcrypt.compare(password, user.password))){
        res.status(201).json({
            message: 'SuperUser Logged In!',
            fullName: user?.fullName,
            username: user?.username,
            token: generateToken(user?._id)
        })
    }
    else {
        res.status(201).json({
            error: {
                error: "Eror",
                message: "Nom d'utliisateur or password Incorrect."
            }
        })
    }

})



module.exports = router