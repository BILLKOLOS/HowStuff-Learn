/*
// ../utils/paymentService.js

const PayPal = require('paypal-rest-sdk');
const Mpesa = require('mpesa-node'); // For integrating MPESA, you'll need to find a suitable package

// Configurations for PayPal
PayPal.configure({
  'mode': 'sandbox', // use 'live' for production
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

// MPESA Configuration
const mpesa = new Mpesa({
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortCode: process.env.MPESA_SHORTCODE,
  initiatorName: process.env.MPESA_INITIATOR_NAME,
  securityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
  environment: 'sandbox' // or 'production'
});

module.exports = {
  
  // PayPal Payment Creation
  createPayPalPayment: (paymentDetails) => {
    return new Promise((resolve, reject) => {
      const create_payment_json = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        transactions: [{
          amount: {
            currency: 'USD',
            total: paymentDetails.totalAmount
          },
          description: paymentDetails.description
        }],
        redirect_urls: {
          return_url: paymentDetails.returnUrl,
          cancel_url: paymentDetails.cancelUrl
        }
      };

      PayPal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });
  },

  // MPESA Payment
  processMpesaPayment: (paymentDetails) => {
    return new Promise((resolve, reject) => {
      const requestData = {
        phoneNumber: paymentDetails.phoneNumber,
        amount: paymentDetails.amount,
        accountReference: paymentDetails.accountReference,
        transactionDesc: paymentDetails.transactionDesc
      };

      mpesa.lipaNaMpesaOnline(requestData)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  },

  // Function to Verify Payment (for both PayPal and MPESA)
  verifyPayment: (paymentId, payerId) => {
    return new Promise((resolve, reject) => {
      const execute_payment_json = {
        payer_id: payerId
      };

      PayPal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });
  },

  // Refund Function (Optional)
  refundPayment: (paymentId) => {
    return new Promise((resolve, reject) => {
      const data = {
        amount: {
          total: '5.00',
          currency: 'USD'
        }
      };

      PayPal.sale.refund(paymentId, data, function (error, refund) {
        if (error) {
          reject(error);
        } else {
          resolve(refund);
        }
      });
    });
  }
};
*/

