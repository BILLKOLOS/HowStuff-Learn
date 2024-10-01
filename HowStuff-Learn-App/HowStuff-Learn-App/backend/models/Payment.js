const mongoose = require('mongoose');
const { Schema } = mongoose;

// Payment Schema Definition
const paymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user making the payment
        required: true,
    },
    userRole: {
        type: String,
        enum: ['Student', 'Parent', 'Admin', 'Teacher'],
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
    description: {
        type: String,
        required: true,
        trim: true, // Description of the payment
    },
    paymentDate: {
        type: Date,
        default: Date.now, // Capture when the payment was processed
    },
    refundStatus: {
        type: Boolean,
        default: false, // Track if the payment has been refunded
    },
    currency: {
        type: String,
        required: true,
        default: 'USD', // Default currency for payments
    },
    paymentDetails: {
        type: Schema.Types.Mixed, // Flexible structure for storing additional payment info
        payPalInvoice: {
            type: String,
        },
        mpesaCode: {
            type: String,
        },
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurrence: {
        type: String,
        enum: ['Weekly', 'Monthly', 'Yearly'],
    },
    nextPaymentDate: {
        type: Date,
    },
    transactionHistory: [{
        transactionId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed'],
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
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

// Middleware to validate payment status
paymentSchema.pre('save', function(next) {
    if (!['Pending', 'Completed', 'Failed'].includes(this.status)) {
        return next(new Error('Invalid payment status.'));
    }
    next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
