const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const { getPortfolio } = require('../controllers/portfolioController');
router.get('/', authenticate, getPortfolio);
module.exports = router;
