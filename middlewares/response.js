module.exports = async(ctx, next) => {
    //请求成功
    ctx.jsonReturn = ({ code, msg, data }) => {
        ctx.body = { code, msg, data };
    };
    //传递给下一个中间件
    await next();

}