
var util = {}
/**************************************************************************************************************************
 *                                  dom操作 相关
 ***************************************************************************************************************************/

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

/**************************************************************************************************************************
 *                                  前后端交互 相关
 ***************************************************************************************************************************/

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


/**************************************************************************************************************************
 *                                  数据存储 相关
 ***************************************************************************************************************************/

/******************************
 * COOKIE 操作类
 ******************************/
/******************************
 * 添加一个cookie
 */
util.setCookie = function (key, value) {
    var Days = 30
    var exp = new Date()
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
    document.cookie = key + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

/*******************************
 * 获取某个cookie的值
 */
util.getCookie = function (key) {
    var allcookies = document.cookie
    var arr = allcookies.split(';')
    var value
    for (var i = 0; i < arr.length; i++) {
        var strIn = arr[i]
        var pos = strIn.indexOf('=')
        var regEx = /\s+/g
        if (strIn.substring(0, pos).replace(regEx, '') === key) {
            value = strIn.substring(pos + 1, strIn.length)
        }
    }
    return unescape(value)
}

/**********************************
 * 判断某个cookie是否存在
 */
util.containCookie = function (key) {
    var allcookies = document.cookie
    var cookiePos = allcookies.indexOf(key)
    if (cookiePos > -1) {
        return true
    }
    return false
}

/**********************************
 * 移除某个cookie
 *
 * 如果只移除一个，传第一个参数
 * 如果全部移除，传两个参数，如('', true)
 */
util.removeCookie = function (key, removeAll) {
    var removeAll = typeof removeAll === 'boolean' ? removeAll : false
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
    if (keys) {
        for (var i = 0; i < keys.length; i ++) {
            if (!removeAll) {
                if (keys[i] === key) {
                    document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
                }
            } else {
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
            }
        }
    }
}




/**************************************************************************************************************************
 *                                  uri操作 相关
 ***************************************************************************************************************************/
/**********************
 * 获取url中的参数
 */
util.getUrlParams = function (opt) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
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


/**************************************************************************************************************************
 *                                  格式校验 相关
 ***************************************************************************************************************************/
/**********************************
 *验证手机号
 */
util.isPhone = function (opt) {
    var pattern = /^1(3|4|5|7|8)\d{9}$/
    if (pattern.test(opt)) {
        return true
    }
    return false
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


/**************************************************************************************************************************
 *                                  工具 相关
 ***************************************************************************************************************************/

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

/************************************
 *浅拷贝
 */
util.shallowCopy = function (json) {
    var dst = {}
    for (item in json) {
        if (json.hasOwnProperty(item)) {
            dst[item] = json[item]
        }
    }
    return dst
}
