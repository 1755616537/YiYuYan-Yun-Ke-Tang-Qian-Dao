$(".teachingBody").on("click", ".situation", function () {

    let trLth = $('.alls').find('tr').length;

    if ($(this).hasClass('DetailedN')) {
        $(this).removeClass('DetailedN');
        $(this).find('input').attr("checked", false);
    } else {
        $(this).addClass('DetailedN');
        $(this).find('input').attr("checked", true);
    }

    if ($('.alls').find(' input:checked').length == trLth) {
        $('#ckAlls').attr("checked", true);
        $('#ckAlls').parent().addClass('ckls')
    } else {
        $('#ckAlls').attr("checked", false);
        $('#ckAlls').parent().removeClass('ckls')
    }
})
$(".teachingBody").on("click", "#ckAlls", function () {
    if ($(this).parent().hasClass('ckls')) {
        $(this).parent().removeClass('ckls')
        $('.alls').find(' input[type=checkbox]').each(function (e) {
            $(this).attr("checked", false);
            $(this).parent().parent().removeClass('DetailedN');
        })
    } else {
        $(this).parent().addClass('ckls')
        $('.alls').find(' input[type=checkbox]').each(function (e) {
            $(this).attr("checked", true);
            $(this).parent().parent().addClass('DetailedN');
        })

    }

})
$(".teachingBody").on("click", ".oneBar", function () {
    if ($(this).hasClass('ctOn')) {
        $(this).removeClass('ctOn');

    } else {
        $(this).addClass('ctOn');
        $(this).parent().siblings().find('a').removeClass('ctOn');
    }
    $(this).next().slideToggle();
    $(this).parent().siblings().children("ul").slideUp();
})


$(".teachingRight").on("click", ".teachingMove", function () {
    //获得选中的学生
    var _html = "";
    var len = $(".teachingBottom .DetailedN").length;
    if (len == 0) {
        NoticeMessage("请勾选您要移除的学生")
    } else {
        $("#addClass").css("display", "block");
        $("#zhedang").css("display", "block");
        $(".movegroup").html("你确定将下列学员从授课班级里移除吗？");
        $(".addClassBottom").css("height", "195px")
    }

    return false;
});

//全选
$(".teachingRight").on("click", ".teachingChecked", function () {
    var text = $(this).text();
    if (text == '全选') { $(this).text('全部取消') }
    else { $(this).text('全选') }
    $(".teachingBottom .situation .Detailed").each(function (index, item) {
        if (text == '全选') {
            $(this).addClass("DetailedN");
        } else {
            $(this).removeClass("DetailedN");
        }
    });
});

///angular部分
var outputExcel = null;
var outputExcelexportAz = null;
var spocApp = angular.module('teacherClassApp', []);
spocApp.controller('teacherClassCtrl', function ($scope, $http) {

    //转化时间戳
    function formatDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ';
    };

    $scope.oneBar = function () {
    }

    //获得学期
    $scope.getSemester = function () {
        LoadingMessage('加载中请稍后');
        $http.get("/Teacher/GetSemesterInfoJson", { params: {} }).then(function (resp) {
            $scope.SemesterList = resp.data;
            $scope.semester = resp.data.semester.ID;
            $scope.sname = resp.data.semester.Name;
            $scope.getClassroom(function (msg) {
                $(".box-close").trigger("click");
            });
        });
    };
    $scope.getSemester();
    //获得教师所有的班级
    var dataType = 1;
    $scope.ctype = 3;
    $scope.getClassroom = function (callback) {
        $scope.course = null;
        $scope.cname = null;
        $scope.studentLen = 0;
        $scope.classId = null;
        $scope.classType = 2;
        $scope.Class_Name = null;
        $scope.scoreList = null;
        $scope.signListd = null;    //签到
        $scope.SignInDetails = null;    //签到详情
        $scope.studentlist = null;
        $http.post("/TeacherPreparationN/getPartCourseClass", { semeterId: $scope.semester }).then(function (resp) {
            $scope.classList = resp.data.list;

            if ($scope.classList.length > 0 && $scope.classList[0].classlist.length > 0) {
                $scope.course = $scope.classList[0].C_ID;
                $scope.cname = $scope.classList[0].C_Name;
                $scope.ctype = $scope.classList[0].C_Type;
                $scope.classId = $scope.classList[0].classlist[0].ID;
                $scope.Class_Name = $scope.classList[0].classlist[0].Name;

                var type = $scope.classList[0].classlist[0].Type;
                if (dataType === 1) {
                    $scope.getpartStudent($scope.classId, type, $scope.course, $scope.cname, $scope.Class_Name, function (msg) {
                        if (typeof callback === 'function') {
                            return callback(msg)
                        } else {
                            $(".box-close").trigger("click");
                        }
                    });
                } else if (dataType === 2) {
                    $scope.getScore(function (msg) {
                        if (typeof callback === 'function') {
                            return callback(msg)
                        }
                    });
                } else if (dataType === 5) {
                    $scope.courseScore(function (msg) {
                        if (typeof callback === 'function') {
                            return callback(msg)
                        }
                    });
                    //if ($scope.ctype ==1) {
                    //    $scope.courseScore(function (msg) {
                    //        if (typeof callback === 'function') {
                    //            return callback(msg)
                    //        }
                    //    });
                    //} else {
                    //    if (typeof callback === 'function') {
                    //        return callback(resp.data)
                    //    }
                    //}
                } else if (dataType === 7) {    //签到管理
                    $scope.getStsign(function (msg) {
                        if (typeof callback === 'function') {
                            return callback(msg)
                        }
                    });
                } else {
                    $scope.statistics(dataType, function (msg) {
                        if (typeof callback === 'function') {
                            return callback(msg)
                        }
                    });
                }

            } else {
                if (typeof callback === 'function') {
                    return callback(resp.data)
                }
            }
        });
    };
    //获得班级下面的学生
    $scope.getStu = function () {
        dataType = 1;
        if ($scope.classId && $scope.course) {
            $scope.getpartStudent($scope.classId, $scope.classType, $scope.course, $scope.cname, $scope.Class_Name);
        }
    };
    $scope.getStuC = function (_classId, _type, cid, cname, banji, ctype) {
        $scope.ctype = ctype;
        $scope.classId = _classId;
        $scope.course = cid;
        $scope.cname = cname;

        if (dataType === 1) {
            $scope.getpartStudent(_classId, _type, cid, cname, banji);
        } else if (dataType === 2) {
            $scope.getScore();
        } else if (dataType === 5) {
            //if (ctype ==1) {

            //}
            $scope.courseScore();
        } else if (dataType === 7) {
            //if (ctype ==1) {

            //}
            $scope.getStsign();
        } else {
            $scope.statistics(dataType);
        }
    };
    $scope.getpartStudent = function (_classId, _type, cid, cname, banji, callback) {
        LoadingMessage('加载中请稍后');
        $http.post("/TeacherPreparationN/getpartStudentByClassId", { classId: _classId }).then(function (resp) {

            $scope.studentlist = resp.data.list;
            $scope.Class_Name = banji;
            $scope.studentLen = resp.data.size;
            $scope.classId = _classId;
            $scope.classType = _type;
            $scope.course = cid;
            $scope.cname = cname;
            if (typeof callback === 'function') {
                return callback(resp.data)
            } else {
                $(".box-close").trigger("click");
            }
        });
    };
    //获得积分
    $scope.SetSemester = function () {
        var list = $scope.SemesterList.semesterList;
        for (var i = 0; i < list.length; i++) {
            if ($scope.semester == list[i].ID) {
                $scope.sname = list[i].Name;
                break;
            }
        }
        $scope.getClassroom(function () {
            $(".box-close").trigger("click");
        });
    };
    $scope.getScore = function (callback) {

        dataType = 2;
        if (!$scope.classId || !$scope.course) { return }
        LoadingMessage('加载中请稍后');
        $http.post("/CourseReport/getClassScore", { classID: $scope.classId, courseID: $scope.course, semesterID: $scope.semester }).then(function (resp) {
            if (resp.data.success) {

                $scope.scoreList = resp.data;
            } else {
                messageBox({
                    text: "积分请求出错！",
                    type: "error"
                });
            }
            if (typeof callback === 'function') {
                return callback(resp.data)
            }
            $(".box-close").trigger("click");
        }, function () {
            messageBox({
                text: "积分请求失败！",
                type: "error"
            });
        });
    };
    $scope.statistics = function (type, callback) {
        dataType = type;
        var stype = type == 3 ? 6 : 9;
        if (!$scope.classId || !$scope.course || !$scope.course) {
            return
        }
        LoadingMessage('加载中请稍后');
        $http.get("/api/homeworkMarking", { params: { classId: $scope.classId, C_ID: $scope.course, semeterId: $scope.semester, type: stype }, headers: { 'token': $("#token").val() } }).then(function (resp) {
            if (resp.data.code == 1) {
                $scope.SList = resp.data.data.data;

            } else {
                messageBox({
                    text: "请求出错！",
                    type: "error"
                });
            }
            if (typeof callback === 'function') {
                return callback(resp.data)
            }
            $(".box-close").trigger("click");
        }, function () {
            messageBox({
                text: "请求失败！",
                type: "error"
            });
        });
    }

    $scope.unBindAccount = function () {
        var len = $(".teachingBottom").find('.DetailedN').length;

        if (len == 0) {
            messageBox({
                text: "请选择学生！",
                type: "error"
            });
            return;
        } else if (len >= 2) {
            messageBox({
                text: "请勿多选！",
                type: "error"
            });
            return;
        }


        var operid = $(".teachingBottom").find('.DetailedN').attr("data-id");

        $http.post("/api/service",
            { operatorID: operid },
            { headers: { passembly: 'spoc.Services.IWeixinService', pmethod: 'UnBindWeixin', token: $("#token").val() } }
        ).then(function (resp) {
            if (resp.data.code == 1) {
                layer.msg('解绑账号完成!');
                setTimeout(function () {
                    window.location.reload();
                }, 2000)

            }
            else {

                layer.msg("解绑账号失败!" + resp.data.msg);
            }
        });




    }

    //显示签到数据
    $scope.getStsign = function () {
        dataType = 7;
        LoadingMessage('加载中请稍后');

        $http.post("/CourseReport/querySignInfo", { classID: $scope.classId, courseID: $scope.course, semesterID: $scope.semester, studentOperatorID: '' }).then(function (resp) {
            if (resp.data.success) {
                $scope.signListd = resp.data.data;


            } else {
                messageBox({
                    text: "请求出错！",
                    type: "error"
                });
            }

            $(".box-close").trigger("click");
        }, function () {
            messageBox({
                text: "请求失败！",
                type: "error"
            });
        });


    }
    //
    $scope.dalongUP = function (PcID) {
        $http.post("/CourseReport/studentSignInDetails", { classID: $scope.classId, courseID: $scope.course, semesterID: $scope.semester, studentOperatorID: PcID }).then(function (resp) {
            if (resp.data.success) {
                $scope.SignInDetails = resp.data.data
            } else {
                messageBox({
                    text: "请求出错！",
                    type: "error"
                });
            }

            $(".box-close").trigger("click");
        }, function () {
            messageBox({
                text: "请求失败！",
                type: "error"
            });
        });
        layer.open({
            title: '添加活动',
            type: 1,
            area: ['800px', '100%'],
            fixed: true, //不固定
            shade: 0.4,
            move: false,
            content: $("#boxshown"),
            id: 'iframsd1',
            end: function (msg) {
                if (msg) {
                    $scope.datainfoAll();
                }
            },
            cancel: function (index) {
                jQuery('#boxshown').hide()
            }
        })
    }

    //获取签到搜索
    $scope.searchLuist = function () {

        LoadingMessage('加载中请稍后');
        $http.post("/CourseReport/querySignInfo", { classID: $scope.classId, courseID: $scope.course, semesterID: $scope.semester, nameOrCode: $scope.nameSearch }).then(function (resp) {
            if (resp.data.success) {
                $scope.signListd = resp.data.data;


            } else {
                messageBox({
                    text: "请求出错！",
                    type: "error"
                });
            }

            $(".box-close").trigger("click");
        }, function () {
            messageBox({
                text: "请求失败！",
                type: "error"
            });
        });
    };

    //移除学生
    $scope.removeStudent = function () {
        if ($scope.classId == 0) {
            messageBox({
                text: "还没有选择班级！",
                type: "error"
            });
            return;
        }

        //获得选中的学生
        var _str = "";
        //var len = $(".alls").find('tr').length;
        //for (var i = 0; i < len; i++) {
        //    if () {
        //    }
        //    _str += ','+$(".alls").find('.DetailedN').eq(i).attr("data-id");
        //}
        //console.log(_str)
        $('.alls').find('.DetailedN').each(function (inde, itmes) {

            _str += ',' + $(itmes).attr("data-id");
        })

        $scope.student = _str; //多个学生用,隔开

        if ($scope.student == "") {
            messageBox({
                text: "请选择要移除的学生！",
                type: "error"
            });
            return;
        }
        if ($scope.classId == null) {
            ErrorMessage('未选择班级');
            return;
        }
        $http.post("/TeacherPreparationN/removeStudentClass", { classId: $scope.classId, studentId: $scope.student }).then(function (resp) {
            if (resp.data.state == 1) {//成功
                $scope.getpartStudent($scope.classId, $scope.classType, $scope.course, $scope.cname, $scope.Class_Name);
                $("#addCourse").css("display", "none");
                $("#addClass").css("display", "none");
                $("#zhedang").css("display", "none");
                $('#ckAlls').attr("checked", false);
                $('#ckAlls').parent().removeClass("ckls");
                $scope.topic = "";
                $scope.topicNum = "";
                $scope.nameCodeStudent = [];
                $("#selectpicker").val("1");

            } else {
                messageBox({
                    text: "" + resp.data.message + "",
                    type: "error"
                });
            }
        });
    };
    //查询输入的学生
    $scope.getStudentlistByNameCode = function (e) {
        if (!e) {
             e=1
        }
        console.log(e)
        $http.post("/TeacherPreparationN/getStudentNameCode", { studentCode: $scope.topicNum, studentName: $scope.topic, PageIndex:e })
            .then(function (resp) {
                if (resp.status == 200) {
                    var result = resp.data;
                    if (result.code == 1) {
                        $scope.nameCodeStudent = result.data.PageData;
                        $scope.pageStudent = result.data;
                        $("#QueryStudent").css("height", "400px")
                        if ($scope.nameCodeStudent.length <= 0) {
                            $("#QueryStudent").css("height", "170px")
                        }
                    } else {
                        messageBox({
                            text: result.msg,
                            type: "学生列表获取失败！"
                        });
                    }
                } else {
                    messageBox({
                        text: statusText,
                        type: "学生列表获取失败！"
                    });
                }
                //$scope.nameCodeStudent = resp.data.list;
            });
    };
    $scope.EscADDStudent = function () {
        $scope.topic = "";
        $scope.topicNum = "";
        $scope.nameCodeStudent = [];
        $("#addCourse").css("display", "none");
        $("#addClass").css("display", "none");
        $("#zhedang").css("display", "none");
        $("#Remarks").html("");
    }
    $scope.EscMoveStudent = function () {
        $("#addCourse").css("display", "none");
        $("#addClass").css("display", "none");
        $("#zhedang").css("display", "none");
    }
   
    // 上一页
    $scope.UpPage = function () {
        if ($scope.pageStudent.PageIndex <= 1) {
            return
        }
        $scope.getStudentlistByNameCode($scope.pageStudent.PageIndex - 1)
    }
    //分页方法--下一页
    $scope.DownPage = function () {
        if ($scope.pageStudent.PageIndex >= $scope.pageStudent.PageCount) {
            return
        }
        $scope.getStudentlistByNameCode($scope.pageStudent.PageIndex + 1)
    }
    
    //跳转页方法
    $scope.GoPage = function () {
        var gopageval = parseInt($("#InpPageID").val());
        
        gopageval = Number(gopageval);
     
        if (isNaN(gopageval)) {

            ErrorMessage('请输入数字');
            $scope.page2 = ' ';
            return false

        }  

        if (gopageval > $scope.pageStudent.PageCount || gopageval < 1) {
            ErrorMessage("没有此页");
            return false
        } else {
            $scope.getStudentlistByNameCode(gopageval)  
        }
    }

    //弹出层
    $(".teachingRight").on("click", ".teachingAdd", function () {
        if ($scope.classId == 0) {
            NoticeMessage("请选择授课班级")
            return;
        }
        $("#addCourse").css("display", "block");
        $("#zhedang").css("display", "block");
        $("#QueryStudent").css("height", "190px")
    });
    //添加学生
    $scope.insertStudent = function () {
        //获得选中的学生
        var _strStu = "";
        var len = $("#addStudent .DetailedN").length;
        for (var i = 0; i < len; i++) {
            _strStu += "," + $("#addStudent .DetailedN").eq(i).attr("data-id");
        }
        $scope.student = _strStu; //多个学生用,隔开
        if ($scope.student == "") {
            messageBox({
                text: "请选择学生！",
                type: "error"
            });
            return;
        }
        $http.post("/TeacherPreparationN/InsertstudentInClass", { classId: $scope.classId, studentId: _strStu }).then(function (resp) {
            if (resp.data.state == 1) {//成功
                $scope.getpartStudent($scope.classId, $scope.classType, $scope.course, $scope.cname, $scope.Class_Name);
                $("#addCourse").css("display", "none");
                $("#addClass").css("display", "none");
                $("#zhedang").css("display", "none");
                $("#topic").val("");
                $("#topicNum").val("");
                $("#selectpicker").val("1");
                $scope.nameCodeStudent = null;
            } else {
                if (resp.data.state == 0) {
                    $("#Remarks").html(resp.data.message);
                } else {
                    messageBox({
                        text: "" + resp.data.message + "",
                        type: "error"
                    });
                    $("#Remarks").html(resp.data.message);
                }
            }
        });
    };
    //导入班级
    $scope.import_add_class = function (mode) {
        var obj = { mode: mode };

        obj.mode = mode;

        if ($scope.classId === undefined) {
            NoticeMessage("请选择授课班级")
            return;
        }
        var url = "/Student/partStudentClassMap?classId=" + $scope.classId + "&ClassName=" + $scope.Class_Name;
        showDialog(url, { width: 1000, height: 580, title: '导入学生' }, function (objback) {
            //返回数据
            if (objback == "true") {
                //刷新数据
                $scope.getpartStudent($scope.classId, $scope.classType, $scope.course, $scope.cname, $scope.Class_Name);
            } else if (objback == "false") {
                messageBox({
                    text: "导入数据失败!",
                    type: "error"
                });
                return;
            }
        }, obj);
    };
    //
    outputExcel = function () {
        var titles = [];
        var formatter = [];
        titles[0] = { "field": "Name", "title": "姓名", "width": 140 };
        titles[1] = { "field": "Code", "title": "学号", "width": 140 };
        titles[2] = { "field": "total", "title": "合计得分", "width": 100 };
        titles[3] = { "field": "checkin", "title": "签到得分", "width": 100 };
        titles[4] = { "field": "answernote", "title": "笔记得分", "width": 100 };
        titles[5] = { "field": "Comment", "title": "评课得分", "width": 100 };
        titles[6] = { "field": "Before", "title": "课前活动得分", "width": 100 };
        titles[7] = { "field": "Lessons", "title": "课中活动得分", "width": 100 };
        titles[8] = { "field": "After", "title": "课后活动得分", "width": 100 };
        var paras = {
            classID: $scope.classId,
            courseID: $scope.course,
            semesterID: $scope.semester
        };
        var postData = {
            url: "/CourseReport/getClassScore",
            rows: 0,
            page: 0,
            isPage: false,
            Titles: JSON.stringify(titles),
            Paras: JSON.stringify(paras),
            FileName: $scope.sname + '_' + $scope.cname + '_' + $scope.Class_Name + "积分汇总.xls",
            retName: "data",
            formatter: JSON.stringify(formatter)
        };
        var urltemp = "";
        saveExcelFile(postData, urltemp);
    }
    outputExcel2 = function (type) {
        if (!$scope.SList || $scope.SList.data.length < 0) { return; }
        var list = $scope.SList.data;

        var titles = [];
        titles[0] = { "field": "Name", "title": "姓名", "width": 140 };
        titles[1] = { "field": "Code", "title": "学号", "width": 140 };
        var tlist = list[0].list;
        for (var i = 0, j = tlist.length; i < j; i++) {


            var obj = { "field": "score" + i, "title": tlist[i].Content + '（' + formatDateTime(new Date(Number(tlist[i].starTime))) + '）', "width": 140 };
            titles.push(obj)
        }

        var data = [];

        for (var i = 0, j = list.length; i < j; i++) {

            var obj = {}, sl = list[i].list;

            obj.Name = list[i].S_Name;
            obj.Code = list[i].S_Code;

            for (var x = 0, y = sl.length; x < y; x++) {

                obj['score' + x] = sl[x].CH_Score
            }

            data.push(JSON.stringify(obj));
        }

        var text = '作业统计.xls';
        if (dataType == 4) {
            text = '测验统计.xls'
        }

        var postData = {
            page: 0,
            data: JSON.stringify(data),
            isPage: false,
            Titles: JSON.stringify(titles),
            FileName: $scope.sname + '_' + $scope.cname + '_' + $scope.Class_Name + '_' + text,
            retName: "data"
        };
        var urltemp = "";
        saveExcelFile(postData, urltemp, 1);
    }
    /////
    //签到导出(全部)
    outputExcelexportAz = function () {
        if (!$scope.signListd || $scope.signListd.length < 0) { return; }
        var titles = [];
        var formatter = [];
        titles[0] = { "field": "S_Code", "title": "学号", "width": 140 };
        titles[1] = { "field": "S_Name", "title": "姓名", "width": 100 };
        titles[2] = { "field": "ShouldSignIn", "title": "应签到(/次)", "width": 100 };
        titles[3] = { "field": "SignIn", "title": "签到(/次)", "width": 100 };
        titles[4] = { "field": "Late", "title": "迟到(/次)", "width": 100 };
        titles[5] = { "field": "EarlyRetreat", "title": "早退(/次)", "width": 100 };
        titles[6] = { "field": "Absent", "title": "缺席(/次)", "width": 100 };
        titles[7] = { "field": "Casualleave", "title": "事假(/次)", "width": 100 };
        titles[8] = { "field": "Sickleave", "title": "病假(/次)", "width": 100 };
        var paras = {
            classID: $scope.classId,
            courseID: $scope.course,
            semesterID: $scope.semester,
        };
        var postData = {
            url: "/CourseReport/querySignInfo",
            rows: 0,
            page: 0,
            isPage: false,
            Titles: JSON.stringify(titles),
            Paras: JSON.stringify(paras),
            FileName: $scope.sname + '_' + $scope.cname + '_' + $scope.Class_Name + '_' + "签到管理.xls",
            retName: "data",
            formatter: JSON.stringify(formatter)
        };
        var urltemp = "";

        saveExcelFile(postData, urltemp);
    }

    //单个导出
    $scope.outputExcelOnly = function (namesId, namesTxt) {

        if (!$scope.signListd || $scope.signListd.length < 0) { return; }
        var titles = [];
        var formatter = [];
        titles[0] = { "field": "CurriculumName", "title": "课程名称", "width": 140 };
        titles[1] = { "field": "S_Name", "title": "学生", "width": 140 };
        titles[2] = { "field": "TName", "title": "授课老师", "width": 100 };
        titles[3] = { "field": "ICS_DateText", "title": "签到时间", "width": 120 };
        titles[4] = { "field": "ICS_StatusText", "title": "签到状态", "width": 100 };
        var paras = {
            classID: $scope.classId,
            courseID: $scope.course,
            semesterID: $scope.semester,
            studentOperatorID: namesId,
        };
        var postData = {
            url: "/CourseReport/studentSignInDetails",
            rows: 0,
            page: 0,
            isPage: false,
            Titles: JSON.stringify(titles),
            Paras: JSON.stringify(paras),
            FileName: $scope.sname + '_' + $scope.cname + '_' + $scope.Class_Name + '_' + "管理.xls",
            retName: "data",
            formatter: JSON.stringify(formatter)
        };
        var urltemp = "";

        saveExcelFile(postData, urltemp);

    }
    //添加分组

    $scope.addgrouping = function () {

        let urls = "/TeacherPreparationN/modulShow?classID=" + $scope.classId + '&courseID=' + $scope.course
        layer.open({
            title: '添加分组',
            type: 2,
            area: ['800px', '630px'],
            fixed: true, //不固定
            shade: 0.4,
            move: false,
            content: urls,

        })
    }


    //成绩导出
    $scope.outputgrades = function () {

        //window.location.href = "/TeacherPreparationN/ExportExcel?tClassID=" + $scope.classId + '&cid=' + $scope.course;
        if (!$scope.finalscore || $scope.finalscore.length <= 0) {


            return false;
        }
        var list = $scope.finalscore;
        var titles = [];
        titles[0] = { "field": "Name", "title": "姓名", "width": 140 };
        titles[1] = { "field": "NO", "title": "学号", "width": 140 };
        titles[2] = { "field": "TotalScore", "title": "成绩", "width": 140 };
        var tlist = $scope.CCList;
        var btlist = $scope.ttitle1;
        var b = 0;

        for (var i = 1, j = tlist.length; i < j; i++) {
            b++
            for (var au = 0; au < 3; au++) {
                var obj = { "field": "score" + b + "_" + Number(au), "title": tlist[i].CC_Name + '（' + btlist[au].name + '）', "width": 180 };
                titles.push(obj)
            }

        }


        //var allArr = [];
        //for (var i = 0; i < titles.length; i++) {
        //    var flag = true;
        //    for (var j = 0; j < allArr.length; j++) {
        //        if (titles[i].field == allArr[j].field) {
        //            flag = false;
        //        };
        //    };
        //    if (flag) {

        //        allArr.push(titles[i]);
        //    };
        //};

        var datas = [];

        var ay = 0;
        for (var i = 0, j = list.length; i < j; i++) {
            var obj = {}, sl = list[i].UnitScore;

            obj.Name = list[i].Name;
            obj.NO = list[i].NO;
            obj.TotalScore = list[i].TotalScore;
            var c = 0;
            for (var x = 0; x < list[i].UnitScore.length; x++) {
                c++;
                obj['score' + c + '_' + Number(ay)] = list[i].UnitScore[x]["nScore"];
                obj['score' + c + '_' + Number(ay + 1)] = list[i].UnitScore[x]["eScore"];
                obj['score' + c + '_' + Number(ay + 2)] = list[i].UnitScore[x]["Score"];

            }
            datas.push(JSON.stringify(obj));
        }


        var text = '成绩管理.xls';
        var postData = {
            page: 0,
            data: JSON.stringify(datas),
            isPage: false,
            Titles: JSON.stringify(titles),
            FileName: $scope.sname + '_' + $scope.cname + '_' + $scope.Class_Name + '_' + text,
            retName: "data"
        };
        var urltemp = "";
        saveExcelFile(postData, urltemp, 1);
    }
    $scope.courseScore = function (callback) {
        dataType = 5;
        if (!$scope.classId || !$scope.course) {
            return
        }
        $scope.fixedShow = false;
        var token = $("#token").val();

        LoadingMessage('加载中，请稍后');
        $http.post("/TeacherPreparationN/getClassIntegralScore", { classID: $scope.classId, cid: $scope.course, semesterID: $scope.semester }).then(function (res) {

            var data = res.data;
            if (data.code == 1) {

                $scope.CCList = data.data.ChapterList;
                $scope.ttitle1 = [];
                $scope.finalscore = data.data.StudentScore;
                var sList = data.data.StudentScore;
                var zm = 0;
                for (var i = 0, j = $scope.CCList.length; i < j; i++) {
                    var arr = [{ name: '课堂', ccid: $scope.CCList[i].CC_ID, type: "nScore" }, { name: '评核', ccid: $scope.CCList[i].CC_ID, type: "eScore" }, { name: '得分', ccid: $scope.CCList[i].CC_ID, type: "Score" }];
                    var oly = new RegExp("期中|期末");
                    var flag = oly.test($scope.CCList[i].CC_Name);
                    if (flag) {
                        arr = [{ name: '得分', ccid: $scope.CCList[i].CC_ID, type: "Score", colspan: true }];
                        $scope.CCList[i].colspan = true;
                        zm += 66;
                    } else {
                        zm += 198;
                    }
                    $scope.ttitle1 = $scope.ttitle1.concat(arr);

                }
                if (zm >= 584) {
                    $scope.fixedShow = true;
                }
                $scope.zhang = 0;
                var obj = { CC_ID: 0, CC_Name: '请选择单元或章节' }
                $scope.CCList = $scope.CCList || [];
                $scope.CCList.unshift(obj);

                if (typeof callback === 'function') {
                    return callback(res.data)
                }
                $(".box-close").trigger("click");
            } else {
                messageBox({
                    text: data.msg,
                    type: "error"
                });
            }
        });
    }
    $scope.resultscore = function (obj, list) {
        var s = 0;

        for (var x = 0, y = list.length; x < y; x++) {
            var o = list[x]
            if (obj.ccid == o.CC_ID) {
                s = o[obj.type];
                break;
            }
        }
        return Math.floor(s * 100) / 100;
    };
    $scope.getclassroom = function () {
        if ($scope.scoreway == 1) {
            return
        }
        var token = $("#token").val();
        $scope.endactive = [{ ICA_RefID: 0, ICA_Name: "请先选择课堂" }];
        $scope.endclass = [{ ID: 0, Name: "请先选择单元或章节" }];
        $scope.chactive = 0;
        $scope.endroom = 0;
        if ($scope.zhang <= 0) {
            return
        }
        LoadingMessage('加载中，请稍后');
        $http.post("/api/service", { tClassID: $scope.classId, ccid: $scope.zhang }, { headers: { passembly: 'spoc.Services.LessionsService.ILessonsService', pmethod: 'getChapterLessons', token: token } }).then(function (res) {
            var data = res.data;
            if (data.code == 1) {
                if (!data.data || data.data.length < 1) {
                    $scope.endclass[0].Name = '该单元或章节没有已下课课堂'
                } else {
                    $scope.endclass[0].Name = '请选择已下课课堂'
                    $scope.endclass = $scope.endclass.concat(data.data)
                }
                $(".box-close").trigger("click");
            } else {
                $scope.endclass = [{ ID: 0, Name: "请重新选择单元或章节" }];
                messageBox({
                    text: data.msg,
                    type: "error"
                });
            }
        });
    };
    $scope.getactvie = function () {
        var token = $("#token").val();
        $scope.chactive = 0;
        $scope.endactive = [{ ICA_RefID: 0, ICA_Name: "请先选择课堂" }];
        if ($scope.endroom <= 0) {
            return
        }
        LoadingMessage('加载中，请稍后');
        $http.post("/api/service", { lessonsID: $scope.endroom }, { headers: { passembly: 'spoc.Services.LessionsService.ILessonsService', pmethod: 'getActivitiesOfLessons', token: token } }).then(function (res) {
            var data = res.data;
            if (data.code == 1) {
                if (!data.data || data.data.length < 1) {
                    $scope.endactive[0].ICA_Name = '该课堂没有已结束的活动'
                } else {
                    $scope.endactive[0].ICA_Name = '请选择已结束的测验或作业';
                    var list = data.data;
                    var mlist = [];
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].ICA_Type == 6 || (list[i].ICA_Type == 7 || list[i].ICA_Type == 9)) {
                            mlist.push(list[i])
                        }
                    }
                    $scope.endactive = $scope.endactive.concat(mlist)
                }
                $(".box-close").trigger("click");
            } else {
                $scope.endactive = [{ ICA_RefID: 0, ICA_Name: "请重新选择课堂" }]
                messageBox({
                    text: data.msg,
                    type: "error"
                });
            }
        });
    }
    $scope.scoreway = '1';
    $scope.getzhang = function () {
        $scope.excelData = null;
        $scope.excelFile = null;
        $scope.scoreway = '1';
        $scope.zhang = 0;
        $scope.endroom = 0;
        $scope.endclass = [{ ID: 0, Name: "请先选择单元或章节" }];
        $scope.endactive = [{ ICA_RefID: 0, ICA_Name: "请先选择课堂" }];
        $scope.chactive = 0;
    }
    $scope.excel = imloader('#excelLoad', {
        url: '/Examine/importClassScore',
        title: 'excel',
        extensions: 'xlsx,xls',
        mimeTypes: '.xlsx,.xls',
        queued: function (file) {
            $scope.excelFile = file;
            $scope.$apply();
        },
        beforeSend: function (block, data) {
            var titles = [];
            $scope.excelData = null;
            titles[0] = { "field": "Name", "title": "姓名" };
            titles[1] = { "field": "NO", "title": "学号" };
            titles[2] = { "field": "Score", "title": "得分" };
            data.fields = JSON.stringify(titles);
            data.classID = $scope.classId;
        },
        loading: function (file) {
            $scope.excelFile = file;
            $scope.$apply();
        },
        success: function (file, resp) {
            $scope.excelFile = file;
            if (resp.flag) {
                $scope.excelData = resp.data;
            }
            $scope.$apply();
        },
        error: function (file) {
            $scope.excelFile = file;
            ErrorMessage("文件上传失败；请重新上传！");
            $scope.$apply();
        }
    });
    $scope.saveImport = function () {
        if ($scope.zhang <= 0) {
            ErrorMessage("请选择单元或章节！");
            return;
        }
        if ($scope.scoreway == 1) {
            if (!$scope.excelData || $scope.excelData.length <= 0) {
                ErrorMessage("请上传文件！");
                return;
            }
            $scope.importscore()
        } else {
            if ($scope.endroom <= 0) {
                ErrorMessage("请选择课堂！");
                return;
            }
            if ($scope.chactive <= 0) {
                ErrorMessage("请选择测验或作业！");
                return;
            }
            $scope.choosescore()
        }
    };
    $scope.importscore = function () {
        LoadingMessage('保存中，清稍后。');
        $http.post("/Examine/SaveClassScore", { data: $scope.excelData, ccid: $scope.zhang, classID: $scope.classId }).then(function (resp) {
            var data = resp.data;
            if (data.flag) {
                var edata = data.failData;
                for (var i = 0, j = edata.length; i < j; i++) {
                    for (var x = 0, y = $scope.excelData.length; x < y; x++) {
                        if ((edata[i].NO == $scope.excelData[x].NO) && (edata[i].Name == $scope.excelData[x].Name)) {
                            $scope.excelData[x]._erro = true;
                        }
                    }
                }
                $scope.courseScore(function () {
                    if (edata.length > 0) {
                        $scope.excelFile.loading = 6;
                        ErrorMessage('您有' + edata.length + '条数据导入失败。请确认后重新导入！');
                    } else {
                        $(".box-close").trigger("click");
                        $('#myModal').modal('hide');
                    }
                })
            } else {
                ErrorMessage(data.msg);
            }
        })
    };
    $scope.choosescore = function () {
        LoadingMessage('保存中，清稍后。');
        var token = $("#token").val();
        $http.post("/api/service", { ccid: $scope.zhang, classID: $scope.classId, lessonsID: $scope.endroom, ceid: $scope.chactive }, { headers: { passembly: 'spoc.Services.Capacity.IExamineService', pmethod: 'calculateCElementExamineScore', token: token } }).then(function (resp) {
            var data = resp.data;
            if (data.code == 1) {
                $scope.courseScore(function () {
                    $(".box-close").trigger("click");
                    $('#myModal').modal('hide');
                })
            } else {
                ErrorMessage(data.msg);
            }
        })
    };
    $scope.getexamine = function () {
        var token = $("#token").val();
        $scope.examine = [];
        LoadingMessage('加载中，请稍后');
        $http.post("/api/service", { cid: $scope.course, classID: $scope.classId }, { headers: { passembly: 'spoc.Services.Capacity.IExamineService', pmethod: 'getExamine', token: token } }).then(function (resp) {
            var data = resp.data;
            if (data.code == 1) {
                $scope.examine = data.data;
                $(".box-close").trigger("click");
            } else {
                ErrorMessage(data.msg);
            }
        })
    }
    var allscore = function (index) {
        var score = 0;
        for (var i = 0, j = $scope.examine.length; i < j; i++) {
            if (index === i) {
                continue;
            }
            score += $scope.examine[i].Scale;
        }
        return score;
    }
    $scope.editscale = function (index, type) {
        var obj = $scope.examine[index];
        if (type == 2) {
            var score = allscore();
            if (score + 1 <= 100) {
                obj.Scale++
            } else {
                var e = allscore(index);
                obj.Scale = 100 - e;
            }
        } else if (type == 1) {
            if (obj.Scale > 1) {
                obj.Scale--
            } else {
                obj.Scale = 0
            }
        } else {
            obj.Scale = parseInt(obj.Scale);
            var score = allscore();
            if (score > 100) {
                var e = allscore(index);
                obj.Scale = 100 - e;
            }
        }
    };
    $scope.savescale = function () {
        var score = allscore();
        if (score != 100) {
            ErrorMessage('权重比之和必须是100%');
            return
        }
        LoadingMessage('保存中，请稍后');
        $http.post("/api/service", { list: $scope.examine }, { headers: { passembly: 'spoc.Services.Capacity.IExamineService', pmethod: 'setExaminScale', token: token } }).then(function (resp) {
            var data = resp.data;
            if (data.code == 1) {
                $scope.courseScore(function () {
                    $(".box-close").trigger("click");
                    $('#listModal').modal('hide');
                })
            } else {
                ErrorMessage(data.msg);
            }
        })
    }

    //重置学生密码
    $scope.UpdatePwdShow = function () {
        var checked = $(".teachingBottom .DetailedN");
        var len = checked.length;
        if (len < 1) {
            NoticeMessage("请勾选您要重置密码的学生");
            return;
        } else if (len > 1) {
            NoticeMessage("重置密码只能对单个学生进行操作");
            return;
        }
        $scope.studentId = checked.attr("data-id");
        $scope.studentName = checked.attr("data-name");
        jQuery('#restStuPwdModal').modal('show');
    }
    $scope.UpdatePwd = function () {
        if ($scope.studentPwd == null) {
            NoticeMessage("请输入密码");
            return;
        } else if ($scope.studentPwd2 == null) {
            NoticeMessage("请输入重复密码");
            return;
        } else if ($scope.studentPwd.length < 6 || $scope.studentPwd2.length < 6) {
            NoticeMessage("密码和重复密码不能小于6位");
            return;
        }
        else if ($scope.studentPwd != $scope.studentPwd2) {
            NoticeMessage("两次密码输入不一致");
            return;
        }
        //修改数据
        $http({
            method: 'POST',
            url: '/Teacher/ResetPassword',
            data: { ID: $scope.studentId, pwd: $scope.studentPwd }
        }).then(function (resp) {
            if (resp.data.flag) {
                messageBox({
                    text: "重置密码成功!",
                    type: "success"
                });
                //关闭弹出框
                $('#restStuPwdModal').modal('hide');

            }
            else {
                messageBox({
                    text: "重置密码失败!" + resp.data.msg,
                    type: "error"
                });
            }
        });
    }
});

