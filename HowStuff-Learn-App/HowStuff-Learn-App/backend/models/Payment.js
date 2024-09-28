const mongoose = require('mongoose');
const { Schema } = mongoose;

// Payment Schema Definition
const paymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user making the payment
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0, // Ensure the amount is not negative
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

// Middleware to validate payment amount
paymentSchema.pre('save', function(next) {
    if (this.amount < 0) {
        return next(new Error('Payment amount must be a positive value.'));
    }
    next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
