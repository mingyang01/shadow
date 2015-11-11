var schema = ace.edit("editor");
//schema.setTheme("ace/theme/termi");//clouds
schema.getSession().setMode("ace/mode/json");
//示例json
var starting = {
    "title":"这是一个json例子",
    "name": "John Smith",
    "age": 35,
    "gender": "male"
};
$.post('/source/getJson',{id:id}, function(data) {
    if(data.data==1){
        schema.setValue(JSON.stringify(starting,null,4));
    }else{
        schema.setValue(data.data);
    }
    schema.gotoLine(0);
},'json');

document.getElementById('save-json').addEventListener('click', function() {
    var string = schema.getValue();
    var flag = isJson(JSON.parse(string));
    if(flag){
        $.post('/source/saveJson',{id:id,json:string},function(data){
            if(data){
                alert(data.msg)
            }
        },'json')
    }
});

function isJson(obj){

    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;

}
