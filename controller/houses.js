const db = require('../core/mysql');
const fs = require('fs');
const path = require('path');
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
    // 搜索
    async searchAdd(req, res) {
        // let searchSql = "SELECT * FROM `houses` where estate like ? or hadd like ? and examine = 1 LIMIT ?,?;";
        let getSql = "SELECT * FROM `houses` "
        let searchSql = "where examine = 1 and (estate like ? or hadd like ?) ";
        switch(parseInt(req.query.mode)) {
            case 1:
                searchSql += "and mode = '整租' ";
                break;
            case 2: 
                searchSql += "and mode = '合租' ";
                break;
            default: 
                break;
        }
        switch(parseInt(req.query.price)) {
            case 1:
                searchSql += "and hprice <= 1000 ";
                break;
            case 2:
                searchSql += "and hprice between 1000 and 2000 ";
                break;
            case 3:
                searchSql += "and hprice between 2000 and 3000 ";
                break;
            case 4:
                searchSql += "and hprice between 3000 and 5000 ";
                break;
            case 5:
                searchSql += "and hprice >= 5000 ";
                break;
            default: 
                break;
        }
        switch(parseInt(req.query.square)) {
            case 1:
                searchSql += "and hsquare <= 40 ";
                break;
            case 2:
                searchSql += "and hsquare between 40 and 60 ";
                break;
            case 3:
                searchSql += "and hsquare between 60 and 80 ";
                break;
            case 4:
                searchSql += "and hsquare between 80 and 100 ";
                break;
            case 5:
                searchSql += "and hsquare between 100 and 120 ";
                break;
            case 6:
                searchSql += "and hsquare >= 120 ";
                break;
        }
        getSql += searchSql + "LIMIT ?,?;"
        // let totalSql = "SELECT count(*) AS total FROM `houses` where estate like ? or hadd like ? and examine = 1;";
        let totalSql = "SELECT count(*) AS total FROM `houses`" + searchSql + ";";
        let pageSize = req.query.size;
        let pageIndex = req.query.page;
        let params = ['%' + req.query.addr + '%', '%' + req.query.addr + '%', (pageIndex - 1) * parseInt(pageSize), parseInt(pageSize)];
        try {
            let result = await db.query(getSql, params);
            let totalResult = await db.query(totalSql, ['%' + req.query.addr + '%', '%' + req.query.addr + '%']);
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
    // 详情页 根据id获取房屋(通过审核的)
    async getHousesById(req, res) {
        let getSql = 'SELECT * FROM `houses` WHERE hid=? and examine > 0';
        let params = [parseInt(req.query.id)];
        try {
            let result = await db.query(getSql, params);
            result[0].hpic = JSON.parse(result[0].hpic);
            result[0]['his_price'] = JSON.parse(result[0]['his_price']);
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
    //详情(所有)
    async getHousesDetail(req, res) {
        let getSql = 'SELECT * FROM `houses` WHERE hid=?';
        let params = [parseInt(req.query.id)];
        try {
            let result = await db.query(getSql, params);
            result[0].hpic = JSON.parse(result[0].hpic);
            result[0]['his_price'] = JSON.parse(result[0]['his_price']);
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
        let insertSql = 'INSERT INTO `houses`(`hadd`, `hsquare`, `hdes`, `hprice`, `uid`, `htype`, `hpic`, `examine`,`mode`,`floor`,`tfloor`,`estate`,`orientation`,`pay`,`hdate`, `his_price`)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
        let body = req.body;
        let date = new Date();
        let dateParam = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
        let hisParam = {};
        hisParam[dateParam] = body.price;
        hisParam = JSON.stringify(hisParam);
        let params = [body.add, body.square, body.des, body.price, body.userid, body.type, JSON.stringify(body.pic), 0, body.mode, body.floor, body.tfloor, body.estate, body.orientation, body.pay,dateParam, hisParam];
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
        res.json({
            pic: filename,
            msg: 'success'
        })
    }
    // 更新房屋
    async updateHouses(req, res) {
        let updateSql = 'UPDATE `houses` SET `hadd`=?, `hsquare`=?, `hdes`=?, `hprice`=?, `htype`=?,`mode`=?,`floor`=?,`tfloor`=?,`estate`=?,`orientation`=?,`pay`=?, `hpic`=?, `his_price`=? WHERE `hid`=?;';
        let hisSql = 'SELECT `his_price` FROM `houses` WHERE hid=?'
        let body = req.body;
        let date = new Date();
        let dateParam = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
        let hisParam = [body.hid];
        try {
            let hisResult = await db.query(hisSql, hisParam);
            let temp = JSON.parse(hisResult[0]['his_price']);  //{'2022-1-10': 1234,....}
            temp[dateParam] = body.hprice;
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
                JSON.stringify(temp),
                body.hid,
            ];
            let result = await db.query(updateSql, params);
            if (result && result.affectedRows >= 1) {
                res.json({
                    code: 200,
                    msg: "更新成功",
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
    // 价格数据分析
    async housePrice(req, res) {
        let querySql = `SELECT nld AS 'name', COUNT(*) AS 'value' FROM ( SELECT
                CASE
            WHEN hprice >= 0
            AND hprice <= 1000 THEN
                '0-1000元'
            WHEN hprice >= 1001
            AND hprice <= 2000 THEN
                '1001-2000元'
            WHEN hprice >= 2001
            AND hprice <= 3000 THEN
                '2001-3000元'
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
    // 面积数据分析
    async houseSquare(req, res) {
        let querySql = `SELECT nld AS 'name', COUNT(*) AS 'value' FROM ( SELECT
                CASE
            WHEN hsquare >= 0
            AND hsquare <= 20 THEN
                '0-20㎡'
            WHEN hsquare >= 21
            AND hsquare <= 40 THEN
                '21-40㎡'
            WHEN hsquare >= 41
            AND hsquare <= 60 THEN
                '41-60㎡'
            WHEN hsquare >= 61
            AND hsquare <= 100 THEN
                '61-100㎡'
            WHEN hsquare >= 101
            AND hsquare <= 140 THEN
                '101-140㎡'
            WHEN hsquare >= 141
            AND hsquare <= 180 THEN
                '141-180㎡'
            WHEN hsquare >= 181 THEN
                '≥180㎡'
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
    // 付款方式数据分析
    async housePay(req, res) {
        let querySql = `SELECT nld AS 'name', COUNT(*) AS 'value' FROM ( SELECT
                CASE
            WHEN pay = '押一付一' THEN
                '押一付一'
            WHEN pay = '押三付一' THEN
                '押三付一'
            WHEN pay = '半年付' THEN
                '半年付'
            WHEN pay = '年付' THEN
                '年付'
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
    // async houseDate(req, res) {
    //     let getSql = 'SELECT hdate FROM `houses` where examine = 1';
    //     // let totalSql = 'SELECT count(*) AS total FROM `houses` where examine = 1';
    //     // let pageSize = req.query.size;
    //     // let pageIndex = req.query.page;
    //     // let params = [(pageIndex - 1) * parseInt(pageSize), parseInt(pageSize)];
    //     try {
    //         let result = await db.query(getSql, []);
    //         // let totalResult = await db.query(totalSql);
    //         // result.forEach(item => {
    //         //     item.hpic = JSON.parse(item.hpic)
    //         // })
    //         if (result && result.length >= 0) {
    //             res.json({
    //                 code: 200,
    //                 message: '请求成功',
    //                 data: {
    //                     result
    //                 },
    //                 // total: totalResult[0].total
    //             })
    //         } else {
    //             res.json({
    //                 code: -200,
    //                 message: '请求失败'
    //             })
    //         }
    //     } catch (error) {
    //         res.json(500, {
    //             message: "服务器错误",
    //             error
    //         })
    //     }
    // }
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