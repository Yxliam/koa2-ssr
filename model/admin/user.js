const mongoose = require('../init.js') //引入Mongoose
const Schema = mongoose.Schema //声明Schema
let ObjectId = Schema.Types.ObjectId //声明Object类型

//创建我们的用户Schema
const userSchema = new Schema({
    UserId: ObjectId,
    userName: { type: String },
    password: String,
    createAt: { type: Date, default: Date.now() },
    lastLoginAt: { type: Date, default: Date.now() },
    role: { type: Number, default: 2 } //1是超级管理员  2是普通
})

//发布模型
module.exports = mongoose.model('userModel', userSchema)