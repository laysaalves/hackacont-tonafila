const express = require('express');
const { createQueue } = require('../controllers/queueController');
const router = express.Router();

router.post('/', createQueue);

module.exports = router;
