const db = require('../core/mysql');
const createToken = require('../utils/token').createToken;
class Admin {
    async login(req, res) {
        let loginSql = 'SELECT `a_name` FROM `admin` WHERE a_name=? AND a_pwd=?;';
        let params = [req.body.name, req.body.pwd];
        try {
            let result = await db.query(loginSql, params);
            if(result && result.length >= 1) {
                res.json({
                    code: 200,
                    message: '登陆成功',
                    token: createToken(result[0])
                })
            } else {
                res.json({
                    code: -200,
                    message: '登陆失败'
                })
            }
        } catch (error) {
            res.json({
                code: 500,
                message: "登陆失败",
                error
            })
        }
    }
}

module.exports = new Admin();