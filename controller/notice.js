const db = require('../core/mysql');
class Notice{
    async getNotice(req, res) {
        // let getSql = 'SELECT * FROM `notice`';
        let getSql = 'SELECT * FROM `notice` LIMIT ?,?';
        let totalSql = 'SELECT count(*) AS total FROM `notice`';
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
            res.status(500).json({
                message: "服务器错误",
                error
            })
        }
    }
    async addNotice(req, res) {
        let insertSql = 'INSERT INTO `notice`(`title`, `content`)VALUES(?,?);';
        let body = req.body;
        let params = [body.title, body.content];
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
    async deleteNotice(req, res) {
        let deleteSql = 'DELETE FROM `notice` WHERE `id`=?;';
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
    async updateNotice(req, res) {
        let updateSql = 'UPDATE `notice` SET `title`=?, `content`=? WHERE `id`=?;';
        let body = req.body;
        let params = [
            body.title,
            body.content,
            body.id
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

module.exports = new Notice()