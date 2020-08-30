mui.init({ pullRefresh: {
    container: '#content',
    down: {
        callback: pulldownRefresh
    }
}
});
function pulldownRefresh() {
    var mw = document.getElementById("weeks").querySelector("time").textContent;
    schedule(mw, sleLoad)
    

}
var sleLoad = 0;
function mheight() {
    var winHeight;
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    // 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight;
    }
    return winHeight;
}
function schedule(week, xueqi, flag) {
   
     if(flag==1){
         mui.alert('加载中...', ' ',' ',null,'div');
         document.querySelector(".mui-popup").classList.add("loading");
     }
     mui.ajax('/WeiXin/partialSchedule', {
         data: {
             semester: xueqi,
             weekStr: week
         },
         dataType: 'html', //服务器返回json格式数据
         type: 'post', //HTTP请求类型
         timeout: 30000, //超时时间设置为10秒；
         headers: { 'Content-Type': 'application/json' },
         success: function (data) {
             document.getElementById("schedule").innerHTML = data;
             document.getElementById("weeks").querySelector("time").textContent = week;
             if (flag == 1) {
                 setTimeout(function () { mui.closePopups(); }, 600)
             } else {
                 setTimeout(function () {
                     mui('#content').pullRefresh().endPulldownToRefresh(); //refresh completed
                 }, 600)
             }
         },
         error: function (xhr, type, errorThrown) {
             mui.closePopups();
             mui.toast('请求出错！');
         }
     });
}
function setCookie(name, value,expiresHours) {
    var cookieString = name + "=" + escape(value);
    //判断是否设置过期时间
    if (expiresHours > 0) {
        var date = new Date();
        date.setTime(date.getTime + expiresHours * 3600 * 1000);
        cookieString = cookieString + "; expires=" + date.toGMTString();
    }
    document.cookie = cookieString + ";path=/";
}
function getCookie(name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name) return arr[1];
    }
    return "";
}
mui.ready(function () {
    //普通示例
    document.getElementById("content").style.height = +mheight() - 94 + "px";
    var _week = document.querySelector("#weeks time").textContent;
    var thisxueqi = "";
    _week = (_week != "" &&_week > 0) ? _week : document.querySelector("#weeks time").textContent;
    //获取当前学期
    //mui.ajax('/Schedule/getSemesterList', {
    //    data: {},
    //    dataType: 'html', 
    //    type: 'post',
    //    headers: { 'Content-Type': 'application/json' },
    //    success: function (data) {
    //        var datajson = JSON.parse(data);
    //        thisxueqi = datajson.curr.ID;
    //        //schedule(_week,datajson.curr.ID, 0);
    //    }
    //});
//学期和周数级联下拉
(function ($, doc) {
    $.init();
    $.ready(function () {
        //-----------------------------------------
        //级联示例
        var cityPicker = new $.PopPicker({
            layer: 2
        });
        var jsonData = getCookiePub("getSemesterJsonsWeiXin");
        if (jsonData == null || jsonData == undefined || jsonData == "") {
            mui.ajax('/TeacherWX/getSemesterJsons', {
                timeout: 10000, //超时时间设置为10秒；
                async: false,
                success: function (data) {
                    //服务器返回响应，根据响应结果，分析是否登录成功；
                    jsonData = data;
                    setCookiePub("getSemesterJsonsWeiXin", data, 2);
                }
            });
        }
        var obj = JSON.parse(jsonData);
        thisxueqi = obj[obj.length - 1].value;
        cityPicker.setData(obj);
        var showCityPickerButton = doc.getElementById('weeks');
        showCityPickerButton.addEventListener('tap', function (event) {
           //设置菜单默认选中     
            cityPicker.pickers[0].setSelectedValue(thisxueqi, 0, function() {
                setTimeout(function() {
                cityPicker.pickers[1].setSelectedValue(_week);
                }, 100);
                });
            //菜单选择事件
            cityPicker.show(function (items) {
                document.getElementById('Year').setAttribute("data-Id", items[0].value);
                document.getElementById('Year').innerHTML = items[0].text;
                document.getElementById('weeks').setAttribute("data-Id", items[1].value);
                sleLoad = items[0].value
                schedule(items[1].value, items[0].value,1);
            });
        }, false);
        var provCode = doc.getElementById('weeks').getAttribute("data-Ids");
        var cityCode = doc.getElementById('weeks').getAttribute("data-Id");
        var mydata = document.getElementById("wxSDKParameter").value;
        if (mydata) {
            mydata = JSON.parse(mydata);
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: mydata.appId, // 必填，公众号的唯一标识
                timestamp: mydata.timeStamp, // 必填，生成签名的时间戳
                nonceStr: mydata.nonceStr, // 必填，生成签名的随机串
                signature: mydata.signature, // 必填，签名，见附录1
                jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        }
        
    });
})(mui, document);
    mui("#content").on('tap', 'a', function (e) {
        var flag = this.href;
        if (!flag || flag == "" || flag == "javacript:;") {
            var sid = this.getAttribute("schedule_id"), token = document.getElementById('token').value;
            if (sid && sid != '') {
              
                var datas = { "scheduleID": sid };
                mui.loading('请求中，请稍后...'+sid);
                mui.ajax('/api/service?passembly=spockp.Services.IAppService&pmethod=getScheduleStatus', {
                    type: 'post', //HTTP请求类型
                    data: JSON.stringify(datas),
                    timeout: 100000, //超时时间设置为10秒；
                    async: false,
                    processData: false,
                    headers: {
                        'passembly': 'spockp.Services.IAppService',
                        'pmethod': 'getScheduleStatus',
                        'token': token
                    },
                    success: function (data) {
                        setTimeout(function () { mui.loaded(); }, 100);
                        //服务器返回响应，根据响应结果，分析是否登录成功；
                        if (data.code == 1 && data.data) {
                            var obj = data.data;
                            if (obj.Schedule_ID && obj.Lessons_ID && obj.ICID) {
                                var time = document.querySelector("#weeks time").textContent;
                                setCookie("week", time, 4);
                                mui.openWindow({ url: "/Weixin/InteractiveClassroom?lessionid=" + obj.Lessons_ID + "&icid=" + obj.ICID + "&scheduleid=" + obj.Schedule_ID})
                            }
                        } else {
                            mui.toast('老师还未布置任务哦！');
                        }
                    }
                });
            } else {
                mui.toast('老师还未布置任务哦!！');
            }
        } else {
            var time = document.querySelector("#weeks time").textContent;
            setCookie("week", time, 4);
            mui.openWindow({ url: this.href });
        }
    });
    mui(".footer").on('tap', 'a', function (e) { mui.openWindow({ url: this.href }) });
    mui(".header").on('tap', '#SignIn', function (e) {

       
        jQuery('.masker').show();
        jQuery('.popmasker').show();

    });
 
});
mui("body").on("tap", ".status_4", function () {
    var nextSibling = this.nextSibling;
    while (nextSibling && nextSibling.nodeType != 1) {
        nextSibling = nextSibling.nextSibling;
    }
    if (nextSibling) {
        var classduhtml = nextSibling.innerHTML;
        var d = document.getElementById("maxcstop");
        if (d) {
            d.style.display = 'block';
        }
        var v = document.getElementById("msclass");
        if (v) {
            v.innerHTML = classduhtml;
        }
    }
})
mui("body").on("tap", "#msclass", function () {
    document.getElementById("maxcstop").style.display = 'none';
})
mui("body").on("tap", ".lookerwei", function (e) {
      e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
        var btnArray = ['取消', '确定'];
        mui.prompt('', '请输入签到码', '快速签到', btnArray, function (e) {
            if (e.index == 1) {
                var text = e.value, token = document.getElementById('token').value;
                if (text.replace(/\s/g, "") == "") {
                    mui.toast('请输入签到码！');
                } else {
                    mui.loading('请求中，请稍后...')
                   
                    $.post("/Checkin/CheckIn", { CheckInType: 1, Code: text, }, function (data) {
                      
                        mui.loaded()
                     
                        if (data.code === 1) {
                           
                            mui.toast(data.msg);
                          
                        } else if (data.code === 0) {
                            mui.toast('签到失败！<br/><br/>提示信息: ' + data.msg);
                        }
                        if (data.data.ToIC) {
                            var Schedule_Id2 = data.data.Schedule_Id[0];
                            mui.openWindow({ url: "/Weixin/InteractiveClassroom?lessionid=" + data.data.Lessons_ID + "&icid=" + data.data.IC_ID + "&scheduleid=" + Schedule_Id2 })
                        } 
                    })
                }
            } else {

            }
        })
})

mui("body").on("tap", ".saoms", function (e) {

    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            var result = res.resultStr;  // 当needResult 为 1 时，扫码返回的结果

            mui.loading('请求中，请稍后');
            $.post("/Checkin/CheckIn", { CheckInType: 2, Code: result }, function (data) {
                mui.loaded()
              
                if (data.code === 1) {
                }
                else if (data.code === 0) {
                    mui.toast('签到失败！<br/><br/>提示信息: ' + data.msg);

                }

                if (data.data.ToIC) {
                    var Schedule_Id2 = data.data.Schedule_Id[0];
                    mui.openWindow({ url: "/Weixin/InteractiveClassroom?lessionid=" + data.data.Lessons_ID + "&icid=" + data.data.IC_ID + "&scheduleid=" + Schedule_Id2 })
                } 
               
            }, 'json');
        }
    })
})
jQuery('.popmasker').on("tap", function (e) {

    jQuery('.masker').hide();
    jQuery('.popmasker').hide();
    window.location.reload(); 
})
jQuery('.cancels').on("tap", function (e) {
   
    jQuery('.masker').hide();
    jQuery('.popmasker').hide();

})