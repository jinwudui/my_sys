/**
 * Created by shijianan on 2016/7/6.
 */
var express = require('express');
var router = express.Router();

var base = require('../lib/base');
var fs=require('fs');
var multiparty = require('multiparty');
var mql = require('../lib/mysql');
var async = require('async');

var fromQueryOrBody = base.fromQueryOrBody;

var idCardId=1;

router.get('/login', function(req, res, next) {

    var userName = fromQueryOrBody(req, 'userName') || '-';
    var passwd = fromQueryOrBody(req, 'passwd') || '-';
    async.waterfall([
        function (callback) {
            mql.loginUser('jing5', 'user',passwd, userName,function (err, result) {
                if (err) {
                    console.log('user :  loginUser err:%s',err);
                    return callback(err)
                }
                if(result){
                    console.log('user :  loginUser result:%s',result);
                }
                callback(null, result)
            })
        }
    ], function (err, result) {
        if (err) return res.json({status: -1, msg: err});
        res.json({code: 200, data: result});
    })

});

/**
 * 上传图片
 */
router.all('/rewardImg1', function(req, res, next) {
    var userName=fromQueryOrBody(req,'userName');
    var userId=fromQueryOrBody(req,'userId');
    userName=decodeURI(userName);
    userName+="_";
    userName+=userId;
        idCardId = 1;
    var ImgUrl='d:/my_sys_5/public/images/reward/';
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: ImgUrl});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);

        if(err){
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + filesTmp);
            var inputFile = files.filename[0];
            var uploadedPath = inputFile.path;
            var str='';
            str += idCardId;
            str +=".jpg";
            idCardId++;
            //var dstPath = ImgUrl + inputFile.originalFilename;
            var dstPath = ImgUrl + str;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function(err) {
                if(err){
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });
        }
        res.end();
    });
    res.json("ok");
});



router.all('/rewardImg2', function(req, res, next) {
    var userName=fromQueryOrBody(req,'userName');
    var userId=fromQueryOrBody(req,'userId');
    userName=decodeURI(userName);
    userName+="_";
    userName+=userId;
    idCardId = 2;
    var ImgUrl='d:/my_sys_5/public/images/reward/';
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: ImgUrl});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);

        if(err){
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + filesTmp);
            var inputFile = files.filename[0];
            var uploadedPath = inputFile.path;
            var str='';
            str += idCardId;
            str +=".jpg";
            idCardId++;
            //var dstPath = ImgUrl + inputFile.originalFilename;
            var dstPath = ImgUrl + str;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function(err) {
                if(err){
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });
        }
        res.end();
    });
    res.json("ok");
});


router.all('/rewardImg3', function(req, res, next) {
    var userName=fromQueryOrBody(req,'userName');
    var userId=fromQueryOrBody(req,'userId');
    userName=decodeURI(userName);
    userName+="_";
    userName+=userId;
    idCardId = 3;
    var ImgUrl='d:/my_sys_5/public/images/reward/';
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: ImgUrl});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);

        if(err){
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + filesTmp);
            var inputFile = files.filename[0];
            var uploadedPath = inputFile.path;
            var str='';
            str += idCardId;
            str +=".jpg";
            idCardId++;
            //var dstPath = ImgUrl + inputFile.originalFilename;
            var dstPath = ImgUrl + str;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function(err) {
                if(err){
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });
        }
        res.end();
    });
    res.json("ok");
});

router.all('/createReward', function (req, res, next) {
    var database = "jing5";
    var table = "setting";
    var name = fromQueryOrBody(req, 'name');
    var level = fromQueryOrBody(req, 'level');
    var num = fromQueryOrBody(req, 'num');
    var remark = fromQueryOrBody(req, 'remark');
    console.log('database:%s,table:%s,dataType:%s,sqlType:%s,data:%s',database,table);
    async.waterfall([
        function (callback) {
            mql.createReward(database, table,name,level,num,remark,function (err, result) {
                if (err) {
                    console.log('user :  createUsers err:%s',err);
                    return callback(err)
                }
                if(result){
                    console.log('user :  createUsers result:%s',result);
                }
                callback(null, result)
            })
        }
    ], function (err, result) {
        if (err) return res.json({status: -1, msg: err});
        res.json({code: 200, data: result});
    })
});


router.all('/getOwnerList', function (req, res, next) {
    async.waterfall([
        function (callback) {
            mql.getRewardList("jing5", "setting",function (err, result) {
                if (err) {
                    console.log('user :  createUsers err:%s',err);
                    return callback(err)
                }
                if(result.length > 0){
                    console.log('user :  createUsers result:%s',JSON.stringify(result));
                    for(var i = 0;i<result.length;i++){

                        result[i].reward_name=decodeURI(result[i].ownerHome);
                        result[i].remark=decodeURI(result[i].remark);
                    }

                }
                callback(null, result)
            })
        }
    ], function (err, result) {
        if (err) return res.json({status: -1, msg: err});
        res.json({code: 200, data: result});
    })
});


module.exports = router;
