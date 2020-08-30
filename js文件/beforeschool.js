

$(".h1").on("click", ".left-Drawer", function () {
    var thiss = $(this);

    var thisClass = thiss.parents(".hw_2").hasClass("foot-width");
    if (thisClass) {
        thiss.parents(".hw_2").removeClass("foot-width");
        thiss.parents(".hw_2").addClass("foot-nowidth");
        thiss.attr("class", "fa fa-angle-double-left left-Drawer");
    } else {
        thiss.parents(".hw_2").addClass("foot-width");
        thiss.parents(".hw_2").removeClass("foot-nowidth");
        thiss.attr("class", "fa fa-angle-double-right left-Drawer");
    }
});
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
var ic_id = $("#IC_ID").val();
var app = angular.module("schoolApp", ["ngSanitize"]);
var IDList = ""; //签到获取的id
app.filter("activeType", function () {
    return function (input, format) {
        var point = ["其他", "调查", "头脑风暴", "一句话问答", "粘贴板", "学习资料", "过关练习", "材料作业", "分组", "测验", "抢答", "资源包", "讲授", "质控", "点将", "网络资源", "任务", "举手活动", "", "网络资源"];
        return point[input];
    };
});
app.filter("activeClass", function () {
    return function (input, format) {
        var point = ["Inquiry", "Inquiry", "头脑风暴", "Question", "Clipboard", "Study", "operation", "operation", "分组", "testing", "goQuestion", "Library", "Openh", "Library", "Will", "网络资源", "Quality", "Library", "", "网络资源"];
        return point[input];
    };
});
app.filter("jsonDate", function ($filter) {
    return function (input, format) {
        if (input == undefined) {
            return "";
        }
        //从字符串 /Date(1448864369815)/ 得到时间戳 1448864369815
        var timestamp = Number(input.replace(/\/Date\((\d+)\)\//, "$1"));
        var date = new Date(timestamp);
        if (isNaN(date.getFullYear())) {
            var formatDate = '——';
            return formatDate
        } else {
            var formatDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();

            return formatDate
        }

        //转成指定格式
        //  return $filter("date")(timestamp, format);
    };
});
app.controller('schoolCtrl', function ($scope, $http, $filter) {
    $scope.cancleds = function () {     //编辑分组弹框关闭

        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引

        parent.layer.close(index)
    }
   
    //初始数据
    //$scope.selectName = 1;//默认为1
    $scope.datainfoAll = function (callBack) {
        $http.get("/Interaction/GetLessonsData", { params: { IC_ID: ic_id } }).then(function (resp) {
            $scope.school_ID = resp.data;
            $scope.activeType = 0;
            $scope.linkClass = localStorage.getItem("linkClass");
            if ($scope.linkClass === null || ($scope.school_ID.sections.length - 1) < $scope.linkClass) {
                localStorage.setItem("linkClass", 0);
                $scope.linkClass = 0;
            }
            if ($scope.school_ID.sections[0] != undefined && $scope.linkClass != null) {
                $scope.school_ID.sections[$scope.linkClass].choose = true;
                $scope.sectionId = $scope.school_ID.sections[$scope.linkClass].section.ID;
            }
            $scope.icName = $scope.school_ID.IC.IC_Name;
            if ($scope.school_ID.CourseType != 3) {
                $scope.CourseType = false;
            } else {
                $scope.CourseType = true;
            }
            var isketime = localStorage.getItem("isketime");
            if (isketime === 1) {
                $("body .activeAdd>li").eq(0).click();
            } else if (isketime === 2) {
                $("body .activeAdd>li").eq(1).click();
            } else if (isketime === 3) {
                $("body .activeAdd>li").eq(2).click();
            }
            if (typeof callBack === 'function') {
                callBack();
            }

            $("body .box-close").trigger("click");
        });
    };
    //设置签到次数

    $scope.selNums = [];
    function nums() {
        for (var i = 0; i < 20; i++) {
            $scope.selNums[i] = {};
            $scope.selNums[i].name = i + 1;
            $scope.selNums[i].id = i + 1;
        }
    }
    nums();

    $scope.postBack = [''];
    //追加li
    $scope.addLI = function () {

        var postBack = '';
        $scope.postBack.push(postBack);


    }
    $scope.removeLI = function (e) {

        if (e == 0) {
            ErrorMessage("该输入框无法删除！");
        } else {
            var cts = $scope.postBack;
            var arrs = cts.splice(e, 1)
            $scope.postBack = cts
        }
    }
    $scope.IsReset = false;
    //签到设置
    $scope.Settings = function () {
        $('#checkSettings').modal({ backdrop: 'static', keyboard: false });
        if ($scope.signList.CheckinList.length != 0) {
            $scope.selectName = $scope.signList.CheckinList.length;
            if ($scope.signList.CheckinList[0].Type == 1) {
                $scope.codeNumcs = 1;
            } else {
                $scope.codeNumcs = 2;
                jQuery('.codes2').prop("checked", "checked")
            }

        } else {
            $scope.selectName = $scope.selNums[0].id;
            $scope.codeNumcs = 1;
        }
        //$scope.signList.CheckinList
    }

    $scope.signStatus = 1;//签到状态 // 1 为开始 2 暂停 3结束
    //修改签到次数
    $scope.getApiCategory = function (e) {
        $scope.selectName = e;
    }
    //设置签到类型
    $scope.codeNumcs = 1; //默认设置为签到码
    $scope.codeChose = function (e) {
        $scope.codeNumcs = e;
    }
    //签到设置
    $scope.update_sign = function (index) {
        var tnd = false;
        if ($scope.signList.CheckinList.length != 0) {
            tnd = true
        }
        $http.get("/Checkin/CheckInSetting", { params: { CheckInType: $scope.codeNumcs, CheckInNumber: $scope.selectName, IC_ID: ic_id, IsReset: tnd } }).then(function (resp) {
            
            if (resp.data.code == 1) {
                layer.msg(resp.data.msg)
                
                setTimeout("location.reload();", 1000)
                $(".box-close").trigger("click");
                //    $scope.datainfoAll();
            } else {
                layer.msg(resp.data.msg)
                setTimeout("location.reload();", 1000)
                $(".box-close").trigger("click");
            }
        });
    }
    ////获取是否显示签到
    //$scope.showSignBox = false;
    //$scope.hideSings = function () {
    //    $http.get("/Checkin/GetCheckinConfig", {}).then(function (resp) {
        
    //        if (resp.data.code==1) {

    //            $scope.showSignBox=resp.data.data.CheckinSettingEnable
    //        }
    //    })
    //}
    //$scope.hideSings()
    // 获取签到的轮次
    var tnub = null
    $scope.GetIccList = function (e) {
        LoadingMessage('加载中请稍后');
        $http.get("/Checkin/GetIccList", { params: { IC_ID: ic_id } }).then(function (resp) {
            if (resp.data.code == 1) {
                $scope.signList = resp.data.data;
                
                if (e != 0) {
                    if ($scope.signList.CurCheckin == tnub) {

                        if ($scope.signList.NextCheckin == tnub) {
                            $scope.signList.ports = $scope.signList.CheckinList.length
                            $scope.signStatus = 3;
                        } else {
                            //$scope.signList.ports = 0
                            $scope.timerSet(0)


                        }

                    } else {
                        if ($scope.signList.CurCheckin.Status == 1) {
                            $scope.signStatus = 2;

                            $scope.refreCode(0)
                        } else {
                            $scope.signStatus = 1;

                        }
                        $scope.signList.CheckinList.forEach(function (item, index) {
                            if ($scope.signList.CurCheckin.CheckId == item.CheckId) {
                                $scope.signList.ports = index+1;
                                if ($scope.signList.ports < $scope.signList.CheckinList.length) {
                                    $scope.textEnd = '下一次签到'
                                } else {
                                    $scope.textEnd = '结束签到'
                                }

                            }
                        })

                    }
                } else {
                    $scope.signList.CheckinList.forEach(function (item, index) {
                        if ($scope.signList.CurCheckin.CheckId == item.CheckId) {
                            $scope.signList.ports = index+1;
                            if ($scope.signList.ports < $scope.signList.CheckinList.length) {
                                $scope.textEnd = '下一次签到'
                            } else {
                                $scope.textEnd = '结束签到'
                            }

                        }
                    })

                }
               
                $(".box-close").trigger("click");

            }
        });
    }
    $scope.GetIccList()
    $scope.datainfoAll();

    //手动刷新二维码
    $scope.Manual=false
    $scope.RefreshCheckInCode = function () {
        $scope.Manual = true;
         
        $scope.refreCode()
    }

    //刷新二维码
    $scope.refreCode = function (e) {
        if (!$scope.signList.CurCheckin) {
            return false
        }
        $http.post("/Checkin/RefreshCheckInCode", { CheckId: $scope.signList.CurCheckin.CheckId, Refresh: $scope.Manual}).then(function (respate) {

            if (respate.data.code == 1) {
                $scope.Manual=false
                $scope.checkCode = respate.data.data;
                if (e == 0) {
                    $scope.timerSet()
                } 
            }


        });
    }

    //开始签到
    $scope.begingSign = function () {
       
        $scope.checkCode = '';
        if (!$scope.signList.ports) {
            $scope.signList.ports=0
        }
        LoadingMessage('加载中请稍后');
        if (0 < $scope.signList.ports && $scope.signList.ports < $scope.signList.CheckinList.length) {

            $scope.stopsign(function () {
                $scope.nextSD()
            });
         
        } else {
            if ($scope.signList.ports != $scope.signList.CheckinList.length) {
                
                $scope.nextSD()
            } else {
              
                $scope.stopsign()
            }
        }
    
      
     
       
    }
    //下次签到
    $scope.nextSD = function () {
         
        $http.get("/Checkin/StartCheckIn", { params: { CheckId: $scope.signList.NextCheckin.CheckId } }).then(function (resp) {
            $scope.GetIccList(0)
            $scope.RefreshTime = resp.data.data.ChceckinCodeRefreshTime;

            if (resp.data.code == 1) {
                $scope.signStatus = 2;
                if ($scope.signList.CurCheckin == tnub) {

                    $http.get("/Checkin/RefreshCheckInCode", { params: { CheckId: $scope.signList.NextCheckin.CheckId } }).then(function (respate) {
                        $(".box-close").trigger("click");
                        $scope.checkCode = respate.data.data;

                    });
                }
                $scope.timerSet()
            }
        });
    }

    //暂停签到
    $scope.stopsign = function (callback) {
        
        $http.get("/checkin/stopchchkin", { params: { checkid: $scope.signList.CurCheckin.CheckId } }).then(function (resp) {
            if (resp.data.code == 1) {
                $scope.GetIccList();
                $scope.timerSet(0);
                $(".box-close").trigger("click");
                if (typeof callback === 'function') {
                    return callback();
                }
            }
        });

    }
    //var numstime = 120;
    var tnb = null;
    $scope.timerSet = function (e) {
        if (e != 0) {
            tnb = setInterval(function () {
                $scope.refreCode()
            }, 3000)
        } else {

            clearInterval(tnb);
            tnb = null;
        }


    }


    //补签
    $scope.suregetValue = function () {
        var tblisty = [];
        $('.class_nums_code ul li').each(function (item, index) {
            tblisty.push($(index).find('input').val())
        })
        var Stu_Codes = tblisty.join(",")
        $http.get("/Checkin/CheckInCodeByTeacher", { params: { IC_ID: ic_id, Stu_Codes: Stu_Codes } }).then(function (resp) {

            if (resp.data.code == 1) {
                layer.msg(resp.data.msg)
                //$('#greenCode').modal('hide');
                setTimeout("location.reload();", 1000)
            } else {
                layer.msg(resp.data.msg)
            }

        });

    }
    //筛选课前课中课后
    $("body").on("click", ".b_tcleft .activeAdd>li", function () {
        $(this).addClass("active").siblings().removeClass();
        $(".h1").hide().eq($('.b_tcleft li').index(this)).show();
        $(".topName div a").removeClass("activeTop");
        var thival = $(this).attr("data-val");
        if (thival == 1) {
            $("#addhj").hide();
            localStorage.setItem("isketime", "1");
        } else if (thival == 2) {
            $("#addhj").show();
            localStorage.setItem("isketime", "2");
        } else if (thival == 3) {
            $("#addhj").hide();
            localStorage.setItem("isketime", "3");
        }
    });
    //课程章节结构树信息
    $scope.getSemester = function (issave) {
        $scope.issave = issave;
        $("#savestcID").text("");
        $('#saveplan').modal({ backdrop: 'static', keyboard: false });
        LoadingMessage('加载中请稍后');
        $http.get("/Teacher/GetSemesterInfoJson", { params: {} }).then(function (resp) {
            $scope.SemesterList = resp.data;
            $scope.semester = resp.data.semester.ID;
            $scope.ChapterLi(function () {
                $(".box-close").trigger("click");
            });
        });
    };
    $scope.SetSemester = function () {
        $scope.AddChapterList = [];
        $("#savestcID").text("");
        LoadingMessage('加载中请稍后');
        $scope.ChapterLi(function () {
            $(".box-close").trigger("click");
        });
    }
    $scope.ChapterLi = function (callback) {
        $http.get("/Resource/getCurriculumChapterList", { params: { semesterID: $scope.semester } }).then(function (resp) {
            var myData = resp.data;
            $.fn.zTree.init($("#sp-ulId"), $scope.treeSetting, myData);
            $scope.ChapterLis = myData;
            callback && typeof callback === 'function' && callback();
        });
    }
    //treeNode.pId == null为课程，反之为章节
    var optionSrc = ["", "", ""];
    $scope.zTreeOnClick = function (event, treeId, treeNode) {
        $scope.curriculumId = treeNode.id;
        var zTree = $.fn.zTree.getZTreeObj("sp-ulId");
        var sNodes = zTree.getSelectedNodes();
        if (treeNode.pId == null) {
            $scope.chapters = true;
            $scope.Classroom = false;
            $scope.AddChapterList = "";
            zTree.expandNode(treeNode);
        } else {
            $scope.screenCL($scope.curriculumId);
            optionSrc.splice(0, 1, sNodes[0].getParentNode().name);
            optionSrc.splice(1, 1, treeNode.name);
            if (optionSrc.length > 2) {
                optionSrc.pop();
            }
            $("#savestcID").text(optionSrc.join(' > '));
        }
        $scope.$apply();
    }
    //添加章节
    $scope.AddChapter = function () {
        var name = $("#zhNameID").val();
        if (name == "") {
            NoticeMessage("请输入章节名称");
            return;
        }
        $http.get("/TeacherPreparationN/AddChapter", { params: { cid: $scope.curriculumId, name: name } }).then(function (resp) {
            $("#zhNameID").val("");
            $scope.curriculumId = resp.data.CC_ID;
            $scope.AddChapterList = [{ CC_ID: resp.data.CC_ID, Name: resp.data.CC_Name, CourseUnit_ID: resp.data.CourseUnit_ID }];
            $scope.addisfind = true;
            $scope.ChapterLi(true);
        });
    }
    //点击章节查看课堂
    $scope.screenCL = function (ccid) {
        $("#clasNameID").val("");
        $http.get("/TeacherPreparation/getLessonsDataImport", { params: { ccid: ccid } }).then(function (resp) {
            $scope.AddChapterList = resp.data;
            $scope.chapters = false;
            $scope.Classroom = true;
            $scope.addisfind = false;
        });
    }
    //保存教案and引用教案样式
    $("body").on("click", ".saveplan .sp-ul li.Courseware", function () {
        var $this = $(this);
        $this.parents(".saveplan").find(".sp-ul li").removeClass("activeLi-b");
        $this.addClass("activeLi-b");
        var thistext = $this.find("p").text()
        $("#clasNameID").val(thistext);
        if (optionSrc.length < 3) {
            optionSrc.push("");
        }
        optionSrc.splice(2, 1, thistext);
        $("#savestcID").text(optionSrc.join(' > '));
    });
    //保存教案方法调用
    $scope.updatCl = function () {
        if ($scope.issave) {
            //查询是否重复
            var name = $("#clasNameID").val();
            $http.get("/TeacherPreparation/copyLessionDisplay", { params: { CC_ID: $scope.curriculumId, name: name } }).then(function (resp) {
                if (resp.data.state == 1) {
                    messageBox({
                        text: "该课堂已存在，是否覆盖？",
                        type: "info",
                        doneFunction: function (msg) {
                            if (msg) {
                                $scope.ischange(1);
                            }
                        }
                    });
                } else {
                    $scope.ischange(0);
                }
            });
        } else {
            //引用教案
            var activeLibleng = $("#rightClasinfo").find(".activeLi-b");
            var courseunitId = activeLibleng.attr("data-id");
            if (activeLibleng.length == 0) {
                ErrorMessage("请选择课堂");
                return;
            }
            LoadingMessage("创建中...");
            $http.get("/TeacherPreparation/teacherCopyLessons", { params: { lessonsId: courseunitId, IC_ID: ic_id } }).then(function (data) {
                if (data.data.statue == 1) {
                    location.href = "/Interaction/schooling?IC_ID=" + ic_id;
                } else {
                    ErrorMessage(data.data.message);
                }
            });
        }
    }
    //替换或新增课堂
    $scope.ischange = function (copy) {
        var names = $("#clasNameID").val();
        if (names == "") {
            ErrorMessage("请选择或输入课堂");
            return;
        }
        $http.get("/TeacherPreparation/SaveTeacherIng", { params: { CC_ID: $scope.curriculumId, IC_ID: ic_id, name: names, copy: copy } }).then(function (resp) {
            if (resp.data.statue == 1) {
                SuccessMessage("操作成功");
                $("#saveplan").modal("hide");
                $("#clasNameID").val('');
                $scope.screenCL($scope.curriculumId)
            } else {
                ErrorMessage(resp.data.message);
            }
        });
    }
    $scope.onExpand2 = function (event, treeId, treeNode) {
        $scope.curExpandNode = treeNode;
    }
    $scope.zTreeOnClick2 = function (event, treeId, treeNode) {

        if (treeNode.pId && treeNode.pId != "null") {
            $scope.getActiveList(treeNode.id, 1);
        }
    }
    $scope.beforeClick2 = function beforeClick(treeId, treeNode, clickFlag) {
        var zTree = $.fn.zTree.getZTreeObj("treeDepartmentAC");
        zTree.expandNode(treeNode, null, null, null, true);
        return (treeNode.click != false);
    }


    //课程结构树参数
    $scope.treeSetting = {
        view: {
            dblClickExpand: false//屏蔽掉双击事件
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeExpand: $scope.beforeExpand,
            onExpand: $scope.onExpand,
            beforeClick: $scope.beforeClick,
            onClick: $scope.zTreeOnClick
        }
    };
    //课程结构树参数
    $scope.treeSetting2 = {
        view: {
            dblClickExpand: false//屏蔽掉双击事件
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeExpand: $scope.beforeExpand2,
            onExpand: $scope.onExpand2,
            beforeClick: $scope.beforeClick2,
            onClick: $scope.zTreeOnClick2
        }
    };

    //上课and下课
    $scope.getzhang = function () {
        $http.get("/TeacherPreparationN/getCurriculumChapter", { params: { cid: $scope.school_ID.IC.C_ID } }).then(function (resp) {
            $(".box-close").trigger("click");
            $scope.CCList = resp.data;
            var obj = { CC_ID: 0, CC_Name: '请选择单元或章节' }
            $scope.CCList = $scope.CCList || [];
            $scope.CCList.unshift(obj);
            $scope.zhang = 0;
        });
    }
    $scope.classUP = function (sk_Status) {
        var lessionId = $scope.school_ID.lessons.ID,
            batchID = $("#batchID").val();

        if (sk_Status === 1) {
            LoadingMessage('操作中，请稍后');
            $.ajax({
                type: "POST",
                contentType: "application/json;",
                url: "/TeacherPreparation/partLessionUnEnd",
                data: "{IC_ID:'" + ic_id + "' }",
                success: function (rel) {

                    $("#isxiakeModal").modal('show');
                    $scope.acList = rel.list;
                    $scope.$apply();
                    $scope.getzhang();
                }
            });
        }
        else if (sk_Status === 3) {
            messageBox({
                text: "确认要进行上课操作？",
                type: "info",
                time: 1000,
                closeBox: false,
                doneFunction: function (msg) {
                    if (msg) {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json;",
                            url: "/TeacherPreparation/BeginClass",
                            data: "{IC_ID: '" + ic_id + "', lessionId: '" + lessionId + "' }",
                            success: function (resource) {
                                if (resource.success == 0) {
                                    layer.msg(resource.messge)

                                } else {
                                    $("body .box-close").trigger("click");
                                    setTimeout("location.reload();", 1000)
                                }

                            }
                        });
                    }
                }
            });
        }
    };
    //正式下课

    $scope.formalDown = function () {
        var ICA_IDStr = [];
        var lessionis = $scope.school_ID.lessons.ID;
        if ($scope.zhang <= 0) {
            ErrorMessage("请选择章节！");
            return
        }
        $("#HangList input:checked").each(function () {
            var id = $(this).attr("data-id")
            ICA_IDStr.push(+id);
        })
        $http.post("/TeacherPreparation/EndClass", { IC_ID: ic_id, ICA_IDStr: ICA_IDStr, tClassID: $scope.school_ID.IC.TClass_ID, ccid: $scope.zhang }).then(function (resp) {
            if (resp.data.statue == "1") {
                $("#isxiakeModal").modal('hide');
                setTimeout("location.reload();", 1000)
            } else {
                ErrorMessage(resp.data.message);
            }
        })
    }
    $scope.LectureCode = function (lessonsid) {
        var busInfo = "课堂名称：" + $scope.icName + ",教师名称：" + $("body .userinfo .dropdown-header span").text() + "";
        $http.get("/WxMessage/getLessonsQrCode", { params: { lessonsid: lessonsid, busInfo: busInfo } }).then(function (resp) {
            if (resp.data.falg) {
                $("#masklayer").show();
                $("#erweimaModal").show(100);
                $("#shoukeMaId").attr("src", resp.data.url);
            } else {
                NoticeMessage(resp.data.msg);
            }
        });
    }

    /*判断活动状态*/

    $scope.getActionStatus = function (BusinessID) {
        var status = "";

        $.each($scope.school_ID.ICAList, function (index, item) {
            if (item.ICA_ID == BusinessID) {
                status = item.ICA_Status;
                return;
            }
        })
        return status;
    }

    $scope.chooseSection = function (index) {
        for (var i = 0; i < $scope.school_ID.sections.length; i++) {
            $scope.school_ID.sections[i].choose = false;
        }
        $scope.school_ID.sections[index].choose = true;
        localStorage.setItem("linkClass", index);
        $scope.linkClass = localStorage.getItem("linkClass");
        $scope.sectionId = $scope.school_ID.sections[$scope.linkClass].section.ID;
    }
    //一句话3，抢答10，粘贴板4，点将14,学习资料5，调查1，作业6，测验9，活动库-2
    $scope.TitleName = ["一句话问答", "抢答", "粘贴板", "点将", "作业", "测验", "分组活动", '举手活动'];
    $scope.addTypes = ["3", "10", "4", "14", "6", "9", '17'];
    $scope.activityTypes = ["boardtask", "inquiry", "partdatateach", "parthomeWork", "activeMember"];
    $scope.toActivity = function (lessionId, section, title, addType, activityTypes, IC_ID) {

        var addAct = $(".activeAdd li.active").attr("data-val");

        var myid = $scope.sectionId || section;
        if ((addAct === "1" && title == "抢答") || (addAct === "1" && title == "点将") || (addAct === "1" && title == "举手活动")) {
            NoticeMessage("抱歉，该互动不能在课前添加");
            return;
        }
        if ((addAct === "3" && title == "抢答") || (addAct === "3" && title == "点将") || (addAct === "3" && title == "举手活动")) {
            NoticeMessage("抱歉，该互动不能在课后添加");
            return;
        }
        if (addAct === "1" || addAct === "3") {
            var url = "/TeacherPreparationN/" + activityTypes + "?lessionId=" + lessionId + "&ApplayType=" + addAct + "&Type=" + addType + "&IC_ID=" + IC_ID + "&BatchStatus=" + $scope.school_ID.BatchStatus;
        } else if (addAct === "2") {
            if ($(".middle>ul").length === 0) {
                NoticeMessage("请添加环节");
                return;
            }
            var url = "/TeacherPreparationN/" + activityTypes + "?lessionId=" + lessionId + "&ApplayType=" + addAct + "&sectionId=" + myid + "&Type=" + addType + "&IC_ID=" + IC_ID + "&BatchStatus=" + $scope.school_ID.BatchStatus;
        }

        $scope.activeType = addType;
        layer.open({
            title: '添加活动',
            type: 2,
            area: ['1200px', '100%'],
            fixed: true, //不固定
            shade: 0.4,
            move: false,
            content: url,
            id: 'dtlms',
            end: function (msg) {
                $scope.datainfoAll()
            }
        })
    };
    $("body").on('click', '.layui-layer-close', function () {
        var t = $scope.activeType;
        if (t == 6 || t == 9 || t == 1) {
            $scope.datainfoAll();
        }
    });
    //修改活动
    $scope.updetActive = function (EID, type, aid) {      //后续两个参数是显示活动分组（修改）
        var url = "";

        if (type == 3 || type == 10 || type == 14 || type == 4 || type == 17) {
            url = "/TeacherPreparationN/boardtask?courseElmentId=" + EID + '&Cca_id=' + aid + '&getId=' + $scope.school_ID.IC.IC_ID + '&NOload=1'
        } else if (type == 1) {
            url = "/TeacherPreparationN/inquiry?courseElmentId=" + EID + '&Cca_id=' + aid + '&getId=' + $scope.school_ID.IC.IC_ID + '&NOload=1'
        } else if (type == 5 || type == 7) {
            url = "/TeacherPreparationN/partdatateach?courseElmentId=" + EID + '&Cca_id=' + aid + '&getId=' + $scope.school_ID.IC.IC_ID + '&NOload=1'
        } else if (type == 9 || type == 6 || type == 13) {
            url = "/TeacherPreparationN/parthomeWork?courseElmentId=" + EID + '&Cca_id=' + aid + '&getId=' + $scope.school_ID.IC.IC_ID + '&NOload=1'
        }
        $scope.activeType = type;
        layer.open({
            title: '修改活动',
            type: 2,
            area: ['1200px', '100%'],
            fixed: true, //不固定
            shade: 0.4,
            move: false,
            id: 'iframsd1',
            content: url,
            end: function (msg) {
                if (msg) {
                    $scope.datainfoAll();
                }
            }
        })
    }
    //添加and修改环节
    $scope.addHJ = function (lessionId) {
        $http.get("/TeacherWX/InsertSection", { params: { lessionId: lessionId, sectionTitle: "新的环节，点击编辑" } }).then(function (resp) {
            if (resp.data.success == 1) {
                localStorage.setItem("linkClass", 0);
                $scope.datainfoAll();
            } else {
                ErrorMessage("添加环节失败");
            }
        });
    };
    //开始修改环节名称
    $scope.textfocus = function (target) {
        $scope.hjVal = $(target).val();
        //$(target).val("");
    }
    $scope.textblur = function (target, section, lessons) {
        if ($(target).val() != "") {
            $http.get("/TeacherWX/InsertSection", { params: { lessionId: lessons, sectionTitle: $(target).val(), sectionId: section } }).then(function (resp) {
                if (resp.data.success == 1) {
                    $scope.datainfoAll();
                    if ($scope.hjVal != $(target).val()) {
                        SuccessMessage("修改成功");
                    }
                } else {
                    ErrorMessage("修改失败");
                }
            });
        } else {
            $(target).val($scope.hjVal)
        }
    }
    $scope.updateHj = function (target) {
        var sectionId = $(target).attr("data-section"),
            lessionId = $(target).attr("data-lessons"),
            sectionTitle = $(target).prev().val();
        if (sectionTitle == "") {
            ErrorMessage("请输入内容");
            return;
        }
        $http.get("/TeacherWX/InsertSection", { params: { lessionId: lessionId, sectionTitle: sectionTitle, sectionId: sectionId } }).then(function (resp) {
            if (resp.data.success == 1) {
                $scope.datainfoAll();
            } else {
                ErrorMessage("修改环节失败");
            }
        });
    }
    //删除环节
    $("body").on("click", ".delHJone", function () {
        var sectionID = $(this).attr("data-id");
        var courseULlen = $(this).parents(".courseUL").find(".homework").length;
        if (courseULlen >= 1) {
            NoticeMessage("只允许删除空的环节");
            return;
        }
        messageBox({
            text: "确认要删除该环节？",
            type: "warning",
            time: 1000,
            closeBox: false,
            doneFunction: function (msg) {
                if (msg) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json;",
                        url: "/TeacherWX/deleteSection",
                        data: "{sectionID: '" + sectionID + "' }",
                        success: function (resource) {
                            $scope.datainfoAll();
                            $(".middle>ul").first().click();
                        }
                    })
                }
            }
        });
    });
    //删除未开始的互动
    $scope.delHud = function (courseElmentId) {
        messageBox({
            text: "确认要删除该活动？",
            type: "warning",
            time: 1000,
            closeBox: false,
            doneFunction: function (msg) {
                if (msg) {
                    $http.get("/TeacherPreparation/deleteActivle", { params: { courseElmentId: courseElmentId } }).then(function (resp) {
                        if (resp.data.state == 1) {
                            $scope.datainfoAll();
                        } else {
                            ErrorMessage(resp.data.message);
                        }
                    });
                }
            }
        });
    }
    //设置页面右边显示高度
    var that = $(".topName div a");
    that.each(function (index) {
        $(this).click(function () {
            that.removeClass("activeTop");
            that.eq(index).addClass("activeTop");
        });
    });
    UE.getEditor('edite', {
        toolbars: [
            ['undo', 'redo', '|', 'bold', 'italic', 'underline', '|', 'forecolor', 'backcolor',
                '|', 'simpleupload', 'imagenone', 'imageleft', 'imageright']
        ],
        lang: /^zh/.test(navigator.language || navigator.browserLanguage || navigator.userLanguage) ? 'zh-cn' : 'en',
        wordCount: false,
        elementPathEnabled: false,
        initialFrameHeight: 300
    });
    $scope.getgoal = function (mid) {
        if ($scope.goal) {
            $('#goalModal').modal({ backdrop: 'static', keyboard: false });
            return;
        }
        LoadingMessage("加载中，请稍后。");
        $http.post("/api/service", { lessonsID: mid }, { headers: { passembly: 'spoc.Services.LessionsService.ILessonsService', pmethod: 'getLessonsExInfo', token: $("#token").val() } }).then(function (res) {
            $(".box-close").trigger("click");
            if (res.data.code == 1) {
                var obj = res.data.data;
                var Goal = obj.goal;
                $scope.goal = res.data.data;
                UE.getEditor('edite').setContent(Goal ? Goal : "");
                $('#goalModal').modal('show');
            } else {
                ErrorMessage(res.data.msg);
            }
        });
    }
    $scope.UnitTeaching = function (type) {
        var data = {}
        var TeachingGoal = UE.getEditor('edite').getContent().replace(/[\s]{0,}((<p>[\s]{0,}(<br[^>]+>|<br>)[\s]{0,}<\/p>)|([\s]{0,}<p>[\s]{0,}<\/p>[\s]{0,})|([\s]{0,}<br[^>]+>[\s]{0,}|[\s]{0,}<br>[\s]{0,})){1,}$/i, "");
        if (TeachingGoal == '') {
            ErrorMessage("请输入课堂目标");
            return
        }
        LoadingMessage("保存中，请稍后。");
        data.goal = TeachingGoal;
        $http.post("/api/service", { lessonsID: $("#beginclass").val(), model: data }, { headers: { passembly: 'spoc.Services.LessionsService.ILessonsService', pmethod: 'saveLessonsExInfo', token: $("#token").val() } }).then(function (res) {
            if (res.data.code == 1) {
                $(".box-close").trigger("click");
                $('#goalModal').modal('hide');
            } else {
                messageBox({
                    text: res.data.msg,
                    type: "error"
                });
            }

        });
    };
    $scope.pageActiveGo = function (type) {
        if (type == 1) {
            if ($scope.activePageNo > 1) {
                $scope.activePageNo = $scope.activePageNo - 1;
                $scope.getActiveList(0);
            }
        } else {
            if ($scope.activePageNo < $scope.activePage) {
                $scope.activePageNo = $scope.activePageNo + 1;
                $scope.getActiveList(0);
            }
        }
    }
    $scope.getActiveList = function (myid, PageNo) {

        if (myid > 0) {
            $scope.ccID = myid;
        }
        if (PageNo) {
            $scope.activePageNo = PageNo;
        }
        if (!$scope.ccID || $scope.ccID == "") {
            $(".box-close").trigger("click");
            messageBox({ text: "请选择章节", type: "error" });
            $scope.activeList = [];
            return;
        }
        $http.post("/Resource/getActiveData", { "ccid": $scope.ccID, "searchKey": $scope.activeKey, pageNO: $scope.activePageNo }).then(function (res) {

            $scope.activeList = res.data.list;

            $scope.activePage = res.data.pageCount;
            $.each($scope.myActive, function (i, obj) {
                $.each($scope.activeList, function (x, item) {
                    if (item.ID == obj) {
                        item.choose = 1;
                    }
                });
            });
            var self = $("#active_" + $scope.ccID);
            self.parent().find(".active").removeClass("active");
            self.addClass("active");
            $(".box-close").trigger("click");
        })
    };
    //活动库开始
    //课程，章节信息
    $scope.getSemester_activity = function () {
        if ($scope.SemesterList && $scope.semester) {
            return;
        }
        LoadingMessage('加载中请稍后');
        $http.get("/Teacher/GetSemesterInfoJson", { params: {} }).then(function (resp) {
            $scope.SemesterList = resp.data;
            $scope.semester = resp.data.semester.ID;
            $scope.getcourse(function () {
                $(".box-close").trigger("click");
            });
        });
    };
    $scope.setSemester_activity = function () {
        LoadingMessage('加载中请稍后');
        $scope.activeList = null;
        $scope.activePageNo = 1;
        $scope.activePage = 1;
        $scope.ccID = 0;
        $scope.getcourse(function () {
            $(".box-close").trigger("click");
        });
    }
    $scope.getSemester_activity();
    $scope.getcourse = function (callback) {

        $scope.noDatas = false;
        $http.get("/Resource/getCurriculumChapterList", { params: { semesterID: $scope.semester } }).then(function (resp) {
            var myData = resp.data;
            $.each(myData, function (i, item) {
                if (item.ParentID == 0 || !item.ParentID) {
                    myData[i].click = false;
                    if (i != 0) {
                        myData[i].open = false;
                    }
                }
            });

            $.fn.zTree.init($("#treeDepartmentAC"), $scope.treeSetting2, myData);
            if (myData.length < 1) {
                $scope.noDatas = true;
                callback && typeof callback === 'function' && callback();
                return
            }
            for (var i = 0, j = myData.length; i < j; i++) {
                if (myData[i].pId > 0) {
                    $scope.ccid = myData[i].id;
                    break;
                }
            }
            var zTree = $.fn.zTree.getZTreeObj("treeDepartmentAC");
            var nodeList = zTree.getNodeByParam("id", $scope.ccid);
           
            if (nodeList) {
                $(".box-close").trigger("click");
                $("#" + nodeList.tId + ">a").trigger("click");

            }
            callback && typeof callback === 'function' && callback();
        });
    }
    //选择活动
    $scope.myActive = [];
    $scope.ChooseActive = function (index, qid) {
        var flag = true, num = 0;
        for (var i = 0, j = $scope.myActive.length; i < j; i++) {
            if ($scope.myActive[i] == qid) {
                flag = false;
                num = i;
                break;
            }
        }
        if (flag) {
            $scope.activeList[index].choose = 1;
            $scope.myActive.push(qid);
        } else {
            $scope.activeList[index].choose = 0;
            $scope.myActive.splice(num, 1);
        }
    }
    ///添加活动库的方法
    $scope.importActivieku = function () {
        var activeCont = [];
        var courseElmentIdStr = $scope.myActive.join(","); //课件库的id字符串用,隔开


        var lessionId = $scope.school_ID.lessons.ID; //课堂Id

        $scope.activeList.forEach(function (item, index) {
            $scope.myActive.forEach(function (items2, index2) {
                if (items2 == item.ID) {
                    activeCont.push(item)
                }

            })

        })

        var applayType = $(".activeAdd li.active").attr("data-val");  //课前，课中
        //var sectionId = $scope.sectionId; //环节
        if (courseElmentIdStr == "") {
            messageBox({ text: "请选择活动", type: "error" });
            return;
        }
        var activles = [];
        activeCont.forEach(function (item, index) {

            if (item.Type == 17 && applayType == 1 || item.Type == 10 && applayType == 1 || item.Type == 14 && applayType == 1) {

                messageBox({ text: "有活动不能添加到课前", type: "error" });
                return;
            } else if (item.Type == 17 && applayType == 3 || item.Type == 10 && applayType == 3 || item.Type == 14 && applayType == 3) {

                messageBox({ text: "有活动不能添加到课后", type: "error" });
                return;
            }
            var obj = {
                icaName: item.Content,
                icaContent: item.Content,
                teching: item.Teaching,
                type: item.Type,
                resouId: item.ResourceID,
                expdata: item.ExpData,
                score: item.Score,
                taskInfoId: item.ResourceID,
            }
            activles.push(obj)
            //activles.ApplayType = scope.test.ApplayType,

            //activles.type =scope.test.activeType,
            //activles.lessionId = scope.test.lessonsid,
            //activles.IC_ID = scope.test.IC_ID,
            //activles.score =scope.active.Score,
            //activles.taskInfoId = data.taskInfoId
        })
        activles.forEach(function (item, index) {
            item.ApplayType = applayType;
            item.lessionId = lessionId;
            item.sectionID = $scope.sectionId;
            item.IC_ID = ic_id;
        })
        $http.post("/TeacherPreparation/InsertActivles", { activles: activles }).then(function (res) {
            if (res.data.code == 1) {
                window.location.reload()
                $scope.cancleds();
                $scope.datainfoAll()
            }
        })
    };

    $scope.qiandoaStatus = false;   //签到查看详情状态
    //签到情况

    $scope.openModal = false;
    //判断弹出签到情况
    //if (base.ShowCheckin) {
      
    //    $scope.openModal=true
    //}
    //打开
    //$scope.lookMoadl = function () {
    //    if (base.ShowCheckin) {
    //        $scope.Itsjlon()
    //    }
    //}
    //$scope.lookMoadl()
    $scope.Itsjlon = function () {
        
        IDList = "";
        $scope.qiandoaStatus = false;  
        var tnuull = null;
        $('#signModal').modal({ backdrop: 'static', keyboard: false });
        $http.get("/Checkin/GetCheckinListByICID", { params: { IC_ID: ic_id } }).then(function (resp) {
            if (resp.data.code == 1) {
                $scope.ListByicd = resp.data.data;
                
                $(".box-close").trigger("click");
            }
            $scope.ListByicd.forEach(function (item, index) {
                if (item.Operator_Code == tnuull) {
                    item.Operator_Code = '-';
                }
            })
        })

    }

    //刷新界面
    $scope.reflushLoad = function () {
        LoadingMessage('加载中请稍后');
        $scope.Itsjlon()
    }
    //查看签到详情
    $scope.lookDetil = function (e) {
        $http.get("/Checkin/GetCheckinDetailsByStu", { params: { IC_ID: ic_id, Operator_ID: e } }).then(function (resp) {
            if (resp.data.code == 1) {
                $scope.qiandoaStatus = true
                $scope.CheckinDetails = resp.data.data
            }

        })
    }
    //返回签到列表
    $scope.bakckprev = function () {
        $scope.qiandoaStatus = false
    }

});

app.directive('repeatFinish', function () {
    return {
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                var container = document.getElementById("courseWrapperInfo");
                Sortable.create(container, {
                    animation: 150,
                    draggable: '.courseInfo'
                });

                [].forEach.call(container.getElementsByClassName('courseInfoContent'), function (el) {
                    Sortable.create(el, {
                        group: 'photo',
                        filter: '.updateHJ',
                        handle: ".homework",
                        animation: 150,
                        onEnd: function (evt) {
                            if ($(evt.item).hasClass('homework')) {
                                var tache = ["inClass"];
                                var result = {
                                    element: {
                                        ID: $(evt.item).data('subject'),
                                        SectionID: tache.indexOf($(evt.to).data('tache')) !== -1 && $(evt.to).data('section') ? $(evt.to).data('section') : 0,
                                        preIndex: $(evt.item).prev().length === 1 ? $(evt.item).prev().data('index') : 0,
                                        nextIndex: $(evt.item).next().length === 1 ? $(evt.item).next().data('index') : 0
                                    }
                                };
                                LoadingMessage('加载中请稍后');
                                $.ajax({
                                    type: "POST",
                                    contentType: "application/json;",
                                    headers: {
                                        passembly: 'spoc.Services.ICourseElmentService',
                                        pmethod: 'SortElement'
                                    },
                                    url: "/api/service",
                                    data: JSON.stringify(result),
                                    success: function (rel) {
                                        if (rel.code !== 1) {
                                            ErrorMessage(rel.msg ? rel.msg : "请求失败");
                                        }
                                        scope.datainfoAll(function () {
                                            $(evt.item).remove()
                                        });
                                    }, error: function (res) {
                                        ErrorMessage(res.data.msg);
                                    }
                                });
                            }
                        }
                    });
                });
            }
        }
    };
});

