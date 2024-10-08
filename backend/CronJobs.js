const cron = require('node-cron');
const { sendEmailNotification } = require('./services/emailService'); // Your email service
const { sendSMSNotification } = require('./services/smsService');     // Your SMS service
const Notifications = require('./models/Notifications');               // Your Notification model
const User = require('./models/User');               // Your Notification model

// Schedule the job to run every minute (for testing purposes)
cron.schedule('* * * * *', async () => {
    console.log('Running cron job to send notifications...');
    try {
        const users = await User.find({
          $or: [
            { 'notificationPreferences.emailSubscribed': true },
            { 'notificationPreferences.smsSubscribed': true }
          ]});

        // Fetch notifications that have not been sent (you can customize the filter)
        const notifications = await Notifications.find({ sent: false });

        for (const user of users) {
            const {notificationPreferences} = user
            //console.log(notificationPreferences);
           for (const notification of notifications) {
            const { isGeneral, userId, notificationMsg } = notification;
            console.log(isGeneral, userId, notificationMsg);
            if(isGeneral===false){
            // Call the functions to send email and SMS
                if(notificationPreferences.emailSubscribed===true) await sendEmailNotification(userId, notificationMsg);
                if(notificationPreferences.smsSubscribed===true) await sendSMSNotification(userId, notificationMsg);
            }
            else{
                if(userId===user._id){
                    if(notificationPreferences.emailSubscribed===true) await sendEmailNotification(userId, notificationMsg);
                    if(notificationPreferences.smsSubscribed===true) await sendSMSNotification(userId, notificationMsg);
                }
            }

            // Update the notification to mark it as sent
            notification.sent = true;
            await notification.save();
         }
        }
        console.log('Notifications sent successfully.');
    } catch (error) {
        console.error('Error running cron job:', error);
    }
});
