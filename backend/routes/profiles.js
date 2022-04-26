const router = require('express').Router()
const {Profile} = require('../models/profile.models')



router.route('/').get(async(req, res) => {
    await Profile.find()
        .then(profiles => res.json(profiles))
        .catch(err => "Error: " + err)
})


router.route('/add').post(async(req, res) => {
    const {profiles} = req.body
    console.log(profiles)

    // check if profiles has everything
    if(!profiles || profiles.length < 1){
        res.json({
            error: "Specifiquez tout les details des profiles svp"
        })
        return
    }
    
    for(let i=0; i<profiles.length; i++){
        if(!profiles[i].profileName || !profiles[i].profileCode){
            res.json({
                error: "Specifiquez tout les details des profiles svp"
            })
            return
        }
        if(profiles[i].users.length > 0){
            for(let j=0; j< profiles[i].users.length; j++){
                if(!profiles[i]?.users[j].fullName || !profiles[i]?.users[j].phoneNumber){
                    res.json({
                        error: "Specifiquez tout les details des utilisateurs du profile svp"
                    })
                    return
                }
            }
        }
    }
    

    const profile = new Profile({
        profiles
    })

    await profile.save()
            .then(() => res.json(profile))
            .catch(err => {
                res.json({
                    error: err,
                    message: "error while uploading profiles"
                })
            })
})







module.exports = router