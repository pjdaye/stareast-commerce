const express = require('express');
const { checkout } = require('../controllers/checkoutController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/checkout', authenticate, checkout);

module.exports = router;
