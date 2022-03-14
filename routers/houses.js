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
})

router.get('/getHouses', require('../controller/houses').getHouses); // 获取已审核房屋
router.get('/getOwnHouses', require('../controller/houses').getOwnHouses); // 获取用户个人发布房屋
router.get('/getHousesById', require('../controller/houses').getHousesById); // 通过id获得房屋
router.get('/housePrice', require('../controller/houses').housePrice); // 用于数据分析
router.post('/deleteHouses', require('../controller/houses').deleteHouses); // 删除房屋
router.post('/updateHouses', uploader, require('../controller/houses').updateHouses); // 更新房屋信息
router.post('/addHouses', uploader, require('../controller/houses').addHouses); // 发布房屋
router.get('/searchAdd', require('../controller/houses').searchAdd); // 根据地址模糊搜索
router.post('/uploadImg', uploader, require('../controller/houses').uploadImg); // 上传图片
router.get('/examineHouse', require('../controller/houses').examineHouse); // 获取未审核房屋
router.post('/passExamine', require('../controller/houses').passExamine); // 通过审核
router.post('/rejectExamine', require('../controller/houses').rejectExamine); // 驳回审核

module.exports = router;