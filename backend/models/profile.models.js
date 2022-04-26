const mongoose = require('mongoose')
const { customerSchema } = require('./customer.model')

const Schema = mongoose.Schema






const profileSchema = new Schema({
    profileName: {
        type: String,
    },
    profileCode: {
        type: Number
    },
    users: {
        type: [customerSchema]
    }
})


const Profile = mongoose.model("Profile", profileSchema)

module.exports = {
    Profile,
    profileSchema
}