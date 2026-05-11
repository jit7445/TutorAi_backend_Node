const aiService = require('../services/ai.service');
const fs = require('fs');
const Note = require('../models/Note');
const Video = require('../models/Video');
const Job = require('../models/Job');

// Handle AI Job Creation Request
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

    // --- REAL VERSION (FastAPI is now running) ---
    const result = await aiService.triggerAiJob(topic, file);

    // --- SAVE JOB MAPPING TO MONGODB ---
    if (result.job_id && req.user) {
      await Job.create({
        jobId: result.job_id,
        user: req.user.id,
        topic: topic || (file ? file.originalname : 'Generated Content'),
        status: 'pending'
      });
    }

    // Cleanup: Remove the uploaded file after processing
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
    // Cleanup on error
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

// Handle Job Completion Callback (Only if FastAPI uses async callback)
const handleCallback = async (req, res) => {
  try {
    const { job_id, status, video_url, pdf_url, doc_url, pdf_thumbnail } = req.body;
    console.log(`Received callback for job ${job_id} with status ${status}`);

    if (status === 'completed') {
      // Find the job to get the user context
      const job = await Job.findOne({ jobId: job_id });
      
      if (!job) {
        console.warn(`Job mapping not found for job_id: ${job_id}`);
        return res.status(404).json({ status: 'error', message: 'Job not found' });
      }

      // 1. Create Note entry
      await Note.create({
        user: job.user,
        title: job.topic,
        pdfUrl: pdf_url || '',
        thumbnailUrl: pdf_thumbnail || '',
        sourceUrl: job.topic
      });

      // 2. Create Video entry
      await Video.create({
        user: job.user,
        title: job.topic,
        videoUrl: video_url || '',
        sourceUrl: job.topic
      });

      // 3. Update Job status
      job.status = 'completed';
      await job.save();

      console.log(`✅ Successfully saved assets for user ${job.user} (Job: ${job_id})`);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Callback processed and saved successfully',
    });
  } catch (error) {
    console.error('Error processing callback:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during callback processing',
    });
  }
};

// --- New Feature Handlers ---
const summarizeDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ status: 'error', message: 'PDF file is required' });

    const result = await aiService.triggerSummarizeJob(file);
    if (result.job_id && req.user) {
      await Job.create({ jobId: result.job_id, user: req.user.id, topic: file.originalname, jobType: 'document_summary', status: 'pending' });
    }
    fs.unlink(file.path, () => {});
    return res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

const generateTTS = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ status: 'error', message: 'Text is required' });

    const result = await aiService.triggerTTSJob(text);
    if (result.job_id && req.user) {
      await Job.create({ jobId: result.job_id, user: req.user.id, topic: text.substring(0, 30), jobType: 'tts_narration', status: 'pending' });
    }
    return res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

const coachPresentation = async (req, res) => {
  try {
    const file = req.file; // User's spoken audio
    if (!file) return res.status(400).json({ status: 'error', message: 'Audio file is required' });

    const result = await aiService.triggerCoachJob(file);
    if (result.job_id && req.user) {
      await Job.create({ jobId: result.job_id, user: req.user.id, topic: 'Audio Presentation', jobType: 'presentation_coach', status: 'pending' });
    }
    fs.unlink(file.path, () => {});
    return res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createJob,
  handleCallback,
  summarizeDocument,
  generateTTS,
  coachPresentation,
};
