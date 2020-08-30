//清除单个localStorageName
function clearCookiePub(name) {
    localStorage.removeItem(name);
}
// 清空 localStorage
function clearCookieAll() {
    localStorage.clear();
}
//设置localStorage
function setCookiePub(name, value, exdays) {
    value = value ? value : "", expires = false, data = {};
    //判断是否设置过期时间
    if (exdays > 0) {
        var date = new Date();
        expires = date.getTime() + exdays * 24 * 3600 * 1000;
    }
    data = {
        data: JSON.stringify(value),
        expires: expires
    };
    localStorage.setItem(name, JSON.stringify(data));
}
//获取cookie
function getCookiePub(name) {
    var data = JSON.parse(localStorage.getItem(name)), nowTime = new Date().getTime(), result = data && data.data ? JSON.parse(data.data) : undefined;
    if (data && data.expires !== false && nowTime > data.expires) {
        clearCookiePub(name);
        result = undefined;
    }
    return result;
}