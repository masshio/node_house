const express = require('express');
const router = express.Router();

router.post('/register', require('../controller/account').register);
router.post('/login', require('../controller/account').login);
router.post('/changePass', require('../controller/account').changePass);
router.post('/updateMessage', require('../controller/account').updateMessage);
router.get('/getMessage', require('../controller/account').getMessage);
router.get('/getMessageById', require('../controller/account').getMessageById);
router.get('/getUser', require('../controller/account').getUser);
router.post('/deleteUser', require('../controller/account').deleteUser);
router.post('/updateUser', require('../controller/account').updateUser);
router.get('/userAge', require('../controller/account').userAge);
router.post('/block', require('../controller/account').block);
router.get('/searchName', require('../controller/account').searchName);

module.exports = router;