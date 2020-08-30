$(function () {
    $("table").attr("class", "table table-striped table-hover");
    //初始化富文本编辑器
    creatEditor($(".text-input"));
    function creatEditor(obj) {
        $.each(obj, function (i, item) {
            var myid = item.getAttribute("id");
            UE.getEditor(myid, {
                toolbars: [
                    ['undo', 'redo', '|', 'bold', 'italic', 'underline', '|', 'forecolor', 'backcolor',
                        '|', 'simpleupload', 'imagenone', 'imageleft', 'imageright']
                ],
                lang: /^zh/.test(navigator.language || navigator.browserLanguage || navigator.userLanguage) ? 'zh-cn' : 'en',
                wordCount: false,
                elementPathEnabled: false,
                initialFrameWidth: 1200,
                initialFrameHeight: 100
            });
        })
    }
})
//图片预览
$("body").on("click", ".msgFuwen img", function () {
    var src = $(this).attr("src");
    imgbigres(src);

})
//angular语法---------------------------------------------
var app = angular.module('TaskMessage', ['ngSanitize']);
//格式化时间
app.filter("jsonDate", function ($filter) {
    return function (input, format) {
        if (input == undefined) {
            return "";
        }
        //从字符串 /Date(1448864369815)/ 得到时间戳 1448864369815
        var timestamp = Number(input.replace(/\/Date\((\d+)\)\//, "$1"));
        //转成指定格式
        return $filter("date")(timestamp, format);
    };
});
app.controller('TaskMessageRoller', function ($scope, $http) {
    //取数据
    LoadingMessage("加载中，请稍后。");
    $http.get("/ManagerTask/getNoticeData", { params: { page: 1, type: 1, pageSize: 10} })
        .then(function (resp) {
            $(".box-close").trigger("click");
            $scope.TaskMessage = resp.data.data;
            $scope.PreClassAllpage = resp.data.page;
        })
    var thisPageID = parseInt($("#thisPageID").text());
    //分页方法--上一页
    $scope.UpPage = function () {
        if (thisPageID > 1) {
            thisPageID -= 1;
        }
        $http.get("/ManagerTask/getNoticeData", { params: { page: thisPageID, type: 1, pageSize: 10} })
        .then(function (resp) {
            $scope.TaskMessage = resp.data.data;
            $("#thisPageID").text(thisPageID)
            $("#InpPageID").val(thisPageID)
        })
    }
    //分页方法--下一页
    $scope.DownPage = function () {
        if (thisPageID < $scope.PreClassAllpage) {
            thisPageID += 1;
        }
        $http.get("/ManagerTask/getNoticeData", { params: { page: thisPageID, type: 1, pageSize: 10} })
        .then(function (resp) {
            $scope.TaskMessage = resp.data.data;
            $("#thisPageID").text(thisPageID)
            $("#InpPageID").val(thisPageID)
        })
    }
    //跳转页方法
    $scope.GoPage = function () {
        var gopageval = parseInt($("#InpPageID").val());
        if (gopageval > $scope.PreClassAllpage || gopageval < 1) {
            ErrorMessage("没有此页")
        } else {
            $http.get("/ManagerTask/getNoticeData", { params: { page: gopageval, type: 1, pageSize: 10} })
        .then(function (resp) {
            $scope.TaskMessage = resp.data.data;
            $("#thisPageID").text(gopageval)
        })
        }
    }
    //发送消息通知-------------------------
    $scope.addMessage = function () {
        var msgContent = UE.getEditor('inputEditor').getContent();
        var objID = $("#pteacher").val();
        var datatext = $('#laoShi').val();
        if (msgContent == null || msgContent == "") {
            ErrorMessage("请输入消息内容");
            return;
        }
        if (datatext == "") {
            ErrorMessage("请选择班级");
            return;
        }
        messageBox({
            text: "确认给课程“" + datatext + "”发送消息吗？",
            type: "info",
            time: 1000,
            closeBox: false,
            doneFunction: function (msg) {
                if (msg) {
                    $.ajax({
                        type: "post",
                        contentType: "application/json;",
                        url: "/ManagerTask/sendMemmage",
                        data: "{msg:'" + msgContent + "',type:1,objID:'" + objID + "'}",
                        success: function (result) {
                            if (result.falg) {
                                SuccessMessage(result.msg)
                                $http.get("/ManagerTask/getNoticeData", { params: { page: $("#InpPageID").val(), type: 1, pageSize: 10} })
                                    .then(function (resp) {
                                        $scope.TaskMessage = resp.data.data;
                                        $scope.PreClassAllpage = resp.data.page;
                                    })
                                UE.getEditor('inputEditor').setContent("");
                            } else {
                                ErrorMessage(result.msg)
                            }
                        }
                    });
                }
            }
        });
    }
    //查看已看人数
    $scope.getUserInfo = function (noticeid) {
        $http.get("/ManagerTask/getUserInfo", { params: { noticeid: noticeid} })
        .then(function (resp) {
            $scope.yiNoticeData = resp.data;
        })
    }
});
//zTree_v3下拉菜单
$(function () {
    GetOwerClass();
})
function GetOwerClass() {
    $.ajax({
        type: 'post',
        contentType: "application/json;",
        url: '/ManagerTask/GetOwerClass',
        data: {},
        success: function (result) {
            $.fn.zTree.init($("#treeDemoT"), setting, result);
        }
    })
}
var setting = {
    check: {
        enable: true,
        chkStyle: "radio",
        radioType: "all"
    },
    view: {
        dblClickExpand: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: onClick,
        onCheck: onCheck,
        beforeCheck: beforeCheck
    }
};
function onClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj(tree_Wrapper);
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}
function beforeCheck(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj(tree_Wrapper);
    var select = zTree.getSelectedNodes(true);
    if (tree_Val != "#pteacher") {
        for (var i = 0; i < select.length; i++) {
            if (select[i].D_Type != 2) {
                return false
            }
        }
    }
}
function onCheck(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj(tree_Wrapper),
			nodes = zTree.getCheckedNodes(true),
			v = [],
            mid = [];
    for (var i = 0, l = nodes.length; i < l; i++) {
        zTree.selectNode(nodes[i])
        v.push(nodes[i].name);
        mid.push(nodes[i].id);
    }
    $(tree_Text).attr("value", v.join(','));
    $(tree_Val).attr("value", mid.join(','));
    onBodyDown()
    if (tree_Val == "#pteacher") {
        $(tree_Val).change();
    }
}
var select_menu = null, tree_Text = null, tree_Wrapper = null, tree_ID = null, tree_Val = null;
function searchNode(treeDom, mid, inputId, inputName, flag) {
    var zTree = $.fn.zTree.getZTreeObj(treeDom);
    keyType = "id";
    value = parseInt(mid);
    var node = zTree.getNodeByParam(keyType, value);
    if (node) {
        if (flag) {
            zTree.selectNode(node);
            zTree.checkNode(node, true, true);
            $(inputId).val(mid);
            $(inputName).val(node.name);
        } else {
            zTree.cancelSelectedNode(node);
            zTree.checkNode(node, false, true, false);
            $(inputId).val("");
            $(inputName).val("");
        }

    }
}
$("#laoShi").on("click", function (e) {
    e.stopPropagation();
    var self = $(this), menu = self.attr("data-id"), flag = self.attr("data-cks");
    if (select_menu && select_menu != menu) {
        hideMenu()
    }
    $("input.menuText").attr("data-cks", 0)
    if (flag != 1) {
        select_menu = menu;
        tree_Text = self;
        tree_Val = self.attr("data-val");
        tree_Wrapper = self.attr("data-tree");
        self.attr("data-cks", 1);
        $(menu).slideDown("fast");
        
    } else {
        hideMenu()
    }
})
function hideMenu() {
    $(select_menu).fadeOut();
    select_menu = null;
 
    $("body").unbind("click", onBodyDown);
}
function onBodyDown(event) {
    $("input.menuText").attr("data-cks", 0);
    hideMenu();
}
 
 