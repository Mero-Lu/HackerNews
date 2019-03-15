const fs = require('fs')
const path = require('path')
const url = require('url')
const dbpath = path.join(__dirname, './data/data1.json')
const querystring = require('querystring')


// index 页面
module.exports.index = function (req, res) {
    // 读取数据
    my_readFile(data => {
        const fileUrl = path.join(__dirname, './views/index.html')
        // 渲染页面
        res.my_reand(fileUrl, {
            list: data
        })
    })
}

// details 页面
module.exports.details = function (req, res) {
    // 获取数据
    //获取到id
    let id = url.parse(req.url, true).query.id
    my_readFile(data => {
        const fileUrl = path.join(__dirname, './views/details.html')
        let obj = data.find(item => item.id == id)
        // 渲染页面
        res.my_reand(fileUrl, obj)
    })

}

// submit 页面
module.exports.submit = function (req, res) {
    const fileUrl = path.join(__dirname, './views/submit.html')
    fs.readFile(fileUrl, (err, data) => {
        if (err) return console.log('submit 读取失败')
        res.end(data)
    })
}

// add get
module.exports.addGet = function (req, res) {
    // 获取url里的地址
    let obj = url.parse(req.url, true).query
    obj.id = +new Date()
    // 读取文件
    my_readFile(data => {
        data.unshift(obj)
        // 重新写入
        my_writeFile(data, () => {
            // 重定向 返回首页
            res.my_redirect()
        })
    })
}

// add Post
module.exports.addPost = function (req, res) {
    // 收集数据组成一个对象
    let str = ''
    req.on('data', chunk => {
        str += chunk
    })
    // 如果传输完了, 会执行下面的代码
    req.on('end', () => {
        let obj = querystring.parse(str)
        obj.id = +new Date()

        // 读取文件
        my_readFile(data => {
            data.unshift(obj)
            // 写入文件
            my_writeFile(data, () => {
                // 重定向
                res.my_redirect()
            })
        })
    })
}

// assets 静态
module.exports.assets = function(req,res) {
    const fileUrl = path.join(__dirname, req.url)
    fs.readFile(fileUrl, (err, data) => {
        if (err) return console.log('静态资源读取失败')
        res.end(data)
    })
}

// 其他 404
module.exports.other = function(res) {
    res.setHeader('content-type', 'text/plain;charset=utf-8')
        res.end('404,没找到')
}



// 封装  读取文件
function my_readFile(callback) {
    fs.readFile(dbpath, 'utf-8', (err, data) => {
        if (err) {
            return console.log('读取失败')
        }
        data = JSON.parse(data || '[]')
        callback(data)
    })
}

// 封装 写入数据
function my_writeFile(data, callback) {
    fs.writeFile(dbpath, JSON.stringify(data, null, 2), err => {
        if (err) return console.log('写入失败')

        callback()
    })
}