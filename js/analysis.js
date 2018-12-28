var analysisOper = {
    init: function () {
        var me = this;
        me.resize();
        me.windowResize();
        me.clickEvent();
    },
    resize: function () {
        var me = this;
        var obj = me.getClientSize();
        var widths = obj.width;
        var heights = obj.height;
        var cw = $("#cartogramListConDiv").hasClass("hide") ? 0 : $("#cartogramListConDiv").width();
        //$('.content').css({ height: heights - 60 });
        $(".tool").css({height: heights - 60});
        //$("#cartogramListConDiv").css({height: heights - collectListResize60});
        $("#folderBtn").css({top: (heights - 60) / 2});
        $("#folderCartogramBtn").css({top: (heights - 60) / 2});
        $(".tool-panel-content").css({height: heights - 106});
        $("#data-layer-list").css({height: heights - 106 - 47});
        if ($(".toolbar>li").hasClass("actived")) {
            $(".sidebar").hide();
            $(".map").css({float: "none"});
            //闭合状态
            if ($("#folderBtn").hasClass("unfolder")) {
                $(".right-bottom-container").css({right: (cw + 8) + "px"});
                $(".map").css({
                    width: widths - cw,
                    height: heights - 60,
                    marginLeft: 0 + "px",
                    marginRight: cw + "px"
                });
                //展开状态
            } else {
                $(".right-bottom-container").css({right: (cw + 8) + "px"});
                $(".map").css({
                    width: widths - cw - 370,
                    height: heights - 60,
                    marginLeft: 370 + "px",
                    marginRight: cw + "px"
                });
            }
        } else {
            if ($(".sidebar")[0].style.display == "none")
                $(".map").css({float: "left", width: widths - 70, height: heights - 60, marginLeft: 0 + "px"});
            else
                $(".map").css({float: "left", width: widths - 330, height: heights - 60, marginLeft: 0 + "px"});
            $(".sidebar").css({float: "right", width: 260, height: heights - 60});
        }
        //重新加载地图
        $(".map").empty();
        analyze();
    },
    windowResize: function () {
        var me = this;
        $(window).resize(function () {
            me.resize();
        });
    },
    //绑定事件
    clickEvent: function () {
        var me = this;
        $(".panel-close").click(function () {
            $("#folderBtn").hide();
            me.closeDataPanel(this);
            //collectList.collectClose();
        });
        $(".toolbar").on("click", function (evt) {
            me.toolbarLiEvent(evt);
        });
        $(".addDataConDiv").on("click", function () {
            if ($("#addDataWin").css("display") == "block") return;
            addData.openWindow();
        });
        //TODO 20171115 折叠
        $("#folderBtn").on("click", function () {
            me.folderHanlder()
        });
        $("#folderCartogramBtn").on("click", function () {
            me.folderCartogramHanlder()
        });
    },
    //关闭面板
    closeDataPanel: function (evt) {
        var me = this;
        $(".tool-panel").hide();
        //analysisMap.clearMap();
        analysisSaveData.listDataChange("", "", "", false);
        $(".toolbar>li").removeClass('actived');
        $("#data-layer-list").empty();//$(evt).attr('ac') == "do" ? $("#data-layer-list").empty() : "";
        $("#legend-container").empty();//图例进行更新
        $("#legend-wrapper").addClass('hide');
        me.resize();
        analysisSaveData.closeWindow();
        addData.closeWindow();
        //setProgressTime.timeShaft(false);//20171027  时间轴关闭
        //20171113统计图
        addCartogramOper.listItemRemove();
    },
    //工具栏操作事件
    toolbarLiEvent: function (evt) {
        var me = this;
        var e = evt.target || evt.srcElement;
        var eParent = e.parentNode;
        if ((/^li$/i.test(e.tagName) && $(e).attr("ac") == 'do') || (/^li$/i.test(eParent.tagName) && $(eParent).attr("ac") == 'do')) {//现状评价
            var ele = /^li$/i.test(e.tagName) ? e : eParent;
            if ($(ele).hasClass("actived")) {
                //$(ele).removeClass('actived');
                //$(".tool-panel-container li[ac='do']").hide();
                me.closeDataPanel(ele);
                $("#folderBtn").hide();
            } else {
                $(ele).addClass('actived').siblings().removeClass('actived');
                $(".tool-panel-container li").hide();
                //collectList.collectClose();
                $(".tool-panel-container li[ac='do']").show();
                //切换回来时把之前的页面去除
                $("#folderBtn").show();
                //打开地图
                $("#total").show();
                $("#second").hide();
                //清空下拉列表
                $("#regressData option[value!=\"noselect\"]").remove();
                $("#columnY option[value!=\"noselect\"]").remove();
                $("#columnX option").remove();
                //me.loadData();
            }
        } else if ((/^li$/i.test(e.tagName) && $(e).attr("ac") == 'sd') || (/^li$/i.test(eParent.tagName) && $(eParent).attr("ac") == 'sd')) {//潜力评价
            var ele = /^li$/i.test(e.tagName) ? e : eParent;
            if ($(ele).hasClass("actived")) {
                $(ele).removeClass('actived');
                $(".tool-panel-container li[ac='sd']").hide();
                $("#folderBtn").hide();
            } else {
                $(ele).addClass('actived').siblings().removeClass('actived');
                $(".tool-panel-container li").hide();
                //collectList.collectClose();
                $(".tool-panel-container li[ac='sd']").show();
                $("#folderBtn").show();
                //me.loadData();
                //获取回归年份数据
                getRegressData();
            }
        } else if ((/^li$/i.test(e.tagName) && $(e).attr("ac") == 'cd') || (/^li$/i.test(eParent.tagName) && $(eParent).attr("ac") == 'cd')) {//协同布局
            var ele = /^li$/i.test(e.tagName) ? e : eParent;
            if ($(ele).hasClass("actived")) {
                $(ele).removeClass('actived');
                $(".tool-panel-container li[ac='cd']").hide();
                //collectList.collectClose();
                $("#folderBtn").hide();
            } else {
                $(".tool-panel-container li").hide();
                me.closeDataPanel(ele);
                $(ele).addClass('actived').siblings().removeClass('actived');
                //collectList.collectListAjax();//ADD  20170830  收藏的列表加载
                $(".tool-panel-container li[ac='cd']").show();
                $("#folderBtn").show();
                //获取协同布局数据
                getSynergyData();
            }
        }
        me.resize();
    },
    folderHanlder: function () {
        var me = this;
        var bool = $("#folderBtn").hasClass("unfolder");
        if (bool) {
            $("#folderBtn").removeClass("unfolder").css("left", "370px");
            $(".tool").show();
        } else {
            $("#folderBtn").addClass("unfolder").css("left", "0");
            $(".tool").hide();
        }
        me.resize();
    },
    //统计图的折叠 20171117
    folderCartogramHanlder: function () {
        var me = this;
        var bool = $("#folderCartogramBtn").hasClass("unfolder");
        if (bool) {
            $("#folderCartogramBtn").removeClass("unfolder").css("right", $("#cartogramListConDiv").width());
            $("#cartogramListConDiv").show();
        } else {
            $("#folderCartogramBtn").addClass("unfolder").css("right", "0");
            $("#cartogramListConDiv").hide();
        }
        me.resize();
    },
    //获取浏览器的高度
    getClientSize: function () {
        var c = window,
            b = document,
            a = b.documentElement;
        if (c.innerHeight) {
            return {
                width: c.innerWidth,
                height: c.innerHeight
            }
        } else {
            if (a && a.clientHeight) {
                return {
                    width: a.clientWidth,
                    height: a.clientHeight
                }
            } else {
                return {
                    width: b.body.clientWidth,
                    height: b.body.clientHeight
                }
            }
        }
    }
}

