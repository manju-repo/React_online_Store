const twilio = require('twilio');
console.log(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// Set up Twilio client (replace with your Twilio credentials)
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMSNotification = async (userId, message, templateName, userVariables) => {
console.log(userId, message, templateName, userVariables);
    try {
        // Find user's phone number by userId (if needed), or pass the phone number directly
        const userPhoneNumber = '+919987012878';  // Fetch phone number for userId from DB

        const smsResponse = await client.messages.create({
            body: message,                      // SMS content
            from: 'whatsapp:+14155238886',           // Twilio WhatsApp sandbox number
            to: 'whatsapp:+919987012878',             // Receiver's phone number

            template: {
                            name: templateName,           // Pre-approved template name
                            language: {
                                code: 'en'                // Language code for the template
                            },
                            components: [
                                {
                                    type: 'body',
                                    parameters: userVariables   // Variables to pass into the template
                                }
                            ]
                        }
        });

        console.log(`WhatsApp message sent to user ${userId}: ${smsResponse.sid}`);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

module.exports = { sendSMSNotification };
