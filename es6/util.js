
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
export const hasClass = function (obj, className) {
    let reg = new RegExp('^|\\s' + className + '$|\\s')
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
export const addClass = function (obj, className) {
    if (hasClass(obj, className)) {
        return
    }
    let classArr
    let classNew
    classArr = obj.className.split(' ')
    classArr.push(className)
    classNew = classArr.join(' ')
    obj.className = classNew
}

/*******************************
 * 创建script标签
 *
 * opt为字面量对象，设置script的属性，
 * 最终在head上创建一个script标签
 */
export const createScript = function (opt) {
    let script = document.createElement('script')
    // 是否为字面量对象
    if (!isJson(opt)) {
        return
    }
    for (let item in opt) {
        script.setAttribute(item, opt[item])
    }
    document.querySelector('head').appendChild(script)
}

/*******************************
 * 获取元素属性值
 */
export const getComputedAtt = function (dom, att) {
    let value = (dom.currentStyle ? dom.currentStyle : getComputedStyle(dom))[att]
    return value
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
export const ajax = function (args) {
    var opt = {
        url: '',
        type: 'GET',
        data: {},
        success: function () {},
        error: function () {}
    }
    extend(opt, args)
    if (typeof opt.url === 'string' && opt.url) {
        let url = opt.url
        let type = opt.type.toUpperCase()
        let data = opt.data
        let success = opt.success
        let error = opt.error
        let res
        let xhr = XMLHttpRequest ? new XMLHttpRequest() : window.ActiveXObject('Miscrosoft.XMLHTTP')
        let combinedUrl = dataToUri(url, data)
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
export const jsonp = function (args) {
    let opt = {
        url: '',
        data: {},
        jsonpCallback: 'jsonp'
    }
    extend(opt, args)
    let url = dataToUri(opt.url, opt.data) + encodeURIComponent('jsonpCallback') + '=' + encodeURIComponent(opt.jsonpCallback)
    createScript({src: url})
}


/**************************************************************************************************************************
 *                                  数据存储 相关
 ***************************************************************************************************************************/

/*******************************
 * COOKIE 操作类
 ******************************/

/******************************
 * 添加一个cookie
 */
export const setCookie = function (key, value) {
    let Days = 30
    let exp = new Date()
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
    document.cookie = key + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

/*******************************
 * 获取某个cookie的值
 */
export const getCookie = function (key) {
    let allcookies = document.cookie
    let arr = allcookies.split(';')
    let value
    for (let i = 0; i < arr.length; i++) {
        let strIn = arr[i]
        let pos = strIn.indexOf('=')
        let regEx = /\s+/g
        if (strIn.substring(0, pos).replace(regEx, '') === key) {
            value = strIn.substring(pos + 1, strIn.length)
        }
    }
    return unescape(value)
}

/**********************************
 * 判断某个cookie是否存在
 */
export const containCookie = function (key) {
    let allcookies = document.cookie
    let cookiePos = allcookies.indexOf(key)
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
export const removeCookie = function (key, removeAll) {
    let removeAllVal = typeof removeAll === 'boolean' ? removeAll : false
    /* eslint-disable no-useless-escape */
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g)
    if (keys) {
        for (let i = 0; i < keys.length; i++) {
            if (!removeAllVal) {
                if (keys[i] === key) {
                    document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
                }
            } else {
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
            }
        }
    }
}


/********************************
 * localStorage
 */
/************
 * 是否存在localStorage
 * att 需要判断的属性
 */
export const containLocalStorage = function (attr) {
    let storage = window.localStorage
    if (storage.hasOwnProperty(attr)) {
        return true
    } else {
        return false
    }
}
/**************
 * 添加localStorage
 * json 传入字面量对象格式如{name:'夏天'}
 */
export const setLocalStorage = function (json) {
    if (!isJson(json) || !window.localStorage) {
        return
    }
    let storage = window.localStorage
    for (let item in json) {
        if (json.hasOwnProperty(item)) {
            storage[item] = JSON.stringify(json[item])
        }
    }
}

/**************
 * 获取localStorage
 * 存在，返回对应值
 * 不存在，返回''
 */
export const getLocalStorage = function (attr) {
    let storage = window.localStorage
    if (containLocalStorage(attr)) {
        let json = JSON.parse(storage[attr])
        return json
    } else {
        return ''
    }
}
/*************
 * 删除localStorage
 *
 */
export const delLocalStorage = function (attr) {
    let storage = window.localStorage
    if (containLocalStorage(attr)) {
        storage.removeItem(attr)
    }
}
/**************
 * 删除全部localStorage
 */
export const delAllLocalStorage = function (attr) {
    let storage = window.localStorage
    storage.clear()
}

/**************************************************************************************************************************
 *                                  uri操作 相关
 ***************************************************************************************************************************/

/********************************
 * dataToUri
 *
 * 将json格式的data和url合并在一起，并encode
 * url: 标准url
 * data: 必须是字面量对象格式
 * encode: bollean格式，true 需要转译，false 不需要转译
 */
export const dataToUri = function (url, data, encode) {
    // 是否为字面量对象
    if (isJson(data)) {
        let _encode = true
        let dataArr = []
        if (typeof encode === 'boolean') {
            _encode = encode
        }
        for (let item in data) {
            let str = _encode ? (encodeURIComponent(item) + '=' + encodeURIComponent(data[item])) : item + '=' + data[item]
            dataArr.push(str)
        }
        url += (url.indexOf('?') < 0 ? '?' : '&') + dataArr.join('&')

        return url.replace(/$\\?/g, '')
    } else {
        return url
    }
}

/********************************
 * 跳转到页面
 */
export const goTo = function (str) {
    if (str && typeof str === 'string') {
        window.location.href = str
    }
}

/********************************
 * 获取当前url，在#/之前
 */
export const getLocalHref = function () {
    let str = window.location.href
    if (str.indexOf('#/') > -1) {
        str = str.substring(0, str.indexOf('#/'))
    }
    console.log(str)
    return str
}

/**************************************************************************************************************************
 *                                  格式校验 相关
 ***************************************************************************************************************************/

/********************************
 * 判断是字面量对象
 *
 * true 是字面量对象， false 不是
 */
export const isJson = function (data) {
    if (data instanceof Object && data.prototype === undefined) {
        return true
    }
    return false
}

/************************************
 * 验证密码格式
 *
 *true 格式正确 ， false 格式不正确
 */
export const isPassword = function (value) {
    let pattern = /^[\d_a-zA-Z]{6,18}$/
    if (pattern.test(value)) {
        return true
    }
    return false
}

/**************************************
 * 手机号格式
 * true 格式正确， false 格式不正确
 */
export const isPhone = function (value) {
    let pattern = /^1(3|4|5|7|8)\d{9}$/
    if (pattern.test(value)) {
        return true
    }
    return false
}

/*********************************
 *为空
 *
 * true 空， false 非空
 */
export const isEmpty = function (value) {
    if (value === null || value === undefined || value === '') {
        return true
    }
    return false
}

/*********************************
 *字符串格式
 *
 * true 是， false 不是
 */
export const isString = function (value) {
    return !!value && value instanceof String
}
/*********************************
 *数组格式
 *
 * true 是， false 不是
 */
export const isArray = function (value) {
    return !!value && value instanceof Array
}


/************************************
 * 是布尔值
 */
export const isBollean = function (value) {
    return value === true || value === false
}

/**************************************************************************************************************************
 *                                  工具 相关
 ***************************************************************************************************************************/


/********************************
 * 参数的覆盖
 * 以第一个为基准，并不新添属性
 */
export const extend = function (opt, args) {
    for (let item in opt) {
        if (args[item] !== undefined) {
            opt[item] = args[item]
        }
    }
}


/********************************
 * json合并
 * 参数合并，属性添加并覆盖
 * arguments ： [obj1,obj2]
 */
export const extendList = function () {
    let obj = {}
    for(let i = 0; i < arguments.length; i++) {
        for (let key in arguments[i]) {
            obj[key] = arguments[i][key]
        }
    }
    return obj
}

/*****************************************************
 *                  时间操作方法
 ******************************************************/

/********************************
 * 获取 [年,月,日,星期,星期名]
 * params date对象
 * return ['2017','01','02','5','周五']
 */
export const getDateArr = function (date) {
    let year = date.getFullYear()
    let month = (date.getMonth() + 1 > 9) ? (date.getMonth() + 1 + '') : ('0' + (date.getMonth() + 1))
    let day = (date.getDate() > 9) ? (date.getDate() + '') : ('0' + date.getDate())
    let week = date.getDay()
    return [year, month, day, week, getWeekStr(week)]
}

/********************************
 * 获取 周几
 * params '5'
 * return 周日
 */
export const getWeekStr = function (week) {
    let str = ''
    switch (week) {
        case '0':
            str = '周日'
            break;
        case "1":
            str = '周一'
            break;
        case "2":
            str = '周二'
            break;
        case "3":
            str = '周三'
            break;
        case "4":
            str = '周四'
            break;
        case "5":
            str = '周五'
            break;
        case "6":
            str = '周六'
            break;
        default:
            str = ' '
            break
    }
    return str
}

/********************************
 * 获取 天数差
 * params [startDate,endDate] ，参数为date对象
 * return false:已超时； 11:天数
 */
export const getDayDiff = function (dateArr) {
    let startTime = new Date(dateArr[0]);
    let endTime = new Date(dateArr[1]);
    let diff = endTime.getTime() - startTime.getTime();
    if (diff < 0) {
        return false
    }
    return diff / (3600 * 24 * 1000);
}

/********************************
 * 获取 秒数差
 * params [startDate,endDate] ，参数为date对象
 * return false:已超时； 111000:秒数
 */
export const getSecondDiff = function (dateArr) {
    let startTime = dateArr[0]
    let endTime = dateArr[1]
    let diff = endTime.getTime() - startTime.getTime()
    if (diff < 0) {
        return false
    }
    return diff / 1000;
}

/********************************
 * 秒数转成  天 时 分 秒
 * params seconds：秒数
 * return 11天 2h:33m:56s
 */
export const getD_H_M_S_BySeconds = function (seconds) {
    let secondTime = parseInt(seconds);// 秒
    let minuteTime = 0 // 分
    let hourTime = 0 // 小时
    let dayTime = 0 // 天
    if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60)
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60)
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60)
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60)
            // 如果小时大于24，将转成天
            if (hourTime > 24) {
                //获取小时，获取分钟除以60，得到整数小时
                dayTime = parseInt(hourTime / 24)
                hourTime = parseInt(hourTime % 24)
            }
        }
    }
    secondTime = (secondTime > 9) ? secondTime : ('0' + secondTime)
    minuteTime = (minuteTime > 9) ? minuteTime : ('0' + minuteTime)
    hourTime = (hourTime > 9) ? hourTime : ('0' + hourTime)
    dayTime = (dayTime > 9) ? dayTime : ('0' + dayTime)
    let result = "" + secondTime + 's'

    if (minuteTime > 0) {
        result = "" + minuteTime + "m:" + result
    }
    if (hourTime > 0) {
        result = "" + hourTime + "h:" + result
    }
    if (dayTime > 0) {
        result = "" + dayTime + "天 " + result
    }
    return result
}

