(function ($) {

    $.fn.newTableAndPage = function(){
        var conf = {
            callback: undefined,
            newLine: undefined,
            data: undefined,//{"list":[],"success":true}
            colNum: 0,
            noDataMsg: undefined,
            errorMsg: '',
            listId: '',
            paginationId: '',
            removeEvents: undefined,
            paginationEvents: undefined,
            pageSize : 10
        };
        conf = $.extend(conf, arguments[0]);

        var callback = conf.callback;
        var data = conf.data;
        if(null == conf.listId || '' == conf.listId){
            conf.listId = "recordList";
        }
        var listObj = $(this).find("#"+conf.listId);
        var setMsg = function(content){
            listObj.html("");
            if(content != undefined){
                var msgHtml = "<tr id=\"msgTr\"><td style=\"text-align: center;\" colspan=\"" + conf.colNum + "\">" + content + "</td></tr>";
                listObj.append(msgHtml);
            }
        };
        var newLine = function(o){
            return conf.newLine(o);
        };
        if(data == undefined){
            setMsg('<div class="conloading"></div>');
        }
        else if(data != undefined && data.success == true){
            listObj.html('');
            var list = data.list || [];
            if(list.length > 0){
                //list data - [from, to)
                var fillTable = function(from, to){
                    listObj.html('');
                    to = (list.length > to ? to : list.length);
                    for(var i = from; i < to; i ++){
                        listObj.append(newLine(list[i]));
                    }
                };

                //list page
                var pagination = $('#' + conf.paginationId);
                var pageSize = conf.pageSize;
                var pageMin = 0;
                var pageMax = Math.floor((list.length - 1) / pageSize);
                pagination.attr('_size', pageSize).attr('_min', pageMin).attr('_max', pageMax).attr('_cur', 0);

                var renderPagination = function(cur){
                    cur = parseInt(cur);
                    cur = (cur < pageMin ? pageMin : cur);
                    cur = (cur > pageMax ? pageMax : cur);

                    var wing = 2;
                    var gap = 1;
                    var showLeftGap = (cur > (pageMin + wing + gap) ? true : false);
                    var showRightGap = (cur < (pageMax - wing - gap) ? true : false);
                    var gapHtml = '<span>…</span>';
                    var getPageNumElem = function(num, isCur, isLeftGap, isRightGap){
                        var curClass = isCur ? 'current' : '';

                        var leftGap = (isLeftGap ? '...' : '');
                        var rightGap = (isRightGap ? '...' : '');

                        var m ="";
                        if(isLeftGap){
                            m += '<span class="none">...</span>';
                        }
                        if(isCur){
                            m += '<span id="num" href="javascript:;" _page="' + num + '"   class="' + curClass + '" >' + (num + 1)  + '</span>';
                        }else{
                            m += '<a id="num" href="javascript:;" _page="' + num + '"  class="this_a">' + (num + 1)  + '</a>';
                        }

                        if(isRightGap){
                            m += '<span class="none">...</span>';
                        }
                        return m;
                    };
                    var html = '';
                    //上一页、下一页
                    html += '<a id="prev" class="prev" href="javascript:;" _page="' + (cur > pageMin ? cur - 1 : pageMin) + '">上一页</a>';
                        //'<a id="next" class="next" href="javascript:;" _page="' + (cur < pageMax ? cur + 1 : pageMax) + '">下一页&gt;</a>';
                    //页码选择区域
                    html += (cur > pageMin ? getPageNumElem(pageMin, false, false, showLeftGap) : '');
                    html += (cur == pageMin ? getPageNumElem(pageMin, true) : '');
                    for(var i = (cur - wing); i <= (cur + wing); i ++){
                        html += (i > pageMin && i < pageMax ? getPageNumElem(i, i == cur) : '');
                    }
                    html += (cur < pageMax ? getPageNumElem(pageMax, false, showRightGap, false) : '');
                    html += (cur == pageMax ? getPageNumElem(pageMax, true) : '');
                    //页码输入框
                    //html += '<input id="input" type="text" class="pageInput" />';
                    html +='<a id="next" class="next" href="javascript:;" _page="' + (cur < pageMax ? cur + 1 : pageMax) + '">下一页</a>';
                    pagination.html(html);

                    fillTable(cur * pageSize, (cur + 1) * pageSize);


                    pagination.find('#num[id=num]').unbind("click").bind("click", function(){
                        renderPagination($(this).attr('_page'));
                    });
                    pagination.find("#prev").unbind("click").bind("click", function(){
                        renderPagination($(this).attr('_page'));
                    });
                    pagination.find("#next").unbind("click").bind("click", function(){
                        renderPagination($(this).attr('_page'));
                    });
                    pagination.find("#input").unbind("keypress").bind("keypress", function(e){
                        if(e.keyCode == "13"){
                            var val = $(this).val();
                            if(val && !isNaN(val)){
                                val = parseInt(val) - 1;
                                renderPagination(val);
                            }
                            else{
                                $(this).val('');
                            }
                        }
                    });
                    $("a[id='vtdvId']").unbind('click').bind("click",function(e){
                        var id = $(this).attr("_val");
                        var url = $("#rootPathId").val();
                        window.open(url+'terminal?id='+id,'newwindou','height=500,width=800,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
                    });


                    if(conf.removeEvents){
                        conf.removeEvents();
                    }
                    if(conf.paginationEvents){
                        conf.paginationEvents();
                    }
                };

                pageMax > 0 ? pagination.show() : pagination.hide();
                renderPagination(pageMin)

            }
            else{
                setMsg(conf.noDataMsg);
            }
        }
        else{
            setMsg(conf.errorMsg);
        }
    };
})(jQuery);




utils = {
    baseUrl : ""
};
/**
 * 隐藏选择框
 * @param path
 */
utils.getHideBatch = function(path){
    $("#batch").hide();
    $(".batch").hide();
    $(".botDiv").hide();
}
utils.getUrl = function(path){
    return (utils.baseUrl || "") + path;
};
utils.ajax = function(url, type, data, dataType, timeout, successFunc, errorFunc){
    $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: dataType,
        timeout: timeout,
        success: function(content){
            successFunc(content);
        },
        error: function(content){
            errorFunc(content);
        }
    });
};
utils.ajaxAsyncFalse = function(url, type, data, dataType, timeout, successFunc, errorFunc){
    $.ajax({
        url: url,
        type: type,
        data: data,
        async:false,
        dataType: dataType,
        timeout: timeout,
        success: function(content){
            successFunc(content);
            //utils.getHideBatch();
        },
        error: function(content){
            errorFunc(content);
        }
    });
};
utils.getJson = function(path, data, successFunc, errorFunc){
    var baseUrl = (utils.baseUrl ? utils.baseUrl : '');
    var url = baseUrl + path;
    var type = "GET";
    var dataType = "json";
    var timeout = 100000;
    utils.ajax(url, type, data, dataType, timeout, successFunc, errorFunc);
};

