(function ($) {
    $.fn.TableAndPageAndUrl = function(){
        var conf = {
            callback: undefined,
            newLine: undefined,
            data: undefined,//{"list":[],"success":true}
            colNum: 0,
            noDataMsg: undefined,
            errorMsg: '',
            listId: '',
            paginationId: '',
            paginationEvents: undefined,
            removeEvents: undefined,
            pageClickFun:undefined,
            pageClickFun2:undefined,
            nowPage:-1,
            total:0,
            nowPageNumStart:0,
            pageSize : 10
        };
        conf = $.extend(conf, arguments[0]);

        var data = conf.data;
        if(null == conf.listId || '' == conf.listId){
            conf.listId = "recordList";
        }
        var listObj = $(this).find("#"+conf.listId);
        var setMsg = function(content){
            listObj.html("");
            if(content != undefined){
                var msgHtml = "<tr id=\"msgTr\"><td colspan=\"" + conf.colNum + "\">" + content + "</td></tr>";
                listObj.append(msgHtml);
            }
        };
        var newLine = function(o){
            return conf.newLine(o);
        };
        if(data == undefined){
            setMsg('<div class="conloading"></div>');
            $("#"+conf.paginationId).html("");
        } else if(data != undefined && data.success == true){
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
                fillTable(0,list.length);
                //pageMax > 0 ? pagination.show() : pagination.hide();
                //renderPagination(pageMin)
            } else{
                $("#"+conf.paginationId).html("");
                setMsg(conf.noDataMsg);
            }

            if(conf.removeEvents){
                conf.removeEvents();
            }
            if(conf.paginationEvents){
                conf.paginationEvents();
            }

            if(conf.total>0){
                //list page
                var pagination = $('#' + conf.paginationId);
                var pageSize = conf.pageSize;
                var nowPageNumStart =  conf.nowPageNumStart;
                var pageMin = 0;
                var nowPage = nowPageNumStart/pageSize;
                if( -1!=conf.nowPage && null !=conf.nowPage){
                    nowPage = conf.nowPage;
                }
                var pageMax = Math.floor((conf.total - 1) / pageSize);
                pagination.attr('_size', pageSize).attr('_min', pageMin).attr('_max', pageMax).attr('_cur', 0);

                //cur是当前页
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
                            m += '<span id="num" href="javascript:;" _page="' + num + '"    class="' + curClass + '" >' + (num + 1)  + '</span>';
                        }else{
                            m += '<a id="num" href="javascript:;" _page="' + num + '"   class="this_a">' + (num + 1)  + '</a>';
                        }

                        if(isRightGap){
                            m += '<span class="none">...</span>';
                        }
                        return m;
                    };
                    var html = '';
                    //上一页、下一页
                    html += '<a id="prev" class="prev" href="javascript:;" _page="' + (cur > pageMin ? cur - 1 : pageMin) + '">上一页</a>';
                    //页码选择区域
                    html += (cur > pageMin ? getPageNumElem(pageMin, false, false, showLeftGap) : '');
                    html += (cur == pageMin ? getPageNumElem(pageMin, true) : '');
                    for(var i = (cur - wing); i <= (cur + wing); i ++){
                        html += (i > pageMin && i < pageMax ? getPageNumElem(i, i == cur) : '');
                    }
                    html += (cur < pageMax ? getPageNumElem(pageMax, false, showRightGap, false) : '');
                    html += (cur == pageMax ? getPageNumElem(pageMax, true) : '');
                    //页码输入框
                    html +='<a id="next" class="next" href="javascript:;" _page="' + (cur < pageMax ? cur + 1 : pageMax) + '">下一页</a>';
                    pagination.html(html);



                    //renderPagination(nowPageNumStart);
                    pagination.find('#num[id=num]').unbind("click").bind("click", function(){
                        if(conf.pageClickFun &&-1==conf.nowPage){
                            conf.pageClickFun($(this).attr('_page') * pageSize, pageSize);
                        }else{
                            conf.pageClickFun($(this).attr('_page'), pageSize);
                        }
                        if(conf.pageClickFun2){
                            conf.pageClickFun2();
                        }

                    });
                    pagination.find("#prev").unbind("click").bind("click", function(){
                        if(conf.pageClickFun &&-1==conf.nowPage){
                            conf.pageClickFun($(this).attr('_page') * pageSize, pageSize);
                        }else{
                            conf.pageClickFun($(this).attr('_page'), pageSize);
                        }
                        if(conf.pageClickFun2){
                            conf.pageClickFun2();
                        }
                    });
                    pagination.find("#next").unbind("click").bind("click", function(){
                        if(conf.pageClickFun &&-1==conf.nowPage){
                            conf.pageClickFun($(this).attr('_page') * pageSize, pageSize);
                        }else{
                            conf.pageClickFun($(this).attr('_page'), pageSize);
                        }

                        if(conf.pageClickFun2){
                            conf.pageClickFun2();
                        }

                    });
                };

                pageMax > 0 ? pagination.show() : pagination.hide();
                renderPagination(nowPage)
            }
        }
        else{
            $("#"+conf.paginationId).html("");
            setMsg(conf.errorMsg);
        }
    };
})(jQuery);
