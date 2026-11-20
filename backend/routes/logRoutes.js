
const express = require("express");
const { isIP } = require("node:net");

const SecurityLog = require("../models/SecurityLog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all security log routes
router.use(authMiddleware);

const allowedSeverities = [
  "low",
  "medium",
  "high",
  "critical"
];

const allowedProtocols = ["TCP", "UDP"];

// Helper: Validate optional non-negative numbers
const isValidOptionalNumber = (value) => {
  return (
    value === undefined ||
    value === null ||
    (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0
    )
  );
};

// POST: Create a new security log
router.post("/", async (req, res) => {
  try {
    const {
      sourceIp,
      destinationIp,
      eventType,
      severity,
      message,
      timestamp,
      login_attempts,
      failed_logins,
      bytes_sent,
      protocol,
      port
    } = req.body;

    // Validate required fields
    if (!sourceIp || !eventType || !message) {
      return res.status(400).json({
        success: false,
        message: "Source IP, event type, and message are required."
      });
    }

    // Validate source IP
    if (
      typeof sourceIp !== "string" ||
      !isIP(sourceIp.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid source IP address."
      });
    }

    // Validate destination IP
    if (
      destinationIp !== undefined &&
      destinationIp !== null &&
      destinationIp !== ""
    ) {
      if (
        typeof destinationIp !== "string" ||
        !isIP(destinationIp.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid destination IP address."
        });
      }
    }

    // Validate text fields
    if (
      typeof eventType !== "string" ||
      !eventType.trim() ||
      eventType.trim().length > 100 ||
      typeof message !== "string" ||
      !message.trim() ||
      message.trim().length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid event type or message."
      });
    }

    // Validate severity
    const logSeverity = severity || "low";

    if (!allowedSeverities.includes(logSeverity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid severity level."
      });
    }

    // Validate AI numerical fields
    if (
      !isValidOptionalNumber(login_attempts) ||
      !isValidOptionalNumber(failed_logins) ||
      !isValidOptionalNumber(bytes_sent)
    ) {
      return res.status(400).json({
        success: false,
        message: "AI numerical fields must be non-negative numbers or null."
      });
    }

    // Validate failed logins do not exceed login attempts
    if (
      login_attempts != null &&
      failed_logins != null &&
      failed_logins > login_attempts
    ) {
      return res.status(400).json({
        success: false,
        message: "Failed logins cannot exceed total login attempts."
      });
    }

    // Validate protocol
    if (
      protocol !== undefined &&
      protocol !== null &&
      !allowedProtocols.includes(protocol)
    ) {
      return res.status(400).json({
        success: false,
        message: "Protocol must be TCP, UDP, or null."
      });
    }

    // Validate destination port
    if (
      port !== undefined &&
      port !== null &&
      (
        typeof port !== "number" ||
        !Number.isInteger(port) ||
        port < 1 ||
        port > 65535
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Port must be an integer between 1 and 65535."
      });
    }

    // Validate timestamp
    let logTimestamp = new Date();

    if (timestamp !== undefined) {
      logTimestamp = new Date(timestamp);

      if (Number.isNaN(logTimestamp.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid timestamp."
        });
      }
    }

    // Save security log in MongoDB
    const newLog = await SecurityLog.create({
      sourceIp: sourceIp.trim(),
      destinationIp:
        typeof destinationIp === "string" && destinationIp.trim()
          ? destinationIp.trim()
          : null,
      eventType: eventType.trim(),
      severity: logSeverity,
      message: message.trim(),
      timestamp: logTimestamp,
      userId: req.user.id,

      // Optional AI fields
      login_attempts: login_attempts ?? null,
      failed_logins: failed_logins ?? null,
      bytes_sent: bytes_sent ?? null,
      protocol: protocol ?? null,
      port: port ?? null
    });

    // Notify only the authenticated user's room
    const io = req.app.get("io");

    if (io) {
      io.to(`user_${req.user.id}`).emit("newSecurityLog", {
        success: true,
        message: "New security log detected!",
        log: newLog
      });
    }

    return res.status(201).json({
      success: true,
      message: "Security log created successfully.",
      log: newLog
    });

  } catch (error) {
    console.error("Create security log error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create security log."
    });
  }
});


// GET: Retrieve and filter security logs
router.get("/", async (req, res) => {
  try {
    const { severity, eventType, search } = req.query;

    const filter = {
      userId: req.user.id
    };

    // Filter by severity
    if (severity) {
      if (!allowedSeverities.includes(severity)) {
        return res.status(400).json({
          success: false,
          message: "Invalid severity filter."
        });
      }

      filter.severity = severity;
    }

    // Filter by event type
    if (eventType) {
      if (
        typeof eventType !== "string" ||
        eventType.length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid event type filter."
        });
      }

      filter.eventType = {
        $regex: eventType,
        $options: "i"
      };
    }

    // Search message and IP addresses
    if (search) {
      if (
        typeof search !== "string" ||
        search.length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Search text must be 100 characters or fewer."
        });
      }

      const safeSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        { message: { $regex: safeSearch, $options: "i" } },
        { sourceIp: { $regex: safeSearch, $options: "i" } },
        { destinationIp: { $regex: safeSearch, $options: "i" } }
      ];
    }

    const logs = await SecurityLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });

  } catch (error) {
    console.error("Fetch security logs error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve security logs."
    });
  }
});

module.exports = router;
