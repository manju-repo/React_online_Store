const nodemailer = require('nodemailer');

// Set up the transporter (replace with your SMTP settings)
const transporter = nodemailer.createTransport({
    service: 'gmail',  // You can use any SMTP service (Gmail, Outlook, etc.)
    auth: {
        user: process.env.COMPANY_EMAIL,      // Your email address from environment variables
        pass: process.env.EMAIL_PASSWORD      // Your email password from environment variables
    },
     tls: {
            rejectUnauthorized: false  // This disables certificate validation
        }
});

const sendEmailNotification = async (userId, message) => {
    try {
        // Find user email by userId (if needed), or pass the email directly
        const userEmail = 'manjusha.gupte@gmail.com';  // Fetch email for userId from DB

        const mailOptions = {
            from: process.env.COMPANY_EMAIL,     // Sender address
            to: userEmail,                      // Receiver's email
            subject: 'New Notification',        // Email subject
            text: message,                      // Email content
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to user ${userId}: ${message}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmailNotification };
