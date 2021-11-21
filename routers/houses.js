const express = require('express');
const jwt = require('jwt-simple');
const tokenKey = require('../config').tokenKey;
const router = express.Router();

router.use((req, res, next) => {
    let token = req.headers.token;
    let result = jwt.decode(token, tokenKey);
    if(result) {
        next();
    } else {
        res.json(401,{
            code: 401,
            msg: 'token失效，请重新登录'
        })
    }
})

router.get('/getHouses',require('../controller/houses').getHouses);
router.get('/getOwnHouses',require('../controller/houses').getOwnHouses);
router.get('/getHousesById',require('../controller/houses').getHousesById);
router.get('/housePrice',require('../controller/houses').housePrice);
router.post('/deleteHouses',require('../controller/houses').deleteHouses);
router.post('/updateHouses',require('../controller/houses').updateHouses);
router.post('/addHouses',require('../controller/houses').addHouses);
router.get('/searchAdd',require('../controller/houses').searchAdd);

module.exports = router;