function saveExcelFile(data, para, type) {
    var downloadHelper = $('<iframe style="display:none;" id="downloadHelper"></iframe>').appendTo('body')[0];

    var doc = downloadHelper.contentWindow.document;
    var text = 'ExportExcel';
    if (type) {
        text = 'ExportExcelByData';
    }
    if (doc) {
        doc.open();
        doc.write('')//微软为doc.clear()有时会出bug
        doc.writeln(StringFormat("<html><body><form id='downloadForm' name='downloadForm' method='post' action='{0}{1}'>"
            , "/ExportExcel/" + text, para));
        for (var key in data) {

            doc.writeln(StringFormat("<input type='hidden' name='{0}' value='{1}'>", key, data[key]));

        }
        doc.writeln('<\/form><\/body><\/html>');
        doc.close();
        var form = doc.forms[0];
        if (form) {
            form.submit();
        }
    }
}
; (function () {
    $(".spoc-table-wrapper").on('mouseenter', '.spoc-table-tbody tr', function () {
        var self = $(this), par = self.parents('.spoc-table-wrapper');
        var index = self.index();
        var tbody = par.find('.spoc-table-tbody');
        for (var i = 0, j = tbody.length; i < j; i++) {
            $(tbody[i]).find('tr').eq(index).addClass('hover');
        }
    });
    $(".spoc-table-wrapper").on('mouseleave', '.spoc-table-tbody tr', function () {
        var self = $(this), par = self.parents('.spoc-table-wrapper');
        var index = self.index();
        var tbody = par.find('.spoc-table-tbody');
        for (var i = 0, j = tbody.length; i < j; i++) {
            $(tbody[i]).find('tr').eq(index).removeClass('hover');
        }
    });
    $(".table-scorll.table-scorll-xy").on('scroll', function () {
        var self = $(this), l = self.scrollLeft(), h = self.scrollTop();
        var par = self.parents('.spoc-table-wrapper');
        var head = par.children('.spoc-table-header'), body = par.find('.spoc-table-left .spoc-table-tbody'), br = par.find(".spoc-table-right .spoc-table-tbody");
        head.scrollLeft(l);
        body.scrollTop(h);
        br.scrollTop(h);
    });
})();