var app = angular.module("schoolApp", ["ngSanitize"]);
var base = (function () {
    var url = window.location.search;
    if (!url || url === '' || url === '?') {
        return false
    }
    var l = url.substring(1).split('&');
    var obj = {};
    for (var i = 0, j = l.length; i < j; i++) {
        var t = l[i].split('=');
        obj[t[0]] = t[1];
    }
    return obj;
})();
(function ($) {
    app.controller('schoolCtrl', function ($scope, $http) {
       $scope.beforeClass = [];
         
        $scope.inClass = [];
        $scope.afterClass = [];
        $scope.isCkin = false; //是否签到
        //获取签到的次数
        $scope.getNms = function () {
            online = window.navigator.onLine;
            if (!online) {
                mui.loaded();
                mui.toast('网络已断开连接！');
                return 
            }
            mui.loading('请求中，请稍后');
            var model = document.getElementById("model"), ic_id = model.value;
            $scope.noCheckin = [];
            var nosckin = [];
            var objIcd = {
                IC_ID: ic_id
            }
            jQuery('.table_green_bg').css('display', 'block')
            $http.post('/Checkin/GetCheckinDetailsByStu', objIcd).then(function (res) {
                mui.loaded();
                if (res.data.code == 1) {
                    $scope.getcodeNum = res.data.data;
                    $scope.getcodeNum.forEach(function (item, index) {
                        if (item.IsCheckin == 1) {
                            $scope.isCkin = true;
                            nosckin.push(item)
                        }
                    })
                    $scope.noCheckin = nosckin
                }

                if ($scope.noCheckin.length != 0) {
                    jQuery('#mynote').removeClass('disabled')
                } else {
                    jQuery('#mynote').addClass('disabled')
                }

            }, function (res) {
                mui.loaded();

                mui.toast('请求出错');
            });
        }
        $scope.getNms()
        //加入小组
        $scope.sureJoin = function (e) {
            layer.confirm('请确认是否加入该小组？', {
                btn: ['确定', '取消'] //按钮
            }, function (index) {

                $http.post('/GroupActivity/JoinGroup', { group_id: e }).then(function (res) {
                    console.log(res)
                    if (res.data.code == 1) {
                        $scope.getFZ();
                    } else if (res.data.code == -1) {
                        layer.msg(res.data.msg)
                    }
                })
                layer.close(index);

            }, function (index) {
                layer.close(index);
            });
        }
        //退出小组(分组活动)


        $scope.signOutJoin = function (e) {
            layer.confirm('请确认是否退出该小组？', {
                btn: ['确定', '取消'] //按钮
            }, function (index) {

                $http.post('/GroupActivity/SignOutGroup', { group_id: e }).then(function (res) {

                    if (res.data.code == 1) {
                        $scope.getFZ();
                    } else if (res.data.code == -1) {
                        layer.msg(res.data.msg)
                    }
                })
                layer.close(index);

            }, function () {

            });
        }



        //加入活动分组
        $scope.sureJoinAct = function (e) {
            layer.confirm('请确认是否加入该小组？', {
                btn: ['确定', '取消'] //按钮
            }, function (index) {
                $http.post('/ActivityGroup/JoinActivityGroup', { group_id: e }).then(function (res) {
                    if (res.data.code == 1) {
                        $scope.getFZ();
                    } else if (res.data.code == -1) {
                        layer.msg(res.data.msg)
                    }
                })
                layer.close(index);

            }, function (index) {
                layer.close(index);
            });
        }
        //获取签到列表
        $scope.getIcclist = function () {
            var model = document.getElementById("model"), ic_id = model.value;
            $http.post('/Checkin/GetIccList', { IC_ID: ic_id }).then(function (res) {
                $scope.getConts = res.data.data;

            })
        }
        //$scope.getIcclist()
        //退出活动分组
        $scope.signOutAct = function (e) {
            layer.confirm('请确认是否退出该小组？', {
                btn: ['确定', '取消'] //按钮
            }, function (index) {
                $http.post('/ActivityGroup/SignOutActivityGroup', { group_id: e }).then(function (res) {
                    if (res.data.code == 1) {
                        $scope.getFZ();
                    } else if (res.data.code == -1) {
                        layer.msg(res.data.msg)
                    }
                })
                layer.close(index);

            }, function (index) {
                layer.close(index);
            });

        }
        //进入课件
        $scope.toKejian = function () {
            var model = document.getElementById("model"), ic_id = model.value

            $.openWindow({ url: '/Weixin/courseware?IC_ID=' + ic_id });

        }
        //笔记弹出
        jQuery('#mynote').on('tap', function () {
            $.openWindow({ url: this.href });
        });

        jQuery('.lookerwei').on('tap', function () {

            var model = document.getElementById("model"), ic_id = model.value;
            $http.post('/Checkin/RefreshCheckInCode', { CheckId: $scope.getConts.CurCheckin.CheckId }).then(function (res) {

                if (res.data.code == 1) {
                    h = "<img  src='data:image/jpg;base64," + res.data.data.Code + "'  />";
                    jQuery('.lookCodes').append(h)

                }
            })

            jQuery('.lookCodes').show()
            jQuery('.masker').hide()

        })

        jQuery('.popmasker').on('tap', function () {
            jQuery('.lookCodes').hide()
            jQuery('.masker').hide()
            jQuery('.popmasker').hide();
            window.location.reload();

        })


        $scope.adddata = function (index, callback) {
          
            $scope.getNms()
            if (!online) {
                mui.loaded();
                mui.toast('网络已断开连接！');
                return 
            }
        //    mui.loading('请求中，请稍后');
            jQuery('.table_green_bg').css('display', 'block')
            var model = document.getElementById("model"), ic_id = model.value, batch_id = model.getAttribute("data-bit"), LessonsID = model.getAttribute("data-les");
            var applayType = +index + 1;
            var nom = new Date();

            $http.post("/Weixin/partialItemClassJson?v=" + nom.getMilliseconds(),
                {
                    applayType: applayType,
                    ic_id: ic_id,
                    batchid: batch_id,
                    schduleid: base.scheduleid,
                    lessionid: LessonsID
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }).then(function (res) {
                    
                    mui.loaded()
                    if (res.status === 200) {
                        var Model = res.data, result = Model.items, count = result.length;
                        angular.forEach(result, function (item) {
                            item.isNew = item.isNew ? "new" : "";
                            item.SectionText = item.Section && item.Section.Goal ? item.Section.Goal : "";
                            switch (item.typeId) {
                                case "1":
                                    item.actUrl = "/Weixin/inquriy?courseElementId=" + item.courseElmentId + "&icid=" + Model.ICID + "&scheduleid=" + Model.SchdelueID + "&lessionid=" + Model.LessonsID;
                                    item.imgUrl = "diaocha";
                                    item.activeName = "调查";
                                    break;
                                case "3":
                                    item.actUrl = "/Weixin/QuestionAnswer?icaID=" + item.ID + "&icid=" + Model.ICID + "&scheduleid=" + Model.SchdelueID + "&lessionid=" + Model.LessonsID;
                                    item.imgUrl = "wenda";
                                    item.activeName = "一句话问答";
                                    break;
                                case "10":
                                    item.actUrl = "/Weixin/Qiangda?icaID=" + item.ID + "&icid=" + Model.ICID + "&scheduleid=" + Model.SchdelueID + "&lessionid=" + Model.LessonsID;
                                    item.imgUrl = "qiangda";
                                    item.activeName = "抢答";
                                    break;
                                case "4":
                                    item.actUrl = "/Weixin/Board?icaID=" + item.ID + "&icid=" + Model.ICID + "&scheduleid=" + Model.SchdelueID + "&lessionid=" + Model.LessonsID;
                                    item.imgUrl = "zhangtie";
                                    item.activeName = "粘贴板";
                                    break;
                                case "9":
                                    item.actUrl = "/Weixin/TestExam?taskInfo=" + item.taskInfoID + "&Id=" + item.courseElmentId + "&icid=" + Model.ICID + "&scheduleid=" + Model.SchdelueID + "&lessionid=" + Model.LessonsID + "&sign=" + Model.Sign + "&type=1";
                                    item.imgUrl = "test";
                                    item.activeName = "测验";
                                    break;
                                case "5":
                                    item.actUrl = "/Weixin/material?courseElementId=" + item.courseElmentId + "&icid=" + Model.ICID + "&scheduleid=" + Model.SchdelueID + "&lessionid=" + Model.LessonsID;
                                    item.imgUrl = "ziliao";
                                    item.activeName = "学习资料";
                                    break;
                                case "12":
                                    item.actUrl = "/Weixin/material?courseElementId=" + item.courseElmentId + "&icid=" + Model.ICID + "&scheduleid=" + Model.SchdelueID + "&lessionid=" + Model.LessonsID;
                                    item.imgUrl = "Teach";
                                    item.activeName = "讲授";
                                    break;
                                case "6":
                                    item.actUrl = "/Weixin/TestExam?taskInfo=" + item.taskInfoID + "&Id=" + item.courseElmentId + "&icid=" + Model.ICID + "&scheduleid=" + Model.SchdelueID + "&lessionid=" + Model.LessonsID + "&sign=" + Model.Sign + "&type=2";
                                    item.imgUrl = "MaterialOperation";
                                    item.activeName = "过关练习";
                                    break;
                                case "13":
                                    item.actUrl = "/Weixin/TestExam?taskInfo=" + item.taskInfoID + "&Id=" + item.courseElmentId + "&icid=" + Model.ICID + "&scheduleid=" + Model.SchdelueID + "&lessionid=" + Model.LessonsID + "&sign=" + Model.Sign + "&type=3";
                                    item.imgUrl = "ActivityLibrary";
                                    item.activeName = "质控";
                                    break;
                                case "7":
                                    item.actUrl = "/Weixin/homeWork?courseElementId=" + item.courseElmentId + "&icid=" + Model.ICID + "&scheduleid=" + Model.SchdelueID + "&lessionid=" + Model.LessonsID;
                                    item.imgUrl = "MaterialOperation";
                                    item.activeName = "材料作业";
                                    break;
                                case "14":
                                    item.actUrl = "/Weixin/rollCall?ica_id=" + item.ID + "&icid=" + Model.ICID + "&ce_id=" + item.courseElmentId + "&ic_id=" + Model.ICID + "&icid=" + Model.ICID + "&scheduleid=" + Model.SchdelueID + "&lessionid=" + Model.LessonsID;
                                    item.imgUrl = "Point";
                                    item.activeName = "点将";
                                    break;
                                case "17":
                                    item.actUrl = "/Weixin/handActive?ica_id=" + item.ID + "&icid=" + Model.ICID + "&ce_id=" + item.courseElmentId + "&ic_id=" + Model.ICID + "&icid=" + Model.ICID + "&scheduleid=" + Model.SchdelueID + "&lessionid=" + Model.LessonsID;
                                    item.imgUrl = "Point";
                                    item.activeName = "举手活动";
                                    break;
                                default:
                                    //其它默认
                                    item.actUrl = "javascript:void(0)";
                                    item.imgUrl = "";
                                    item.activeName = "";
                                    break;
                            }
                        });
                       
                        if (applayType === 1) {
                            $scope.beforeClass = result;

                        } else if (applayType === 2) {
                            $scope.inClass = result;
                        } else if (applayType === 3) {
                            $scope.afterClass = result;

                        } else {
                            $scope.beforeClass = [];
                            $scope.inClass = [];
                            $scope.afterClass = [];
                        }
                        if (applayType == 1) {
                           
                            sessionStorage.setItem("kelo1", JSON.stringify($scope.beforeClass));
                         
                         
                        } else if (applayType == 2) {
                            sessionStorage.setItem("kelo1", JSON.stringify($scope.inClass));
                        
                        } else if (applayType == 3) {
                            sessionStorage.setItem("kelo1", JSON.stringify($scope.afterClass));
                        
                        }
                        sessionStorage.setItem("keType", applayType);
                        var NewUrl = "/Weixin/InteractiveClassroom" + location.search;
                        history.replaceState(1, '新yemian ', NewUrl);
                        
                        setTimeout(function () { mui.closePopups(); }, 500);
                        if (typeof callback === "function") {
                            return callback();
                        }
                    } else {
                        setTimeout(function () { mui.closePopups(); }, 500);
                        mui.toast('请求出错！');
                        mui.loaded()
                    }
                   
                  
                }, function (res) {
                    mui.loaded();
                  
                    mui.toast('请求出错');
                });
        };


        //刷新本页面
        //$scope.refresh = function () {
        //    console.log(33)
        //   // $scope.getNms()
        //}
        mui('body').on('tap', '#refres_nows', function () {
            $scope.getNms();
            $scope.adddata(1)
        })

        //改变资料预览状态
        mui("#active-content").on("tap", ".SudaList", function () {

            var datanid = this.getAttribute("data-nid");
            var thisurl = this.getAttribute("data-url");
          
        
            var activeName = this.getAttribute("data-type");
            var page = document.getElementById('sliderSegmentedControl').getElementsByClassName('mui-active')[0].getAttribute("data-sequence");
            sessionStorage.setItem("keType", page);
           
            setCookie("page", page, 4);
            setCookie("historyGO", 0, 6);
            if (activeName === "学习资料") {
                mui.ajax('/Weixin/NoticeAndStatusByCourseElementID', {
                    data: { ce_id: datanid },
                    dataType: 'json',
                    type: 'post',
                    timeout: 10000,
                    headers: { 'Content-Type': 'application/json' },
                    success: function (data) {
                        mui.openWindow({ url: thisurl });
                    }
                });
            } else {
                window.location.href = thisurl;
            }
        });
        //////////////////


        document.getElementById("scoreInfo").addEventListener('tap', function (e) {
          
            e.detail.gesture.preventDefault();
            $.openWindow({ url: this.href });
        });

        ////跳转课件
        //document.getElementById("courseware").addEventListener('tap', function (e) {
        //    e.detail.gesture.preventDefault();
        //    $.openWindow({ url: this.href });
        //});

        document.getElementById("commentNote").addEventListener('tap', function (e) {
            e.detail.gesture.preventDefault();

            var _this = this, oldActive = document.getElementById("sliderSegmentedControl").getElementsByClassName('mui-active')[0];

            getStatus(function (mystatus) {
                var model = document.getElementById("model"), ic_id = model.value, batch_id = model.getAttribute("data-bit"), S_ID = model.getAttribute("data-sid"), LessonsID = model.getAttribute("data-les");
                if (mystatus.statue === 3) {
                    $.openWindow({ url: "/Weixin/NotePage?&IC_ID=" + ic_id + "&icid=" + ic_id + "&scheduleid=" + S_ID + "&schdule_ID=" + S_ID + "&lessionid=" + LessonsID + "&page=note-page" });
                } else if (mystatus.statue === 4) {
                    $.openWindow({ url: "/Weixin/CommentNote?&icid=" + ic_id + "&IC_ID=" + ic_id + "&S_ID=" + S_ID + "&lessionid=" + LessonsID + "&page=comment-page" });
                } else {
                    _this.classList.remove('mui-active');
                    if (mystatus.message !== "") {
                        $.toast(mystatus.message);
                    }

                    oldActive.classList.add('mui-active');
                }
            });
        });
        //document.getElementById("grop5").addEventListener('tap', function (e) {
        //    jQuery(this).addClass('mui-active').siblings().removeClass('mui-active');
        //    jQuery('#fenzAction').addClass('mui-active').siblings().removeClass('mui-active');
        //    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        //    var type = document.querySelector("#active-content .mui-active.mui-control-content").getAttribute("data-type");
        //    var left = parseInt(w) * parseInt(type);
        //    setTimeout(function () {
        //        document.getElementById("active-content").style = "transform: translate3d(-" + left + "px, 0px, 0px) translateZ(0px); transition-duration: 0ms; transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);";
        //        mui('.mui-slider').slider();
        //    }, 200);



        //})
        //getStatus();
        document.getElementById("SignIn2").addEventListener('tap', function (e) {
            var model = document.getElementById("model"), ic_id = model.value;
            var tntnull = null;
            mui.loading('请求中，请稍后');
            $http.post('/Checkin/GetIccList', { IC_ID: ic_id }).then(function (res) {
                $scope.getConts = res.data.data;
                mui.loaded();
                if (!$scope.getConts.CurCheckin && !$scope.getConts.NextCheckin) {
                    mui.toast(' 签到已结束！');

                } else {
                    if (!$scope.getConts.CurCheckin) {
                        mui.toast(' 签到未开始 ！');

                    } else {

                        if ($scope.getConts.CurCheckin.Type == 1) {  //签到码
                            e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
                            var btnArray = ['取消', '确定'], self = this, icid = document.getElementById("model").value;
                            var contentBod = {};

                            if ($scope.getConts.CurCheckin) {
                                if ($scope.getConts.CurCheckin.Status = 1) {
                                    contentBod = $scope.getConts.CurCheckin
                                }
                            } else {
                                contentBod = $scope.getConts.NextCheckin
                            }
                            e.preventDefault();
                            e.stopPropagation();
                            $.prompt('', '请输入签到码', '上课签到', btnArray, function (e) {
                                if (e.index === 1) {
                                    var text = e.value;
                                    if (text.replace(/\s/g, "") === "") {
                                        $.toast('请输入签到码！');
                                    } else {
                                        setTimeout(function () {
                                            mui.loading('请求中，请稍后');
                                            $.post("/Checkin/CheckIn", { IC_ID: icid, CheckInType: contentBod.Type, Code: text }, function (data) {

                                                mui.loaded();
                                                if (data.code === 1) {
                                                    mui.toast(data.msg);
                                                    $scope.getNms()
                                                } else if (data.code === 0) {

                                                    if (data.msg == tntnull || data.msg == '') {
                                                        mui.toast('签到失败！');
                                                    } else {

                                                        mui.toast('签到失败！<br/><br/>提示信息: ' + data.msg);
                                                    }
                                                }
                                            }, 'json');
                                        }, 500);
                                    }
                                } else {


                                }
                            });
                            document.querySelector('.mui-popup-input input').type = 'number';

                        } else {        //二
                            jQuery('.popmasker').show();
                            jQuery('.masker').show();

                        }
                    }

                }
            }, function (res) {
                mui.loaded();

                mui.toast('请求出错');
            });


        });


        document.querySelector('#slider').addEventListener('slide', function (event) {

            console.log("点击事件");
            console.log(event);
         
            $scope.adddata(event.detail.slideNumber, function () {

                setTimeout(function () { $.toast('加载成功！'); }, 100);
            });
        });

        $("#slider").on('tap', '.title a', function (e) {
            if (!this.classList.contains("myCroup")) {
                var page = this.parentNode.parentNode.parentNode.parentNode.getAttribute("data-scroll");

                setCookie("page", page, 0.1);
                setCookie("historyGO", 0, 6);
            }
        });
        jQuery('.cancels').on('tap', function () {

            jQuery('.popmasker').hide();
            jQuery('.masker').hide();
        })
        //< span class="cancels" > 取消</span >
        //    <span class="lookerwei">查看二维码</span>
        //    <span class="saoms">扫码</span>


        $(".header").on('tap', 'a.title', function (e) {
            $.openWindow({ url: this.href });
        });

        //获取分组

        //$scope.getFZ = function () {
        //    var model = document.getElementById("model");
        //    var ic_id = model.value;
        //    $http.post('/ClassGroup/GetGroupAll', { ic_id: ic_id }).then(function (res) {
        //        console.log(res)
        //        if (res.data.code == 1) {
        //            $scope.Group_Members = res.data.data.GroupActivityData;
        //            $scope.ActivitGroupy = res.data.data.ActivitGroupyData;
        //            console.log($scope.ActivitGroupy)
        //        }
        //    })
        //}
        //$scope.getFZ();
        $.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function (index, pullRefreshEl) {
          
            $(pullRefreshEl).pullToRefresh({
                down: {
                    callback: function () {
                      
                        var self = this;
                        $scope.getNms()
                        $scope.adddata(index, function () {
                            mui.toast('数据已更新！');
                            self.endPullDownToRefresh();
                        });
                        setTimeout(function () {
                            self.endPullDownToRefresh();  
                        },1000)
                    }
                }
            });
        });

        function getStatus(callback) {
            var model = document.getElementById("model");
            var ic_id = model.value, batch_id = model.getAttribute("data-bit"), S_ID = model.getAttribute("data-sid"), LessonsID = model.getAttribute("data-les");
            mui.loading('请求中，请稍后');
            $.ajax('/Weixin/GetCommentNoteStatus', {
                data: { IC_ID: ic_id, "S_ID": S_ID },
                dataType: 'json', //服务器返回json格式数据
                type: 'post', //HTTP请求类型
                timeout: 10000, //超时时间设置为10秒；
                headers: { 'Content-Type': 'application/json' },
                success: function (data) {
                    if (data.statue === 4) {

                        document.getElementById("commentNote").querySelector("i").classList.add("comment");
                    }
                    mui.loaded();
                    if (typeof callback === "function") {
                        return callback(data);
                    }
                },
                error: function (xhr, type, errorThrown) {
                    mui.loaded();
                    if (type === 'timeout') {
                        mui.toast('请求超时！');
                    } else {
                        mui.toast('请求出错！');
                    }
                }
            });

        }
        jQuery('.saoms').on('tap', function () {
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var resultCodes = res.resultStr;  // 当needResult 为 1 时，扫码返回的结果

                    $.post("/Checkin/CheckIn", { CheckInType: 2, Code: resultCodes, }, function (data) {

                        if (data.code === 1) {
                            mui.toast('签到成功 ！');
                            window.location.reload();

                        }
                        else if (data.code === 0) {
                            mui.toast('签到失败！<br/><br/>提示信息: ' + data.msg);
                            window.location.reload();
                        }
                    }, 'json');
                }
            })
        })
    });
    $.ready(function () {
        mui.init();
      
        if (history.state == 1) {
            
            var info = JSON.parse(sessionStorage.getItem('kelo1'))
            var info2 = JSON.parse(sessionStorage.getItem('keType'))
            var mypagep = document.getElementById("active-content");
            var width2 = 0;
            if (window.innerWidth) { width2 = window.innerWidth; }
            else if (document.body && document.body.clientWidth) {
                width2 = document.body.clientWidth;
            }
            if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                width2 = document.documentElement.clientWidth;
            }
            console.log(info)
            var appElement = document.querySelector('[ng-controller=schoolCtrl]');
            var scope = angular.element(appElement).scope();

            if (info2==0) {
                scope.beforeClass = info
            } else if (info2 == 1) {
                scope.inClass = info
            } else if (info2 == 2) {
                scope.afterClass = info
            }
            
            if (info2 >= 0) {

                jQuery('#sliderSegmentedControl a').eq(info2).addClass('mui-active').siblings().removeClass('mui-active')

                setTimeout(function () {

                    document.getElementById("active-content").style = "transform: translate3d(-" + width2 * (info2) + "px, 0px, 0px) translateZ(0px); transition-duration: 0ms; transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);";
                    mui('.mui-slider').slider();
                }, 200);
            }
            if (info2 == 1) {
                scope.isCkin = true;
            }
          
            sessionStorage.removeItem('info')
            sessionStorage.removeItem('info2')
        }
        window.onresize = function () {
            console.log(2233)
            var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var type = document.querySelector("#active-content .mui-active.mui-control-content").getAttribute("data-type");
            var left = parseInt(w) * parseInt(type);
            setTimeout(function () {
              
                document.getElementById("active-content").style = "transform: translate3d(-" + left + "px, 0px, 0px) translateZ(0px); transition-duration: 0ms; transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);";
                mui('.mui-slider').slider();
            }, 200);
        };
        //阻尼系数
        var deceleration = mui.os.ios ? 0.003 : 0.0009;
        $('.mui-scroll-wrapper').scroll({
            scrollY: true, //是否竖向滚动
            bounce: true,
            indicators: true, //是否显示滚动条
            deceleration: deceleration
        });
        //console.log(angular.element('#schoolCtrl'))
        //判断是否有未评课的
        var unClassUrl = document.getElementById("lastUnClassroom").value;

        if (unClassUrl && unClassUrl.length > 0) {
            var lessonsInfo = document.getElementById("lastUnClassroomInfo").value;
            mui.alert('有未评论的课堂，请先评课 ！' + lessonsInfo, '提示', ['确认'], function (e) {
                $.openWindow({ url: unClassUrl });
            });
        }

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
        var mypage = parseInt(getCookie("page"));
        console.log(mypage)
        if (mypage >= 2) {
            console.log('改变')
            var myactive = document.querySelector("#sliderSegmentedControl .mui-active");
            if (myactive) { myactive.classList.remove("mui-active"); myactive = null; }
            document.querySelectorAll("#sliderSegmentedControl>a")[+mypage - 1].classList.add("mui-active");
            var width = 0;
            if (window.innerWidth) { width = window.innerWidth; }
            else if (document.body && document.body.clientWidth) {
                width = document.body.clientWidth;
            }
            if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                width = document.documentElement.clientWidth;
            }
            var mypagep = document.getElementById("active-content");
          //  mypagep.style.transform = "translate3d(-" + width * (mypage - 1) + "px, 0px, 0px) translateZ(0px)";
            var myshow = mypagep.querySelector("div.mui-active");
            if (myshow) {
                myshow.classList.remove("mui-active");
                myshow = null;
            }
            if (mypagep.children[mypage - 1]) {

                mypagep.children[mypage - 1].classList.add("mui-active");
            }
            mypagep = null;
        }
        $('.mui-slider').slider();
        $('.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control').scroll({
            scrollY: false,
            scrollX: true,
            startX: 0,
            indicators: false,
            snap: '.mui-control-item'
        });
        var mdiv = document.getElementById("active-content").querySelectorAll(".mui-table-view"), len = mdiv.length, tap = document.getElementById("sliderSegmentedControl").querySelectorAll("a>span");
        for (var i = 0; i < len; i++) {
            var countli = mdiv[i].querySelectorAll("li.new"), count = countli.length;
            countli = null;
            if (count > 0) {
                tap[i].setAttribute("data-no", count);
                tap[i].classList.add("new");
            }
            if (i === len - 1) { mdiv = null; len = null; mh = null; tap = null; }
        }
    });
})(mui);


function setCookie(name, value, expiresHours) {
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
        if (arr[0] === name) return arr[1];
    }
    return "";
}