$(document).ready(function () {
    analysisMap = new analyze();//地图实例化
    //setProgressTime = new SetProgressTime();//时间轴
    analysisOper.init();//页面
    addData = new AddData();//添加数据实例化
    //addSec  = new AddSec();//回归数据实例化
    analysisSaveData = new SaveData();//保存数据
    addCartogramOper = new AddCartogramOper();//统计图
    //获取科技资源
    getResourceName();
    //编辑表格内联模式
    $.fn.editable.defaults.mode = 'inline';
    //提交
    $("form#formUpload").submit(function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: "http://114.215.68.90/regressUpload",
            type: "POST",
            data: formData,
            success: function (data) {
                aggregation(data);
            },
            cache: false,
            contentType: false,
            processData: false
        });
    })
});

//添加数据
function AddData() {
    this.WinID = "#addDataWin";
    this.addDataWindowTemplate = "#addData-window-template";//面板模版
    this.loadingTemplate = "#laoding-template";//加载等待模版
    this.indexdataTemplate = "#indexdata-template";//指标模版
    this.yeardataTemplate = "#yeardata-template";//指标模版
    this.emptyTemplate = "#empty-template";
    this.macMicType = "mac";//当前tab状态
    this.macMicParamObj = {
        url: "./template/GetIndexClassList.json",
        data: {dataSourcetype: "mac", indexDataClass: "", parentCode: "0", classKeyVal: "", classRegion: ""}
    };//获取数据类型的参数
    this.indexParamObj = {
        url: "./template/GetSelClassIndexInfos.json",
        data: {dataSourcetype: "mac", indexDataClass: "", classCode: ""}
    };//获取数据指标的参数
    this.analysisParamObj = {
        url: "./template/GetSelIndexDataInfos.json",
        data: {dataSourcetype: "mac", indexDataClass: "", classCode: "", selIndexs: "", indexYears: ""}
    };//提交数据进行分析
    this.indexYearData = null;//指标年份的数据保存
    this.indexFieldsYearObj = {classFielTitle: "", indexFields: [], indexYears: []};//提交数据之后保存当前的勾选的指标数据和年份
    //TODO 渲染查看数据的相关信息  名称、字段、数据类型（微观|宏观）
    this.init();
}

