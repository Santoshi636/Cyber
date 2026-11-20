
const mongoose = require("mongoose");

const securityLogSchema = new mongoose.Schema(
  {
    // Existing security log fields
    sourceIp: {
      type: String,
      required: true,
      trim: true
    },

    destinationIp: {
      type: String,
      trim: true,
      default: null
    },

    eventType: {
      type: String,
      required: true,
      trim: true
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low"
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },

    timestamp: {
      type: Date,
      default: Date.now
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Additional AI analysis input fields
    login_attempts: {
      type: Number,
      default: null,
      min: 0
    },

    failed_logins: {
      type: Number,
      default: null,
      min: 0
    },

    bytes_sent: {
      type: Number,
      default: null,
      min: 0
    },

    protocol: {
      type: String,
      enum: ["TCP", "UDP", null],
      default: null
    },

    port: {
      type: Number,
      default: null,
      min: 1,
      max: 65535
    }
  },
  {
    timestamps: true
  }
);

const SecurityLog = mongoose.model(
  "SecurityLog",
  securityLogSchema
);

module.exports = SecurityLog;
