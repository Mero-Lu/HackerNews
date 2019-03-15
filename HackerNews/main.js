
const http = require('http')


// 导入 路由
const route = require('./router')
// 导入拓展
const extend = require('./extend')

// 创建服务器
const server = http.createServer()
// 处理请求
server.on('request', (req, res) => {

    extend(res)
    route(req,res)
    
})
// 开启服务器
server.listen('3000', () => {
    console.log('开启了 http://localhost:3000')
})



