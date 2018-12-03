
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

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find (list, f) {
    return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array <Object> } cache
 * @return {*}
 */
export  function deepCopy (obj, cache = []) {
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj)
    if (hit) {
        return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy
    })

    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache)
    })

    return copy
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

/********************************
 * 获取月份列表
 * params date：开始时间对象
 * return monthList 月份列表
 */
export const getMonthList = function (date) {
    let monthList = []
    let nowDate = this.formatDateObjToDate(date)
    let nowYear = Number(nowDate[0])
    let nowMonth = Number(nowDate[1])

    for (let i = 0; i < 13; i++) {
        let m = nowMonth + i > 12 ? (nowMonth + i  - 12) : nowMonth + i
        m = m <  10 ? '0' +m : m
        let y = nowMonth + i > 12 ? nowYear + 1 : nowYear
        monthList.push([y + '',m + ''])
    }

    return monthList

}

/********************************
 * 获取月份日期列表
 * params: [年，月]
 * return: [01,02,03...31]
 */
export const getDaysByMonth = function (arr) {
    let daysArr = []
    let dateLen = new Date(arr[0],arr[1],0).getDate()
    for (let i = 1; i < dateLen + 1; i++){
        let day = i < 10 ? '0'+i : i
        let dateStr = `${arr[0]}-${arr[1]}-${day}`
        let obj = {
            date: dateStr, // 当前日期
        }
        daysArr.push(obj)
    }
}
/********************************
 * 将date转成年月日
 * params: date对象
 * return: [年,月,日]
 */
export const formatDateObjToDate = function (date) {
    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString().length === 1 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1)
    let day = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate()
    return [year+'', month+'', day + '']
}

/**
 * 判断日期是否是包含关系
 * @param date: 日期对象, arrDate: [开始日期，结束日期]
 * @returns 1:开始，2：结束，3：包含,
 */
export const isContentDate = function (date, arrDate) {
    let selectedDate = arrDate
    let now = date
    let selected = false
    let startDate = selectedDate[0]
    let endDate = selectedDate[1]
    let n = joinDateArrToStr(formatDateObjToDate(now))
    let s = joinDateArrToStr(formatDateObjToDate(startDate))
    let e = joinDateArrToStr(formatDateObjToDate(endDate))
    if (now >= startDate && now <= endDate) {
        selected = true
    }
    return {
        selected: selected,
        start: n === s,
        end: n === e
    }
}
/**
 * 获取一年之后日期
 * @param startDateStr: '2018-02-02'
 * @returns 1:开始，2：结束，3：包含,
 */
export const getOneYear = function (startDateStr) {
    let endDate =new Date(startDateStr)
    endDate = endDate.setFullYear(endDate.getFullYear()+1)
    endDate =  new Date(endDate)
    return endDate
}
/**
 * 将日期数组日期转字符串
 * @param arr: [年，月，日]
 * @returns 1: 年-月-日
 */
export const joinDateArrToStr = function (arr) {
    return `${arr[0]}-${arr[1]}-${arr[2]}`
}
/**
 * 获取当前日期为周几
 * @param date: date对象
 * @returns week: 周几，isWeekend：是否是周末
 */
export const getDateWeek = function (date) {
    return {
        week: date.getDay(),
        isWeekend: date.getDay()===0 || date.getDay()===6
    }
}


/*****************************************************
 *                  金额操作方法
 ******************************************************/

/**
 * 人民币返回 大写汉字
 * @param money
 * @returns week: 周几，isWeekend：是否是周末
 */
export const convertCurrency = function (money) {
    //汉字的数字
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    //整数金额时后面跟的字符
    var cnInteger = '整';
    //整型完以后的单位
    var cnIntLast = '元';
    //最大处理的数字
    var maxNum = 999999999999999.9999;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = '';
    //分离金额后用的数组，预定义
    var parts;
    if (money == '') { return ''; }
    money = parseFloat(money);
    if (money >= maxNum) {
        //超出最大处理数字
        return '';
    }
    if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
    } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                //归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '') {
        chineseStr += cnInteger;
    }
    return chineseStr;
}
/**
 * 人民币返回 大写汉字
 * @param money
 * @returns week: 周几，isWeekend：是否是周末
 */
export const convertCurrency = function (money) {
    //汉字的数字
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    //整数金额时后面跟的字符
    var cnInteger = '整';
    //整型完以后的单位
    var cnIntLast = '元';
    //最大处理的数字
    var maxNum = 999999999999999.9999;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = '';
    //分离金额后用的数组，预定义
    var parts;
    if (money == '') { return ''; }
    money = parseFloat(money);
    if (money >= maxNum) {
        //超出最大处理数字
        return '';
    }
    if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
    } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                //归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '') {
        chineseStr += cnInteger;
    }
    return chineseStr;
}
/**
 * 计算金额为金额数组
 * @param money
 * @returns array: [亿,千万,百万...元,角,分]
 */
export const computeMoneyArr = function (money) {
    let str = money + ''
    let moneyArr = []
    let arr = str.split('.')
    let Xs = '00'
    if (arr[1]){
        if (arr[1].length === 2){
            Xs = arr[1]
        } else {
            Xs = arr[1] + '0'
        }
    }
    let XsArr = Xs.split('')
    let ZsArr = arr[0].split('')
    moneyArr = ZsArr.concat(XsArr)

    let returnArr = []
    let currentLength = moneyArr.length
    for (let i = 0; i < (11 - currentLength); i++){
        returnArr.push('0')
    }
    returnArr = returnArr.concat(moneyArr)
    return returnArr
}