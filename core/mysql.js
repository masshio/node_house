const mysql = require('mysql');
const dev = require('../config').dev;
const pool = mysql.createPool(dev)

module.exports.query =  function(sql, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if(err) {
              console.log("连接失败");
              reject(err);
            }
            conn.query(sql, params, (err, rows) => {
                conn.release();
                if(err) {
                    console.log("执行mysql失败");
                    reject(err);
                }
                resolve(rows);
            })
          })
    })
}

// let sql = "select * from users;";
// let params = [];
// query(sql, params, (result, fields) => {
//     console.log("result", result);
//     // console.log("fields", fields);
// })