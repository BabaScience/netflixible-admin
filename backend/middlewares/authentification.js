


function isLoggedIn(req, res, next){
    if(req.isauthenticated()){
        return next()
    }
    else{
        res.redirect('/')
    }
}




module.exports = {
    isLoggedIn
}