utils.getJsonAsyncFalse = function(path, data, successFunc, errorFunc){
    var baseUrl = (utils.baseUrl ? utils.baseUrl : '');
    var url = baseUrl + path;
    var type = "GET";
    var dataType = "json";
    var timeout = 100000;
    utils.ajaxAsyncFalse(url, type, data, dataType, timeout, successFunc, errorFunc);
};

utils.postJson = function(path, data, successFunc, errorFunc){
    var baseUrl = (utils.baseUrl ? utils.baseUrl : '');
    var url = baseUrl + path;
    var type = "POST";
    var dataType = "json";
    var timeout = 100000;
    data._csrf=csrfVal;
    utils.ajax(url, type, data, dataType, timeout, successFunc, errorFunc);
};

utils.postSyncJsonFalse = function(path, data, successFunc, errorFunc){
    var baseUrl = (utils.baseUrl ? utils.baseUrl : '');
    var url = baseUrl + path;
    var type = "POST";
    var dataType = "json";
    var timeout = 100000;
    data._csrf=csrfVal;
    utils.ajaxAsyncFalse(url, type, data, dataType, timeout, successFunc, errorFunc);
};
utils.getSyncJson = function(path, data){
    var url = (utils.baseUrl ? utils.baseUrl : '') + path;
    var result = undefined;
    $.ajax({
        url: url,
        async:false,
        type: 'GET',
        data: data,
        dataType: 'json',
        timeout: 100000,
        success: function(content){
            result = content;
        },
        error: function(content){
            result = content;
        }
    });
    return result;
};

