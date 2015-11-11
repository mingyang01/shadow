var code = code;
var nowPage = '';
var first = 1;
//插件
$(".select2").select2();
$('.picker').datetimepicker({
	format: "YYYY-MM-DD HH:mm:SS"
})

//保存模板
$("#save-btn").click(function(){
	var start_time = $("#start_time").val();
	var end_time = $("#end_time").val();
	var params = {
		code : code,
		start_time : start_time,
		end_time : end_time
	}
	saveTemplateFun(params,true);
})

function saveTemplateFun(params,validate){
	if(validate){
		var compaer_start = parseInt(new Date(params.start_time).getTime()/1000);
		var compaer_end = parseInt(new Date(params.end_time).getTime()/1000);
		if(compaer_start > compaer_end){
			$('#sure-btn').hide();
			$('#comon-alert').modal('show');
			var html = "结束时间要大于开始时间哦！"
			$('#alert-message').html(html)
			return ;
		}
		if(!compaer_start||!compaer_end){
			$('#sure-btn').hide();
			$('#comon-alert').modal('show');
			var html = "时间必填哦！"
			$('#alert-message').html(html)
			return ;
		}
		var flag = false;
		checkTime(params.code,compaer_start,compaer_end,-1,function(data){
			(function(tmp){
				console.log('---'+data)
				flag = data;
			})(flag)
		})
		console.log('-'+flag)
		if(!flag){
			$('#sure-btn').hide();
			$('#comon-alert').modal('show');
			var html = "多期活动不能有交叉的时间哦！"
			$('#alert-message').html(html)
			return false;
		}
	}
	$.post('/template/saveTemplate', params, function(data) {
		if(data.succ==1){
			$('#sure-btn').show();
			$('#comon-alert').modal('show');
			var html = "添加成功"
			$('#alert-message').html(html)
		}else{
			alert(data.msg)
		}
	},'json');
}

//分页

var options = {
    totalPages: 1,
    visiblePages: 10,
    currentPage: 1,
    onPageChange: function (num, type) {
    	nowPage = num;
    	if(first==1){
    		getData(page,code);
    		first++;
    	}else{
    		getData(num,code);
    	}
        
    }
		
}
$.jqPaginator('#pagination1', options);
//添加模板
$("#add-btn").click(function(){
	if(multiple==1){
		var params = {
			code : code,
			start_time : 0,
			end_time : 0
		}
		saveTemplateFun(params,false);
	}else{
		$("#data-wramp").hide();
		$("#add-wramp").show();
	}
})
//关闭添加
$("#return-btn").click(function(){
	$("#data-wramp").show();
	$("#add-wramp").hide();
})
//搜索
$("#serch-btn").click(function(){
	code = $("#code-in").val();
	//getData(1,code);
	window.location = "/template/index?code="+code;
})

//展示数据

if(!flag||flag=='false'){
	$("#data-wramp").hide();
	$("#alert-wramp").show();
}
//获取数据
function getData(num,code){
	var page = parseInt(num) || 1;
	var code = code|| '';
	var params = {
		page : num,
		code : code
	}
	if(!flag||flag=='false'){
		$("#data-wramp").hide();
		$("#alert-wramp").show();
		return;
	}
	$.get('/template/getTemplate',params, function(data) {
		if(data.succ==1){
			$('#pagination1').jqPaginator('option', {
	        	totalPages:data.data.total,
	        	currentPage:page
	        });
			var tmp = data.data;
			var rows = tmp.rows;
			var html = '';
			var allHtml = [];
			for(items in rows){
				var item =rows[items];
				var sta = convertStatus(item.status,item.code,item._id);
				html = "<tr class='data-line'>"
				+"<td style='padding-left:30px;'>"+item.id+"</td>"
				+getEventType(item.start_time,item.end_time)
				+"<td>"+item.op_user+"</td><td>"+item.unix+"</td>"+sta+""
				+"<td>"+getPreBtn(item.is_test,item.code,item._id,item.pre_sta)+"</td>"
				+"<td class='text-center'>"
				+getBtnUpdate(item._id)
				+"<button data-toggle='tooltip' data-placement='top' title='删除' class='btn btn-danger btn-sm delete-btn' data-id="+item._id+" style='margin-right:10px;'><i class='glyphicon glyphicon-trash'></i></button>"
				+"<button data-toggle='tooltip' data-placement='right' title='查看' class='btn btn-primary btn-sm show-btn' data-code= "+item.code+" data-id="+item._id+" style='margin-right:10px;'><i class='glyphicon glyphicon-share'></i></button>"
				+"</td><tr>";
				allHtml.push(html)
			}
			$("#table").html(allHtml.join(" "));
			$("#data-wramp").show();
			$("#alert-wramp").hide();
			$(".show-num").html("共有 <i>"+data.data.num+"</i> 条数据")
      		$('[data-toggle="tooltip"]').tooltip()
		}else{
			if(!flag||flag=='false'){
				$("#data-wramp").hide();
				$("#alert-wramp").show();
			}else{
				$(".show-num").html("暂无数据，请添加")
				$("#data-wramp").show();
				$("#alert-wramp").hide();
			}
			
		}
	},'json');
}
//修改按钮转换