//function Itsjlon(ic_id, batch_id) {
//    $.post("/CourseReport/partialSignInfo", { ic_id: ic_id, batch_id: batch_id }, function (data) {
//        var text = "<div class=\"alert fade in\" style=\"line-height:100px;\"><strong>暂无签到数据..</strong> </div>";
//        if (!data || data == "") {
//            $("#Sign_ID").html(text);
//            return;
//        }
//        $("#Sign_ID").html(data);

//        $("#qiandao_usernum").find("tr").each(function () {
//            var thisclass = $(this).attr("class");
//            if (thisclass == "_sing_type_1") {
//                $(this).find("td").first().find("span").addClass("star_user_namea");
//                $(this).find("td").first().find("span").text("签到");
//            }
//            if (thisclass == "_sing_type_2") {
//                $(this).find("td").first().find("span").addClass("star_user_nameb");
//                $(this).find("td").first().find("span").text("迟到");
//            }
//            if (thisclass == "_sing_type_3") {
//                $(this).find("td").first().find("span").addClass("star_user_namec");
//                $(this).find("td").first().find("span").text("缺席");
//            }
//            if (thisclass == "_sing_type_4") {
//                $(this).find("td").first().find("span").addClass("star_user_named");
//                $(this).find("td").first().find("span").text("游侠");
//            }
//        })
//    })
//}