//长文本缩小还原组件 - 超过长度
$.fn.cutAndRevertStr = function(length){
    var txt = $(this).text();
    if(txt && txt.length > length){
        $(this).attr('_txt', txt);
        $(this).text($(this).attr('_txt').substr(0, length - 3) + '...');
        $(this).attr('_isCut', 'true');
        $(this).css('cursor', 'pointer');
        $(this).unbind("click").bind("click", function(){
            if($(this).attr('_isCut') == 'true'){
                $(this).text($(this).attr('_txt'));
                $(this).attr('_isCut', 'false');
            }
            else{
                $(this).text($(this).attr('_txt').substr(0, length - 3) + '...');
                $(this).attr('_isCut', 'true');
            }
        });

    }
};

//data数据格式：[{"name":"","data":[]},{"name":"","data":[]}]；xNames数据格式：["","",""]
utils.lineEchart = function(title,elem, title, chartData, xNames, name,max, type, lineCharName1, lineCharName2) {
    var myChart = echarts.init(document.getElementById(elem));
    var list = [];
    var list1 = [];

    // 判断类型是不是网络,网络的话有两个数组
    if (type != "network" && type != "disk") {
        list = utils.cleanNullInArray(chartData[0].data);
    } else {
        list = utils.cleanNullInArray(chartData[0].data);
        list1 = utils.cleanNullInArray(chartData[1].data);
    }
    // 对单个数据处理
    var dataCharts = [], dataCharts1 = [];
    var item = {};
    for (var i in list) {
        item = {
            value: list[i],
            time: xNames[i],
            symbol: 'emptyCircle',
            symbolSize: 4,
            itemStyle: {
                normal: {
                    color: '#bc74d3'
                }
            }
        }
        dataCharts.push(item);
    }
    for (var i in list1) {
        item = {
            value: list1[i],
            time: xNames[i],
            symbol: 'emptyCircle',
            symbolSize: 4,
            itemStyle: {
                normal: {
                    color: '#fed74c'
                }
            }
        }
        dataCharts1.push(item);
    }


    function getTime(xNames) {
        var num = 1;
        var timeArray = [];
        timeArray.push("");//0
        timeArray.push(xNames[1]);
        timeArray.push("");
        timeArray.push("");
        timeArray.push("");

        timeArray.push(xNames[5]);
        for (var i = 6; i <= xNames.length; i++) {
            num++;
            if (num < 6) {
                timeArray.push("");
            } else {
                timeArray.push(xNames[i]);
                num = 1;
            }
        }
        return timeArray;
    }

    var option = {
        title: {
            text: title,
            x: 'center',
            textStyle: {
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return "时间：" + params[5].time + '<br/>' + name+ "：" + params.value
            },
            backgroundColor: 'rgba(0,0,30,0.5)'
        },
        grid: {
            y2: 80
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: getTime(xNames),
                splitLine: {
                    show: false
                },
                axisLabel: {
                    interval: 0
                },
                axisLine: {    // 轴线
                    show: true,
                    lineStyle: {
                        color: '#c0c6ca',
                        width: 0
                    }
                },
                axisTick: {    // 刻度线
                    show: true,
                    lineStyle: {
                        color: '#c0c6ca',
                        width: 1
                    }
                }
            }
        ],
        yAxis: [
            {
                min: 0,
                max: max,
                title: {
                    text: ''
                },
                splitNumber: 4,
                axisLine: {    // 轴线
                    show: true,
                    lineStyle: {
                        color: '#c0c6ca',
                        width: 0
                    }
                }
            }
        ],
        series: [
            {
                type: 'line',
                symbol: 'emptyCircle',
                symbolSize: 4,
                itemStyle: {
                    normal: {
                        color: '#bc74d3'
                    }
                },
                data: dataCharts
            }
        ]
    };


    if (type == "network" || type == "disk") {
        var option = {
            title: {
                text: title,
                x: 'center',
                textStyle: {
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return "时间：" + params[5].time + '<br/>' + params[0] + "：" + params.value
                },
                backgroundColor: 'rgba(0,0,30,0.5)'
            },
            grid: {
                y2: 80
            },
            legend: {
                x:'left',
                data:[lineCharName1,lineCharName2]
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: getTime(xNames),
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0
                    },
                    axisLine: {    // 轴线
                        show: true,
                        lineStyle: {
                            color: '#c0c6ca',
                            width: 0
                        }
                    },
                    axisTick: {    // 轴线
                        show: true,
                        lineStyle: {
                            color: '#c0c6ca',
                            width: 1
                        }
                    }
                }
            ],
            yAxis: [
                {
                    min: 0,
                    title: {
                        text: ''
                    },
                    splitNumber: 4,
                    axisLine: {    // 轴线
                        show: true,
                        lineStyle: {
                            color: '#c0c6ca',
                            width: 0
                        }
                    }
                }
            ],
            series: [
                {
                    name: lineCharName1,
                    type: 'line',
                    symbol: 'emptyCircle',
                    symbolSize: 4,
                    itemStyle: {
                        normal: {
                            color: '#bc74d3'
                        }
                    },
                    data: dataCharts
                }, {
                    name: lineCharName2,
                    type: 'line',
                    symbol: 'emptyCircle',
                    symbolSize: 4,
                    itemStyle: {
                        normal: {
                            color: '#fed74c'
                        }
                    },
                    data: dataCharts1
                }
            ]
        };
    }
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    //document.getElementById("showMenu").addEventListener("resize", function () {
    //    myChart.resize();
    //});
    //document.getElementById("showMenu").addEventListener('click', function () {
    //
    //    myChart.resize();
    //});
}

