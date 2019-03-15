
const mime = require('mime')

// 导入页面 
const handle = require('./handle')

module.exports = function (req, res) {
    res.setHeader('content-type', mime.getType(req.url))
    // 读取文件
    if (req.url === '/index.html' || req.url === '/') {

        handle.index(req, res)

    } else if (req.url.startsWith('/details')) {

        handle.details(req, res)

    } else if (req.url.startsWith('/submit')) {

        handle.submit(req,res)
       
    } else if (req.url.startsWith('/add') && req.method == "GET") {
       
        handle.addGet(req,res)

    } else if (req.url.startsWith('/add') && req.method == 'POST') {
      
        handle.addPost(req,res)
    }
    // 获取静态资源
    else if (req.url.startsWith('/assets')) {
       
        handle.assets(req,res)

    } else {
        
        handle.other(res)

    }
}



