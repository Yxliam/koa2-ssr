const mongoose = require('../../model/init'),
    md5 = require('md5'),
    passport = require('../../lib/passport'),
    moment = require('moment'),
    CateModel = require('../../model/admin/cate');
class CateController {
    static async cateList(ctx, next) {
        let cateList = await CateModel.find();
        ctx.render('./admin/cate', {
            cateList: cateList
        });

    }
    static async addCate(ctx, next) {
        let { catename } = ctx.request.body;
        if (catename == '') {
            ctx.body = {
                code: 0,
                msg: '分类名称不能为空'
            }
            return;
        }
        let isExit = await CateModel.findOne({ CateName: catename });
        if (isExit) {
            ctx.body = {
                code: 0,
                msg: '分类名称已存在'
            }
            return;
        }

        let cate = new CateModel({ CateName: catename });
        var result = await cate.save();
        if (result) {
            ctx.body = {
                code: 1,
                msg: '添加分类成功'
            }
            return;
        } else {
            ctx.body = {
                code: 1,
                msg: '添加分类失败'
            }
            return;
        }

    }
    static async cateEdit(ctx, next) {

        let { catename, id } = ctx.request.body;
        if (!id) {
            ctx.body = {
                code: 0,
                msg: '分类id异常'
            }
            return;
        }
        let isExit = await CateModel.findOne({ CateName: catename });
        if (isExit) {
            ctx.body = {
                code: 0,
                msg: '该分类已存在'
            }
            return;
        }
        id = id.replace(/"/g, '');
        var res = await CateModel.update({ _id: id }, { CateName: catename });
        if (res) {
            ctx.body = {
                code: 1,
                msg: '修改分类成功'
            }
            return
        } else {
            ctx.body = {
                code: 0,
                msg: '修改分类失败'
            }
            return;
        }
    }
    static async getCateEditTmp(ctx, next) {
        let id = ctx.params.id;
        let cateInfo = await CateModel.findOne({ _id: id });
        ctx.render('./admin/cate-edit', {
            cateInfo: cateInfo
        })
    }
    static async delCate(ctx, next) {
        let { id } = ctx.request.body;
        if (!id) {
            ctx.body = {
                code: 0,
                msg: 'id异常'
            }
            return
        }
        //删除该条父级
        let res = await CateModel.remove({ _id: id });
        //删除子类
        if (res) {
            var list = await CateModel.find({ _id: id })
            if (list.length > 0) {
                let chidres = await CateModel.remove({ parentId: id });
                if (chidres) {
                    ctx.body = {
                        code: 1,
                        msg: '删除成功'
                    }
                    return
                } else {
                    ctx.body = {
                        code: 0,
                        msg: '删除子栏目失败'
                    }
                    return
                }
            } else {
                ctx.body = {
                    code: 1,
                    msg: '删除成功'
                }
                return
            }
        } else {
            ctx.body = {
                code: 0,
                msg: '删除失败'
            }
            return
        }

    }
    static async addCateChild(ctx, next) {
        let id = ctx.params.id;
        ctx.render('./admin/cate-add', {
            id: id
        })
    }
    static async DoaddCateChild(ctx, next) {
        let { catename, id } = ctx.request.body;
        if (catename == '') {
            ctx.body = {
                code: 0,
                msg: '分类名称不能为空'
            }
            return;
        }
        if (!id) {
            ctx.body = {
                code: 0,
                msg: 'id异常'
            }
            return;
        }
        id = id.replace(/"/g, '');
        let isExit = await CateModel.findOne({ CateName: catename });
        if (isExit) {
            ctx.body = {
                code: 0,
                msg: '分类名称已存在'
            }
            return;
        }

        //查找父级
        let parent = await CateModel.findOne({ _id: id });
        let depth = parent.depth + 1;
        let cate = new CateModel({ CateName: catename, parentId: id, depth: depth });
        var result = await cate.save();
        if (result) {
            ctx.body = {
                code: 1,
                msg: '添加子栏目成功'
            }
            return;
        } else {
            ctx.body = {
                code: 1,
                msg: '添加子栏目失败'
            }
            return;
        }
    }
    static async dousing(ctx, next) {
        let { id, isCheck } = ctx.request.body;
        if (!id) {
            ctx.body = {
                code: 0,
                msg: 'id异常'
            }
            return
        }
        var res = await CateModel.update({ _id: id }, { isUsing: isCheck });
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
}

module.exports = CateController;