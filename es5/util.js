/*********************************************************************************************************************
 * COOKIE 操作类
 */

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