//data数据格式：[{"name":"","data":[]},{"name":"","data":[]}]；xNames数据格式：["","",""]
utils.lineChart = function(elem, title, data, xNames, max, type){
    $(elem).highcharts({
        chart: {
            type: 'spline',
            zoomType: 'x'
        },
        title: {
            text: title
        },
        xAxis: {
            tickInterval: 5,
            categories: xNames
        },
        yAxis: {
            min: 0,
            max: max,
            title: {
                text: ''
            },
            labels : {
                distance: 1,
                formatter: function (){
                    if(type == 'network'){
                        return this.value;
                    }
                    else if(max && max == 100){
                        return this.value;// + ' %';
                    }
                    else if(max && max != 100){
                        return Math.ceil(this.value / 1024 / 1024) + ' GB';
                    }
                    else{
                        return this.value;
                    }
                }
            }
        },
        series: data,
        credits:{
            enabled: false
        },
//			legend: {
//				align: 'right',
//				verticalAlign: 'middle',
//				layout: 'vertical'
//			}
        legend: {enabled:false}
    });

};


/**
 * 长文本缩小还原组件 - 超过长度
 */

$.fn.cutAndRevertStr = function(length){
    var txt = $(this).text();
    if(txt && txt.length > length){
        $(this).attr('_txt', txt);
        $(this).text($(this).attr('_txt').substr(0, length - 3) + '...');
        $(this).attr('_isCut', 'true');
        $(this).css('cursor', 'pointer');
        $(this).unbind("click").bind("click", function(){
            if($(this).attr('_isCut') == 'true'){
                $(this).text($(this).attr('_txt'));
                $(this).attr('_isCut', 'false');
            }
            else{
                $(this).text($(this).attr('_txt').substr(0, length - 3) + '...');
                $(this).attr('_isCut', 'true');
            }
        });

    }
};

/**
 *
 * @param delete_div_id  放name的id
 * @param title - 标题
 * @param content content - 提示内容；
 * @param confirmData 点击“确认”的回调方法；
 * @param confirmFunc - 回调方法的回调数据
 * @param cancelFunc 点击“取消”的回调方法；
 */
utils.confirmDlg = function(delete_div_id,title, content, confirmData, confirmFunc, contentId){
    var con = content;
    var name = con.split("：");
    if(name.length>1){
        if(name[1].length>15){
            con = name[0]+"："+name[1].substring(0,15)+"...";
        }
    }
    con +=" ？";
    $("#"+delete_div_id).html(con);

    // 打开提示框content（默认.deleteTips）
    var content_div = ".deleteTips";
    if (null != contentId && "" != contentId && undefined != contentId) {
        content_div = "#" + contentId;
    }
    layer.open({
        title: title,
        type: 1,
        content: $(content_div),
        area: '460px',
        btn: ['确定', '取消'],
        yes: function(index, layero){
            layer.close(index);
            $("#loadingId").show();
            confirmFunc(confirmData);
        },cancel: function(index){
            $("#loadingId").hide();
            layer.close(index);
        }
    });
};

/**
 * 批量删除提示框
 * @param delete_div_id  放name的id
 * @param title - 标题
 * @param tishi - 提示文字
 * @param content content - 提示内容；  格式 ： 确认删除云主机：name1#name2#name#
 * @param confirmData 点击“确认”的回调方法；
 * @param confirmFunc - 回调方法的回调数据
 * @param cancelFunc 点击“取消”的回调方法；
 */