AddData.prototype = {
    init: function () {
        var me = this;
        //this.layoutRender();
        //this.resize();
        $(window).resize(function () {
            me.resize();
        });
        this.bindWinEvent();
    },
    //计算面板打开的位置
    resize: function () {
        var me = this;
        var H = ($(document).height() - 380) / 2;
        var W = ($(document).width() - 600) / 2;
        $(me.WinID).css("top", H).css("left", W);
    },
    //面板数据渲染
    layoutRender: function () {
        var me = this;
        $(me.addDataWindowTemplate).tmpl().appendTo('body');
    },
    //绑定窗口事件 
    bindWinEvent: function () {
        var me = this;
        //tabs切换
        $(".addDataTabsUl>li").on("click", function () {
            me.tabUlChange(this);
        });
        //数据来源的点击切换事件
        $(".datagroup>ul>li").on("click", function () {
            me.dataSources(this);
        });
        //提交数据按钮事件
        $(".addDataBtnDiv .addDataOkInput").on("click", function () {
            me.submitData()
        });
        //取消按钮事件
        $(".addDataBtnDiv .addDataCanelInput").on("click", function () {
            me.cancelData()
        });
        //关闭窗口事件
        $(".addDataTitleDiv .addDataCloseBtn").on("click", function () {
            me.cancelData()
        });
        //指标勾选
        $(".addDataIndexConDiv").delegate(".indexCheckBoxClass", "click", function () {
            me.indexCheckChange(this);
        });
        //指标年份勾选
        $(".addDataYearConDiv").delegate(".yearCheckBoxClass", "click", function () {
            me.indexYearCheckChange(this);
        });
        //搜索事件
        $(".typeSearchBtn").on("click", function () {
            me.searchData()
        });
        //地区的点击事件
        $(".areaSearchDiv").on("click", function () {
            me.areaSelectEvent();
        })
    },
    //TODO 地区选择事件 20170904  地区相关待扩展
    areaSelectEvent: function () {
        var me = this;
        var ele = $(".addDataContentUl li[ac=" + me.macMicType + "] .areaSearchDiv i");
        me.macMicParamObj.data.parentCode = "0";
        me.macMicParamObj.data.classRegion = "";//行政区内容切换
        if (ele.hasClass("fa-chevron-up")) {
            //关闭
            $(ele).addClass("fa-chevron-down").removeClass("fa-chevron-up");
        } else {
            //打开
            $(ele).addClass("fa-chevron-up").removeClass("fa-chevron-down");
        }
    },
    //搜索
    searchData: function () {
        var me = this;
        //TODO 地区 搜索
        var val = $(".addDataContentUl li[ac=" + me.macMicType + "] .typeSearchInput").val();
        if (me.macMicParamObj.url == "") return;
        //me.macMicParamObj.data.kc = me.macMicType=="mac"?"uerymacclass":"";
        //me.macMicParamObj.data.keyValue = val;
        me.macMicParamObj.data.parentCode = "0";
        me.macMicParamObj.data.classKeyVal = val;
        me.typeDataReset();
        $(me.loadingTemplate).tmpl().appendTo('.addDataContentUl li[ac=' + me.macMicType + '] .typeTreeUl');
        me.treeRequest();
    },
    //tabs切换，以及对应面板的切换
    tabUlChange: function (evt) {
        var me = this;
        if ($(evt).hasClass("active")) return;
        $(evt).addClass("active").siblings(".active").removeClass("active");
        var ac = $(evt).attr("ac");
        me.macMicType = ac;
        me.macMicParamObj.data.dataSourcetype = ac;
        me.indexParamObj.data.dataSourcetype = ac;
        me.analysisParamObj.data.dataSourcetype = ac;
        me.macMicParamObj.url = ac == "mic" ? "./template/GetIndexClassListMic.json" : "./template/GetIndexClassList.json";
        me.indexParamObj.url = ac == "mic" ? "./template/GetSelClassIndexInfosMic.json" : "./template/GetSelClassIndexInfos.json";
        me.analysisParamObj.url = ac == "mic" ? "./template/GetSelIndexDataInfosMic.json" : "./template/GetSelIndexDataInfos.json";
        //20171110 
        //me.analysisParamObj.data.indexDataClass = "";
        //me.analysisParamObj.data.classCode = "";
        //me.analysisParamObj.data.selIndexs = "";
        //me.analysisParamObj.data.indexYears = "";
        var ele = $(".addDataContentUl").find("li[ac=" + ac + "]");
        $(ele).addClass("active").siblings(".active").removeClass("active");
    },
    //数据来源的选择切换
    dataSources: function (evt) {
        var me = this;
        if ($(evt).hasClass("active")) return;
        $(evt).addClass("active").siblings(".active").removeClass("active");
        var ac = $(evt).attr("ac");
        //获取分类的参数
        me.macMicParamObj.data.indexDataClass = ac;
        me.macMicParamObj.data.classKeyVal = "";//关键字
        me.macMicParamObj.data.classRegion = "";//行政区
        me.macMicParamObj.data.parentCode = "0";//分类编码
        //获取指标的分类
        me.indexParamObj.data.indexDataClass = ac;
        me.indexParamObj.data.classCode = "";
        me.analysisParamObj.data.indexDataClass = ac;
        me.analysisParamObj.data.classCode = "";
        //数据的获取
        //me.typeDataReset();
        me.typeDataReset();
        $(me.loadingTemplate).tmpl().appendTo('.addDataContentUl li[ac=' + me.macMicType + '] .typeTreeUl');
        me.treeRequest();

    },
    //树数据获取
    treeRequest: function (nodeId) {
        var me = this;
        $.ajax({
            url: me.macMicParamObj.url,
            //data: me.macMicParamObj.data,
            type: 'get',
            dataType: "json",
            success: function (data) {
                if (data.state == "success") {
                    var treeData;
                    try {
                        treeData = eval('(' + data.data + ')');
                    } catch (e) {
                        $('.addDataContentUl li[ac=' + me.macMicType + '] .typeTreeUl').html("数据转换成JSON数据格式异常！");
                        //alert("数据转换成JSON数据格式异常！");
                    }
                    if (treeData.length > 0) {
                        treeData = me.treeDataIntegration(treeData);
                        me.treeViewRender(treeData, nodeId);
                    } else {
                        if (nodeId != undefined) {//20171018  当在异步加载数据时，解决返回数据为空的情况；区分加载第一层树渲染数据渲染的情况
                            $('.addDataContentUl li[ac=' + me.macMicType + '] .typeTreeUl').treeview("addNode", [nodeId, {
                                node: [{
                                    text: "此类型下无查询数据",
                                    id: ""
                                }], silent: true
                            }]);
                        } else {
                            $('.addDataContentUl li[ac=' + me.macMicType + '] .typeTreeUl').html("<div style='text-align:center;margin-top:5px;'>暂无分类</div>");
                        }
                    }
                } else {
                    $('.addDataContentUl li[ac=' + me.macMicType + '] .typeTreeUl').html("获取数据失败：" + data.message);
                    //alert("获取数据失败：" + data.message);
                }
            },
            error: function (xhr, msg) {
                $('.addDataContentUl li[ac=' + me.macMicType + '] .typeTreeUl').html('数据获取异常：' + msg);
                //alert('数据获取异常：' + msg);
            }
        });

    },
    //数据分类树渲染 20170904
    treeViewRender: function (treeData, nodeId) {
        var me = this;
        if (me.macMicParamObj.data.parentCode == "0") {
            //渲染列表
            $('.addDataContentUl li[ac=' + me.macMicType + '] .typeTreeUl').empty();
            $('.addDataContentUl li[ac=' + me.macMicType + '] .typeTreeUl').treeview({
                data: treeData,
                showCheckbox: false,
                selectedBackColor: "#25b0ff",
                levels: 1,
                onNodeSelected: function (node, opt) {//选中
                    me.indexParamObj.data.classCode = opt.id;
                    me.analysisParamObj.data.classCode = opt.id;
                    me.indexFieldsYearObj.classFieldTitle = opt.text;
                    me.IndexDataReset();
                    me.treeNodeSelect(node, opt);
                },
                onNodeCollapsed: function (node, opt) {//折叠
                },
                onNodeExpanded: function (node, opt) {//展开
                    if (opt.nodes.length > 0 && opt.nodes[0].id != "loading") return;
                    me.macMicParamObj.data.parentCode = opt.id;
                    me.treeRequest(opt.nodeId);
                }
            });
            $('.addDataContentUl li[ac=' + me.macMicType + '] .typeTreeUl').treeview('collapseAll', {silent: true});
        } else {
            //追加
            $('.addDataContentUl li[ac=' + me.macMicType + '] .typeTreeUl').treeview("addNode", [nodeId, {
                node: treeData,
                silent: true
            }]);
        }
    },
    //节点的点击事件，获取指标或者子节点
    treeNodeSelect: function (node, data) {
        var me = this;
        //if (data.hasChildren == false) {
        //获取数据加载
        $(me.loadingTemplate).tmpl().appendTo(".addDataContentUl li[ac=" + me.macMicType + "] .addDataIndexConDiv");
        me.macMicParamObj.data.parentCode = data.id;
        me.getIndexYearData();
        //}

    },
    //数据分类的数据整理
    treeDataIntegration: function (data) {
        var me = this;
        $.each(data, function (i, item) {
            //item.nodes = item.children;
            //item.state = { expanded: item.state == "close" ? false : true };
            item.state = item.state ? ({expanded: item.state == "close" ? false : true}, item.nodes = [{
                id: "loading",
                text: "正在加载数据..."
            }]) : "";
            //if (item.children&&item.children.length > 0) me.treeDataIntegration(item.children);
        });
        return data;
    },
    //指标数据、年份的获取
    getIndexYearData: function () {
        var me = this;
        //me.IndexDataReset();
        $.ajax({
            url: me.indexParamObj.url,
            data: me.indexParamObj.data,
            type: 'get',
            dataType: "json",
            success: function (data) {
                if (data.state == true) {
                    //渲染列表
                    var indexData = data.data;
                    me.indexYearData = indexData;
                    me.IndexDataReset();
                    if (indexData.length > 0) {
                        $(me.indexdataTemplate).tmpl(indexData).appendTo(".addDataContentUl li[ac=" + me.macMicType + "] .addDataIndexConDiv");
                        $.each(me.indexYearData, function (i, item) {
                            item.indextime = item.indextime ? item.indextime.split(";") : [];
                        });
                        me.indexCheckChange();
                    } else {
                        $('.addDataContentUl li[ac=' + me.macMicType + '] .addDataIndexConDiv').html("<div style='text-align:center;margin-top:5px;'>此分类下暂无指标</div>");
                    }
                } else {
                    $('.addDataContentUl li[ac=' + me.macMicType + '] .addDataIndexConDiv').html("获取数据失败：" + data.message);
                    //alert("获取数据失败：" + data.message);
                }
            },
            error: function (xhr, msg) {
                $('.addDataContentUl li[ac=' + me.macMicType + '] .addDataIndexConDiv').html('数据获取异常：' + msg);
                //alert('数据获取异常：' + msg);
            }
        });
    },
    //指标勾选事件
    indexCheckChange: function (evt) {
        var me = this;
        $(".addDataContentUl li[ac=" + me.macMicType + "] .addDataYearConDiv").empty();
        $(me.loadingTemplate).tmpl().appendTo(".addDataContentUl li[ac=" + me.macMicType + "] .addDataYearConDiv");
        var checkArr = $(".addDataContentUl li[ac=" + me.macMicType + "] .addDataIndexConDiv").find(".indexCheckBoxClass");
        var yearArr = [];
        $.each(checkArr, function (i, item) {
            if (!$(item).prop("checked")) return true;
            $.each(me.indexYearData, function (j, temp) {
                if ($(item).attr("code") == temp.indexcode) {
                    yearArr = yearArr.concat(temp.indextime);
                }
            });
        });
        //年份数据去重，整理
        yearArr.sort().reverse();
        var itemYear, yearObjArr = [];
        $.each(yearArr, function (i, item) {
            if (item == itemYear) return true;
            yearObjArr.push({year: item, code: item});
            itemYear = item;
        });
        if (yearObjArr.length > 0) yearObjArr.unshift({year: "全部", code: "all"});
        //console.log(yearObjArr);
        $(".addDataContentUl li[ac=" + me.macMicType + "] .addDataYearConDiv").empty();
        $(me.yeardataTemplate).tmpl(yearObjArr).appendTo(".addDataContentUl li[ac=" + me.macMicType + "] .addDataYearConDiv");
    },
    //指标年份勾选事件  20170904
    indexYearCheckChange: function (evt) {
        var me = this;
        var code = $(evt).attr("code");
        var checked = $(evt).prop("checked");
        var inputs = $(".addDataYearConDiv").find(".yearCheckBoxClass");
        if (code == "all") {//全选|全不选
            checked == true ? $(".addDataYearConDiv").find(".yearCheckBoxClass").prop("checked", true) : $(".addDataYearConDiv").find(".yearCheckBoxClass").prop("checked", false);
        } else {
            if (checked == true) {
                //在单个年份的复选框全部勾选的情况下，将全选选项的复选框勾选
                var len = 0;
                $.each(inputs, function (i, item) {
                    var codeVal = $(item).attr("code");
                    if (codeVal == "all") return true;
                    if ($(item).prop("checked") == true) len++;
                });
                len + 1 == inputs.length ? $(".addDataYearConDiv").find(".yearCheckBoxClass[code='all']").prop("checked", true) : "";
            } else if (checked == false) {
                //在全选的情况下，勾去了一个，全选选项的复选框取消勾选
                var allChecked = $(".addDataYearConDiv").find(".yearCheckBoxClass[code='all']").prop("checked");
                allChecked == true ? $(".addDataYearConDiv").find(".yearCheckBoxClass[code='all']").prop("checked", false) : "";
            }
        }
    },
    //提交数据按钮
    submitData: function () {
        var me = this;
        var ac = me.analysisParamObj.data.dataSourcetype;
        //提交数据 添加判断，列表中最多只允许出现3条数据
        var len = $("#data-layer-list>li").length;
        if (len == 3) {
            layer.alert("数据最多添加三条");
            return;
        }
        var yearLabelLen = $(".addDataContentUl").find("li[ac=" + ac + "]").find('.addDataYearConDiv>label').length;
        var indexCheckedBool = me.dataIntegration();//勾选指标项的数据整理和年份的整理
        if (indexCheckedBool) {
            //return alert("请选择指标项，再进行分析！");
            layer.confirm('未选择指标项，是否继续？', {
                btn: ['是', '否'] //按钮
            }, function (index) {//按钮-是
                //if (me.macMicType == "mac" && yearLabelLen > 0) {//20171011 在宏观数据的情况下，判断是否勾选年份
                //    var yearCheckArr = $(".addDataContentUl").find("li[ac=" + ac + "]").find(".addDataYearSelectDiv .addDataYearConDiv .yearCheckBoxClass");
                //    if (yearCheckArr.length == 0 || me.analysisParamObj.data.indexYears == "") return layer.alert("请选择指标年份，再进行分析！");
                //} else if (me.macMicType == "mic" && yearLabelLen > 0) {
                //    if (me.analysisParamObj.data.indexYears == "") return layer.alert("请选择指标年份，再进行分析！");
                //}
                me.referRequest();
                layer.close(index);
            }, function (index) {//按钮-否
                return layer.close(index);
            });
        } else {
            if (me.macMicType == "mac") {//20171011 在宏观数据的情况下，判断是否勾选年份
                //var yearCheckArr = $(".addDataContentUl").find("li[ac=" + ac + "]").find(".addDataYearSelectDiv .addDataYearConDiv .yearCheckBoxClass");
                //if (yearCheckArr.length == 0 || me.analysisParamObj.data.indexYears == "") return layer.alert("请选择指标年份，再进行分析！");
                if (me.analysisParamObj.data.selIndexs == "") {
                    return layer.alert("请选择指标项，再进行分析！");
                }
                else if (me.analysisParamObj.data.selIndexs != "" && me.analysisParamObj.data.indexYears == "") {
                    layer.confirm('未选择指标年份，是否继续？', {
                        btn: ['是', '否'] //按钮
                    }, function (index) {//按钮-是
                        me.referRequest();
                        layer.close(index);
                    }, function (index) {//按钮-否
                        return layer.close(index);
                    });
                } else {
                    me.referRequest();
                }
            } else if (me.macMicType == "mic" && yearLabelLen > 0) {
                if (me.analysisParamObj.data.indexYears == "") { //return layer.alert("请选择指标年份，再进行分析！");
                    layer.confirm('未选择指标年份，是否继续？', {
                        btn: ['是', '否'] //按钮
                    }, function (index) {//按钮-是
                        me.referRequest();
                        layer.close(index);
                    }, function (index) {//按钮-否
                        return layer.close(index);
                    });
                } else {
                    me.referRequest();
                }
            }
            //me.referRequest();
        }
    },
    //提交请求数据
    referRequest: function () {
        var me = this;
        $.ajax({
            url: me.analysisParamObj.url,
            type: 'get',
            dataType: "json",
            data: me.analysisParamObj.data,
            beforeSend: me.loadingShow,
            success: function (data) {
                if (data.state) {
                    if (data.data.length > 0) {
                        //将返回的数据进行整理等一系列后续操作
                        me.analysisDataIntegration(data.data);
                        //获取数据进行调用模型、渲染数据
                        //new MicMacAnalysis(data.data);
                    } else {
                        layer.alert("该数据解析返回结果为空,请选择其他数据进行解析。");
                        me.laodingHide();
                    }
                } else {
                    layer.alert("数据获取失败：" + data.message);
                    me.laodingHide();
                }
            },
            error: function (xhr, msg) {
                layer.alert('数据获取异常：' + msg);
                me.laodingHide();
            }
        });
        me.closeWindow();//关闭窗口
    },
    //勾选指标项的数据整理和年份的整理
    dataIntegration: function () {
        var me = this, ac = me.analysisParamObj.data.dataSourcetype;//20171110  面板获取的容器中的数值时区分当前类型下的数据 
        var indexCheckArr = $(".addDataContentUl").find("li[ac=" + ac + "]").find(".addDataIndexConDiv .indexCheckBoxClass");//$(".addDataIndexConDiv .indexCheckBoxClass");
        var yearCheckArr = $(".addDataContentUl").find("li[ac=" + ac + "]").find(".addDataYearSelectDiv .addDataYearConDiv .yearCheckBoxClass"); //$(".addDataYearSelectDiv .addDataYearConDiv .yearCheckBoxClass");
        var checkedIndex = [], checkYear = [];
        me.indexFieldsYearObj.indexFields = [], me.indexFieldsYearObj.indexYears = [];
        $.each(indexCheckArr, function (i, item) {
            if ($(item).prop("checked")) {
                checkedIndex.push($(item).attr("code"));
                me.indexFieldsYearObj.indexFields.push({
                    "code": $(item).attr("code"),
                    "type": $(item).attr("indextype").toLowerCase(),
                    "visible": true,
                    "name": $(item).attr("title")
                });
            }
        });
        $.each(yearCheckArr, function (i, item) {
            if ($(item).prop("checked") && $(item).attr("code") != "all") {
                checkYear.push($(item).attr("code"));
                me.indexFieldsYearObj.indexYears.push({"code": $(item).attr("code"), "name": $(item).attr("code")});
            }
        });
        var bool = ac == "mic" ? (checkedIndex.length > 0 ? false : true) : (false);
        me.analysisParamObj.data.selIndexs = checkedIndex.join(",");
        me.analysisParamObj.data.indexYears = checkYear.join(",");
        return bool;
    },
    //将返回的数据进行整理等一系列后续操作
    analysisDataIntegration: function (dataArr) {
        var me = this;
        var indexCheckArr = $(".addDataIndexConDiv .indexCheckBoxClass");
        var obj = {
            "content": [{
                "itemId": me.indexParamObj.data.classCode,//唯一标识
                "itemName": me.indexFieldsYearObj.classFieldTitle,// me.analysisParamObj.data.dataSourcetype == "mac" ? "宏观数据" : "微观数据",//名称
                "themeDataType": me.analysisParamObj.data.dataSourcetype == "mac" ? "POLYGON" : "POINT", //数据类型，点数据POINT、面数据POLYGON
                "visible": true,//是否显示
                "fields": me.indexFieldsYearObj.indexFields,
                "years": me.indexFieldsYearObj.indexYears,
                "data": dataArr
            }]
        };
        //console.log(obj);
        me.laodingHide();
        new MicMacAnalysis(obj);
        //20171113 统计图数据添加
        obj.content[0].themeDataType == "POLYGON" && (addCartogramOper.data.push(obj.content[0]), addCartogramOper.btnShowHide());
    },
    //取消
    cancelData: function () {
        var me = this;
        me.closeWindow();//关闭窗口
    },
    //窗口打开
    openWindow: function () {
        var me = this;
        me.resize();
        me.dataReset();
        $(me.WinID).show();
    },
    //窗口关闭
    closeWindow: function () {
        var me = this;
        $(me.WinID).hide();
        //me.dataReset();
    },
    //数据重置
    dataReset: function () {
        var me = this;
        //相关数据，展示恢复默认状态
        $(".addDataTabsUl").find("li[ac=mac]").addClass("active").siblings(".active").removeClass("active");//默认宏观数据
        $(".addDataContentUl").find("li[ac=mac]").addClass("active").siblings(".active").removeClass("active");
        $(".datagroup>ul>li").removeClass("active");//数据来源不选中
        //me.typeDataReset();
        $(".typeTreeUl").empty();//分类清空
        $(".addDataIndexConDiv").empty();//指标信息清空
        $(".addDataYearConDiv").empty();//时间信息清空
        $(".typeSearchInput").val("");//搜索框的清空
        //TODO 地区清空
        //清空参数
        this.macMicType = "mac";//当前tab状态
        this.macMicParamObj = {
            url: "./template/GetIndexClassList.json",
            data: {dataSourcetype: "mac", indexDataClass: "", parentCode: "0", classKeyVal: "", classRegion: ""}
        };//获取数据类型的参数
        this.indexParamObj = {
            url: "./template/GetSelClassIndexInfos.json",
            data: {dataSourcetype: "mac", indexDataClass: "", classCode: ""}
        };//获取数据指标的参数
        this.analysisParamObj = {
            url: "./template/GetSelIndexDataInfos.json",
            data: {dataSourcetype: "mac", indexDataClass: "", classCode: "", selIndexs: "", indexYears: ""}
        };//提交数据进行分析
        this.indexYearData = null;//指标年份的数据保存
        this.indexFieldsYearObj = {indexFields: [], indexYears: []};//提交数据之后保存当前的勾选的指标数据
    },
    //数据来源切换
    typeDataReset: function () {
        var me = this;
        $(".addDataContentUl li[ac=" + me.macMicType + "] .typeTreeUl").empty();//分类清空
        if (me.macMicParamObj.data.classKeyVal == "") $(".typeSearchInput").val("");//搜索框的清空
        //TODO 地区清空
        me.IndexDataReset();
    },
    //数据类型切换
    IndexDataReset: function () {
        var me = this;
        $(".addDataContentUl li[ac=" + me.macMicType + "] .addDataIndexConDiv").empty();//指标信息清空
        $(".addDataContentUl li[ac=" + me.macMicType + "] .addDataYearConDiv").empty();//时间信息清空
    },
    loadingShow: function () {
        $("#loadingPage").show();
    },
    laodingHide: function () {
        $("#loadingPage").hide();
    },
}