function qiandaomashow() {
    $("#masklayer").show();
    $("#QdaomaModal").show(100);
}
function erweishow() {
    $("#masklayer").show();
    $("#erweiModal").show(100);
}
$("#masklayer").on("click", function () {
    $("#masklayer").hide();
    $("#erweimaModal").hide(100);
    $("#QdaomaModal").hide(100);
    $("#erweiModal").hide(100);
    $("#greenCode").hide(100);
});

//全选
$(function () {
    $("body").on("click", "#checkAll", function () {
        $('input[name="subBox"]').attr("checked", this.checked);

    });
    $("body").on('click', "#HangList input[name='subBox']", function () {
        var $subBox = $(this).parent().find("input[name='subBox']");
        $("#checkAll").attr("checked", $subBox.length == $("input[name='subBox']:checked").length ? true : false);
    });
    $("body .height-bodymod").css("height", $(window).height() - 130 + "px");
});
//收缩操作按钮
$(".nso-nav>.nso-tiben").on("click", ".shrink", function () {
    var $this = $(this);
    $this.prev().toggle(50);
    $this.parents(".nso-tiben").toggleClass("nso-tibenpadd", 50);
    var nso = $this.parents(".nso-tiben").hasClass("nso-tibenpadd");
    if (nso) {
        $this.find("i").attr("class", "fa fa-angle-double-left");
    } else {
        $this.find("i").attr("class", "fa fa-angle-double-up");
    }
});


