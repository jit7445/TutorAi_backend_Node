const express = require('express');
const dataController = require('../controllers/data.controller');

const router = express.Router();

router.post('/note', dataController.storeNote);
router.post('/video', dataController.storeVideo);
router.get('/notes', dataController.getNotes);
router.get('/videos', dataController.getVideos);

module.exports = router;