//保存数据
function SaveData() {
    this.WinID = "#saveWinConDiv";
    this.saveWinTemplate = $("#saveWin-template");
    this.getStateUrl = "./template/GetThemeClassList.json";
    this.submitUrl = "./template/SubmitForm.json";
    this.submitParam = {
        ParCode: "",
        NodeName: "",
        NodeType: "theme",
        ThemeType: "",
        ThemeDesc: "",
        ThemeInfo: [],
        mapType: "OSM"
    };//保存提交的参数 TODO地图底层类型mapType默认OSM，待完善
    this.operData = [];
    this.init();
}

SaveData.prototype = {
    init: function () {
        var me = this;
        //$(me.saveWinTemplate).tmpl().appendTo('body');
        me.resize();
        $(window).resize(function () {
            me.resize();
        });
        me.loadState();
        me.bindWinEvent();
    },
    //计算面板打开的位置
    resize: function () {
        var me = this;
        var H = ($(document).height() - 220) / 2;
        var W = ($(document).width() - 350) / 2;
        $(me.WinID).css("top", H).css("left", W);
    },
    //绑定窗口事件 
    bindWinEvent: function () {
        var me = this;
        //关闭窗口事件
        $(".titleConDiv .saveDataCloseBtn").on("click", function () {
            me.closeWindow()
        });
        //取消
        $(".btnClass .saveCanelInput").on("click", function () {
            me.closeWindow()
        });
        //保存
        $(".btnClass .saveSubmitInput").on("click", function () {
            me.submitData()
        });
        //下拉树的展示与隐藏
        $("#txt_typename").click(function () {
            me.treeView();
        });
    },
    //类别选择的面板
    treeView: function () {
        if ($('#treeview').css("display") == "none") {
            $('#treeview').show();
            $("#treeview .list-group-item").show();
        } else {
            $('#treeview').hide();
        }
    },
    //获取类别
    loadState: function (parNode, nodeId) {
        var me = this;
        var parCode = parNode ? parNode : 0;
        $.ajax({
            url: me.getStateUrl,
            type: 'get',
            dataType: "json",
            data: {parCode: parCode},
            success: function (data) {
                if (data.state == "success") {
                    try {
                        treeData = eval('(' + data.data + ')');
                    } catch (e) {
                        //$('.addDataContentUl li[ac=' + me.macMicType + '] .typeTreeUl').html("数据转换成JSON数据格式异常！");
                        layer.alert("数据转换成JSON数据格式异常！");
                    }
                    if (treeData.length > 0) {
                        if (nodeId == undefined) {
                            var treeDataNew = me.treeDataIntegration(treeData);
                            var options = {
                                bootstrap2: false,
                                showTags: true,
                                //levels: 5,
                                showCheckbox: false,
                                data: treeDataNew,
                                onNodeSelected: function (event, data) {
                                    me.submitParam.ParCode = data.id;
                                    $("#txt_typename").val(data.text);
                                    $("#treeview").hide();
                                },
                                onNodeExpanded: function (node, opt) {//展开
                                    if (opt.nodes.length > 0 && opt.nodes[0].id != "loading") return;
                                    me.loadState(opt.id, opt.nodeId);
                                }
                            };
                        } else {
                            //追加
                            var treeDataNode = me.treeDataIntegration(treeData);
                        }
                    } else {
                        if (nodeId != undefined) {//20171018  当在异步加载数据时，解决返回数据为空的情况；区分加载第一层树渲染数据渲染的情况
                        } else {
                        }
                    }
                } else {
                    layer.alert("获取数据失败：" + data.message);
                }
            },
            error: function (xhr, msg) {
                layer.alert('获取数据类别异常：' + msg);
            }
        })
    },
    treeDataIntegration: function (data) {
        var me = this;
        $.each(data, function (i, item) {
            //item.nodes = item.children;
            //item.state = { expanded: item.state == "close" ? false : true };
            item.state ? (item.state = {expanded: item.state == "closed" ? false : true}, item.nodes = [{
                id: "loading",
                text: "正在加载数据..."
            }]) : "";
            //if (item.children&&item.children.length > 0) me.treeDataIntegration(item.children);
        });
        return data;
    },
    //提交数据
    submitData: function () {
        var me = this;
        if (me.submitParam.ParCode == "") return layer.alert("请选择专题图类别！");
        var val = $.trim($("#saveWinConDiv .themeNameInputClass").val());
        if (val == "") return layer.alert("请输入专题图名称！");
        me.submitParam.NodeName = val;
        me.submitParam.ThemeDesc = $.trim($("#saveWinConDiv .themeDecTextareaClass").val());
        //地图
        //var layerArr = analysisMap.olMap.getLayers().getArray();
        var themeType = "";
        //for (var i = layerArr.length - 1; i > 0; i--) {
        //    var item = layerArr[i];
        //    if (!item.values_.visible) continue;
        //    me.submitParam.ThemeInfo.push(item);
        //    if (themeType != item.values_.themeType && themeType == "") {
        //        themeType = item.values_.themeType;
        //    } else if (themeType != item.values_.themeType && themeType != "") {
        //        themeType = "mixed";
        //    }
        //}
        $.each(me.operData, function (i, item) {
            if (item.visible) {
                if (themeType != item.geometryType && themeType == "") {
                    themeType = item.geometryType;
                } else if (themeType != item.geometryType && themeType != "") {
                    themeType = "mixed";
                }
                if (item.geometryType == "pt") {
                    me.submitParam.ThemeInfo.push(item);
                } else if (item.geometryType == "pg") {
                    me.submitParam.ThemeInfo.unshift(item);
                }
            }
        });
        if (themeType == "") return layer.alert("保存的专题图中没有进行展示的图层！");
        me.submitParam.ThemeType = themeType;
        me.submitParam.ThemeInfo = JSON.stringify(me.submitParam.ThemeInfo);
        console.log(me.submitParam);
        me.submitAjax();
        me.closeWindow();
    },
    submitAjax: function () {
        var me = this;
        $.ajax({
            url: me.submitUrl,
            data: me.submitParam,
            beforeSend: me.loadingShow,
            complete: me.loadingHide,
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.state) {
                    layer.alert(data.message);
                } else {
                    layer.alert("操作专题图指标收藏信息失败：" + data.message);
                }
            },
            error: function (xhr, msg) {
                layer.alert("操作专题图指标收藏信息异常：" + msg);
            }
        })
    },
    //窗口打开
    openWindow: function () {
        $(this.WinID).show();
        this.loadState();
    },
    //窗口关闭
    closeWindow: function () {
        var me = this;
        $(me.WinID).hide();
        me.reset();
    },
    //内容重置
    reset: function () {
        var me = this;
        //if ($(me.WinID + " #txt_typename").val() != "")
        //    $(me.WinID + ' #treeview').treeview("unselectNode", $(me.WinID + ' #treeview').treeview("getSelected"), {silent: true});
        $(me.WinID + " #txt_typename").val("");
        $(me.WinID + " .themeNameInputClass").val("");
        $(me.WinID + " .themeDecTextareaClass").val("");
        //$('#treeview').hide();
        me.submitParam.ParCode = "", me.submitParam.NodeName = "",
            me.submitParam.NodeType = "theme", me.submitParam.ThemeType = "",
            me.submitParam.ThemeDesc = "", me.submitParam.ThemeInfo = [];

    },
    //数据修改
    listDataChange: function (attr, cid, bool) {
        if (bool) {
            this.updateData(attr, cid);
        } else {
            this.deleteData(attr, cid);
        }
    },
    //数据添加修改
    updateData: function (attr, cid) {
        var me = this, pd = true;
        $.each(me.operData, function (i, item) {
            if (item.cid == cid) {
                pd = false;
                item.config = attr.config;
            }
        });
        if (pd) {
            var temp = $.extend({cid: cid}, attr);
            me.operData.push(temp);
        }
    },
    //数据删除
    deleteData: function (attr, cid) {
        var me = this;
        if (cid == "") return me.operData = [];
        $.each(me.operData, function (i, item) {
            if (item.cid == cid) {
                me.operData.splice(i, 1);
                return false;
            }
        });
    },
    //遮罩层显示
    loadingShow: function () {
        $("#loadingPage").show();
    },
    //遮罩层隐藏
    loadingHide: function () {
        $("#loadingPage").hide();
    }
}

