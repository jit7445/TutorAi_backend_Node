const aiService = require('../services/ai.service');
const fs = require('fs');


 //Handle AI Job Creation Request

const createJob = async (req, res) => {
  try {
    const { topic } = req.body;
    const file = req.file;

    if (!topic && !file) {
      return res.status(400).json({
        status: 'error',
        message: 'Must provide either a topic or a PDF file',
      });
    }

    const result = await aiService.triggerAiJob(topic, file);

    // Cleanup: Remove the uploaded file after sending to FastAPI
    if (file) {
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }

    return res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    // Cleanup on error too
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file on error:', err);
      });
    }

    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

 //Handle Job Completion Callback from FastAPI

const handleCallback = async (req, res) => {
  try {
    const { job_id, status, data } = req.body;

    console.log(`Received callback for job ${job_id} with status ${status}`);

    // Here you would typically:
    // 1. Update the job status in your database
    // 2. Notify the user via WebSockets or Email
    // 3. Store the generated video/note URLs

    return res.status(200).json({
      status: 'success',
      message: 'Callback processed successfully',
    });
  } catch (error) {
    console.error('Error processing callback:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during callback processing',
    });
  }
};

module.exports = {
  createJob,
  handleCallback,
};
