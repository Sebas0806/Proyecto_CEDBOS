const express = require('express'),
	homeControllers = require('../controllers/HomeControllers'),
	router = express.Router();

router.get('/student', homeControllers.registerstudentview);
router.get('/product', homeControllers.registerproductview);
router.get('/grade', homeControllers.registergradeview);
router.get('/userHistory', homeControllers.userhistoryview);
router.get('/inactivo', homeControllers.userinactive);
router.get('/productsNotVailable', homeControllers.productsnotivailable);
router.get('/foodBasket', homeControllers.foodbasketview);
router.get('/bloqueo/:NIP', homeControllers.userHistoryBlock);
router.get('/userDelete/:NIP', homeControllers.userhistorydelete);
router.get('/userDeactive/:NIP', homeControllers.userhistorydeactivate);
router.get('/productHistory', homeControllers.producthistoryview);
router.get('/foodbasketDeliver', homeControllers.foodbasketentregaview);
router.get('/foodBasketHistory', homeControllers.foodbaskethistoryview);
router.get('/entregar/:IdMer', homeControllers.foodbasketEntrega);
router.get('/disolver/:IdMer', homeControllers.foodbasketdisolver);
router.post('/productsEdit/:IdProducto', homeControllers.producthistoryedit);
router.get('/productsDelete/:IdProducto', homeControllers.producthistorydelete);
router.post('/createFoodBasket', homeControllers.createfoodbasket);
router.post('/registergrade', homeControllers.registergrade);
router.get('/deletegrade/:IdGrado', homeControllers.deletegrade);
router.post('/updategrade/:IdGrado', homeControllers.updategrade);
router.post('/registerproduct', homeControllers.registerproduct);
router.post('/registerstudent', homeControllers.registerstudent);
router.get('/charts', homeControllers.charts);

module.exports = router;
