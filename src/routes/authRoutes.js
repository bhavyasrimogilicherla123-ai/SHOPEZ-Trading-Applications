const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const controller = require('../controllers/authController');
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authenticate, controller.me);
module.exports = router;
