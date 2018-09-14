const router = require('koa-router')(),
    userRouter = require('./front/user'),
    HomeController = require('../controllers/front/home');

router.get('/', HomeController.index)
router.get('/article/:id', HomeController.Article)
router.get('/list', HomeController.getListArticle)
router.get('/about', HomeController.getAbout)
router.get('/liuyan', HomeController.getContat)






module.exports = router.routes();