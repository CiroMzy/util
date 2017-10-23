
var util = {}

/****************************
 *hasClass
 *
 * 判断是否存在某个class
 * obj：原生dom
 * className：要验证的class
 *
 * 返回：boolean，true 包含，false 不包含
*/
util.hasClass = function (obj, className) {
    var reg = new RegExp('^|\\s' + className + '$|\\s')
    return reg.test(obj.className)
}

/****************************
 *addClass
 *
 * 添加一个class
 * obj：原生dom
 * className：要添加的class
 *
 * 返回：string，拼接在一起的className
*/
util.addClass = function (obj, className) {
    if (util.hasClass(obj, className)) {
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
 *
 * url：请求路径
 * type：请求方式
 * data：参数
 * success：成功回调
 * error：错误回调
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
            res
        var xhr = XMLHttpRequest ? new XMLHttpRequest() : window.ActiveXObject('Miscrosoft.XMLHTTP')
        var combinedUrl = util.dataToUri(url, data)
        if (type === 'GET') {
            xhr.open(type, combinedUrl, true)
            xhr.send()
        }
        if (type === 'post') {
            xhr.open(type, url, true)
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencode')
            xhr.send(combinedUrl)
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
 *
 * url：请求路径
 * data：参数
 */
util.jsonp = function (args) {
    var opt = {
        url: '',
        data: {},
        jsonpCallback: 'jsonp'
    }
    util.extend(opt, args)
    var url = util.dataToUri(opt.url, opt.data) + encodeURIComponent('jsonpCallback') + '=' + encodeURIComponent(opt.jsonpCallback)
    util.createScript({src:url})

}

/********************************
 * dataToUri
 *
 * 将json格式的data和url合并在一起，并encode
 * url: 标准url
 * data: 必须是字面量对象格式
 * encode: bollean格式，true 需要转译，false 不需要转译
 */
util.dataToUri = function (url, data, encode) {
    // 是否为字面量对象
    if (util.ifJson) {
        var _encode = true,
            dataArr = []
        if (typeof encode === 'boolean') {
            _encode = encode
        }
        for (var item in data) {
            var str = _encode ? (encodeURIComponent(item) + '=' + encodeURIComponent(data[item])) : item + '=' + data[item]
            dataArr.push(str)
        }
        url += (url.indexOf('?') < 0 ? '?' : '&') + dataArr.join('&')

        return url.replace(/$\\?/g, '')
    } else {
        return url
    }

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

/*******************************
 * 创建script标签
 *
 * opt为字面量对象，设置script的属性，
 * 最终在head上创建一个script标签
 */
util.createScript = function (opt) {
    var script = document.createElement('script')
    // 是否为字面量对象
    if (!util.ifJson(opt)) {
        return
    }
    for (var item in opt) {
        script.setAttribute(item, opt[item])
    }
    document.querySelector('head').appendChild(script)
}

/********************************
 * 判断是字面量对象
 *
 * true 是字面量对象， false 不是
 */
util.ifJson = function (data) {
    if (data instanceof Object  && data.prototype === undefined) {
        return true
    }
    return false
}


/***************************************************
 * 1.判断是不是字面量对象
 * data instanceof Object  && data.prototype === undefined
 * 是否直接继承自Object 并且没有原型对象
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */





















