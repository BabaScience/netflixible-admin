const mongoose = require('mongoose')

const { Schema } = mongoose



const customerSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    startingDate:  {
        type: Date,
        required: true
    },
    lastSubscriptionTermination: {
        type: Date,
        required: true
    }
},
{
    timestamps: true
})

customerSchema.set('toJSON', {
    transform: function(doc, ret, options){
        return ret
    },
    virtuals: true,
    versionKey: false
})
customerSchema.set('toObject', {
    transform: function(doc, ret, options){
        return ret
    },
    virtuals: true,
    // versionKey: false
})
customerSchema.virtual('active').get(function(){
    return this.lastSubscriptionTermination > Date.now()
})

const Customer = mongoose.model('Customer',  customerSchema)

module.exports = {
    Customer,
    customerSchema
}