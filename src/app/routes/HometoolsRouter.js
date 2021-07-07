const express = require('express'),
	HomeControllers = require('../controllers/HomeControllers'),
	router = express.Router();

router.get('/registerstudent', HomeControllers.registerstudentview);
router.get('/registerproduct', HomeControllers.registerproductview);
router.post('/registerstudent', HomeControllers.registerstudent);

module.exports = router;
