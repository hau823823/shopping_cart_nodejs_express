var express = require('express');
var router = express.Router();

const OrderGetMethod = require('../controllers/order/get_controller');
const OrderModifyMethod = require('../controllers/order/modify_controller');

orderGetMethod = new OrderGetMethod();
orderModifyMethod = new OrderModifyMethod();

// 取得全部訂單資料
router.get('/order', orderGetMethod.getAllOrder);

// 取得單一顧客的訂單資料
router.get('/order/member', orderGetMethod.getOneOrder);

// 新增多筆訂單
router.post('/order', orderModifyMethod.postOrderAllProduct);

// 新增單筆訂單
router.post('/order/addoneproduct', orderModifyMethod.postOrderOneProduct);

// 更改單筆訂單資料
router.put('/order', orderModifyMethod.updateOrderProduct);

// 刪除訂單資料
router.delete('/order', orderModifyMethod.deleteOrderProduct);

// 訂單已完成
router.put('/order/complete', orderModifyMethod.putProductComplete);

module.exports = router;
