const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Null means it's for all users (general notification)
    productCode: { type: String, default: null }, // Products related to the notification (optional)
    notificationType: { type: String, required:true}, // The notification message
    createdAt: { type: Date, default: Date.now }, // Timestamp when created
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who created the promotion
    subscriptionStatus: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }, // Indicates if the notification has been read (specific user)
    notified: { type:Boolean, default:false}
});
module.exports = mongoose.model("Subscriptions", SubscriptionSchema,"Subscriptions");