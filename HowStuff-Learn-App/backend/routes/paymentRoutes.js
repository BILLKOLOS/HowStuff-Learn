const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have authentication middleware

// Route to create a PayPal payment
router.post('/paypal/create', authMiddleware, PaymentController.createPayPalPayment);

// Route to execute a PayPal payment
router.post('/paypal/execute', authMiddleware, PaymentController.executePayPalPayment);

// Route to create an MPESA payment
router.post('/mpesa/create', authMiddleware, PaymentController.createMPesaPayment);

// Route to handle MPESA callback
router.post('/mpesa/callback', PaymentController.handleMPesaCallback);

// Route to refund a payment
router.post('/refund', authMiddleware, PaymentController.refundPayment);

module.exports = router;

