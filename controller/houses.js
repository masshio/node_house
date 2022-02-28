const db = require('../core/mysql');
const fs = require('fs')
const path = require('path')
const jwt = require('jwt-simple');
const tokenKey = require('../config').tokenKey;
class Houses {
    async getHouses(req, res) {
        let getSql = 'SELECT * FROM `houses` LIMIT ?,?';
        let totalSql = 'SELECT count(*) AS total FROM `houses`';
        let pageSize = req.query.size;
        let pageIndex = req.query.page;
        let params = [(pageIndex - 1) * parseInt(pageSize), parseInt(pageSize)];
        try {
            let result = await db.query(getSql, params);
            let totalResult = await db.query(totalSql);
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
    async searchAdd(req, res) {
        let searchSql = "SELECT * FROM `houses` where h_add like ? LIMIT ?,?;";
        let totalSql = "SELECT count(*) AS total FROM `houses` where h_add like ?;";
        let pageSize = req.query.size;
        let pageIndex = req.query.page;
        let params = ['%' + req.query.addr + '%', (pageIndex - 1) * parseInt(pageSize), parseInt(pageSize)];
        try {
            let result = await db.query(searchSql, params);
            let totalResult = await db.query(totalSql, ['%' + req.query.addr + '%']);
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
    async getOwnHouses(req, res) {
        let getSql = 'SELECT * FROM `houses` WHERE u_id=? LIMIT ?,?';
        let totalSql = 'SELECT count(*) AS total FROM `houses` WHERE u_id=?';
        let pageSize = req.query.size;
        let pageIndex = req.query.page;
        let params = [parseInt(req.query.userid), (pageIndex - 1) * parseInt(pageSize), parseInt(pageSize)];
        let totalParams = [parseInt(req.query.userid)];
        try {
            let result = await db.query(getSql, params);
            let totalResult = await db.query(totalSql, totalParams);
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
    async getHousesById(req, res) {
        let getSql = 'SELECT * FROM `houses` WHERE h_id=?';
        let params = [parseInt(req.query.id)];
        try {
            let result = await db.query(getSql, params);
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
            res.json(500, {
                message: "服务器错误",
                error
            })
        }
    }
    async addHouses(req, res) {
        let insertSql = 'INSERT INTO `houses`(`h_add`, `h_square`, `h_des`, `h_price`, `u_id`, `h_type`, `h_pic`)VALUES(?,?,?,?,?,?,?);';
        console.log(req.body, req.file);
        let ext = path.extname(req.file.originalname);
        let filename = req.file.filename;
        fs.rename(req.file.path, req.file.path + ext, err => {
            if (err) {
                res.json({
                    code: -200,
                    msg: '图片命名失败'
                })
            }
        })
        let params = [req.body.add, req.body.square, req.body.des, req.body.price, req.body.userid, req.body.type, filename + ext];
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
            res.json(500, {
                msg: "服务器错误",
                error
            })
        }
    }
    async deleteHouses(req, res) {
        let deleteSql = 'DELETE FROM `houses` WHERE `h_id`=?;';
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
    async uploadImg(req, res) {
        let token = req.headres.token;
        let {info:{u_id}} = jwt.decode(token, tokenKey);

        let upadtaSql = 'UPDATE `houses` SET `h_pic`=? WHERE `h_id`=?;'
        let params = [req.file, req.body]
        console.log('body', req.body);
        console.log('file', req.file);
        res.json({
            msg: 'success'
        })
    }
    async updateHouses(req, res) {
        let updateSql = 'UPDATE `houses` SET `h_add`=?, `h_square`=?, `h_des`=?, `h_price`=?, `h_type`=? WHERE `h_id`=?;';
        console.log(req.body, req.file);
        if(req.file) {
            let ext = path.extname(req.file.originalname);
            let filename = req.file.filename + ext;
            let picSql = 'UPDATE `houses` SET `h_pic`=? WHERE `h_id`=?;';
            let picParams = [filename, req.body.h_id];
            let result = await db.query(picSql, picParams);
            fs.rename(req.file.path, req.file.path + ext, err => {
                if (err) {
                    res.json({
                        code: -200,
                        msg: '图片命名失败'
                    })
                }
            })
        }
        let params = [
            req.body.h_add,
            req.body.h_square,
            req.body.h_des,
            req.body.h_price,
            req.body.h_type,
            req.body.h_id
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
    async housePrice(req, res) {
        let querySql = `SELECT nld AS 'name', COUNT(*) AS 'value' FROM ( SELECT
                CASE
            WHEN h_price >= 0
            AND h_price <= 1000 THEN
                '0-1000元'
            WHEN h_price >= 1001
            AND h_price <= 3000 THEN
                '1001-3000元'
            WHEN h_price >= 3001
            AND h_price <= 5000 THEN
                '3001-5000元'
            WHEN h_price >= 5001
            AND h_price <= 7000 THEN
                '5001-7000元'
            WHEN h_price >= 7001
            AND h_price <= 10000 THEN
                '7001-10000元'
            WHEN h_price >= 10001 THEN
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
}

module.exports = new Houses();