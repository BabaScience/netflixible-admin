const mongoose = require('mongoose')


const { Schema } = mongoose



const superUserSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }

},
{
    timestamps: true
})


const SuperUser = mongoose.model('SuperUser',  superUserSchema)

module.exports = SuperUser