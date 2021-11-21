const db = require('../core/mysql');
const createToken = require('../utils/token').createToken;

class AccountController {
    async register(req, res) {
        let insertSql = 'INSERT INTO `users`(`u_name`,`u_pwd`)VALUES(?,?);';
        let checkSql = 'SELECT `u_name` FROM `users` WHERE u_name=?;';
        let params = [req.body.name, req.body.pwd];
        let checkParams = [req.body.name]

        try {
            let check = await db.query(checkSql, checkParams);
            if (check && check.length >= 1) {
                res.json({
                    code: -100,
                    message: "账号已存在"
                })
            } else {
                let result = await db.query(insertSql, params);
                if (result && result.affectedRows >= 1) {
                    res.json({
                        code: 200,
                        message: "注册成功"
                    })
                } else {
                    res.json({
                        code: -200,
                        message: "注册失败",
                    })
                }
            }

        } catch (error) {
            res.status(500).json({
                code: 500,
                message: "服务器错误",
                error
            })
        }
    }
    async login(req, res) {
        let loginSql = 'SELECT `u_id` FROM `users` WHERE u_name=? AND u_pwd=?;';
        let params = [req.body.name, req.body.pwd];
        try {
            let result = await db.query(loginSql, params);
            if (result && result.length >= 1) {
                res.json({
                    code: 200,
                    message: '登陆成功',
                    data: result[0]['u_id'],
                    token: createToken(result[0])
                })
            } else {
                res.json({
                    code: -200,
                    message: '登陆失败',
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
    async changePass(req, res) {
        let updateSql = 'UPDATE `users` SET `u_pwd`=? WHERE `u_name`=?;';
        let querySql = 'SELECT `u_pwd` FROM `users` WHERE `u_name`=?;'
        let updateParams = [req.body.configPass, req.body.name];
        let queryParams = [req.body.name];
        try {
            let queryResult = await db.query(querySql, queryParams);
            if (queryResult[0]['u_pwd'] == req.body.pass) {
                let result = await db.query(updateSql, updateParams);
                if (result && result.affectedRows >= 1) {
                    res.json({
                        code: 200,
                        message: '修改成功',
                    })
                } else {
                    res.json({
                        code: -200,
                        message: '修改失败',
                    })
                }
            } else {
                res.json({
                    code: -100,
                    message: '密码错误',
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
    async updateMessage(req, res) {
        let updateSql = 'UPDATE `users` SET `u_add`=?, `u_age`=?, `u_email`=?, `r_name`=?,`u_phone`=?, `u_sex`=? WHERE `u_name`=?;';
        let params = [req.body.addr, req.body.age, req.body.email, req.body.rname, req.body.phone, req.body.sex, req.body.name];
        try {
            let result = await db.query(updateSql, params);
            if (result && result.affectedRows >= 1) {
                res.json({
                    code: 200,
                    message: '更新成功',
                })
            } else {
                res.json({
                    code: -200,
                    message: '更新失败',
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
    async getMessage(req, res) {
        let getSql = 'SELECT * FROM `users` WHERE u_name=?;';
        let params = [req.query.name];
        try {
            let result = await db.query(getSql, params);
            if (result && result.length >= 1) {
                res.json({
                    code: 200,
                    message: "查询成功",
                    data: result[0]
                })
            } else {
                res.json({
                    code: -200,
                    message: "查询失败",
                })
            }
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: "服务器错误",
                error
            })
        }
    }
    async getMessageById(req, res) {
        let getSql = 'SELECT * FROM `users` WHERE u_id=?;';
        let params = [req.query.id];
        try {
            let result = await db.query(getSql, params);
            if (result && result.length >= 1) {
                res.json({
                    code: 200,
                    message: "查询成功",
                    data: result[0]
                })
            } else {
                res.json({
                    code: -200,
                    message: "查询失败",
                })
            }
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: "服务器错误",
                error
            })
        }
    }
    async getUser(req, res) {
        let getSql = 'SELECT * FROM `users` LIMIT ?,?';
        let totalSql = 'SELECT count(*) AS total FROM `users`';
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
    async deleteUser(req, res) {
        let deleteSql = 'DELETE FROM `users` WHERE `u_id`=?;';
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
    async updateUser(req, res) {
        let updateSql = 'UPDATE `users` SET `u_add`=?, `u_age`=?, `u_email`=?, `r_name`=?,`u_phone`=?, `u_sex`=? WHERE `u_name`=?;';
        let params = [req.body.u_add, req.body.u_age, req.body.u_email, req.body.r_name, req.body.u_phone, req.body.u_sex, req.body.u_name];
        try {
            let result = await db.query(updateSql, params);
            if (result && result.affectedRows >= 1) {
                res.json({
                    code: 200,
                    message: '更新成功',
                })
            } else {
                res.json({
                    code: -200,
                    message: '更新失败',
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
    async userAge(req, res) {
        let querySql = `SELECT nld AS 'name', COUNT(*) AS 'value' FROM ( SELECT
                CASE
            WHEN u_age >= 0
            AND u_age <= 20 THEN
                '0-20岁'
            WHEN u_age >= 21
            AND u_age <= 30 THEN
                '21-30岁'
            WHEN u_age >= 31
            AND u_age <= 40 THEN
                '31-40岁'
            WHEN u_age >= 41
            AND u_age <= 50 THEN
                '41-50岁'
            WHEN u_age >= 51
            AND u_age <= 60 THEN
                '51-60岁'
            WHEN u_age >= 61
            AND u_age <= 70 THEN
                '61-70岁'
            WHEN u_age >= 71
            AND u_age <= 80 THEN
                '71-80岁'
            WHEN u_age >= 81 THEN
                '>=81岁'
            END AS nld
            FROM
                    users
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

module.exports = new AccountController();