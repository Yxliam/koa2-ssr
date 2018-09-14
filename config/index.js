const config = {
    tokenSecret: 'yxl',
    dev: {
        //启动端口
        port: 6060,
        //数据库配置
        database: {
            dbUrl: 'mongodb://localhost:27017/',
            dbName: 'koa'
        }
    }
}

module.exports = config