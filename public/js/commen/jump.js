/**
 * Created by shijianan on 2016/7/6.
 */

$(function(){
    layer.config({
        extend: ['skin/moon/style.css'], //加载新皮肤
        skin: 'layer-ext-moon' //一旦设定，所有弹层风格都采用此主题。
    });
});

$("#wechatJump").unbind('click').bind('click',function(){

    layer.open({
        title: "扫描二维码参加抽奖！！",
        type: 1,
        shade: false,
        content: $('#showTips2'),
        area: '460px',
        btn: ['确定'],
        yes: function (index, layero) {
            layer.close(index);
        }
    });
})

$("#settingBtn").unbind('click').bind('click',function(){
    document.location.href = '/setting';
});