function getRegressData() {
    $.ajax({
        url: "http://114.215.68.90/regressData",
        beforeSend: function () {
            var list = [];
            list.push("columnY");
            list.push("columnX");
            clearChildren(list);
        },
        success: function (data) {
            data = JSON.parse(data);
            for (i = 0; i < data.length; i++) {
                node = document.createElement("option");
                node.setAttribute("value", data[i]);
                node.innerHTML = data[i];
                $("#regressData")[0].appendChild(node.cloneNode(true));
            }
        },
        error: function (xhr, msg) {
            alert('获取数据类别异常：' + msg);
        }
    })
}

function getSynergyData() {
    $.ajax({
        url: "http://114.215.68.90/synergyData",
        beforeSend: function () {
            var list = [];
            list.push("companyData");
            list.push("industryData");
            clearChildren(list);
        },
        success: function (data) {
            data = JSON.parse(data);
            for (i = 0; i < data["company"].length; i++) {
                node = document.createElement("option");
                node.setAttribute("value", data["company"][i]);
                node.innerHTML = data["company"][i];
                $("#companyData")[0].appendChild(node.cloneNode(true));
            }
            for (i = 0; i < data["industry"].length; i++) {
                node = document.createElement("option");
                node.setAttribute("value", data["industry"][i]);
                node.innerHTML = data["industry"][i];
                $("#industryData")[0].appendChild(node.cloneNode(true));
            }
        },
        error: function (xhr, msg) {
            alert('获取数据类别异常：' + msg);
        }
    })
}

