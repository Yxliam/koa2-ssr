const log4js = require('log4js');
//日志封装函数
const access = require('./access.js')

//应用级别的日记记录 
const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark'];

//日记切割

module.exports = (options) => {
    let contextLogger = {};
    const defaultInfo = {
            env: 'dev',
            dir: 'logs',
            appLogLevel: 'info'
        }
        //将传过来的options 对象 合并
    const opts = Object.assign({}, defaultInfo, options || {})
    const { env, dir, appLogLevel } = opts; //解构
    const appenders = { cheese: { type: 'dateFile', filename: `${dir}/log`, pattern: '-yyyy-MM-dd.log', alwaysIncludePattern: true } }

    //判断是否开发环境  开发环境就直接输出在终端 方便调试
    if (env === 'dev' || env === 'local' || env === 'development') {
        appenders.out = {
            type: 'console'
        }
    }

    const config = {
        appenders: appenders,
        categories: { default: { appenders: Object.keys(appenders), level: appLogLevel } }
    }

    return async(ctx, next) => {
        const start = +new Date(); //开始时间
        log4js.configure(config);
        const logger = log4js.getLogger('cheese');
        methods.forEach((method, i) => {
                contextLogger[method] = (message) => {
                    logger[method](access(ctx, message, {}))
                }
            })
            //挂载在上下文上
        ctx.log = contextLogger
        await next()

        const end = +new Date(); //结束时间
        const responseTime = end - start;
        logger.info(access(ctx, `响应时间为${responseTime/1000}s`, {}));
    }
}