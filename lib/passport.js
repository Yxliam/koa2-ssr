// passport.js
const passport = require('koa-passport')
var LocalStrategy = require('passport-local').Strategy


// 序列化ctx.login()触发
passport.serializeUser(function(user, done) {
        console.log('serializeUser: ', user)
        done(null, user)
    })
    // 反序列化（请求时，session中存在"passport":{"user":"1"}触发）
passport.deserializeUser(async function(user, done) {
        done(null, user)
    })
    // 提交数据(策略)
    //这个会在 passport.authenticate 的时候触发
passport.use(new LocalStrategy(
    function(username, userId, lastLoginAt, done) {
        var user = { username: username, userId: userId, lastLogin: lastLoginAt }
        done(null, user, { msg: '登录成功' })
            // done(err, user, info)
    }))


module.exports = passport