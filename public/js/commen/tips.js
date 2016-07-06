/**
 * Created by shijianan on 2016/3/29.
 */

function showTextTips(title, content) {
    $("#textTipsContent").html(content);
    layer.open({
        title: title,
        type: 1,
        shade: [0.3, "#000"],
        content: $('#showTips'),
        area: '460px',
        btn: ['确定'],
        yes: function (index, layero) {
            layer.close(index);
        }
    });
}
//无阴影提示
function showTextTips2(title, content) {
    $("#textTipsContent").html(content);
    layer.open({
        title: title,
        type: 1,
        shade: false,
        content: $('#showTips'),
        area: '460px',
        btn: ['确定'],
        yes: function (index, layero) {
            layer.close(index);
        }
    });
}

function showTextTips1(title, content,url) {
    $("#textTipsContent1").html(content);
    layer.open({
        title: title,
        type: 1,
        shade: [0.3, "#000"],
        content: $('#showTips1'),
        area: '460px',
        btn: ['确定'],
        yes: function (index, layero) {
            document.location.href = url;
            layer.close(index);
        }
    });
}

function showTextTips3(title, content) {
    $("#textTipsContent1").html(content);
    layer.open({
        title: title,
        type: 1,
        shade: false,
        content: $('#showTips1'),
        area: '460px',
        btn: ['确定'],
        yes: function (index, layero) {
            layer.close(index);
        }
    });
}