utils.confirmDlgs = function(delete_div_id,title, tishi,content, confirmData, confirmFunc, contentId){
    var con="";
    if(content.length>0 && content.length <=1) {
        con+=tishi+"：";
        var this_cont = content[0];
        if(content[0].length>15){
            this_cont = this_cont.substring(0,10)+"...";
        }
        con +="<lable title='"+content[i]+"'>"+this_cont+"</lable>";
        con +=" ？";
    } else if(content.length>1){
        con+=tishi+"：</br>";
        for(var i=0;i<content.length;i++){
            var this_cont = content[i];
            if(content[i].length>15){
                this_cont = this_cont.substring(0,10)+"...";
            }
            con +="<lable title='"+content[i]+"'>"+this_cont+"</lable>; &nbsp;&nbsp;&nbsp;";
            if((i+1)%2 == 0){
                con +="</br>";
            }
        }
    }
    $("#"+delete_div_id).html(con);
    // 打开提示框content（默认.deleteTips）
    var content_div = ".deleteTips";
    if (null != contentId && "" != contentId && undefined != contentId) {
        content_div = "#" + contentId;
    }
    layer.open({
        title: title,
        type: 1,
        content: $(content_div),
        area: '460px',
        btn: ['确定', '取消'],
        yes: function(index, layero){
            layer.close(index);
            $("#loadingId").hide();
            confirmFunc(confirmData);
        },cancel: function(index){
            $("#loadingId").hide();
            layer.close(index);
        }
    });
};

/**
 * 删除提示
 * @param delete_div_id  放div的id
 * @param delete_name_id  放name的id
 * @param title - 标题
 * @param content content - 提示内容；
 * @param confirmData 点击“确认”的回调方法；
 * @param confirmFunc - 回调方法的回调数据
 * @param cancelFunc 点击“取消”的回调方法；
 */
utils.deletecConfirmDlg = function(delete_div_id,delete_name_id,title, content, confirmData, confirmFunc){
    $("#loadingId").show();
    var con = content;
    var name = con.split("：");
    if(name.length>1){
        if(name[1].length>15){
            con = name[0]+"："+name[1].substring(0,15)+"...";
        }
    }
    con +=" ？";
    $("#"+delete_name_id).html(con);
    layer.open({
        title: title,
        type: 1,
        shade: false,
        content: $('#'+delete_div_id),
        area: '460px',
        btn: ['确定', '取消'],
        yes: function(index, layero){
            //按钮【按钮一】的回调
            layer.close(index);
            $("#loadingId").hide();
            confirmFunc(confirmData);
        },cancel: function(index){
            layer.close(index);
            $("#loadingId").hide();
        }
    });
};



utils.confirmDlgUnBind = function(delete_div_id,title, content, confirmData, confirmFunc){
  //  $("#loadingId").show();
    var con = content;
    var name = con.split("：");
    if(name.length>1){
        if(name[1].length>15){
            con = name[0]+"："+name[1].substring(0,15)+"...";
        }
    }
    con +=" ？";
    $("#"+delete_div_id).html(con);
    layer.open({
        title: title,
        type: 1,
        content: $('.unbindIP'),
        area: '460px',
        btn: ['确定', '取消'],
        yes: function(index, layero){
            //按钮【按钮一】的回调
            layer.close(index);
            $("#loadingId").show();
            confirmFunc(confirmData);
        },cancel: function(index){
            layer.close(index);
        //    $("#loadingId").hide();
            return;
        }
    });
};

/**
 * 提示
 * @param title
 * @param content
 */
utils.showTextTips= function(title,textTipsTitle,content){
    $("#textTipsTitle").text(textTipsTitle);
    $("#textTipsContent").text(content);
    layer.open({
        title: title,
        type: 1,
        content: $('#showTips'),
        area: '515px',
        btn: ['确定'],
        yes: function(index, layero){
            //按钮【按钮一】的回调
            layer.close(index);
        }
    });
}
//清理数组里面的null元素
utils.cleanNullInArray = function(arr){
    if(!arr){
        return arr;
    }
    var newArr = [];
    for(var i in arr){
        if(arr[i] != null){
            newArr.push(arr[i]);
        }
    }
    return newArr;
};

