const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    isGeneral: { type: Boolean, default: false }, // True for general notifications, False for user-specific
    userId: { type: String, default: null }, // Null means it's for all users (general notification)
    userType: { type: String, enum: ['Client', 'Vendor', 'Admin'], default: null },
    productCode: String, // Products related to the notification (optional)
    //size: { type: String, default: null }, // Size related to the product (essential for low stock alerts)
    notificationMsg: { type: String, default:'Banner'}, // The notification message
    imageUrl: String, // Optional: URL for an image related to the promotion
    approved: { type: Boolean, default: false }, // Approval status needed for general notifications to be displayed on homepage and sent to users
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who approved the promotion
    approvalDate: Date, // Date when the promotion was approved
    createdAt: { type: Date, default: Date.now }, // Timestamp when created
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who created the promotion
    readByUser: { type: Boolean, default: false }, // Indicates if the notification has been read (specific user)
    status:  { type: String, enum: ['Created', 'Notified', 'Read'], default: 'Created' },
    sent:  { type: Boolean, default: false }
});
module.exports = mongoose.model("Notifications", NotificationSchema,"Notifications");