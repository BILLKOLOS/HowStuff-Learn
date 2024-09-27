const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user making the payment
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['PayPal', 'MPESA'], // Define the payment methods available
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true, // Ensure transaction IDs are unique
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending', // Default status is pending until confirmed
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update `updatedAt` before saving
paymentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

