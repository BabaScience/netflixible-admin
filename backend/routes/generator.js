const router = require('express').Router()
const { Account } = require('../models/account.model')



router.route('/').get((req, res) => {
    res.json('generator')
})


router.route('/password').get((req, res) => {
    try {
        const password = generatePassword(length=15, chars="netflix")
        res.status(200).json({password})
    }
    catch {
        res.status(500).json({error: "Error while generating random password"})
    }
})



router.route('/code').get((req, res) => {
    try {
        const code = generateCode()
        res.status(200).json({code})
    }
    catch {
        res.status(500).json({error: "Error while generating random code"})
    }
})

router.route('/pick-account').get(async(req, res) => {
    await Account.find()
            .then(accounts => {
                const account = pickAvailableAccount(accounts)
                if(account){
                    res.json({
                        email: account?.email
                    })
                }else {
                    res.json({
                        error: {
                            error: "Error",
                            message: "Auccun compte n'a été trouvé"
                        }
                    })
                    return
                }
            }).catch(err => {
                res.json({
                    error: {
                        error: "Error",
                        message: "Erreur technique en choisiçant un profile"
                    }
                })
                return
            })
})

router.route('/pick-profile').post(async(req, res) => {
    const { email } = req.body
    const account = await Account.findOne({ email })
    if(account){
        if (account?.profiles){
            const profile = pickAvailableProfile(account?.profiles)
            if(profile){
                res.json({
                    message: "profile trouvé!",
                    profileCode: profile.profileCode
                })
                return
            }
            else {
                res.json({
                    error: {
                        error: "Profile non trouvé",
                        message: "Ce compte n'a pas de profile disponible."
                    }
                })
                return
            }
        }
        else{
            res.json({
                error: {
                    error: "Profile inconnu",
                    message: "Ce compte n'a pas de profile"
                }
            })
            return
        }
    }
    else {
        res.json({
            error: {
                error: "Compte inconnu",
                message: "Ce Compte n'existe pas"
            }
        })
        return
    }

})


const pickAvailableProfile = (profiles) => {
    const scores = []
    for(let i=0; i<profiles.length; i++){
        const active_users = profiles[i].users.filter(us => us.active)
        if(active_users){
            scores.push(4 - active_users.length)
        }
        else{
            return scores.push(4)
        }
    }
    const maxIndex = getMaxIndexFromArray(scores)
    return profiles[maxIndex]
}

function pickAvailableAccount(accounts){
    const scores = []
    for(let i=0; i<accounts.length; i++){
        if(accounts[i].customers){
            scores.push((accounts[i].profiles.length * 4) - accounts[i].customers.length)
        }
        else{
            return scores.push((accounts[i].profiles.length * 4))
        }
    }
    const maxIndex = getMaxIndexFromArray(scores)
    return accounts[maxIndex]
}

function getMaxIndexFromArray(arr) {
    console.log(arr)
    let maxIndex = 0
    let maxValue = 0
    for(let i=0; i<arr.length; i++){
        console.log('i: ', i)
        if(arr[i] >= maxValue){
            maxIndex = i
            maxValue = arr[i]
        }
    }
    // console.log(NoneOfThem)
    console.log("maxValue", maxValue)
    console.log("maxIndex", maxIndex)
    if (maxValue === 0){
        return null
    }
    return maxIndex
}

const generatePassword = (length, chars) => {
    const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const integers = "0123456789"
    const exCharacters = "!@#$%^&*_-=+"
    // let chars = alpha;
    chars += alpha
    chars += integers
    // chars += exCharacters
 
    let password = ""
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
};

const generateCode = (length=4) => {
    const integers = "0123456789"

    let code = ""
    for (let i = 0; i < length; i++) {
        code += integers.charAt(Math.floor(Math.random() * integers.length))
    }
    return code
};


module.exports = router