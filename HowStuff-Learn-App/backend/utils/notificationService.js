const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services like SMTP, SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or application-specific password
  }
});

const sendEmailNotification = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

// Example function to send a push notification
const sendPushNotification = (deviceToken, message) => {
  // Placeholder for push notification logic (e.g., using Firebase Cloud Messaging)
  return new Promise((resolve, reject) => {
    // Implement your push notification logic here
    // This is a placeholder implementation
    console.log(`Push notification sent to ${deviceToken}: ${message}`);
    resolve(`Push notification sent: ${message}`);
  });
};

module.exports = {
  sendEmailNotification,
  sendPushNotification
};
