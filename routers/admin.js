const Router = require('koa-router'),
    userRouter = require('./admin/user'),
    cateRouter = require('./admin/cate'),
    articleRouter = require('./admin/article'),
    ArticleModel = require('../model/admin/article'),
    UserModel = require('../model/admin/user');




var router = new Router({
    prefix: '/admin'
});
// 允许不用验证的接口
var allowUrl = [
    '/admin/user/login',
    '/admin/user/register',
    '/admin/user/logout',
    '/admin/user/dologin',
    '/admin/user/doregister',
    '/admin/user/captcha',
];

function getAllowUrl(url) {
    return allowUrl.indexOf(url);
}

router.use('*', async(ctx, next) => {
    var requrl = ctx.request.url;
    if (getAllowUrl(requrl) >= 0 || requrl.indexOf('captcha') >= 0) {
        await next();
    } else {
        if (ctx.isAuthenticated()) {
            await next()
        } else {
            ctx.redirect('/admin/user/login')
        }
    }

})




router.get('/', async(ctx, next) => {
    // 获取session
    let user = ctx.session.passport.user
    ctx.render('./admin/index', {
        userInfo: user
    })
})
router.get('/welcome', async(ctx, next) => {
    let user = ctx.session.passport.user
    let articleListCount = await ArticleModel.count();
    let userListCount = await UserModel.count();
    await ctx.render('./admin/welcome', {
        userInfo: user,
        articleListCount: articleListCount,
        userListCount: userListCount
    })
})


router.use('/user', userRouter)
router.use('/cate', cateRouter)
router.use('/article', articleRouter)





module.exports = router.routes();