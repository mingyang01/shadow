var schema = ace.edit("editor");
//schema.setTheme("ace/theme/monokai");
schema.getSession().setMode("ace/mode/json");

var starting = {
    // name: "John Smith",
    // age: 35,
    // gender: "male"
};

var options = {
    theme: 'bootstrap3',
    iconlib: 'bootstrap3',
    ajax: true,
    disable_edit_json: true,
    disable_properties: true
};

var tmpSchema = 'false';
$.ajaxSetup({ 
    async : false 
}); 
$.post('/source/getJson',{code:code}, function(json) {
    if(json.data!=1){

        $.post('/schema/toSchema', {json: json.data,code:code}, function(data, textStatus, xhr) {
            (function(tmp){
                tmpSchema = JSON.parse(data.data);
            })(tmpSchema);
        },'json'); 

    }
},'json');

var editor = '';

if(tmpSchema!='false'){
    schema.setValue(JSON.stringify(tmpSchema,null,4));
    schema.gotoLine(0);
    options.schema = tmpSchema;
    editor = new Shadow(document.getElementById('preview'), options); 
}

document.getElementById('update-schema').addEventListener('click', function() {

    options.schema = JSON.parse(schema.getValue());
    editor.destroy();
    editor = new Shadow(document.getElementById('preview'), options);
});

$('#save-schema').click(function(){
    var json = schema.getValue();
    var params = {
        code: code,
        data: json
    }
    
    $.post('/schema/saveSchema',params, function(data) {
        if(data){
            $('#comon-alert').modal('show');
            var html = "保存成功"
            $('#alert-message').html(html)
        }
    },'json');
})




$("#full-screen").click(function(){
    if(!$(this).hasClass('full-true')){
        $(this).addClass('full-true')
        $(this).children('i').removeClass('glyphicon-resize-vertical')
        $(this).children('i').addClass('glyphicon-resize-horizontal')
        $("#schema-wramp").removeClass('col-md-7').addClass('col-md-12')
        $("#preview-wramp").removeClass('col-md-5').addClass('col-md-12')
        $('#hide-btn').show();
    }else{
        $(this).removeClass('full-true');
        $('#hide-btn').hide();
        $('#editor').show();
        $(this).children('i').addClass('glyphicon-resize-vertical')
        $(this).children('i').removeClass('glyphicon-resize-horizontal')
        $("#schema-wramp").removeClass('col-md-12').addClass('col-md-7')
        $("#preview-wramp").removeClass('col-md-12').addClass('col-md-5')
    }
    
})
$('#hide-btn').click(function(){
    var This = $(this)
    $('#editor').toggle(function() {
        var obj = This.children('i');
        if(obj.hasClass('glyphicon-menu-down')){
            This.children('i').removeClass('glyphicon-menu-down')
            This.children('i').addClass('glyphicon-menu-up')
        }else{
            This.children('i').removeClass('glyphicon-menu-up')
            This.children('i').addClass('glyphicon-menu-down')
        }


    });  
})
$("#theme").change(function(){
    var theme = 'ace/theme/'+$(this).val()
    schema.setTheme(theme);
})

$(".backToTop").goToTop();
$(window).bind('scroll resize',function(){
    $(".backToTop").goToTop({
        pageWidth:960,
        duration:0
    });
});

$(function(){
    var height = $("#preview-wramp").height();
    $("#editor").height(height);
})




   
    





