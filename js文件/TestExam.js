mui.init();
mui.previewImage();
var spocApp = angular.module('test', ['ngSanitize']);
spocApp.directive('onFinishRender', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    //scope.$emit('ngRepeatFinished'); //事件通知
                    var fun = scope.$eval(attr.onFinishRender);
                    if (fun && typeof (fun) == 'function') {
                        fun();  //回调函数
                    }
                });
            }
        }
    }
}]);
spocApp.controller('testExam', function ($scope, $http) {
    $scope.ngRepeatFile = function () {
        var img = document.querySelectorAll("#content img");
        if (img && img.length > 0) {
            img.forEach(function (item, i) {
                item.setAttribute("data-preview-src", item.src);
                item.setAttribute("data-preview-group", i)
            });
        }
    };
    $scope.redo = function () {
        $scope.canDo = true;
        $scope.allErro = true;
        $scope.isSubmit = true;
        $scope.isRedoFlag = true;
        //console.log($scope.qInfo.list)
       // $scope.question.solution = [];
    }
    
    $scope.isRedo = function () {
      
        if ($scope.exam == undefined) {
            return false;
        }
        if ($scope.canDo) {
           return false;
        }
        if ($scope.qInfo == undefined) {
           return false;
        }
        
        $scope.erroList = [];
        if ($scope.exam.Type == 6&& $scope.exam.ICA_State > 1 ) {
            var len = $scope.qInfo.list.length;
            for (var i = 0; i < len; i++) {
                if ($scope.qInfo.list[i].AnswerList.length > 0) {
                    $scope.qInfo.list[i]._answer = true;
                }
            }
          
            var arrSolut = [];
            var arrList = [];
             
            $scope.qInfo.list.forEach(function (item, index) {
                arrSolut=[]
                arrList = [];
                item.AnswerList.forEach(function (item2, index2) {
                    arrSolut.push(parseInt(item2.Value))
                })
                item.solution.forEach(function (item3, index2) {

                    arrList.push(parseInt(item3.Value))
                })
                item.arrList1 = arrSolut.sort().join(',')
                item.arrList2 = arrList.sort().join(',')
                if (item.arrList1.length != item.arrList1.length) {
                    
                    $scope.erroList.push(index)
                } else {
                    if (item.arrList1 != item.arrList2) {
                       
                        $scope.erroList.push(index)
                    }
                }
            })
         
           
            if ($scope.erroList.length>0) {
                $scope.btnRedoText = "错题数:" + $scope.erroList.length + " 重做";
                return true;
            }
            else {
                return false;
            }

        }
        return false;
    }
   
    $scope.isShowAnswer=function()
    {

        if ($scope.exam == undefined) {
            return false;
        }
        if (!$scope.canDo && $scope.exam.ICA_State > 1 && $scope.exam.Type == 6 || !$scope.canDo && $scope.exam.ICA_State > 1 &&$scope.exam.Type == 9) {
            
            return true;

        } else if (!$scope.canDo && $scope.exam.ICA_State == 3) {
           
            return true
        }
        else {
        
            return false;
        }      
    }
 
    $scope.reset = function () {
        $scope.question = null;//当前题目
        $scope.btnText = '';//按钮显示文本
        $scope.goPage = true;//是否可以看题。
        $scope.canDo = false;//是否可做
        $scope.next = true;//下一题不可点
        $scope.prev = true;//上一题不可点
        $scope.erroList = null;//错题列表
        $scope.allErro = false;//是否只看错题（默认否）
        $scope.isSubmit = false;
        $scope.isRedoFlag = false;
      
    }
    $scope.getInfo = function (callback) {
        var ceid = document.getElementById('course').value;
        mui.loading('加载中，请稍后。')
        $http.post('/webios/partStudentTestByCHID', { courseElmentId: ceid }).then(function (resp) {
            $scope.exam = resp.data;
            var exam = resp.data;
           
            $scope.reset();
            document.title = exam.title;
           
            if (exam.ICA_State == 2) {
                if (exam.CH_State == 1) {
                    $scope.btnText = '开始答题';
                    $scope.canDo = true;
                } else {
                    $scope.btnText = '查看试卷';
                }
            } else if (exam.ICA_State == 1) {
                $scope.btnText = '亲，活动还没有开始';
                $scope.goPage = false;
            } else if (exam.ICA_State == 3) {
                $scope.btnText = '分数：' + exam.CH_Score + '分，查看结果'
            }
            if (typeof callback === 'function') {
                return callback(resp.data);
            }
            
            $scope.getList(function (resp) {
              
                $scope.isRedo( )
                mui.loaded();
            });
          
           
        }, function (res) {
            mui.loaded();
            mui.toast("请求出错");
        });
    };
    var random = function (list) {
       
        var len = list.length;
        var arr = [];
        for (var i = 0; i < len; i++) {
            var index = Math.ceil(Math.random() * list.length) - 1;
            if (list[index].AnswerList.length > 0) {
                list[index]._answer = true;
            }
            arr[i] = list[index];
            list.splice(index, 1);
        }
        
        $scope.count = arr.length;
        return arr
    };
    $scope.getList = function (callback) {
        $http.post('/webios/getTestQuestionList', { CH_ID: $scope.exam.CH_ID }).then(function (resp) {
            $scope.qInfo = resp.data;
         
            $scope.count = $scope.qInfo.list.length;
            if (typeof callback === 'function') {
                return callback(resp.data);
            }
            mui.loaded();
        }, function (res) {
            mui.loaded();
            mui.toast("请求出错");
        });
    };
    $scope.getInfo();
    var viewApi = null;
    function getCookie(name) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (arr[0] == name) return arr[1];
        }
        return "";
    }
    window.onload = function(){
        viewApi = mui('#app').view({
            defaultPage: '#testInfo'
        });
        mui('.mui-scroll-wrapper').scroll({
            bounce: true,
            indicators: false //是否显示滚动条
        });
        mui("body").on("tap", "a.goback", function () {
            var mytext = getCookie("historyGO");
            
            history.back(-1);
            //if (mytext == '1') {
            //    history.go(-1);
            //}
            //if (mytext == '2') {
            //    setCookie("historyGO", 0, 6);
            //    location.reload();
            //}
            //else {
            //    history.go(-1);
            //    //mui.openWindow({ url: "/Weixin/InteractiveClassroom" + location.search })
            //}

        });
    }

    
    $scope.goExam = function (index) {
       
        if ($scope.goPage) {
            //处理返回
            setCookie("historyGO", 2, 6);
            viewApi.go("#exam");

           

            if ($scope.canDo) {
                if ($scope.isRedoFlag)
                {
                   if ($scope.qInfo.list.length> 1) {
                        $scope.qInfo.list = random($scope.qInfo.list);
                    }
                    //重做
                  
                    var len = $scope.qInfo.list.length;
                    
                    for (var i = 0; i < len; i++) {
                        if ($scope.qInfo.list[i].AnswerList.length > 0) {
                            $scope.qInfo.list[i]._answer = false;
                            
                        }                       
                    }
                 
                    //var tsd = $scope.qInfo.list;
                    //tsd.forEach(function (item,index) {

                    //    if (item.AnswerList.length > 0) {
                    //        item._answer==false
                    //    }
                    //    
                    //})
                  //  
                  
                   
                   
                }
                else {
                    if ($scope.qInfo.list.length > 1) {
                        $scope.qInfo.list = random($scope.qInfo.list);
                    }
                }
            } else {
                var len = $scope.qInfo.list.length;
                $scope.erroList = [];
                for (var i = 0; i < len; i++) {
                    if ($scope.qInfo.list[i].AnswerList.length > 0) {
                        $scope.qInfo.list[i]._answer = true;
                    }
                    if ($scope.qInfo.list[i].score <= 0) {
                        $scope.erroList.push(i);
                    }
                }
            }
            if ($scope.qInfo.list.length > 1){
                $scope.next = false;
            }
            $scope.getQuestion(0);
        }
    }
    $scope.toNumQb = function (step) {
         
        if ($scope.allErro&&!$scope.canDo) {
            //只看错题
           
            $scope.onlyWrong(step)
        } else {
           
             //正常状态下的上一步下一步
            $scope.normal(step)
        }
       
    }
    $scope.choseEnd = false;
    $scope.toNums = 0;
    $scope.normal = function (step) {
        var index = $scope.question._num;
        var flag = false;
        if (step == 1 && !$scope.next) {
            index += 1;
            if (index < $scope.count) {
                flag = true;
            }
        } else if (step == 0 && !$scope.prev) {
            index -= 1;
            if (index >= 0) {
                flag = true;
            }
        }
       
        $scope.toNums = index;
        if (flag) {
            if ($scope.canDo) {
                $scope.answerQb(1, function (msg) {
                    $scope.getQuestion(index);
                    mui.loaded();
                    if (!msg) {
                        $scope.$apply();
                    }
                })
            } else {
                $scope.bntState(index, $scope.count)
                $scope.getQuestion(index);
            }
         
           
        }
       
    };
    
    $scope.onlyWrong = function (step) {
        var errNum = $scope.question._errNum;
        var elen = $scope.erroList.length;
        errNum = errNum ? errNum : 0;
        var flag = false;
        if (step == 1 && !$scope.next) {
            errNum += 1;
            if (errNum < elen) {
                flag = true;
            }
        } else if (step == 0 && !$scope.prev) {
            errNum -= 1;
            if (errNum >= 0) {
                flag = true;
            }
        }
        if (flag) {
            $scope.getQuestion($scope.erroList[errNum], errNum);
            $scope.bntState(errNum, elen);
        }
    }
    $scope.bntState = function (num, len) {
        
        if (num == 0) {
            $scope.prev = true;
        } else {
            $scope.prev = false;
        }
        if (num + 1 == len) {
            $scope.next = true;
        } else {
            $scope.next = false;
        }
    }
    $scope.fastToQb = function (index) {
        if ($scope.canDo) {
            $scope.answerQb(1, function (msg) {
                mui.loaded();
                $scope.getQuestion(index);
                $scope.bntState(index, $scope.count)
                if (!msg) {
                    $scope.$apply();
                }
            })
        } else {
            if ($scope.allErro) {
                var num = 0;
                var len = $scope.erroList.length;
                for (var i = 0; i < len; i++) {
                    if (index == $scope.erroList[i]) {
                        num = i;
                        break;
                    }
                }
                $scope.bntState(num,len)
                $scope.getQuestion(index, num);
            } else {
                $scope.getQuestion(index);
                $scope.bntState(index, $scope.count)
            }
           
        }
    };
    $scope.getQuestion = function (index, errNum, type) {
        $scope.question = $scope.qInfo.list[index];
        $scope.question._num = index;
       
        if ($scope.allErro && !$scope.canDo) {
            $scope.question._errNum = errNum;
        }
        if ($scope.isShowAnswer() && !$scope.canDo) {
            for (var x = 0, y = $scope.question.solution.length; x < y; x++) {
                var a = $scope.question.solution[x].Value;
                for (var i = 0, j = $scope.question.QPerContent.length; i < j; i++) {
                    var r = $scope.question.QPerContent[i].ID;
                   
                    if (r == a && !$scope.canDo ) {
                         $scope.question.QPerContent[i]._choose = true;
                        continue;
                    }
                }
            }
            $scope.question.sureqd = $scope.haveIcon(1)
            $scope.question._user=$scope.userAnwer(1);
        } else {
            if ($scope.question.QB_Type >= 1 && $scope.question.QB_Type <= 3) {
                $scope.userAnwer();
            }
        }
      
        if (!type) { $scope.show = false; }
    }
    $scope.userAnwer = function (flag) {
        var list = [];
        var types = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        for (var x = 0, y = $scope.question.AnswerList.length; x < y; x++) {
            var a = $scope.question.AnswerList[x].Value;
            for (var i = 0, j = $scope.question.QPerContent.length; i < j; i++) {
                var r = $scope.question.QPerContent[i].ID;
                if (r == a && !$scope.canDo) {
                    if (flag == 1) {
                       
                        if (i < 26) {
                            list.push(types[i])
                        } else {
                            list.push(i)
                        }
                    } else {
                        $scope.question.QPerContent[i]._choose = true;
                    }
                    continue;
                }
            }
        }
    
        return list.join('、');
    }
    $scope.haveIcon = function () {
        var listCon = [];
        for (var x = 0, y = $scope.question.AnswerList.length; x < y; x++) {
            var a = $scope.question.AnswerList[x].Value;
            listCon.push(a)
        }
        var listCon2 = [];
        for (var x = 0, y = $scope.question.solution.length; x < y; x++) {
            var a = $scope.question.solution[x].Value;
            listCon2.push(a)
        }
        var choseIcons = listCon.join(',');
        var choseIcons2 = listCon2.join(',');
        if (choseIcons == choseIcons2) {
            $scope.tLoad = true
        } else {
            $scope.tLoad = false
        }
    }
    $scope.allNum = function () {
        $scope.show = !$scope.show;
    }
    $scope.chooseOp = function (index) {
        if ($scope.canDo) {
            if ($scope.question.QPerContent[index]._choose) {
                $scope.question.QPerContent[index]._choose = false
            } else {
                if ($scope.question.QB_Type <= 2 && $scope.question.QB_Type > 0) {
                    for (var i = 0, j = $scope.question.QPerContent.length; i < j; i++) {
                        $scope.question.QPerContent[i]._choose = false
                    }
                    $scope.question.QPerContent[index]._choose = true
                } else if ($scope.question.QB_Type == 3 || $scope.question.QB_Type == 0){
                    $scope.question.QPerContent[index]._choose = true
                }
            }
        }
    }
    //$scope.hidenBgs = false;
    $scope.answerQb = function (step, callback) {
       
        var type = $scope.question.QB_Type;
        var answer = '';
        if (type >= 0 && type <= 3) {
            var list = [];
            for (var i = 0, j = $scope.question.QPerContent.length; i < j; i++) {
                
                if ($scope.question.QPerContent[i]._choose) {
                    list.push($scope.question.QPerContent[i].ID);
                }
            }
            if (list.length < 1) {
             
                if (step == 1) {
                    mui.confirm('此题还未作答，确认跳转？', '警告', ['取消', '确认'], function (e) {
                        if (e.index == 1) {
                           
                            $scope.bntState($scope.toNums, $scope.count)
                            if (typeof callback === 'function') {
                                return callback();
                            }
                        
                        }  

                    });

                    
                } else {
                    $scope.bntState($scope.toNums, $scope.count)
                    if (typeof callback === 'function') {
                        return callback();
                    }
                }
             
                //mui.toast("请选择答案。");
                //return;
            } else {
               
                $scope.bntState($scope.toNums, $scope.count)

            }
            answer = list.join(',');
        }
        
        if (answer == '') {  return; }
        else {
          
              //  $scope.question._answer = true;
          var num = $scope.question._num;
            $scope.qInfo.list[num] = angular.copy($scope.question);
           
        if (typeof callback === 'function') {
            return callback(1);
        }
                num += 1
                if (num < $scope.count) {
                    $scope.getQuestion(num);
                    $scope.bntState(num, $scope.count);
                }
        }
        //mui.loading('答题中，请稍后。')
       
        //$http.post('/webios/studentSubmitTestContent', { CH_ID: $scope.exam.CH_ID, taskContent_ID: $scope.question.TaskContent_ID, QB_Type: type, content: answer, courseElmentId: $scope.exam.courseElmentID}).then(function (resp) {
        //    if (resp.data.flase == 1) {
        //        $scope.question._answer = true;
        //        var num = $scope.question._num;
        //        $scope.qInfo.list[num] = angular.copy($scope.question);
        //        if (typeof callback === 'function') {
        //            return callback(resp.data);
        //        }
        //        num += 1
        //        if (num < $scope.count) {
        //            $scope.getQuestion(num);
        //            $scope.bntState(num, $scope.count);
        //        }
        //        mui.loaded();
        //        //if (($scope.question._num + 1) == $scope.count) {
        //        //    $scope.hidenBgs = true;
        //        //}
        //    } else {
        //        mui.toast(resp.data.msg);
        //    }
        //    mui.loaded();
        //}, function (res) {
        //    mui.loaded();
        //    mui.toast("请求出错");
        //});
    }
    $scope.onlyErro = function () {
        $scope.allErro = !$scope.allErro;
        
        if ($scope.allErro) {
           
            $scope.bntState(0, $scope.erroList.length)
          
            $scope.getQuestion($scope.erroList[0], 0,1)
        } else {
        
            var x = $scope.question._num;
            $scope.bntState(x, $scope.count);
        }
    }
    var isAllOk = function () {
        var arr = $scope.qInfo.list, len = arr.length;
        var num = [],flag=true;
        for (var i = 0; i < len; i++) {
            if (!arr[i]._answer) {
                num.push(i + 1);
                flag = false;
            }
        }
        var obj = {};
        obj.flag = flag;
        if (num.length > 10) {
            obj.num = '大于10道';
        } else {
            obj.num = num.join('题、');
        }
        return obj;
    }
    $scope.submit = function () {
        var SubmitCHes = [];
        if (($scope.exam.CH_State == 1 || $scope.isSubmit) && $scope.canDo) {
            $scope.answerQb(0, function (msg) {
                mui.loaded();
                var info = isAllOk();
                var text = '交卷后将无法修改答案！', title = '确认交卷';
             
                $scope.qInfo.list.forEach(function (item, index) {
                    if (item.QPerContent) {
                        var ChoseIDS = [];
                        
                        item.QPerContent.forEach(function (itemChild, itemIndex) {

                            if (itemChild._choose) {
                                ChoseIDS.push(itemChild.ID)
                            } 
                        })
                        var IDstr=ChoseIDS.join(',')
                        var newChes = {
                            content: IDstr,
                            QB_Type: item.QB_Type,
                            taskContent_ID: item.TaskContent_ID
                        }
                        SubmitCHes.push(newChes)
                    }
                })

             
                var cnums = 0;
               
                SubmitCHes.forEach(function (item, dinx) {
                  if (item.content.length <= 0) {
                      cnums++;

                  }  
                })
                var endProjes = {
                    CH_ID: $scope.exam.CH_ID,
                    SubmitCHes
                }
           
               
                if (cnums>0) {
                    text = '你还有' + cnums + '题未做；提交后将不能再作答！';
                }
              
                mui.confirm(text, title, ['取消', '确认'], function (e) {
                    if (e.index == 1) {
                        mui.loading('交卷中，请稍后。')
                        $http.post('/webios/StudentSubmitAssignment', endProjes).then(function (resp) {
                         
                            if (resp.data.code == 1) {
                                $scope.getInfo();
                                viewApi.back();
                            } else {
                                mui.toast(resp.data.msg);
                            }
                            mui.loaded();
                        }, function (res) {
                            mui.loaded();
                            mui.toast("请求出错");
                            });
                    } else {
                        $scope.show = true;
                        $scope.$apply();
                    }
                });
            });
        }
    }
});