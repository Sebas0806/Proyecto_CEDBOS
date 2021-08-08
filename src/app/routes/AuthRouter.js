const express = require('express'),
	authControllers = require('../controllers/authControllers'),
	router = express.Router();

// Landing view rendering
router.get('/', authControllers.landingpageview);
// Home view rendering
router.get('/home', authControllers.signin);
// Login view rendering
router.get('/login', authControllers.loginview);
// Logup view rendering
router.get('/register', authControllers.registerview);

router.get('/register/checkdocument', authControllers.checkdocumentview);
// Password recovery view rendering
router.get('/recover', authControllers.recoverpassview);
// logout view rendering
router.get('/logout', authControllers.signoff);
// New password view rendering
router.get('/recover/newpass', authControllers.recovernewpassview);

router.post('/register/checkdocument/validate', authControllers.checkdocument);
// POST METHOD: Change password
router.post('/recover/newpass/receivedpass', authControllers.newpass);
// POST METHOD: Data check out
router.post('/recover/checkout', authControllers.recover);
// POST METHOD: User log up
router.post('/register', authControllers.register);
// POST METHOD: User auth
router.post('/auth', authControllers.auth);

module.exports = router;
