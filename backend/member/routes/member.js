var express = require('express');
var router = express.Router();

const MemberModifyMethod = require('../controllers/modify_controller');

memberModifyMethod = new MemberModifyMethod();

router.post('/register',memberModifyMethod.postRegister);

module.exports = router;
