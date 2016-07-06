/**
 * Created by shijianan on 2016/7/6.
 */


loginUser =function(userName,passwd){
    $.ajax({
        url:"/login",
        type:"GET",
        async: false,
        data:{
            userName : userName,
            passwd : passwd
        },
        dataType:"json",
        timeout:10000,
        success: function(d) {
            if(d.code == 200){
                if(d.data){
                    alert("成功");
                    document.location.href = '/main';
                }
            }else{
                return;
            }
            return d;
        },
        error:function(result) {
            alert("失败");
            return;
        }
    });

}
/**
 *  登陆
 */
$("#loginBtn").unbind('click').bind('click',function(){
    var userName = $("#userName").val();
    var userPsd = $("#userPsd").val();
    loginUser(userName,userPsd);

});