function getBtnUpdate(_id){
	if(multiple==1) {return '' }
	else{
		return "<button data-toggle='tooltip' data-placement='left' title='修改' class='btn btn-info btn-sm update-btn' data-id="+_id+" style='margin-right:10px;'><i class='glyphicon glyphicon-time'></i></button>"
	}
}

// 状态转换
function convertStatus(flag,code,_id){
	if(multiple==0) {return  }
	if(flag){
		return '<td><button data-code='+code+' data-id='+_id+' class="btn btn-success btn-sm activated" disabled>上线</button></td>';
	}else{
		return '<td><button data-code='+code+' data-id='+_id+' class="btn btn-warning btn-sm activated">下线</button></td>';
	}
}
//类型判断
function getEventType(start_time,end_time){
	if(multiple==1) {return ''}
	else{
		return "<td class='start_time'>"+start_time+"</td><td class='end_time'>"+end_time+"</td>";
	}
}
//状态转换
function getPreBtn(item,code,_id,status){
	if(status){
		return "<button data-code="+code+" data-id="+_id+" disabled class='btn btn-warning btn-sm setPreview'>预览中..</button>";
	}else{
		return "<button data-code="+code+" data-id="+_id+" class='btn btn-info btn-sm setPreview'>预览</button>";
	}
}

$("#table").on('change','.is_test-btn',function(){
	var _id = $(this).attr('data-id');
	var is_test = $(this).val();
	$.get('/template/chageQaStatus',{_id:_id,is_test:is_test}, function(data) {
		var msg = '';
		if(data.succ==1){
			
			msg = "更新成功";
			
		}else{
			msg = "遇到未知问题";
		}
		$('#comon-delete-alert').modal('show');
		$('#delete-message').html(msg)
	});
})
//激活上线状态
$("#table").on('click','.activated',function(){
	var code = $(this).attr('data-code');
	var _id = $(this).attr('data-id');
	var _this = $(this);
	$.get('/template/changeAllStatus',{code:code,status:0},function(data) {
		if(data.succ==1){
			$.get('/template/changeOneStatus',{id:_id}, function(data) {
				if(data.succ==1){
					$('.activated').each(function(){
						if($(this).hasClass("btn-success")){
							$(this).removeClass("btn-success").addClass("btn-warning").removeAttr('disabled').html("下线")
						}
					})	
					_this.removeClass("btn-warning").addClass("btn-success").html("上线").attr('disabled','disabled')
				}
			},'json');
		}
	},'json');
})


//预览状态
$("#table").on('click','.setPreview',function(){
	var code = $(this).attr('data-code');
	var _id = $(this).attr('data-id');
	var _this = $(this);
	var params = {_id:_id,code:code}
	$.get('/template/getPreview',params, function(data) {
		if(data.succ==0){
			$.post('/template/addPreview', {_id: _id}, function(data) {
				if(data.succ==1){
					$('.setPreview').removeAttr('disabled')
					_this.removeClass('btn-info').addClass('btn-warning').html('预览中').attr('disabled')
					alert("添加预览成功，请点击查看进行编辑")
				}
			},'json');
		}else{
			$("#preview-alert").show()
			var time = data.results.time;
			var timer = null;
			if(time>0){
				timer=setInterval(function(){
					var minute = Math.floor(time/60)+" 分 "+Math.floor(time%60)+" 秒 ";
					var html = data.results.user+" 正在预览，剩余时间为 " +minute
					$("#preview-alert").find('.alert').html(html)
					$('.setPreview').attr('disabled','disabled')
					time --;
					if(time<0){
						clearInterval(timer)
						$("#preview-alert").hide()
					}
				},1000)
			}else{
				clearInterval(timer)
				$('.setPreview').removeAttr('disabled')
				$("#preview-alert").hide()
			}
		}
	},'json');
	// $.get('/template/changeAllStatus',{code:code,status:0},function(data) {
	// 	if(data.succ==1){
			
	// 	}
	// },'json');
})

