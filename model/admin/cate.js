const mongoose = require('../init.js') //引入Mongoose
const Schema = mongoose.Schema //声明Schema
var ObjectId = mongoose.Schema.Types.ObjectId

//创建我们的用户Schema
const cateSchema = new Schema({
    CateName: { type: String },
    parentId: { type: String, default: 0 }, //0代表顶级分类,
    depth: { type: Number, default: 0 },
    isUsing: { type: Boolean, default: false }
})

//发布模型
module.exports = mongoose.model('cateModel', cateSchema)