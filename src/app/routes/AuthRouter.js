const express = require('express'),
	AuthControllers = require('../controllers/AuthControllers'),
	router = express.Router();

// Landing view rendering
router.get('/', AuthControllers.landingpageview);
// Home view rendering
router.get('/home', AuthControllers.signin);
// Login view rendering
router.get('/login', AuthControllers.loginview);
// Logup view rendering
router.get('/register', AuthControllers.registerview);
// Password recovery view rendering
router.get('/recover', AuthControllers.recoverpassview);
// logout view rendering
router.get('/logout', AuthControllers.signoff);
// New password view rendering
router.get('/recover/newpass', AuthControllers.recovernewpassview);

// POST METHOD: Change password
router.post('/recover/newpass/receivedpass', AuthControllers.newpass);
// POST METHOD: Data check out
router.post('/recover/checkout', AuthControllers.recover);
// POST METHOD: User log up
router.post('/register', AuthControllers.register);
// POST METHOD: User auth
router.post('/auth', AuthControllers.auth);

module.exports = router;
