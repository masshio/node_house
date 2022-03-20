const db = require('../core/mysql');
const fs = require('fs')
const path = require('path')
const jwt = require('jwt-simple');
const tokenKey = require('../config').tokenKey;
class Houses {
    // 管理 获取房屋信息
    async getHouses(req, res) {
        let getSql = 'SELECT * FROM `houses` where examine = 1 LIMIT ?,?';
        let totalSql = 'SELECT count(*) AS total FROM `houses` where examine = 1';
        let pageSize = req.query.size;
        let pageIndex = req.query.page;
        let params = [(pageIndex - 1) * parseInt(pageSize), parseInt(pageSize)];
        try {
            let result = await db.query(getSql, params);
            let totalResult = await db.query(totalSql);
            result.forEach(item => {
                item.hpic = JSON.parse(item.hpic)
            })
            if (result && result.length >= 0) {
                res.json({
                    code: 200,
                    message: '请求成功',
                    data: {
                        result
                    },
                    total: totalResult[0].total
                })
            } else {
                res.json({
                    code: -200,
                    message: '请求失败'
                })
            }
        } catch (error) {
            res.json(500, {
                message: "服务器错误",
                error
            })
        }
    }
    // 搜索地址
    async searchAdd(req, res) {
        let searchSql = "SELECT * FROM `houses` where hadd like ? and examine = 1 LIMIT ?,?;";
        let totalSql = "SELECT count(*) AS total FROM `houses` where hadd like ? and examine = 1;";
        let pageSize = req.query.size;
        let pageIndex = req.query.page;
        let params = ['%' + req.query.addr + '%', (pageIndex - 1) * parseInt(pageSize), parseInt(pageSize)];
        try {
            let result = await db.query(searchSql, params);
            let totalResult = await db.query(totalSql, ['%' + req.query.addr + '%']);
            result.forEach(item => {
                item.hpic = JSON.parse(item.hpic)
            })
            if (result && result.length >= 0) {
                res.json({
                    code: 200,
                    data: {
                        result
                    },
                    total: totalResult[0].total,
                    msg: "查询成功"
                })
            } else {
                res.json({
                    code: -200,
                    msg: "查询失败"
                })
            }
        } catch (error) {
            res.status(500).json({
                msg: "服务器错误",
                error
            })
        }

    }
    // 用户已发布房屋
    async getOwnHouses(req, res) {
        let getSql = 'SELECT * FROM `houses` WHERE uid=? and examine=1 LIMIT ?,?';
        let totalSql = 'SELECT count(*) AS total FROM `houses` WHERE uid=? and examine=1';
        let pageSize = req.query.size;
        let pageIndex = req.query.page;
        let params = [parseInt(req.query.userid), (pageIndex - 1) * parseInt(pageSize), parseInt(pageSize)];
        let totalParams = [parseInt(req.query.userid)];
        try {
            let result = await db.query(getSql, params);
            let totalResult = await db.query(totalSql, totalParams);
            result.forEach(item => {
                item.hpic = JSON.parse(item.hpic)
            })
            if (result && result.length >= 0) {
                res.json({
                    code: 200,
                    message: '请求成功',
                    data: {
                        result
                    },
                    total: totalResult[0].total
                })
            } else {
                res.json({
                    code: -200,
                    message: '请求失败'
                })
            }
        } catch (error) {
            res.json(500, {
                message: "服务器错误",
                error
            })
        }
    }
    // 用户在审核中房屋
    async getExamineHouses(req, res) {
        let getSql = 'SELECT * FROM `houses` WHERE uid=? and examine <= 0 LIMIT ?,?';
        let totalSql = 'SELECT count(*) AS total FROM `houses` WHERE uid=? and examine <= 0';
        let pageSize = req.query.size;
        let pageIndex = req.query.page;
        let params = [parseInt(req.query.userid), (pageIndex - 1) * parseInt(pageSize), parseInt(pageSize)];
        let totalParams = [parseInt(req.query.userid)];
        try {
            let result = await db.query(getSql, params);
            let totalResult = await db.query(totalSql, totalParams);
            result.forEach(item => {
                item.hpic = JSON.parse(item.hpic)
            })
            if (result && result.length >= 0) {
                res.json({
                    code: 200,
                    message: '请求成功',
                    data: {
                        result
                    },
                    total: totalResult[0].total
                })
            } else {
                res.json({
                    code: -200,
                    message: '请求失败'
                })
            }
        } catch (error) {
            res.status(500).json({
                message: "服务器错误",
                error
            })
        }
    }
    // 详情页 根据id获取房屋
    async getHousesById(req, res) {
        let getSql = 'SELECT * FROM `houses` WHERE hid=?';
        let params = [parseInt(req.query.id)];
        try {
            let result = await db.query(getSql, params);
            result.forEach(item => {
                item.hpic = JSON.parse(item.hpic)
            })
            if (result && result.length >= 0) {
                res.json({
                    code: 200,
                    message: '请求成功',
                    data: {
                        result
                    },
                })
            } else {
                res.json({
                    code: -200,
                    message: '请求失败'
                })
            }
        } catch (error) {
            res.status(500).json({
                message: "服务器错误",
                error
            })
        }
    }
    // 发布房屋
    async addHouses(req, res) {
        let insertSql = 'INSERT INTO `houses`(`hadd`, `hsquare`, `hdes`, `hprice`, `uid`, `htype`, `hpic`, `examine`,`mode`,`floor`,`tfloor`,`estate`,`orientation`,`pay`)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
        let body = req.body;
        let params = [body.add, body.square, body.des, body.price, body.userid, body.type, JSON.stringify(body.pic), 0, body.mode, body.floor, body.tfloor, body.estate, body.orientation, body.pay];
        try {
            let result = await db.query(insertSql, params);
            if (result && result.affectedRows >= 1) {
                res.json({
                    code: 200,
                    msg: "添加成功"
                })
            } else {
                res.json({
                    code: -200,
                    msg: "添加失败"
                })
            }
        } catch (error) {
            res.status(500).json({
                msg: "服务器错误",
                error
            })
        }
    }
    // 删除房屋
    async deleteHouses(req, res) {
        let deleteSql = 'DELETE FROM `houses` WHERE `hid`=?;';
        let params = [req.body.id];
        try {
            let result = await db.query(deleteSql, params);
            if (result && result.affectedRows >= 1) {
                res.json({
                    code: 200,
                    msg: "删除成功"
                })
            } else {
                res.json({
                    code: -200,
                    msg: "删除失败"
                })
            }
        } catch (error) {
            res.status(500).json({
                msg: "服务器错误",
                error
            })
        }

    }
    // 图片
    async uploadImg(req, res) {
        let ext = path.extname(req.file.originalname);
        let filename = req.file.filename + ext;
        if (req.file) {
            fs.rename(req.file.path, req.file.path + ext, err => {
                if (err) {
                    res.json({
                        code: -200,
                        msg: '图片命名失败'
                    })
                }
            })
        }
        console.log('body', req.body);
        console.log('file', req.file);
        res.json({
            pic: filename,
            msg: 'success'
        })
    }
    // 更新房屋
    async updateHouses(req, res) {
        let updateSql = 'UPDATE `houses` SET `hadd`=?, `hsquare`=?, `hdes`=?, `hprice`=?, `htype`=?,`mode`=?,`floor`=?,`tfloor`=?,`estate`=?,`orientation`=?,`pay`=?, `hpic`=? WHERE `hid`=?;';
        // if (req.file) {
        //     let ext = path.extname(req.file.originalname);
        //     let filename = req.file.filename + ext;
        //     let picSql = 'UPDATE `houses` SET `hpic`=? WHERE `hid`=?;';
        //     let picParams = [filename, req.body.hid];
        //     let result = await db.query(picSql, picParams);
        //     fs.rename(req.file.path, req.file.path + ext, err => {
        //         if (err) {
        //             res.json({
        //                 code: -200,
        //                 msg: '图片命名失败'
        //             })
        //         }
        //     })
        // }

        let body = req.body;
        let params = [
            body.hadd,
            body.hsquare,
            body.hdes,
            body.hprice,
            body.htype,
            body.mode,
            body.floor,
            body.tfloor,
            body.estate,
            body.orientation,
            body.pay,
            JSON.stringify(body.hpic),
            body.hid,
        ];
        try {
            let result = await db.query(updateSql, params);
            if (result && result.affectedRows >= 1) {
                res.json({
                    code: 200,
                    msg: "更新成功"
                })
            } else {
                res.json({
                    code: -200,
                    msg: "更新失败"
                })
            }
        } catch (error) {
            res.status(500).json({
                msg: "服务器错误",
                error
            })
        }
    }
    // 数据分析
    async housePrice(req, res) {
        let querySql = `SELECT nld AS 'name', COUNT(*) AS 'value' FROM ( SELECT
                CASE
            WHEN hprice >= 0
            AND hprice <= 1000 THEN
                '0-1000元'
            WHEN hprice >= 1001
            AND hprice <= 3000 THEN
                '1001-3000元'
            WHEN hprice >= 3001
            AND hprice <= 5000 THEN
                '3001-5000元'
            WHEN hprice >= 5001
            AND hprice <= 7000 THEN
                '5001-7000元'
            WHEN hprice >= 7001
            AND hprice <= 10000 THEN
                '7001-10000元'
            WHEN hprice >= 10001 THEN
                '>=10001元'
            END AS nld
            FROM
                houses
            ) a
    GROUP BY
        nld`;
        let params = [];
        try {
            let result = await db.query(querySql, params);
            if (result && result.length >= 1) {
                res.json({
                    code: 200,
                    message: '查询成功',
                    data: {
                        result
                    }
                })
            } else {
                res.json({
                    code: -200,
                    message: '查询失败',
                })
            }
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '服务器错误',
                error
            })
        }
    }
    // 审核房屋
    async examineHouse(req, res) {
        let getSql = 'SELECT * FROM `houses` where examine = 0 LIMIT ?,?';
        let totalSql = 'SELECT count(*) AS total FROM `houses` where examine = 0';
        let pageSize = req.query.size;
        let pageIndex = req.query.page;
        let params = [(pageIndex - 1) * parseInt(pageSize), parseInt(pageSize)];
        try {
            let result = await db.query(getSql, params);
            let totalResult = await db.query(totalSql);
            // result.forEach(item => {
            //     item.hpic = JSON.parse(item.hpic)
            // })
            if (result && result.length >= 0) {
                res.json({
                    code: 200,
                    message: '请求成功',
                    data: {
                        result
                    },
                    total: totalResult[0].total
                })
            } else {
                res.json({
                    code: -200,
                    message: '请求失败'
                })
            }
        } catch (error) {
            res.status(500).json({
                message: "服务器错误",
                error
            })
        }
    }
    // 审核通过
    async passExamine(req, res) {
        let updateSql = 'UPDATE `houses` SET `examine`=? WHERE `hid`=?;';
        let params = [1, req.body.id];
        try {
            let result = await db.query(updateSql, params);
            if (result && result.affectedRows >= 1) {
                res.json({
                    code: 200,
                    msg: "更新成功"
                })
            } else {
                res.json({
                    code: -200,
                    msg: "更新失败"
                })
            }
        } catch (error) {
            res.status(500).json({
                msg: "服务器错误",
                error
            })
        }
    }
    // 驳回
    async rejectExamine(req, res) {
        let updateSql = 'UPDATE `houses` SET `reason`=?, `examine`=? WHERE `hid`=?;';
        let params = [req.body.reason, -1, req.body.id];
        try {
            let result = await db.query(updateSql, params);
            if (result && result.affectedRows >= 1) {
                res.json({
                    code: 200,
                    msg: "更新成功"
                })
            } else {
                res.json({
                    code: -200,
                    msg: "更新失败"
                })
            }
        } catch (error) {
            res.status(500).json({
                msg: "服务器错误",
                error
            })
        }
    }
    // 重新提交
    async modifyHouse(req, res) {
        let updateSql = 'UPDATE `houses` SET `hadd`=?, `hsquare`=?, `hdes`=?, `hprice`=?, `htype`=?, `examine`=0, `mode`=?,`floor`=?,`tfloor`=?,`estate`=?,`orientation`=?,`pay`=?, `hpic`=? WHERE `hid`=?;';
        // if (req.file) {
        //     let ext = path.extname(req.file.originalname);
        //     let filename = req.file.filename + ext;
        //     let picSql = 'UPDATE `houses` SET `hpic`=? WHERE `hid`=?;';
        //     let picParams = [filename, req.body.hid];
        //     let result = await db.query(picSql, picParams);
        //     fs.rename(req.file.path, req.file.path + ext, err => {
        //         if (err) {
        //             res.json({
        //                 code: -200,
        //                 msg: '图片命名失败'
        //             })
        //         }
        //     })
        // }
        let body = req.body;
        let params = [
            body.hadd,
            body.hsquare,
            body.hdes,
            body.hprice,
            body.htype,
            body.mode,
            body.floor,
            body.tfloor,
            body.estate,
            body.orientation,
            body.pay,
            JSON.stringify(body.hpic),
            body.hid,
        ];
        try {
            let result = await db.query(updateSql, params);
            if (result && result.affectedRows >= 1) {
                res.json({
                    code: 200,
                    msg: "更新成功"
                })
            } else {
                res.json({
                    code: -200,
                    msg: "更新失败"
                })
            }
        } catch (error) {
            res.status(500).json({
                msg: "服务器错误",
                error
            })
        }
    }
}

module.exports = new Houses();