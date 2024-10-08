const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

let tempTokens = {}; // Store temporary tokens

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
      }
});

// Generate a random 6-digit verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000);
}

router.post('/send-2fa', (req, res) => {
    const { email } = req.body;
console.log(email, process.env.COMPANY_EMAIL, process.env.EMAIL_PASSWORD);
    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();

    // Generate a temporary token
    const tempToken = crypto.randomBytes(20).toString('hex');
    tempTokens[tempToken] = { email, verificationCode };

    const mailOptions = {
        from: process.env.COMPANY_EMAIL,
        to: email,
        subject: 'Your 2FA Code',
        text: `Your verification code is: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("error:",err.message);
            return res.status(500).send({ message: 'Failed to send 2FA code' });
        }
        res.status(200).send({ message: '2FA code sent. Please check your email.', tempToken });
    });
});

router.post('/verify-2fa', (req, res) => {
    const { tempToken, code } = req.body;
    const userInfo = tempTokens[tempToken];

    if (!userInfo) {
        return res.status(400).send({ message: 'Invalid token' });
    }

    if (code === userInfo.verificationCode.toString()) {
        req.session.is2FACompleted = true; // Mark 2FA as completed
        res.status(200).send({ message: '2FA verified. You can proceed with the order.' });
    } else {
        res.status(400).send({ message: 'Invalid 2FA code' });
    }
});

module.exports = router;
