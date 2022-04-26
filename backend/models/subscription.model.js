const mongoose = require('mongoose')
const { customerSchema } = require('./customer.model')
const { accountSchema } = require('./account.model')


const { Schema } = mongoose


const subscriptionSchema = new Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    account: {
        type: accountSchema,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    invitedBy: {
        type: customerSchema,
    },
    startingDate: {
        type: Date,
        required: true
    },
    endingDate: {
        type: Date,
        required: true
    }
},
{
    timestamps: true
})


subscriptionSchema.set('toJSON', {
    virtuals: true
})

subscriptionSchema.set('toObject', {
    virtuals: true,
    versionKey: false
})
subscriptionSchema.virtual('month').get(function(){
    return (this.startingDate).getMonth()
})


subscriptionSchema.virtual('year').get(function(){
    return (this.startingDate).getYear()
})


const Subscription = mongoose.model('Subscription',  subscriptionSchema)

module.exports = Subscription