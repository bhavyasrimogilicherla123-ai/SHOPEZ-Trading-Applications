const router = require('express').Router();
const controller = require('../controllers/marketController');

router.get('/stocks', controller.listStocks);
router.get('/stocks/:symbol', controller.getStock);

module.exports = router;
