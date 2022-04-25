const express = require('express');
const jwt = require('jwt-simple');
const tokenKey = require('../config').tokenKey;
const router = express.Router();

router.use((req, res, next) => {
    let token = req.headers.token;
    let result
    try {
        result = jwt.decode(token, tokenKey);
    } catch (error) {
        res.json({
            code: 401,
            msg: '无效token'
        })
    }
    if (result) {
        next();
    }
})

router.get('/getNotice', require('../controller/notice').getNotice)
router.post('/addNotice', require('../controller/notice').addNotice)
router.post('/deleteNotice', require('../controller/notice').deleteNotice)
router.post('/updateNotice', require('../controller/notice').updateNotice)

module.exports = router