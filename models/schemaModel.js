/*
* 源数据的model层
* @author mingyang
* @ since 2015-10-29
**/
var mysql =  require('../config/db');
var md5 = require('../public/helper/md5');
conn = new mysql('census');
function schemaModel (){}
module.exports = schemaModel;

schemaModel.prototype.saveSchema = function (params,callback){

	var code    = params.code;
	var data    = params.data;
	var op_user = params.op_user;
	var unix    = parseInt(new Date().getTime()/1000);
	var flagSql = "select * from shadow_schema where code = '"+code+"'"
	conn.query(flagSql,function(erro ,rows){
		if(!rows.length){
			var values =[code,data,op_user,unix]
			var insertSql = "insert into shadow_schema (code,data,op_user,unix) values(?,?,?,?)";
			conn.query(insertSql,values,function(erro) {
				if (erro) {
					console.log(erro);
				}else{
					callback("保存成功");
				}
			});
		}else{

			var values = [data,op_user,unix,code]
			var updateSql = "update shadow_schema set data=?,op_user=?,unix=? where code= ? "
			conn.query(updateSql,values,function(err){
				if (err) {
					console.log(err);
				}else{
					callback("保存成功");
				}
			})
			
		}
	})
}

schemaModel.prototype.getSchema = function (params,callback){
	var code = params.code;
	var sql = "select * from shadow_schema where code = '"+code+"'";
	conn.query(sql, function(error, rows){
		if(error){
			console.log(error)
		}else{
			if(rows.length){
				callback(rows[0].data)
			}else{
				callback(null);
			}
		}
	});
}

function getLocalTime(unix) {

	var date = new Date(parseInt(unix) * 1000);
	
    return date.Format("yyyy-MM-dd hh:mm:ss");
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