//查看详情
$("#table").on('click','.show-btn',function(){
	var code = $(this).attr('data-code');
	var _id = $(this).attr('data-id');
	window.location = "/template/show?_id="+_id+"&code="+code;
})
//删除按钮
$("#table").on('click','.delete-btn',function(){
	var _id = $(this).attr('data-id');
	$('#comon-delete-alert').modal('show');
	var html = "确定删除么"
	$('#delete-message').html(html)
	$('#delete-sure-btn').click(function(){
		$.get('/template/deleteTemplate',{_id:_id}, function(data) {
			if(data.succ==1){
				$('#comon-alert').modal('show');
				var html = data.data
				$('#alert-message').html(html)
			}else{
				alert(data.data)
			}
		},'json');
	})
})
//更新时间按钮
$("#table").on('click','.update-btn',function(){
	
	if($(this).hasClass('already-op')){
		var _id = $(this).attr('data-id');
		var start_time = $('.start_time_input').val()
		var end_time = $('.end_time_input').val()
		var params = {
			_id : _id,
			start_time : parseInt(new Date(start_time).getTime()/1000),
			end_time : parseInt(new Date(end_time).getTime()/1000)
		}
		var flag = false;
		checkTime(code,params.start_time,params.end_time,_id,function(data){
			(function(tmp){
				console.log('---'+data)
				flag = data;
			})(flag)
		})
		if(!flag){
			$('#sure-btn').hide();
			$('#comon-alert').modal('show');
			var html = "多期活动不能有交叉的时间哦！"
			$('#alert-message').html(html)
			return false;
		}
		if(params.start_time > params.end_time){
			$('#sure-btn').hide();
			$('#comon-alert').modal('show');
			var html = "结束时间要大于开始时间哦！";
			$('#alert-message').html(html)
			return;
		}
		$.get('/template/updateTime',params, function(data) {
			if(data.succ==1){
				$('#sure-btn').show();
				$('#comon-alert').modal('show');
				var html = "更新成功"
				$('#alert-message').html(html)
			}else{
				alert(data.msg)
			}
		},'json');
		return;
	}
	var obj = $(this).parent().parent();
	var start_time = obj.children('.start_time').html();
	var end_time = obj.children('.end_time').html();
	var html_start = "<div class='form-group has-success has-feedback'>"
					+"<input class='col-md-12 form-control picker start_time_input' value="+start_time+" aria-describedby='inputSuccess2Status'>"
					+"<span class='glyphicon glyphicon-ok form-control-feedback' aria-hidden='true'></span>"
  					+"<span id='inputSuccess2Status' class='sr-only'>(success)</span>"
					+"</div>";
	var html_end = "<div class='form-group has-success has-feedback'>"
					+"<input  class='col-md-12 form-control picker end_time_input' value="+end_time+">"
					+"<span class='glyphicon glyphicon-ok form-control-feedback' aria-hidden='true'></span>"
  					+"<span id='inputSuccess2Status' class='sr-only'>(success)</span>"
					+"</div>";
	obj.children('.start_time').html(html_start);
    obj.children('.end_time').html(html_end);
    $(this).addClass('already-op');
    $('.picker').datetimepicker({
		format: "YYYY-MM-DD HH:mm:SS"
	})
	$(this).removeClass('btn-info').addClass('btn-success')
	$(this).children('i').removeClass('glyphicon-time').addClass('glyphicon-floppy-save')
})

$('#power-btn').click(function(){
	var power = $("#power").val();
	var params = {
		code : code,
		power: power
	}
	$.get('/template/changePower', params,function(data) {
		if(data.succ==1){
			$('#comon-alert').modal('show');
			var html = "授权成功"
			$('#alert-message').html(html)
		}else{
			alert(data.msg)
		}
	},'json');
})

$('#sure-btn').click(function(){
	window.location.reload();
})

function checkTime (code,start_time,end_time,_id,cbs){
	var params = {
		code:code,
		start_time:start_time,
		end_time: end_time,
		_id:_id
	}
	$.ajaxSetup({ 
	    async : false 
	});
	$.get('/template/checkTime',params, function(data) {
		if(data.succ==1){
			if(data.checked==true){
				cbs(true)
			}else{
				cbs(false)
			}
		}
	});
}


