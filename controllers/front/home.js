const mongoose = require('mongoose'),
    CateModel = require('../../model/admin/cate'),
    moment = require('moment'),
    ArticleModel = require('../../model/admin/article');
class HomeController {
    static async index(ctx, next) {
            let picList = await ArticleModel.find({ digest: true, show: true });;
            let ArticleList = await ArticleModel.find({ show: true }).limit(10).sort({ 'created': 'desc' });
            let typeList = await CateModel.find();
            var newList = [];
            if (ArticleList.length > 0) {
                newList = ArticleList.map(function(item) {
                    item._doc.created = moment(item.created).format('YYYY-MM-DD HH:mm:ss');
                    item.title = HomeController.fnGetLength(item.title, 15);
                    typeList.forEach(item2 => {
                        if (item.type == item2._id) {
                            item['catename'] = item2.CateName
                        }
                    })
                    return item;
                })
            }
            await ctx.render('./front/index', {
                picList: picList,
                ArticleList: newList,
                title: '首页'
            });
        }
        //str要截取的字符串,len截取长度
    static fnGetLength(str, len) {
            var strValue = "";
            var length = 0;
            for (var i = 0; i < str.length; i++) {
                //判断是否为汉字 
                if (HomeController.fnCheckChineseChar(str.charAt(i))) {
                    length++;
                } else {
                    length += 2;
                }
                if (length >= len && str.length > length) {
                    strValue = str.substring(0, length);
                    return strValue + '...';
                }
            }
            return str;
        }
        //判断是否为汉字
    static fnCheckChineseChar(obj) {
        var reg = /^[\u0391-\uFFE5]+$/;
        return reg.test(obj);
    }
    static async Article(ctx, next) {
        let id = ctx.params.id;
        let ArticleInfo = await ArticleModel.findOne({ _id: id });
        let typeList = await CateModel.find();
        let inserInfo = await ArticleModel.update({ _id: id }, { hits: (ArticleInfo.hits) + 1 })
        ArticleInfo._doc.created = moment(ArticleInfo.created).format('YYYY-MM-DD HH:mm:ss');
        typeList.forEach(item2 => {
            if (ArticleInfo.type == item2._id) {
                ArticleInfo['catename'] = item2.CateName
            }
        })

        if (!ArticleInfo) {
            ctx.status = 404
            ctx.render('/admin/404')
        } else {
            ctx.render('./front/article', {
                title: ArticleInfo.title,
                ArticleInfo: ArticleInfo
            })
        }
    }
    static async getListArticle(ctx, next) {
        let ArticleList = await ArticleModel.find({ show: true }).limit(10).sort({ 'created': 'desc' });
        let typeList = await CateModel.find();
        var newList = [];
        if (ArticleList.length > 0) {
            newList = ArticleList.map(function(item) {
                item._doc.created = moment(item.created).format('YYYY-MM-DD HH:mm:ss');
                item.title = HomeController.fnGetLength(item.title, 15);
                typeList.forEach(item2 => {
                    if (item.type == item2._id) {
                        item['catename'] = item2.CateName
                    }
                })
                return item;
            })
        }
        await ctx.render('./front/list-article', {
            ArticleList: newList,
            title: '文章列表'
        });
    }
    static async getAbout(ctx, next) {
            ctx.render('./front/about', {
                title: '关于我'
            })
        }
        //getContat\
    static async getContat(ctx, next) {
        ctx.render('./front/contact', {
            title: '留言'
        })
    }

}

module.exports = HomeController;