const router = require('koa-router')(),
    ArticleController = require('../../controllers/admin/article');
const multer = require('koa-multer');

var storage = multer.diskStorage({

    //文件保存路径

    destination: function(req, file, cb) {

        cb(null, 'public/upload/')

    },
    //修改文件名称

    filename: function(req, file, cb) {

        var fileFormat = (file.originalname).split(".");

        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);

    }
})

var upload = multer({ storage: storage });


router.get('/', ArticleController.getArticleIndex);
router.get('/add', ArticleController.articleAdd)
router.post('/doarticle', ArticleController.doArticle)
router.post('/upload', upload.single('file'), async(ctx, next) => {

    ctx.body = {
        code: 1,
        msg: 'ok',
        filename: ctx.req.file.filename //返回文件名 这里因为我是分分开部署的，所以host也要传给前台

    }

})
router.post('/getlist', ArticleController.getArticleList)
router.post('/changeshow', ArticleController.changeArticleShow)
router.post('/changezd', ArticleController.changeArticleZd)
router.post('/ardel', ArticleController.articleDel)
router.get('/edit/:id', ArticleController.articleShowInfo)
router.post('/edarticle', ArticleController.articlEdit)






module.exports = router.routes();