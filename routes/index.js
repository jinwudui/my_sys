var express = require('express');
var router = express.Router();

var base = require('../lib/base');
var mql = require('../lib/mysql');
var async = require('async');

var fromQueryOrBody = base.fromQueryOrBody;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'login' });
});

/* GET home page. */
router.get('/main', function(req, res, next) {
  res.render('main', { title: 'main' });
});

router.get('/setting', function(req, res, next) {
  var render_date = {
    req:req
  };
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

            result[i].reward_name=decodeURI(result[i].reward_name);
            result[i].remark=decodeURI(result[i].remark);
          }
          render_date['map']=result;
        }
        callback(null, result)
      })
    }
  ], function (err, result) {
    if (err) return res.json({status: -1, msg: err});

    res.render('setting', render_date)
  })
});

/* GET home page. */
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


module.exports = router;
