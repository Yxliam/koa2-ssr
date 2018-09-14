const router = require('koa-router')(),
    svgCaptcha = require('svg-captcha'),
    UserController = require('../../controllers/admin/user');


router.get('/', async(ctx) => {
    if (ctx.isAuthenticated()) {
        console.log('isok');
    } else {
        console.log('isdone');
    }
})
router.get('/add', async(ctx) => {
    ctx.body = '这是后台用户添加';
})
router.get('/logout', UserController.doLogout);

router.get('/login', async(ctx) => {
    ctx.render('./admin/login')
})
router.get('/register', async(ctx) => {
        ctx.render('./admin/register')
    })
    // 注册
router.post('/doregister', UserController.doRegister)


//验证码
router.get('/captcha', async(ctx, next) => {
    var captcha = svgCaptcha.create();
    ctx.session.captcha = captcha.text;
    ctx.type = 'svg'; //类型设置不能少
    ctx.body = captcha.data
})
router.post('/dologin', UserController.doLogin);

//管理员列表
router.get('/userList', async(ctx, next) => {
    ctx.render('./admin/member-list')
})
router.get('/useredit/:id', UserController.getEditUser)
router.post('/useredit', UserController.doUserEdit)
    //post
router.post('/getUserList', UserController.userList)
    //del
router.post('/del', UserController.delUser)





module.exports = router.routes();