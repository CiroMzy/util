var util = {}

/****************************
 *hasClass
 * 判断是否存在某个class
*/
util.hasClass = function (obj, className) {
    var reg = new RegExp('^|\\s' + className + '$|\\s')
    return reg.test(obj.className)
}

/****************************
 *addClass
 * 添加一个class
*/
util.addClass = function (obj, className) {
    if (hasClass(obj, className)) {
        return
    }
    var classArr,
        classNew;
    classArr = obj.className.split(' ')
    classArr.push(className)
    classNew = classArr.join(' ')
    obj.className = className
}
/***************************
 * ajax
 */
util.ajax = function (args) {
    var opt = {
        url: '',
        type: 'GET',
        data: {},
        success: function () {},
        error: function () {}
    }
    util.extend(opt, args)
    if (typeof opt.url === 'string' && opt.url) {
        var url = opt.url,
            type = opt.type.toUpperCase(),
            data = opt.data,
            success = opt.success,
            error = opt.error,
            dataArr = [],
            res
        var xhr = XMLHttpRequest ? new XMLHttpRequest() : window.ActiveXObject('Miscrosoft.XMLHTTP')
        for (var item in data) {
            dataArr.push(item + '=' + data[item])
        }

        if (type === 'GET') {
            url += (url.indexOf('?') ? '?' : '&') + dataArr.join('&')
            xhr.open(type, url.replace(/\?$/g, ''), true)
            xhr.send()
        }
        if (type === 'post') {
            xhr.open(type, url, true)
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencode')
            xhr.send(dataArr.join('&'))
        }
        xhr.onload = function () {
            if (xhr.status === 200 || xhr.status === 304) {
                res = xhr.responseText
                if (success instanceof Function) {
                    success.call(xhr, res)
                }
            } else {
                if (error instanceof Function) {
                    error.call(xhr, res)
                }
            }
        }
    }
}

/********************************
 * jsonp
 */
util.jsonp = function () {

}


/********************************
 * 参数的覆盖
 * 以第一个为基准，并不新添属性
 */
util.extend = function (opt, args) {
    for (var item in opt) {
        if ( args[item] !== undefined ) {
            opt[item] = args[item]
        }
    }
}

