function clearChildren(list) {
    for (var i = 0; i < list.length; i++) {
        childList = document.getElementById(list[i]).children;
        for (var j = childList.length - 1; j > 0; j--) {
            document.getElementById(list[i]).removeChild(childList[j]);
        }
    }
}

function getRegressColumn(that) {
    $.ajax({
        url: "http://114.215.68.90/regressColumn",
        type: "post",
        data: {"name": that.value},
        beforeSend: function () {
            var list = [];
            list.push("columnY");
            list.push("columnX");
            clearChildren(list);
        },
        success: function (data) {
            data = JSON.parse(data);
            for (i = 0; i < data.length; i++) {
                var result = data[i];
                node = document.createElement("option");
                node.setAttribute("value", result.split("_")[0]);
                node.innerHTML = result.split("_")[1];
                if (result.split("_")[0] == "Y")
                    $("#columnY")[0].appendChild(node.cloneNode(true));
                else
                    $("#columnX")[0].appendChild(node.cloneNode(true));
            }
        },
        error: function (xhr, msg) {
            alert('获取数据类别异常：' + msg);
        }
    })
}

function synergy() {
    var company = $("#companyData").val();
    var industry = $("#industryData").val();
    url = "http://114.215.68.90/synergyAnalysis";
    $.ajax({
        url: url,
        type: "post",
        data: {
            "company": company,
            "industry": industry
        },
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            //关闭地图
            $("#total").hide();
            //关闭收缩
            $("#folderBtn").hide();
            //展示结果
            var obj = analysisOper.getClientSize();
            var widths = obj.width;
            var heights = obj.height;
            //清空表格
            $(".table th").remove();
            $(".table td").remove();
            var table = data["table"];
            //添加表头
            var th = document.createElement("th");
            th.innerHTML = "地点";
            $("#thead")[0].appendChild(th);
            th = document.createElement("th");
            th.innerHTML = "企业";
            $("#thead")[0].appendChild(th);
            th = document.createElement("th");
            th.innerHTML = "科研机构";
            $("#thead")[0].appendChild(th);
            th = document.createElement("th");
            th.innerHTML = "C值(耦合度)";
            $("#thead")[0].appendChild(th);
            th = document.createElement("th");
            th.innerHTML = "D值(耦合协调度)";
            $("#thead")[0].appendChild(th);
            //添加内容
            for (var id in table) {
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.innerHTML = id
                tr.appendChild(td);
                for (var i = 0; i < table[id].length; i++) {
                    td = document.createElement("td");
                    td.innerHTML = table[id][i];
                    tr.appendChild(td);
                }
                $("#tbody")[0].appendChild(tr);
            }
            $("#third").css({display: "block", width: widths - 400, height: heights - 60, marginLeft: 380 + "px"});
        },
    });
}

