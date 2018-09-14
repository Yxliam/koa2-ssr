const Koa = require('koa'),
    config = require('./config'),
    bodyparser = require('koa-bodyparser'),
    logger = require('./middlewares/log'),
    ip = require('ip'),
    render = require('koa-art-template'), //模板
    path = require('path'),
    passport = require('./lib/passport'),
    session = require('koa-session'),
    static = require('koa-static'),
    errThrow = require('./middlewares/err'),
    router = require('koa-router')(),
    helmet = require('koa-helmet'), //对于一些常见的数据安全过滤
    indexRouter = require('./routers/index'),
    adminRouter = require('./routers/admin');





const app = new Koa();
//请求的中间件
app.use(bodyparser());
//配置koa-session
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: true,
};
app.use(helmet())
app.use(session(CONFIG, app));

//passport 配置
app.use(passport.initialize())
app.use(passport.session())


//日志
app.use(logger({
    env: app.env, //koa 提供环境变量
    appLogLevel: 'debug',
    dir: 'logs', //日志记录文件夹
    serverIp: ip.address()
}))
app.use(errThrow);
app.use(static(__dirname + '/public'));



// 模板
render(app, {
    root: path.join(__dirname, 'view'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

//前台路由
router.use(indexRouter);
//后台路由
router.use(adminRouter);
//启动路由
app.use(router.routes()).use(router.allowedMethods());


app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

app.listen(config.dev.port);
console.log(`服务器已启动 在${config.dev.port}端口`);