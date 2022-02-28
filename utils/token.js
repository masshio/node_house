let jwt = require('jwt-simple');
const tokenKey = require('../config').tokenKey
exports.createToken = function createToken(data) {
    return jwt.encode({
        exp: parseInt(Date.now()/1000) + (60 * 60 * 24),
        info: data
    }, tokenKey)
}