function regress() {
    var name = $("#regressData")[0].value;
    var Y = $("#columnY")[0].value;
    var X = $("#columnX").val().join(",");
    url = "http://114.215.68.90/regressAnalysis";
    $.ajax({
        url: url,
        type: "post",
        data: {
            "name": name,
            "X": X,
            "Y": Y
        },
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            //关闭地图
            $("#total").hide();
            //关闭收缩
            $("#folderBtn").hide();
            //展示结果
            var obj = analysisOper.getClientSize();
            var widths = obj.width;
            var heights = obj.height;
            $("#formula").text(data["result"]);

            //清空表格
            $(".table th").remove();
            $(".table td").remove();
            var table = data["table"];
            //添加表头
            var th = document.createElement("th");
            th.innerHTML = "地名";
            $("#head")[0].appendChild(th);
            th = document.createElement("th");
            th.innerHTML = "产出值";
            $("#head")[0].appendChild(th);
            for (var i = 0; i < $("#columnX").val().length; i++) {
                th = document.createElement("th");
                th.innerHTML = "投入" + (i + 1) + "(点击可编辑)";
                $("#head")[0].appendChild(th);
            }
            th = document.createElement("th");
            th.innerHTML = "新产出值";
            $("#head")[0].appendChild(th);
            //添加内容
            for (var id in table) {
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.innerHTML = id;
                tr.appendChild(td);
                for (var i = 0; i < table[id].length; i++) {
                    td = document.createElement("td");
                    if (i == 0)
                        td.innerHTML = table[id][i];
                    else
                        td.innerHTML = "<a href='#' data-pk='" + id + i + "' data-type='text' class='editable editable-click'>" + table[id][i] + "</a>";
                    tr.appendChild(td);
                }
                var td = document.createElement("td");
                td.innerHTML = "0";
                tr.appendChild(td);
                $("#body")[0].appendChild(tr);
            }
            //参数
            var factors = data["betas"];
            refreshEditable(factors);
            $("#second").css({display: "block", width: widths - 400, height: heights - 60, marginLeft: 380 + "px"});
        },
    });
}

