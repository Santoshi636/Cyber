
const express = require("express");

const SecurityLog = require("../models/SecurityLog");
const authMiddleware = require("../middleware/authMiddleware");

const {
  checkAIHealth,
  analyzeLogs
} = require("../services/aiService");

const router = express.Router();

// Protect all AI routes
router.use(authMiddleware);


// GET: Check whether Python AI service is running
router.get("/health", async (req, res) => {
  try {
    const health = await checkAIHealth();

    return res.status(200).json({
      success: true,
      message: "AI service is running.",
      health
    });

  } catch (error) {
    console.error("AI health check error:", error.message);

    return res.status(503).json({
      success: false,
      message: "AI service is unavailable."
    });
  }
});


// POST: Analyze stored security logs using Python AI
router.post("/analyze", async (req, res) => {
  try {
    // Retrieve only this user's latest 100 security logs
    const storedLogs = await SecurityLog.find({
      userId: req.user.id
    })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    if (storedLogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No security logs available for analysis."
      });
    }

    // Convert MongoDB fields into Shravani's AI input format
    const aiLogs = storedLogs.map((log) => ({
      event_id: log._id.toString(),

      source_ip: log.sourceIp ?? null,
      destination_ip: log.destinationIp ?? null,

      event_type: log.eventType ?? null,
      message: log.message ?? null,
      timestamp: log.timestamp
        ? new Date(log.timestamp).toISOString()
        : null,

      severity: log.severity ?? null,

      login_attempts: log.login_attempts ?? null,
      failed_logins: log.failed_logins ?? null,
      bytes_sent: log.bytes_sent ?? null,
      protocol: log.protocol ?? null,
      port: log.port ?? null
    }));

    // Send logs to the Python AI service
    const aiResponse = await analyzeLogs(aiLogs);

    // Validate the expected response structure
    if (
      !aiResponse ||
      aiResponse.status !== "success" ||
      !Array.isArray(aiResponse.results)
    ) {
      return res.status(502).json({
        success: false,
        message: "AI service returned an unexpected response."
      });
    }

    // Return AI analysis to the frontend
    return res.status(200).json({
      success: true,
      message: "Security log analysis completed.",
      total_events: aiResponse.total_events,
      results: aiResponse.results,
      attack_groups: aiResponse.attack_groups ?? []
    });

  } catch (error) {
    console.error("AI analysis error:", error.message);

    return res.status(503).json({
      success: false,
      message: "Unable to complete AI analysis. Please try again."
    });
  }
});

module.exports = router;
