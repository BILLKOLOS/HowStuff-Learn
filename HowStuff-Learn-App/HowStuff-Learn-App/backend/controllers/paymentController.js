const Payment = require('../models/Payment');
const Lecture = require('../models/Lecture');
const User = require('../models/User');
const paymentService = require('../utils/paymentService'); // Utility for payment processing
const notificationService = require('../utils/notificationService'); // Utility for notifications

// Process a payment for a lecture using PayPal or MPESA
exports.processPayment = async (req, res) => {
    try {
        const { userId, lectureId, paymentDetails, paymentMethod, isParentalApprovalRequired } = req.body;

        // Validate payment details
        const isValidPayment = await paymentService.validatePayment(paymentDetails);
        if (!isValidPayment) {
            return res.status(400).json({ message: 'Invalid payment details' });
        }

        // Check for parental approval if required
        if (isParentalApprovalRequired) {
            const user = await User.findById(userId);
            if (!user.parentApproved) {
                return res.status(403).json({ message: 'Parental approval is required for this payment.' });
            }
        }

        // Save payment to the database
        const payment = await Payment.create({
            userId,
            lectureId,
            amount: paymentDetails.amount,
            method: paymentMethod, // 'paypal' or 'mpesa'
            status: 'successful', // Update based on actual payment response
            transactionId: paymentDetails.transactionId,
        });

        // Update lecture status
        await Lecture.findByIdAndUpdate(lectureId, { $inc: { participantsCount: 1 } });

        // Notify user about successful payment
        const user = await User.findById(userId);
        await notificationService.sendPaymentNotification(user.email, payment);

        res.status(201).json({ message: 'Payment processed successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment processing failed', error });
    }
};

// Handle refund request
exports.processRefund = async (req, res) => {
    try {
        const { paymentId } = req.params;

        // Find the payment record
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Process refund through payment service
        const refundResult = await paymentService.processRefund(payment.transactionId);
        if (!refundResult.success) {
            return res.status(400).json({ message: 'Refund failed' });
        }

        // Update payment status
        payment.status = 'refunded';
        await payment.save();

        // Notify user about the refund
        const user = await User.findById(payment.userId);
        await notificationService.sendRefundNotification(user.email, payment);

        res.status(200).json({ message: 'Refund processed successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Refund processing failed', error });
    }
};

// Get payment history for a user
exports.getPaymentHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const payments = await Payment.find({ userId });

        res.status(200).json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve payment history', error });
    }
};

// Verify payment status
exports.verifyPayment = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const payment = await Payment.findOne({ transactionId });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to verify payment', error });
    }
};

// Get all payments for a lecture
exports.getLecturePayments = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const payments = await Payment.find({ lectureId });

        res.status(200).json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve payments for this lecture', error });
    }
};

// Additional utility function to handle payment notifications
const notifyPaymentSuccess = async (userId, payment) => {
    const user = await User.findById(userId);
    await notificationService.sendPaymentNotification(user.email, payment);
};

// Additional utility function to handle refund notifications
const notifyRefundSuccess = async (userId, payment) => {
    const user = await User.findById(userId);
    await notificationService.sendRefundNotification(user.email, payment);
};
