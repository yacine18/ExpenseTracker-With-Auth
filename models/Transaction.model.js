const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('transactions', transactionSchema)