function refreshEditable(factors) {
    //计算新y值
    $("a[class='editable editable-click']").editable({
        type: 'text',
        title: 'Enter value',
        success: function (response, newValue) {
            var values = [];
            //获取tr下子节点
            var childs = this.parentNode.parentNode.children;
            //头两个是gdcode和y，最后一个是新y值
            for (var i = 2; i < childs.length - 1; i++) {
                if (childs[i] != this.parentNode) {
                    values.push(parseFloat(childs[i].innerText.trim()));
                }
                else {
                    values.push(parseFloat(newValue));
                }
            }
            //console.log(factors);
            //console.log(values);
            var result = 0;
            for (var i = 0; i < values.length; i++) {
                result += Math.log(values[i]) * factors[i];
            }
            result += factors[factors.length - 1];
            this.parentNode.innerHTML = "<a href='#' data-type='text' class='editable editable-click'>" + newValue + "</a>";
            childs[childs.length - 1].innerText = new Number(Math.exp(result)).toFixed(1);
            refreshEditable(factors);
        }
    });
}

function showUpload(that) {
    if (that.value != "noselect") {
        $("#dataUpload").removeAttr("disabled");
    }
    else {
        $("#dataUpload").attr("disabled", "disabled");
    }
}

function getResourceType(that) {
    if (that.value != "noselect") {
        $("#curMark").removeAttr("disabled");
        $("#dataDownload").removeAttr("disabled");
    }
    else {
        $("#curMark").attr("disabled", "disabled");
        $("#dataDownload").attr("disabled", "disabled");
        $("#dataUpload").attr("disabled", "disabled");
    }

    $.ajax({
        url: "http://114.215.68.90/resourceType",
        type: "post",
        data: {"name": that.value},
        beforeSend: function () {
            var list = [];
            list.push("resourceType");
            list.push("aggregationColumn");
            clearChildren(list);
        },
        success: function (data) {
            data = JSON.parse(data);
            statList = data.statList;
            typeList = data.typeList;
            for (i = 0; i < typeList.length; i++) {
                node = document.createElement("option");
                node.setAttribute("value", typeList[i]);
                node.innerHTML = typeList[i];
                $("#resourceType")[0].appendChild(node.cloneNode(true));
            }
            for (i = 0; i < statList.length; i++) {
                node = document.createElement("option");
                node.setAttribute("value", statList[i]);
                node.innerHTML = statList[i];
                $("#aggregationColumn")[0].appendChild(node.cloneNode(true));
            }
        },
        error: function (xhr, msg) {
            alert('获取资源类别异常：' + msg);
        }
    })
}

function aggregation(value) {
    var year = $("#aggregationYear").val();
    var resource = $("#resourceName").val();
    value = "" + value;
    if (value.indexOf("-") >= 0)
        resource = value;
    var type = $("#resourceType").val();
    var action = $("#action").val();
    var column = $("#aggregationColumn").val();
    var zoom = parseInt($("#zoomLevel").val());
    $.ajax({
        url: "http://114.215.68.90/aggregation",
        type: "get",
        data: {
            "year": year,
            "resource": resource,
            "resourceType": type,
            "action": action,
            "column": column,
            "zoom": zoom
        },
        beforeSend: function () {

        },
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            analyze(window, data, zoom);
        },
        error: function (xhr, msg) {
            alert("区域聚合时异常: " + msg);
        }
    })
}

function getResourceName() {
    $.ajax({
        url: "http://114.215.68.90/resourceList",
        type: "get",
        success: function (data) {
            data = JSON.parse(data);
            for (i = 0; i < data.length; i++) {
                node = document.createElement("option");
                node.setAttribute("value", data[i]);
                node.innerHTML = data[i];
                $("#resourceName")[0].appendChild(node.cloneNode(true));
            }
        },
        error: function (xhr, msg) {
            alert('获取资源列表异常：' + msg);
        }
    })
}

function getActionType(that) {
    if (that.value == "sum") {
        $(".calHidden").hide();
        $("#aggregationColumn").hide();
    }
    else if (that.value == "stat") {
        $(".calHidden").show();
        $("#aggregationColumn").show();
    }
    else if (that.value == "aver") {
        $(".calHidden").hide();
        $("#aggregationColumn").hide();
    }
    else if (that.value == "area") {
        $(".calHidden").hide();
        $("#aggregationColumn").hide();
    }
}