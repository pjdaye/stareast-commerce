const express = require('express');
const { healthcheck } = require('../controllers/healthController');

const router = express.Router();

router.get('/healthcheck', healthcheck);

module.exports = router;
