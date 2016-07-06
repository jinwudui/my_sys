/**
 * Created by shijianan on 2016/7/7.
 */
createUser = function(database,table,name,level,num,remark){
    $.ajax({
        url:"/mql/createReward",
        type:"POST",
        async: false,
        data:{
            database : database,
            table : table,
            name : name,
            level:level,
            num:num,
            remark:remark
        },
        dataType:"json",
        timeout:10000,
        success: function(d) {
            if(d.code == 200){
                //var userName = name;
                //var userId= d.data.insertId;
                //var url ='/?userName='+userName+'&userId='+userId;
                showTextTips3("提示","保存成功");
            }else{
                //showTextTips("提示","注册失败");
                return;
            }
            return d;
        },
        error:function(result) {
            //showTextTips("提示","注册失败");
            return;
        }
    });

}


createNewUser = function(level,name,num,remark){

    var level = level;


    createUser("realspace","users",name,level,num,remark);
}


$("#save1").unbind('click').bind('click',function(){
    var name = $("#rname1").val();
    var num = $("#rnum1").val();
    var rmark = $("#rmark1").val();

    createNewUser("1",name,num,rmark);
    $("#firstPrize").hide();
    $("#secondPrize").show();
    $("#thirdPrize").hide();
});

$("#save2").unbind('click').bind('click',function(){
    var name = $("#rname2").val();
    var num = $("#rnum2").val();
    var rmark = $("#rmark2").val();

    createNewUser("2",name,num,rmark);
    $("#firstPrize").hide();
    $("#secondPrize").hide();
    $("#thirdPrize").show();
});


$("#save3").unbind('click').bind('click',function(){
    var name = $("#rname3").val();
    var num = $("#rnum3").val();
    var rmark = $("#rmark3").val();

    createNewUser("3",name,num,rmark);
    document.location.href = '/main';
});


$("#goBack").unbind('click').bind('click',function(){
    document.location.href = '/main';
});
$("#goBack1").unbind('click').bind('click',function(){
    $("#firstPrize").show();
    $("#secondPrize").hide();
    $("#thirdPrize").hide();
});
$("#goBack2").unbind('click').bind('click',function(){
    $("#firstPrize").hide();
    $("#secondPrize").show();
    $("#thirdPrize").hide();
});

