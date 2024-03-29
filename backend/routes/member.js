var express = require('express');
var router = express.Router();

const MemberModifyMethod = require('../controllers/member/modify_controller');

memberModifyMethod = new MemberModifyMethod();

//註冊新會員
router.post('/register',memberModifyMethod.postRegister);

//會員登入
router.post('/login', memberModifyMethod.postLogin);

//會員資料更新
router.put('/update', memberModifyMethod.putUpdate);

module.exports = router;
