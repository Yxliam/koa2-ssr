const mongoose = require('../../model/init'),
    md5 = require('md5'),
    passport = require('../../lib/passport'),
    moment = require('moment'),
    BaseController = require('./base'),
    UserModel = require('../../model/admin/user');

class UserController extends BaseController {
    static async doLogin(ctx, next) {
        let { username, password, captcha } = ctx.request.body;
        if (username == '' || password == '') {
            ctx.body = { code: 0, msg: '用户名或者密码不能为空' }
            return
        }
        if (captcha == '' || (captcha.toLowerCase() != (ctx.session.captcha).toLowerCase())) {
            ctx.body = { code: 0, msg: '验证码错误' }
            return
        }
        var result = await UserModel.findOne({ 'userName': username, 'password': md5(password) });
        if (result) {
            return passport.authenticate('local',
                function(err, user, info, status) {
                    ctx.body = { code: 1, msg: '登录成功' }
                    let lastDate = moment(result.lastLoginAt).format('YYYY-MM-DD HH:mm:ss');
                    return ctx.login({ username: result.userName, userId: result._id, lastLogin: lastDate, role: result.role })
                })(ctx)
        } else {
            ctx.body = { code: 0, msg: '登录失败' }
        }
    }


    static async doRegister(ctx, next) {

        let { username, password, captcha } = ctx.request.body

        if (captcha == '' || (captcha.toLowerCase() != (ctx.session.captcha).toLowerCase())) {
            ctx.body = { code: 0, msg: '验证码错误' }
            return
        }
        if (username == '' || password == '') {
            ctx.body = { code: 0, msg: '用户名或者密码错误' }
            return
        }
        // 转义html代码
        username = super.xss(username);
        password = super.xss(password);
        //检测是否已经存在该用户
        let isExit = await UserModel.findOne({ userName: username });
        if (isExit) {
            ctx.body = { code: 0, msg: '注册失败，已存在该用户' };
            return;
        }
        var user = new UserModel({ userName: username, password: md5(password) });
        var result = await user.save();

        if (result) {
            ctx.body = { code: 1, msg: '注册成功' }
        } else {
            ctx.body = { code: 0, msg: '注册失败' }
        }
    }
    static async doLogout(ctx, next) {
        //格式化当前时间
        var time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            //修改登登录时间
        let user = ctx.session.passport.user;
        var result = await UserModel.findOne({ '_id': user.userId });
        await UserModel.update({ '_id': result._id }, { lastLoginAt: time });
        ctx.logout()
        ctx.redirect('/admin/user/login');
    }
    static async userList(ctx, next) {
        // 查出所有的管理员
        //page 第几页 size:每页总数
        let { page, size, username } = ctx.request.body;
        let userInfo = ctx.session.passport.user;
        if (isNaN(page)) {
            page = 1
        }
        if (isNaN(size)) {
            page = 10
        }
        //显示符合前端分页请求的列表查询
        let options = { "limit": size, "skip": (page - 1) * size };
        var list = '';
        if (username) {
            list = await UserModel.find({ 'userName': username }).skip(options.skip).limit(+size).sort({ 'createAt': 'desc' });
        } else {
            list = await UserModel.find().skip(options.skip).limit(+size).sort({ 'createAt': 'desc' });
        }


        let totle = await UserModel.count(); //表总记录数
        var newList = [];
        if (list.length > 0) {
            list.map(function(item) {
                item.isMe = userInfo.userId == item._id ? true : false;
                item.createAt = moment(item.createAt).format('YYYY-MM-DD HH:mm:ss');
                if (userInfo.role == 1) {
                    item.isMe = true
                }
                newList.push({
                    _id: item._id,
                    isMe: item.isMe,
                    userName: item.userName,
                    role: item.role,
                    createAt: moment(item.createAt).format('YYYY-MM-DD HH:mm:ss'),
                })
            })
        }
        ctx.body = { code: 1, msg: 'ok', list: newList, totle: totle }
    }
    static async getEditUser(ctx, next) {
        let id = ctx.params.id;
        let result = await UserModel.findOne({ _id: id });
        ctx.render('./admin/member-edit', {
            id: id,
            userInfo: result
        })
    }
    static async doUserEdit(ctx, next) {
        let { username, password, id } = ctx.request.body;
        if (!id) {
            ctx.body = { code: 0, msg: 'id缺失' }
            return
        }
        if (username == '' || password == '') {
            ctx.body = { code: 0, msg: '用户名或者密码不能为空' }
            return
        }
        username = username.replace(/<[^<>]+?>/g, ''); //去除所有的html标签
        password = password.replace(/<[^<>]+?>/g, ''); //去除所有的html标签
        //检测是否已经存在该用户
        let isExit = await UserModel.findOne({ userName: username });
        if (isExit) {
            ctx.body = { code: 0, msg: '修改失败，已存在该用户' };
            return;
        }
        let userInfo = ctx.session.passport.user;
        let isRole = false;
        if (userInfo.role == 1) {
            isRole = true;
        }
        let result = await UserModel.update({ '_id': id }, { userName: username, password: md5(password) });
        if (result.ok == 1) {
            if (isRole) {
                ctx.body = { code: 1, isReload: 0, msg: '修改成功' }
                return
            }
            ctx.body = { code: 1, isReload: 1, msg: '修改成功' }
            return
        } else {
            ctx.body = { code: 0, msg: '修改失败' }
            return
        }

    }
    static async delUser(ctx, next) {
        const { id } = ctx.request.body;
        let isOne = true;
        if (!id) {
            ctx.body = {
                code: 0,
                msg: 'id错误'
            }
            return
        }
        //单个
        isOne = typeof id == 'string' ? true : false;
        let param = { _id: id };


        // 说明当前就是该用户
        if (isOne) {
            if (ctx.session.passport.user.userId == id || ctx.session.passport.user.role == 1) {
                param = { _id: id }
            }
        } else if (ctx.session.passport.user.role == 1) {
            param = { _id: { $in: id } }
        } else {
            ctx.body = {
                code: 0,
                msg: '没权限删除'
            }
            return
        }

        let res = await UserModel.remove(param);
        if (res.ok) {
            //如果是当前登录用户删除自己的就需要重新登录

            if (ctx.session.passport.user.userId == id) {
                ctx.logout()
                ctx.body = {
                    code: 1,
                    role: 1,
                    msg: '删除成功'
                }
                return
            }
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
}

module.exports = UserController;