const express = require('express');
const healthController = require('../controllers/healthController');

const router = express.Router();

// Routes
router.get('/health', healthController.healthCheck);
router.get('/db-test', healthController.testDatabase);

module.exports = router;
