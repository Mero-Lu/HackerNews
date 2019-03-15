
// 导入模块
const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const template = require('art-template')
const dbpath = path.join(__dirname, './data/data1.json')
const url = require('url')
const querystring = require('querystring')
// 创建服务器
const server = http.createServer()
// 出来请求
server.on('request', (req, res) => {
    // 封装渲染页面
    req.my_reand = function(fileUrl,obj){
        let html = template(fileUrl, obj)
        res.end(html)
    }
    // 渲染重定向
    req.my_redirect = function(){
         // 重定向
         res.statusCode = 301
         res.setHeader('location', '/')
         res.end();
    }
    res.setHeader('content-type', mime.getType(req.url))
    // index 页面
    if (req.url === '/index.html' || req.url === '/') {
        // 读取文件
        my_readfile(data => {
            let fileUrl = path.join(__dirname, './views/index.html')
            req.my_reand(fileUrl,{list:data})
            // let html = template(fileUrl, { list: data })
            // res.end(html)
        })
    }
    // details  页面
    else if (req.url.startsWith('/details')) {
        // 读取数据
        let id = url.parse(req.url, true).query.id

        my_readfile(data => {
            const fileUrl = path.join(__dirname, './views/details.html')
            data = data.find(item => item.id == id)
            // console.log(data + '-----------------------------')
           req.my_reand(fileUrl,data)
        })
    }
    // submit 页面
    else if (req.url.startsWith('/submit')) {
        const fileUrl = path.join(__dirname, './views/submit.html')
        fs.readFile(fileUrl, (err, data) => {
            if (err) {
                return console.log('submit页面读取失败')
            }
            res.end(data)
        })
    }
    // get
    else if (req.url.startsWith('/add') && req.method == 'GET') {
        let obj = url.parse(req.url, true).query
        obj.id = +new Date
        console.log(obj)
        // 读取文件
        my_readfile(data => {
            data.unshift(obj)
            // 文件写入
            my_writeFile(data, () => {
                // 页面重定向
                req.my_redirect()
            })
          
        })

    }
    // post
    else if (req.url.startsWith('/add') && req.method == 'POST') {
        // console.log(req.url.querystring)
        // 收集数据组成一个对象
        let str = ''
        req.on('data', chunk => {
            str += chunk
        })
        req.on('end', () => {
            let obj = querystring.parse(str)
            obj.id = +new Date()

            // 读取文件
            my_readfile(data => {
                data.unshift(obj)
                // 文件写入
                my_writeFile(data, () => {
                    // 页面重定向
                    req.my_redirect()
                })

            })
        })
    }
    // assets静态资源
    else if (req.url.startsWith('/assets')) {
        const fileUrl = path.join(__dirname, req.url)
        fs.readFile(fileUrl, (err, data) => {
            if (err) {
                return console.log('assets读取失败')
            }
            res.end(data)
        })
    } else {
        res.setHeader('content-type', 'text/plain;charset=utf-8')
        res.end('404,没找到')
    }


})
// 开启服务器
server.listen('3000', () => {
    console.log('开启了 http://localhost:3000/index.html')
})


// 封装读取数据
function my_readfile(callback) {
    fs.readFile(dbpath, 'utf-8', (err, data) => {
        if (err) return console.log('index读取失败')
        // 转成数组
        data = JSON.parse(data || '[]')
        callback(data)
    })
}
// 封装写入文件
function my_writeFile(data, callback) {
    fs.writeFile(dbpath, JSON.stringify(data, null, 2), err => {
        if (err) return console.log('写入失败')
        callback()
    })
}
