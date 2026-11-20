
const axios = require("axios");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:8000";

// Check whether the AI engine is running
const checkAIHealth = async () => {
  try {
    const response = await axios.get(
      `${AI_SERVICE_URL}/health`,
      { timeout: 5000 }
    );

    return response.data;

  } catch (error) {
    console.error(
      "AI service health check failed:",
      error.message
    );

    throw new Error("AI service is unavailable.");
  }
};

// Send security logs to the AI engine
const analyzeLogs = async (logs) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/analyze-logs`,
      { logs },
      { timeout: 30000 }
    );

    return response.data;

  } catch (error) {
    console.error(
      "AI analysis request failed:",
      error.message
    );

    throw new Error("Failed to analyze security logs.");
  }
};

module.exports = {
  checkAIHealth,
  analyzeLogs
};