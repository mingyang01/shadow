/*
* 源数据的model层
* @author mingyang
* @ since 2015-10-29
**/
var mysql =  require('../config/db');
var md5 = require('../public/helper/md5');
conn = new mysql('census');

module.exports = templateModel;
function templateModel (){}

templateModel.prototype.saveTemplate = function(params,cb) {

	var code =  params.code;
	var op_user =  params.op_user;
	var start_time=  get_unix_time(params.start_time);
	var end_time=  get_unix_time(params.end_time);
	var status =  params.status;
	var data =  "";
	var unix = parseInt(new Date().getTime()/1000);

	var values = [code,op_user,start_time,end_time,status,data,unix];
	var insertSql = "insert into shadow_template (code, op_user, start_time, end_time, status, data, unix) values(?,?,?,?,?,?,?)"
	conn.query(insertSql,values,function(err,rows){
		if(err){
			console.log(err)
		}else{
			cb({succ:1})
		}
	});
};

templateModel.prototype.getTemplate = function(params,cb) {
	var pase = params.page;
	var paseSize = 10;
	var offset = (pase-1)*paseSize;
	var condition = '';
	if(params.code){
		condition = " where code ='"+params.code+"' ";
	}
	var sql = "select t1.id,t2.template_id as pre_sta,t1.unix,t1.start_time,t1.end_time,t1.data,t1.code,t1.op_user,t1.is_test,t1.status from shadow_template t1 left join shadow_preview t2 on t1.id=t2.template_id  where t1.code ='"+params.code+"'  order by start_time desc limit "+offset+" ,"+paseSize;
	conn.query(sql , function(err,rows){
		if(err){
			console.log(err)
		}else{

			for(data in rows){
				rows[data]._id = rows[data].id;
				rows[data].unix = getLocalTime(rows[data].unix);
				rows[data].start_time = getLocalTime(rows[data].start_time);
				rows[data].end_time = getLocalTime(rows[data].end_time);
			}
			var totalSql = "select * from shadow_template "+condition;
			conn.query(totalSql,function(err,res){
				var total = Math.ceil(res.length/paseSize);
				var results = {
					rows : rows,
					total : total,
					num : res.length
				}
				if(rows&&rows.length>0){
					cb({succ:1,data:results});
				}else{
					results.msg = "请检出你的code";
					cb({succ:0,data:results});
				}
			})
			
		}
	})

};

function getPreviewByTemplateId(code){
	var sql = " select template_id from shadow_preview where code = '"+code+"' ";
	var tmp = function(res){
		console.log(1)
		return res;
	}
	conn.query(sql,function(err,rows){
		if(err){
			console.log(err)
		}else{
			var arr = [];
			for(data in rows){
				arr.push(rows[data].template_id)
			}
			
		}
	})
}

templateModel.prototype.updateByCondition = function(params,cb){
	var condition = '';
	var update = '';
	if(params.condition){
		condition = " where "+params.condition;
	}
	if(params.update){
		update = " set " +params.update;
	}
	var sql = " update shadow_template "+update+condition;
	conn.query(sql,function(err,rows){
		if(err){
			console.log(err)
		}else{
			cb({succ:1,rows:rows})
		}
	});
}

templateModel.prototype.updateTime = function(params,cb){
	var _id = params._id;
	var start_time = parseInt(params.start_time);
	var end_time = parseInt(params.end_time);
	var unix = parseInt(new Date().getTime()/1000);
	var op_user = params.op_user;
	var values = [start_time,end_time,unix,op_user,_id]
	var updateSql = " update shadow_template set  start_time = ? , end_time = ? ,unix = ? , op_user= ? where id=? " ;
	conn.query(updateSql,values,function(err,rows){
		if(err){
			console.log(err)
		}else{
			cb({succ:1,rows:rows})
		}
	})
}

templateModel.prototype.deleteTemplate = function(params,cb){
	var deletesql = "delete from shadow_template where id ="+params;	
	conn.query(deletesql,function(err,rows){
		if(err){
			console.log(err)
		}else{
			cb({succ:1,data:"删除成功"})
		}
	});
}