var btnStar = 0;

function listSignshow() {
    btnStar = 1;
    var $scope = angular.element('#mycontroller').scope();
    if ($scope.school_ID.BatchStatus != 2) {
        ErrorMessage("请在下课后修改签到状态");
        return false
    }
    if (eachStu()) {
        NoticeMessage("请勾选需要调整的学生");
        return;
    }
    errorSig();
}
//调整签到状态
function listSign() {
    var selectFIst = jQuery('#signStudent option:selected').val();

    if (btnStar == 0) {
        signfn($("#studentSignId").val(), selectFIst)
    } else if (btnStar == 1) {
        signfn(IDList, selectFIst);
    }
}
/*遍历勾选学生*/

function eachStu() {
    IDList = '';
    $("body #qiandao_usernum tr").each(function (item, ) {
        var ischeck = $(this).find("td").find("input[name='subBox']").is(':checked');
        var id = $(this).find("td").find("input[name='subBox']").attr("data_operat")

        if (ischeck) {
            IDList += id + ",";
        }
    })
    if (IDList == "") {
        return true;
    } else if (IDList != "") {
        return false;
    }
}

//签到方法调用
function signfn(studentId, selectFIst) {

    var CheckIds = '';
    var $scope = angular.element('#mycontroller').scope()

    $scope.signList.CheckinList.forEach(function (item, index) {
        if (item.Status == 2) {

            CheckIds += item.CheckId + ",";
        }
    })
    
    $.post("/Checkin/CheckInByTeacher", { IC_ID: ic_id, Stu_Ids: studentId, CheckIds: CheckIds, Status: selectFIst }).then(function (resp) {
        if (resp.code == 1) {
            SuccessMessage("操作成功");
            $('.modal-box').css('display', 'none');
            setTimeout(function () {
                $scope.reflushLoad()
            },1000)
        } else {
            ErrorMessage(resp.msg);
        }

    });
}
//单项调整
$("#qiandao_usernum tr td").on("click", ".star_user", function () {
    $('#studentSignId').val($(this).attr("data-id"));
    errorSig();
    btnStar = 0;
})
//设置到期无法操作签到
function errorSig() {
    $('.modal-box').css('display', 'block')
}
//全选
$(function () {
    $("#checkAll").click(function () {
        $('input[name="subBox"]').attr("checked", this.checked);
    });
    var $subBox = $("input[name='subBox']");
    $subBox.click(function () {
        $("#checkAll").attr("checked", $subBox.length == $("input[name='subBox']:checked").length ? true : false);
    });
    $("body .height-bodymod").css("height", $(window).height() - 130 + "px");
});


//关闭蒙层
