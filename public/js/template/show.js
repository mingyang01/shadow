var options = {
    theme: 'bootstrap3',
    iconlib: 'bootstrap3',
    // Enable fetching schemas via ajax
    ajax: true,
    // The schema for the editor
    disable_edit_json: true,
    disable_properties: true
};


var params = {
    code :code,
    _id : _id,
    previewFlag:previewFlag
}
var editor = '';
var results = '';

$.ajax({  
    async:false,
    type: "POST",
    dataType: "json",  
    url: "/template/toTemplate",  
    data: params,  
    success: function(data){
        if(data.succ==1){
            (function(res){
                results = {
                    data:data.data,
                    schema:data.schema
                };
            })(results)
        }
    }  
}); 

if(results.data){
    options.startval =  JSON.parse(results.data);
}
options.schema = JSON.parse(results.schema);

editor = new Shadow(document.getElementById('preview'), options); 
$("#save-btn-online").click(function(){
    var errors = editor.validate();
    if(errors.length) {
      alert("页面有错误 不能提交")
      return false;
    }
    var data = JSON.stringify(editor.getValue());
    var params = {
        data : data,
        _id : _id
    }
    $('#preview-alert').modal('show');
    var html = "你保存的数据将会直接影响到线上，你确定要这么做么？"
    $('#alert-message').html(html)

    $('#save-sure-btn').click(function(){
        $.post('/template/saveData',params, function(data, textStatus, xhr) {
            if(data.succ==1){
                clearRedisData ();
                window.location="/template/show?_id="+_id+"&code="+code
            }
        },'json');
    })

})
if(previewFlag!=1){
    $('.sava-btn-box').hide();
}

$("#save-btn-preview").click(function(){
    var data = JSON.stringify(editor.getValue());
    var params = {
        code:code,
        data : data,
        _id : _id
    }
    $('#preview-alert').modal('show');
    var html = "确认保存到预览数据中么？"
    $('#alert-message').html(html)

    $('#save-sure-btn').click(function(){
        $.post('/template/updatePreview',params, function(data, textStatus, xhr) {
            if(data.succ==1){
                window.location="/template/show?_id="+_id+"&code="+code+"&previewFlag=1";
            }
        },'json');
    })
})

function clearRedisData (){
    $.get('/template/clearRedisData',{code:code}, function(data) {
        if(data.succ==1){
            clearPreviewByCode();
        }
    },'json');
}

function clearPreviewByCode(){
    $.get('/template/clearPreviewByCode',{code:code}, function(data) {
       
    },'json');
}
//自动保存预览数据
autoSave();
function autoSave(){
    $.get('/template/aotuSaveJudge',{_id:_id,code:code}, function(data) {
        console.log(data)
        if(data.succ==1){
            $('#preview-save-alert').show()
            setInterval(savePreviewInTime,1000);
        }
    });
}

function savePreviewInTime(){
    var data = JSON.stringify(editor.getValue());
    var params = {
        code:code,
        data : data,
        _id : _id
    }
    $.post('/template/updatePreview',params, function(data, textStatus, xhr) {
        
    },'json');
}