templateModel.prototype.findDataById = function(params,cb){
	var sql = "select * from shadow_template where id ="+params;
	conn.query(sql,function(err,rows){
		if(err){
			console.log(err)
		}else{
			if(rows[0].data){
				cb({succ:1,rows:rows[0].data})
			}else{
				cb({succ:0,rows:rows})
			}
			
		}
	});
}

templateModel.prototype.chageQaStatus = function(params,cb){
	var sql = "update  shadow_template set is_test =? where id =? ";
	var values = [params.is_test,params._id]
	conn.query(sql,values,function(err,rows){
		if(err){
			console.log(err)
		}else{
			if(rows){
				cb({succ:1,rows:rows})
			}else{
				cb({succ:0,rows:rows})
			}
			
		}
	});
}

templateModel.prototype.addPreview = function(params,cb){

	var unix = parseInt(new Date().getTime()/1000);
	var values = [params.code,params.id,params.data,params.op_user,unix,params.start_time,params.end_time]
	var insertSql = " insert shadow_preview (code,template_id,data,op_user,unix,start_time,end_time) values(?,?,?,?,?,?,?)"
	conn.query(insertSql,values,function(err,rows){
		if(err){
			cb({succ:0})
			console.log(err)
		}else{
			cb({succ:1,rows:rows})
		}
	})
}

templateModel.prototype.deletePreview = function(params,cbs){
	var sql = "select * from shadow_preview where code = '"+params.code+"'";
	conn.query(sql,function(err,rows){
		if(err){
			console.log(err)
		}else{
			if(rows.length){
				var sql = "delete from shadow_preview where code = '"+params.code+"'";
				conn.query(sql,function(err,rows){
					if(err){
						console.log(err)
						cbs({succ:0})
					}else{
						cbs({succ:1})
					}

				})
			}
		}
	})
}
templateModel.prototype.updatePreview = function(params,cb){
	var sql = "select * from shadow_preview where template_id = "+params.id;
	var unix = parseInt(new Date().getTime()/1000);
	conn.query(sql,function(err,rows){
		if(err){
			console.log(err)
		}else{
			if(rows.length){
				var values = [params.data,params.op_user,unix,params.id]
				var updateSql =  " update shadow_preview set data = ?,op_user=?,unix=? where  template_id = ?"
				conn.query(updateSql,values,function(err,rows){
					if(err){
						cb({succ:0})
						console.log(err)
					}else{
						cb({succ:1,rows:rows})
					}
				})
			}else{

			}
		}
	});
}

templateModel.prototype.getTemplateById = function(params,cb){
	var sql = " select * from shadow_template where id = "+params.id;
	conn.query(sql,function(err,rows){
		if(err){
			console.log(err)
			cb({succ:0})
		}else{
			cb({succ:1,rows:rows[0]})
		}
	})
}

templateModel.prototype.showPreview = function(params,cb){
	var sql = " select * from shadow_preview where template_id = "+params.id+" and code = '"+params.code+"'";
	conn.query(sql,function(err,rows){
		if(err){
			console.log(err)
			cb({succ:0})
		}else{
			cb({succ:1,rows:rows[0].data})
		}
	})
}

templateModel.prototype.checkTime = function(params,cb){
	var sql = "select * from shadow_template where code = '"+params.code+"'";
	conn.query(sql,function(err,rows){
		if(err){
			console.log(err)
			return cb({succ:0})
		}else{
			var start = params.start_time;
			var end = params.end_time;
			var event_time = [];
			var i = 0;

			for(data in rows){
				if(rows[data].id==params._id){
					console.log(rows[data].id)
					continue;
				}
				if((start>rows[data].start_time&&start<rows[data].end_time)||(end>rows[data].start_time&&end<rows[data].end_time)||(start<rows[data].start_time&&end>rows[data].start_time)||(start<rows[data].end_time&&end>rows[data].end_time)){
					return cb({succ:1,checked:false})
					break;
				}
			}
			return cb({succ:1,checked:true})
		}
	})
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

function get_unix_time(dateStr)
{
    var newstr = dateStr.replace(/-/g,'/'); 
    var date =  new Date(newstr); 
    var time_str = date.getTime().toString();
    return time_str.substr(0, 10);
}