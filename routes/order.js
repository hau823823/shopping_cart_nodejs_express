var express = require('express');
var router = express.Router();

const OrderModifyMethod = require('../controllers/order/modify_controller');

orderModifyMethod = new OrderModifyMethod();

// 訂整筆訂單
router.post('/order', orderModifyMethod.postOrderAllProduct);

module.exports = router;
