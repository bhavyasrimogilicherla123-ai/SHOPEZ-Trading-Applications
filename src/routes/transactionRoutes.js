const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const { listTransactions } = require('../controllers/transactionController');
router.get('/', authenticate, listTransactions);
module.exports = router;
