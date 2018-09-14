const router = require('koa-router')(),
    mongoose = require('mongoose');


router.get('/', async(ctx) => {
    ctx.body = '用户首页'
})
router.get('/add', async(ctx) => {
    ctx.body = '用户添加'
})


router.get('/about', async(ctx, next) => {
    await ctx.render('front/about');
})


module.exports = router.routes();