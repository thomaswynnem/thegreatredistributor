const mongoose = require("mongoose")

const Schema = mongoose.Schema

const transactionSchema = new Schema({
    amount: {
        type: Number,
        required: false,
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }

})

const userSchema = new Schema({
    userWallet: {
        type: String,
        required: true,
        unique: true,
    },
    userEmail: {
        type: String,
        required: false,
        unique: true,
    },
    transactions:
     [transactionSchema],
    userReturns: {
        type: Number,
        required:false,
    },
    userName: {
        type: String, 
        required: false,
        unique: true,
    },
    decision: {
        type: Number,
        required: false,
    }
})



const User = mongoose.model("user", userSchema)



module.exports = User