const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const { placeOrder } = require('../controllers/tradeController');
router.post('/orders', authenticate, placeOrder);
module.exports = router;
