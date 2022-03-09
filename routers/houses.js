const express = require('express');
const jwt = require('jwt-simple');
const tokenKey = require('../config').tokenKey;
const path = require('path')
const router = express.Router();
const multer = require('multer')
const uploader = multer({
    dest: path.join(path.dirname(__dirname), 'imgs')
}).single('file')

router.use((req, res, next) => {
    let token = req.headers.token;
    let result
    try {
        result = jwt.decode(token, tokenKey);
    } catch (error) {
        res.status(401).json({
            code: 401,
            msg: '无效token'
        })
    }
    if (result) {
        next();
    }
    // else {
    //     res.status(401).json({
    //         code: 401,
    //         msg: 'token失效，请重新登录'
    //     })
    // }
})

router.get('/getHouses', require('../controller/houses').getHouses);
router.get('/getOwnHouses', require('../controller/houses').getOwnHouses);
router.get('/getHousesById', require('../controller/houses').getHousesById);
router.get('/housePrice', require('../controller/houses').housePrice);
router.post('/deleteHouses', require('../controller/houses').deleteHouses);
router.post('/updateHouses', uploader, require('../controller/houses').updateHouses);
router.post('/addHouses', uploader, require('../controller/houses').addHouses);
router.get('/searchAdd', require('../controller/houses').searchAdd);
router.post('/uploadImg', uploader, require('../controller/houses').uploadImg);

module.exports = router;