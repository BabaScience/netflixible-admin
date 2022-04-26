const mongoose = require('mongoose')
const { customerSchema } = require('./customer.model')
const { profileSchema } = require('./profile.models')


const { Schema } = mongoose



const accountSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    profiles: {
        type: [profileSchema],
        required: true
    },
    startingDate: {
        type: Date,
        require: true
    }
},
{
    timestamps: true
})


accountSchema.set('toJSON', {
    transform: function(doc, ret, options){
        return ret
    }, 
    versionKey: false,
    virtuals: true,
})

accountSchema.set('toObject', {
    transform: function(doc, ret, options){
        return ret
    }, 
    // versionKey: false,
    virtuals: true,
})



accountSchema.virtual('customers').get(function(){
    let users = []
    for (let i=0; i<this.profiles.length; i++){
        users = [...users, ...this.profiles[i].users]
    }
    return users.filter(user => user.active)
})



const Account = mongoose.model('Account',  accountSchema)

module.exports = {
    Account,
    accountSchema
}