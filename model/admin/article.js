const mongoose = require('../init.js') //引入Mongoose
const Schema = mongoose.Schema //声明Schema
let ObjectId = Schema.Types.ObjectId //声明Object类型

//创建我们的用户Schema
const articleSchema = new Schema({
    CateId: ObjectId,
    title: { type: String }, //文章标题
    type: { type: String }, //文章分类,
    author: { type: String }, //文章作者
    modified: { type: Date, default: 0 }, //修改时间
    created: { type: Date }, //文章创建时间保留时间戳
    image: { type: String }, //缩略图
    tag: { type: String }, //文章tag
    digest: { type: Boolean, default: false }, //是否置顶文章 默认不是
    show: { type: Boolean, default: false }, //是否发布文章，默认不发布
    hits: { type: Number, default: 0 }, //点击数
    comment: { type: Number }, //评论数
    descript: { type: String }, //描述
    content: { type: String }
})

//发布模型
module.exports = mongoose.model('articleModel', articleSchema)