utils.solidGauge = function(elem, min, max, current){
    $(elem).highcharts({
        chart : {
            type : 'solidgauge',
            backgroundColor:null
        },
        title : null,
        pane : {
            center : [ '50%', '100%' ],
            size : '150%',
            startAngle : -90,
            endAngle : 90,
            background : {
                backgroundColor : '#EEE',
                innerRadius : '50%',
                outerRadius : '100%',
                shape : 'arc'
            }
        },
        yAxis : {
            stops : [[0.1, '#55BF3B'], [0.8, '#DDDF0D'], [0.9, '#DF5353']],
            lineWidth : 0,
            minorTickInterval : null,
            tickPixelInterval : 400,
            tickWidth : 0,
            title : {
                enabled : false
            },
            labels : {
                enabled : false
            },
            min : min,
            max : max
        },
        plotOptions : {
            solidgauge : {
                dataLabels : {
                    y : 9,
                    borderWidth : 0,
                    useHTML : true
                }
            }
        },
        credits : {
            enabled : false
        },
        tooltip : {
            enabled : false
        },
        series : [{
            name : ' ',
            data : [current],
            innerRadius : '50%',
            dataLabels : {
                format : '<span style="font-size:8px;font-weight: normal;color:black;">{y}</span>'
            },
            tooltip : {
                valueSuffix : ' ',
                enabled : false
            }
        }]
    });
};
//判断cidr是否合法
utils.isValidCidr = function(cidr){
    var cid = cidr.split("/");
    if(cid.length ==1 && /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g.test(cidr)){
        if(RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256){
            return true;
        }
    }else if(cid.length >1&&/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/g.test(cidr)){
        if(RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256 && RegExp.$5 <= 32){
            return true;
        }
    }
    return false;
};
//判断ports是否合法
utils.isValidPorts2 = function(ports){
    var valid = false;
    var val = parseInt(ports);
    if(val >= 0 && val <= 65535){
        valid = true;
    }
    return valid;
};

//判断ports是否合法
utils.isValidPorts = function(ports, customValid){
    var valid = false;
    var val = parseInt(ports);
    if(isNaN(ports)){
        var arr = ports.split('-');
        if(customValid){
            if(arr.length == 2 && !isNaN(arr[0]) && !isNaN(arr[1]) &&
                parseInt(arr[0]) >= 49152 && parseInt(arr[0]) <= 65535 &&
                parseInt(arr[1]) >= 49152 && parseInt(arr[1]) <= 65535){
                valid = true;
            }
        }
        else if(arr.length == 2 && !isNaN(arr[0]) && !isNaN(arr[1]) &&
            parseInt(arr[0]) >= 0 && parseInt(arr[0]) <= 65535 &&
            parseInt(arr[1]) >= 0 && parseInt(arr[1]) <= 65535){
            valid = true;
        }
    }
    else if(customValid){
        valid = (val == 80 || (val >= 49152 && val <=65535)) ? true : false;
    }
    else if(val >= 0 && val <= 65535){
        valid = true;
    }
    return valid;
};


/**
 * 修改校验 名称
 * @returns {boolean}
 */
utils.onblurDetailName = function(name) {
    if (typeof(name) == undefined || name == '') {
        showTextTips("提示", "名称不能为空");
        return false;
    }
    if (name && name.length > 32) {
        showTextTips("提示", "名称长度不能超过32个字符");
        return false;
    }
    if ( !(/^([a-zA-Z0-9\_]|[\u4e00-\u9fa5]){1,32}$/.test(name))) {
        showTextTips("提示", "名称不可为空，只支持中文、数字、大小写字母及英文下划线“_”，且不能超过32字符");
        return false;
    }else{
        return true;
    }
}


/**
 * 修改校验 描述
 * @returns {boolean}
 */
utils.onblurDetailDesc = function(desc) {
    if (desc && desc.length > 32) {
        showTextTips("提示", "长度不能超过32个字符");
        return false;
    }
    if (!(/^([a-zA-Z0-9\_]|[\u4e00-\u9fa5]){1,32}$/.test(desc)) && desc != "") {
        showTextTips("提示", "描述只支持中文、数字、大小写字母及英文下划线“_”，且不能超过32字符");
        return false;
    }
    else{
        return true;
    }
}


/**
 * 中文转Unicode
 * @param str
 * @returns {string}
 */
utils.toUnicode= function(str){
    var temp,
        i = 0,
        r = '',
        len = str.length;

    for (; i < len; i++) {
        temp = str.charCodeAt(i).toString(16);

        while ( temp.length < 4 )
            temp = '0' + temp;

        r += '\\u' + temp;
    }

    return r;
}
/**
 * Unicode转中文
 * @param un
 * @returns {*|string|Object}
 */
utils.unicodeToStr= function(un){
    var str = eval("'" + un + "'");
    return str;
}