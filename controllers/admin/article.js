const mongoose = require('../../model/init'),
    md5 = require('md5'),
    passport = require('../../lib/passport'),
    moment = require('moment'),
    ArticleModel = require('../../model/admin/article'),
    BaseController = require('./base'),
    CateModel = require('../../model/admin/cate');

class ArticleController extends BaseController {
    static async articleAdd(ctx, next) {
        let classList = await CateModel.find();
        ctx.render('./admin/article-add', {
            classList: classList
        })
    }

    static async getArticleIndex(ctx, next) {
        let classList = await CateModel.find();
        ctx.render('./admin/article-list', {
            classList: classList
        })
    }

    static async doArticle(ctx, next) {
        let { title, tag, type, image, descript, content } = ctx.request.body;
        let author = ctx.session.passport.user.username;
        tag = super.xss(tag);
        if (title == '' || tag == '' || descript == '' || content == '') {
            ctx.body = {
                code: 0,
                msg: '请填写表单'
            }
            return
        }
        let createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let cate = new ArticleModel({ title, tag, type, image, descript, content, author, created: createTime });
        var result = await cate.save();
        if (result) {
            ctx.body = {
                code: 1,
                msg: '添加成功'
            }
            return
        } else {
            ctx.body = {
                code: 0,
                msg: '添加失败'
            }
            return
        }

    }


    static async getArticleList(ctx, next) {
        let { start = '', end = '', type, title, page, size } = ctx.request.body;
        if (isNaN(page)) {
            page = 1
        }
        if (isNaN(size)) {
            page = 10
        }
        //显示符合前端分页请求的列表查询
        let options = { "limit": size, "skip": (page - 1) * size };
        var list = [];
        var params = {};
        if (start && end) {
            params = Object.assign(params, { created: { "$gte": start, "$lt": end } })
        }
        if (title) {
            params = Object.assign(params, { title })
        }
        if (type) {
            params = Object.assign(params, { type })
        }
        list = await ArticleModel.find(params).skip(options.skip).limit(+size).sort({ 'created': 'desc' });
        let typeList = await CateModel.find();
        let totle = await ArticleModel.count(); //表总记录数
        var newList = [];
        if (list.length > 0) {
            newList = list.map(function(item) {
                item._doc.created = moment(item.created).format('YYYY-MM-DD HH:mm:ss');
                typeList.forEach(item2 => {
                    if (item.type == item2._id) {
                        item._doc['cateName'] = item2.CateName
                    }
                })
                return item;
            })
        }

        ctx.body = { code: 1, msg: 'ok', list: newList, totle: totle }

    }
    static async changeArticleShow(ctx, next) {
            let { id, isCheck } = ctx.request.body;
            if (!id) {
                ctx.body = {
                    code: 0,
                    msg: 'id异常'
                }
                return
            }
            var res = await ArticleModel.update({ _id: id }, { show: isCheck });
            if (res) {
                ctx.body = {
                    code: 1,
                    msg: 'ok'
                }
                return
            } else {
                ctx.body = {
                    code: 0,
                    msg: 'err'
                }
                return;
            }
        }
        //changeArticleZd
    static async changeArticleZd(ctx, next) {
        let { id, isCheck } = ctx.request.body;
        if (!id) {
            ctx.body = {
                code: 0,
                msg: 'id异常'
            }
            return
        }
        var res = await ArticleModel.update({ _id: id }, { digest: isCheck });
        if (res) {
            ctx.body = {
                code: 1,
                msg: 'ok'
            }
            return
        } else {
            ctx.body = {
                code: 0,
                msg: 'err'
            }
            return;
        }
    }
    static async articleDel(ctx, next) {
        let { id } = ctx.request.body;
        if (!id) {
            ctx.body = {
                code: 0,
                msg: 'id异常'
            }
            return
        }
        var res = await ArticleModel.remove({ _id: id });
        if (res) {
            ctx.body = {
                code: 1,
                msg: '删除成功'
            }
            return
        } else {
            ctx.body = {
                code: 0,
                msg: '删除失败'
            }
            return
        }
    }
    static async articlEdit(ctx, next) {
        let { title, tag, type, image, descript, content, id } = ctx.request.body;
        let modified = moment().format('YYYY-MM-DD HH:mm:ss');
        var parms = { title, tag, type, image, descript, content, modified };
        if (!id) {
            ctx.body = {
                code: 0,
                msg: 'id异常'
            }
            return
        }
        var res = await ArticleModel.update({ _id: id }, parms);
        if (res) {
            ctx.body = {
                code: 1,
                msg: '修改成功'
            }
            return
        } else {
            ctx.body = {
                code: 0,
                msg: '修改失败'
            }
            return
        }

    }
    static async articleShowInfo(ctx, next) {
        let id = ctx.params.id;
        let articleInfo = await ArticleModel.findOne({ _id: id });
        let classList = await CateModel.find() || [];

        ctx.render('./admin/article-edit', {
            articleInfo: articleInfo,
            classList: classList
        })
    }
}
module.exports = ArticleController;