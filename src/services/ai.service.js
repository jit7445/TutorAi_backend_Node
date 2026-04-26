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

module.exports = {
  triggerAiJob,
};
