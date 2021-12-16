const express = require('express');
const app = express();
app.use(express.static('./dist'))
app.use(express.static('./imgs'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use((req, res, next) => {
    //设置请求头
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': 1728000,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type,token',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    })
    req.method === 'OPTIONS' ? res.status(204).end() : next()
})

app.use('/user', require('./routers/account'))
app.use('/admin', require('./routers/admin'))
app.use('/house', require('./routers/houses'))

app.listen(3000, () => {
    console.log("服务器启动成功");
})