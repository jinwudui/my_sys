/**
 * Created by shijianan on 2016/7/6.
 */
var mysql  = require('mysql');

/**
 * ÓÃ»§µÇÂ¼
 * @param database
 * @param table
 * @param passwd
 * @param uersName
 * @param cb
 */
exports.loginUser = function(database,table,passwd,uersName,cb) {
    var connection = mysql.createConnection({
        host     : '127.0.0.1',
        user     : 'root',
        password : 's6880748',
        port: '3306',
        database: database,
    });

    connection.connect();

    var  userGetSql = 'SELECT * FROM '+table+' WHERE username="'+uersName+'" and password="'+passwd+'" ';
    console.log(userGetSql);
    var flag = 0;
    connection.query(userGetSql,function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ',err.message);
            return cb(err);
        }
        console.log('---------------SELECT----------------');

        if(result.length > 0){
            flag = 1;
        }
        //result[0].flag = flag;
        console.log(flag);
        console.log(result);
        cb(null,result);
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    })
    connection.end();
};


exports.createReward = function(database,table,name,level,num,remark,cb) {
    var connection = mysql.createConnection({
        host     : '127.0.0.1',
        user     : 'root',
        password : 's6880748',
        port: '3306',
        database: database
    });

    connection.connect();
    //var  userAddSql = 'INSERT INTO node_user(id,name,age) VALUES(0,?,?)';
    var  userAddSql = 'UPDATE '+table+' SET reward_name = ?,num = ?,remark = ? WHERE prize_level = ?';
    console.log('userAddSql:%s',userAddSql);
    var  userAddSql_Params = [name,num,remark,level];
    console.log('userAddSql_Params:%s',userAddSql_Params);
    connection.query(userAddSql,userAddSql_Params,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return cb(err);
        }
        console.log('-------INSERT----------');
        //console.log('INSERT ID:',result.insertId);
        console.log('INSERT ID:',result);
        cb(null,result);
        console.log('#######################');
    });
    connection.end();
};

exports.getRewardList = function(database,table,cb) {
    var connection = mysql.createConnection({
        host     : '127.0.0.1',
        user     : 'root',
        password : 's6880748',
        port: '3306',
        database: database
    });

    connection.connect();

    var  userGetSql = 'SELECT * FROM '+table+' ';
    console.log(userGetSql);
    var flag = 0;
    connection.query(userGetSql,function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ',err.message);
            return cb(err);
        }
        console.log('---------------SELECT----------------');

        if(result.length > 0){
            flag = 1;
        }
        console.log(flag);
        console.log(result);
        cb(null,result);
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    })
    connection.end();
};