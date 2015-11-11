var schema = ace.edit("editor");
//schema.setTheme("ace/theme/clouds");//clouds
schema.getSession().setMode("ace/mode/json");

var starting = {
    "title":"这是一个json例子",
    "name": "John Smith",
    "age": 35,
    "gender": "male"
};

schema.setValue(JSON.stringify(starting,null,4));
schema.gotoLine(0);

//新增
$("#add-btn").click(function(){
	$("#myModal").find('input').val('');
	$("#data_id").val(1);
})
$("#save-btn").click(function(){
	$("#switch-state").bootstrapSwitch('readonly',false)
	var mulFlag = $("#switch-state").bootstrapSwitch('state');
	var multiple = mulFlag?1:0;
	var desc = $("#desc").val();
	var name = $("#name").val();
	var power = $("#power").val();
	var code = $("#data_id").val();
	var url = "/source/saveSource";
	var data = schema.getValue();
	var params = {power:power,desc:desc,name:name,data:data,code:code,multiple:multiple}
	if(name&&desc){
		$('#myModal').modal('hide')
		$.post(url,params,function(data){
			var page = 1;
			$('#comon-alert').modal('show');
			var html = data.data
			$('#alert-message').html(html)
			
		},'json');
	}else{
		$('#comon-alert').modal('show');
		var html = "名称，描述和操作人都不能为空!"
		$('#alert-message').html(html)
	}
});
//分页
var total = (parseInt(total)==0)?1:parseInt(total);
var nowPage = parseInt(page);
var options = {
	    totalPages: total,
	    visiblePages: 10,
	    currentPage: 1,
	    onPageChange: function (num, type) {
	        $('#p1').text(type + '：' + num);
	    }
    }
$.jqPaginator('#pagination1', options);
$('#pagination1').jqPaginator('option',{
	currentPage: nowPage
})
$('#pagination1').on('click','li',function(){
	var page = $(this).find('a').html();
	var flag = $(this).hasClass('disabled');

	if(page=='Next'&&!flag){
		page = nowPage+1;
		window.location= "/source/index?page="+page;
	}else if(page=='Last'&&!flag){
		page = total;
		window.location= "/source/index?page="+page;
	}else if (page=='Previous'&&!flag){
		page = nowPage-1;
		window.location= "/source/index?page="+page;
	}else if(page=='First'&&!flag){
		page = 1;
		window.location= "/source/index?page="+page;
	}else{
		if(!flag){
			window.location= "/source/index?page="+page;
		}
	}

})

//查询
$('#search-btn').click(function(){
	var condition = $('#condition').val();
	var page = 1;
	window.location = "/source/index?page="+page+"&condition="+condition;
})
//修改
$(".edit-btn").click(function(){
	var tdArr = $(this).parent().parent().children('td');
	var mulVal = (tdArr.eq(2).html()=="单期")?1:0;
	$("#switch-state").bootstrapSwitch('readonly',false)
	//$("#switch-state").removeAttr('disabled')
	$("#switch-state").bootstrapSwitch('state',mulVal);
	$("#switch-state").bootstrapSwitch('readonly',true)
	// $("#switch-state").attr('disabled','disabled')
	// $(".bootstrap-switch").addClass('bootstrap-switch-disabled');
	$('#myModal').modal('show');
	$('#data_id').val($(this).attr('data-code'));
	$("#name").val(tdArr.eq(0).html());
	$("#desc").val(tdArr.eq(1).html());
	$("#power").val(tdArr.eq(4).html());
	var data = tdArr.eq(7).html();
	schema.setValue(data);
	schema.gotoLine(0);
})

//删除
$('.delete-btn').click(function(){
	var deleteCode = $(this).attr('data-code')
	$('#comon-delete-alert').modal('show');
	var html = "确定删除么？"
	$('#delete-message').html(html)
	$('#delete-sure-btn').click(function(){
		$.get('/source/deleteSource', {code:deleteCode},function(data) {
			$('#comon-alert').modal('show');
			var html = data.msg
			$('#alert-message').html(html)
		},'json');
	})
})

$('.share-btn').click(function(){
	var code = $(this).attr('data-code')
	$('#comon-alert').modal('show');
	var url = 'http://smart.meiliworks.com'+'/template/index?code='+code;
	var html = '<a href="'+url+'" target="_blank">'+url+'</a>'
	$('#alert-message').html(html)
})

$('#sure-btn').click(function(){
	window.location= "/source/index?page="+page;
})

//单期 OR 多期
$("#switch-state").on("click", function() {
	alert(1)
	var type;
	type = $(this).data("switch-get");
	return alert($("#switch-" + type).bootstrapSwitch(type));
});

$("[data-switch-get]").on("click", function() {
	var type;
	type = $(this).data("switch-get");
	return alert($("#switch-" + type).bootstrapSwitch(type));
});
