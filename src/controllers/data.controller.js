const Note = require('../models/Note');
const Video = require('../models/Video');

const storeNote = async (req, res) => {
  try {
    const { title, pdfUrl, sourceUrl } = req.body;
    const userId = req.user.id;

    if (!title || !pdfUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide title and pdfUrl',
      });
    }

    const note = await Note.create({
      user: userId,
      title,
      pdfUrl,
      sourceUrl,
    });

    res.status(201).json({
      status: 'success',
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const storeVideo = async (req, res) => {
  try {
    const { title, videoUrl, sourceUrl } = req.body;
    const userId = req.user.id;

    if (!title || !videoUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide title and videoUrl',
      });
    }

    const video = await Video.create({
      user: userId,
      title,
      videoUrl,
      sourceUrl,
    });

    res.status(201).json({
      status: 'success',
      data: video,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: videos,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  storeNote,
  storeVideo,
  getNotes,
  getVideos,
};
