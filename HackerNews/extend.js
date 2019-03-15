const template = require('art-template')

module.exports = function(res) {
    res.my_reand = function (fileUrl,obj) {
        let html = template(fileUrl,obj)
        res.end(html)
    }
    // 封装重定向
    res.my_redirect = function(){
         // 重定向
         res.statusCode = 301
         res.setHeader('location', '/')
         res.end();
    }
}


