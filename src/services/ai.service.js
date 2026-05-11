const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('../config/config');

const triggerAiJob = async (topic, file) => {
  const form = new FormData();
  
  if (topic) {
    form.append('topic', topic);
  }
  
  if (file) {

    form.append('file', fs.createReadStream(file.path), {
      filename: file.originalname,
      contentType: file.mimetype,
    });
  }

  try {
    const response = await axios.post(`${config.aiBackendUrl}/ai/jobs`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error triggering AI job:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to trigger AI job');
  }
};

const triggerSummarizeJob = async (file) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(file.path), { filename: file.originalname, contentType: file.mimetype });
  try {
    const res = await axios.post(`${config.aiBackendUrl}/ai/summarize`, form, { headers: form.getHeaders() });
    return res.data;
  } catch (error) { throw new Error(error.response?.data?.detail || 'Failed to trigger summarize job'); }
};

const triggerTTSJob = async (text) => {
  const form = new FormData();
  form.append('text', text);
  try {
    const res = await axios.post(`${config.aiBackendUrl}/ai/tts`, form, { headers: form.getHeaders() });
    return res.data;
  } catch (error) { throw new Error(error.response?.data?.detail || 'Failed to trigger TTS job'); }
};

const triggerCoachJob = async (file) => {
  const form = new FormData();
  form.append('audio', fs.createReadStream(file.path), { filename: file.originalname, contentType: file.mimetype });
  try {
    const res = await axios.post(`${config.aiBackendUrl}/ai/coach`, form, { headers: form.getHeaders() });
    return res.data;
  } catch (error) { throw new Error(error.response?.data?.detail || 'Failed to trigger coach job'); }
};

module.exports = {
  triggerAiJob,
  triggerSummarizeJob,
  triggerTTSJob,
  triggerCoachJob,
};
