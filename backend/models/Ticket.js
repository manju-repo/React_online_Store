const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: String,
  message: [
      {
        text: { type: String, required: true }, // Ensure the message text is not empty
        timeStamp: { type: Date, default: Date.now }, // Automatically set the timestamp
        sender: { type: String, enum:['client','support'], required: true } // Specify whether it's 'client' or 'support'
      }
  ],
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'], // Possible status values
    default: 'Open' // Default to 'Open' when a ticket is created
  },
  createdAt: { type: Date, default: Date.now }, // Timestamp for ticket creation
  updatedAt: { type: Date, default: Date.now } // Automatically update this on message addition
  });

module.exports = mongoose.model("Ticket", ticketSchema,"Ticket");