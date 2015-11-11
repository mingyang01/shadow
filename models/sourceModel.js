/*
* 源数据的model层
* @author mingyang
* @ since 2015-10-29
**/
var mysql =  require('../config/db');
var md5 = require('../public/helper/md5');
conn = new mysql('census');
module.exports = sourceModel;
function sourceModel(){
	
}

sourceModel.prototype.getSource = function (params,callback){
	var sql = "select * from shadow_source order by unix desc";
	var pasesize = 10;
	var offset = (params.page-1)*pasesize;
	var condition = '';
	if(params.condition!=1){
		condition = " where name like '%"+params.condition+"%' ";
	}
	console.log(condition)
	conn.query(sql,function(err, rows){
		var total = Math.ceil(rows.length/pasesize);
		var sql = "select * from shadow_source "+condition+" order by unix desc limit "+offset+","+pasesize;
		conn.query(sql,function(err, rows){
			for(data in rows){
				rows[data].unix = getLocalTime(rows[data].unix);
				rows[data].power_show = powerShow(rows[data].power)
			}
			var results = {
				rows:rows,
				total:total
			}
			callback(results);
		});
	});
}

sourceModel.prototype.saveSource = function (params,callback){
	var values = [];
	var md5data = new Date().getTime()+parseInt(Math.random()*10000)
	var name    = params.name;
	var code    = md5(JSON.stringify(md5data));
	var description    = params.desc;
	var op_user = params.op_user;
	var data    = params.data;
	var power    = params.power;
	var power    = params.power;
	var multiple    = params.multiple;
	var unix    = parseInt(new Date().getTime()/1000);
	var flagSql = "select * from shadow_source where name = '"+name+"' and code <> '"+params.code+"'";
	if(parseInt(params.code)==1){
		values.push(name);
		values.push(code);
		values.push(description);
		values.push(op_user);
		values.push(data);
		values.push(power);
		values.push(unix);
		values.push(multiple);
		conn.query(flagSql,function(erro,rows){
			if(erro){
				callback(name+" 已经存在");
				console.log(erro)
			}else{
				if(!rows.length){
					var sql = "insert into shadow_source (name,code,description,op_user,data,power,unix,multiple) values(?,?,?,?,?,?,?,?)";
					conn.query(sql,values,function(err, rows){
						callback("添加成功");
					});
				}else{
					return callback(name+" 已经存在");
				}
			}
		})
		
	}else{
		values.push(name);
		values.push(description);
		values.push(op_user);
		values.push(data);
		values.push(power);
		values.push(unix);
		values.push(params.code);
		conn.query(flagSql,function(erro,rows){
			if(erro){
				callback(name+" 已经存在");
				console.log(erro)
			}else{
				if(!rows.length){
					var sql = "update shadow_source set name=? ,description=? ,op_user=? ,data=? ,power=?,unix=? where code= ?";
					conn.query(sql,values,function(err, rows){
						if(err){
							console.log(err)
						}else{
							callback("修改成功");
						}
					});
				}else{
					callback(name+" 已经存在");
				}
			}
		})

	}
}


sourceModel.prototype.getAllSource = function (callback){
	var sql = "select * from shadow_source";
	conn.query(sql,function(erro ,rows){
		if(erro){
			console.log(erro);
		}else{
			callback(rows)
		}
	})
}

sourceModel.prototype.deleteSource = function (params ,callback){
	var value = [params.code];
	var sql = "delete from shadow_source where code = ?";
	conn.query(sql,value,function(erro ,rows){
		if(erro){
			console.log(erro)
		}else{
			callback("删除成功")
		}
	})
	
}

sourceModel.prototype.saveJson = function (params,callback){
	var code = params.code;
	var json = params.json;
	var values = [json,code];
	var sql = "update  shadow_source set data = ? where code=? ";
	conn.query(sql,values,function(err, rows){
		callback("update success");
	});
}

sourceModel.prototype.getJson = function (params,callback){
	var code = params.code;
	var values = [code];
	var sql = "select data from  shadow_source where code=? ";
	conn.query(sql,values,function(err, rows){
		if(err){
			console.log(err)
		}else{
			callback(rows[0].data);
		}
	});
}

sourceModel.prototype.updatePower = function (params,callback){
	
	var values = [params.power,params.code];
	var sql = "update shadow_source set power=? where code =?";
	conn.query(sql ,values ,function(erro,rows){
		if(erro){
			callback({succ:0,msg:"更新失败"});
			console.log(erro);
		}else{
			callback({succ:1,msg:"更新成功"});
		}
	});
}

sourceModel.prototype.getSourceByCondition = function (params,callback){
	var code = params.code;
	var condition = '';
	if(code){
		condition = "where code = '"+code+"'";
	}
	var sql = "select * from shadow_source "+condition;
	conn.query(sql,function(erro,rows){
		if(erro){
			console.log(erro)
		}else{
			callback(rows[0])
		}
	})
}

function powerShow(str){
	if(!str) return '';
	var arr = str.split(',')
	if(arr.length>2){
		return arr[0]+","+arr[1]+"...";
	}else{
		return str;
	}
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
