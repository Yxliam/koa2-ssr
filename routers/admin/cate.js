const router = require('koa-router')(),
    CateController = require('../../controllers/admin/cate');


router.get('/', CateController.cateList);
router.post('/addcate', CateController.addCate);
router.post('/editcate', CateController.cateEdit);
router.get('/cateedit/:id', CateController.getCateEditTmp);
router.post('/catedel/', CateController.delCate)
router.get('/cateadd/:id', CateController.addCateChild)
router.post('/docateadd', CateController.DoaddCateChild)
router.post('/changeusing', CateController.dousing)

module.exports = router.routes();