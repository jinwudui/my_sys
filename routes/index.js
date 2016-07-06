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
