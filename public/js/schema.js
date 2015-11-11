var schema = ace.edit("editor");
schema.setTheme("ace/theme/monokai");
schema.getSession().setMode("ace/mode/json");
var schema1 = ace.edit("jsonEditor");
schema1.setTheme("ace/theme/monokai");
schema1.getSession().setMode("ace/mode/json");

//console.log(sch)

var container = document.getElementById('model');
var options = {
    mode: 'tree',
    indentation: 4,
    modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
    error: function(err) {
        alert(err.toString());
    }
};
var json = {
    mode: 'tree',
    modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
    error: function(err) {
        alert(err.toString());
    }
};
var model = new JSONEditor(container, options, json);

// This is the starting value for the editor
// We will use this to seed the initial editor
// and to provide a "Restore to Default" button.
var starting = {
    // name: "John Smith",
    // age: 35,
    // gender: "male"
};

var options = {
    theme: 'bootstrap3',
    iconlib: 'bootstrap3',
    // Enable fetching schemas via ajax
    ajax: true,
    // The schema for the editor
    schema: {
        $ref: "/schema/" + tpl,
        format: "row"
    },
    // Seed the form with a starting value
    // startval: starting,
    disable_edit_json: true,
    disable_properties: true
};

// Specify upload handler
Shadow.defaults.options.upload = function(type, file, cbs) {
    if (type === 'root.upload_fail') cbs.failure('Upload failed');
    else {
        var tick = 0;
        var tickFunction = function() {
            tick += 1;
            console.log('progress: ' + tick);
            if (tick < 100) {
                cbs.updateProgress(tick);
                window.setTimeout(tickFunction, 50)
            } else if (tick == 100) {
                cbs.updateProgress();
                window.setTimeout(tickFunction, 500)
            } else {
                cbs.success('http://www.example.com/images/' + file.name);
            }
        };
        window.setTimeout(tickFunction)
    }
};

// Initialize the editor
var tmpSchema = '';
$.ajaxSetup({ 
    async : false 
}); 
$.get(options.schema.$ref, function(data) {
    var jsonPost = JSON.stringify(data, null, 4);
    $.post('/template/toschema',{jsonData:jsonPost},function(json) {
        schema.setValue(JSON.stringify(json, null, 4));
        schema.gotoLine(0);
        (function(tmp){
            tmpSchema = json;
        })(tmpSchema)
    },'json');
    schema1.setValue(JSON.stringify(data, null, 4));
    schema1.gotoLine(0);
});
options.schema = tmpSchema;
var editor = new Shadow(document.getElementById('preview'), options);

// // Hook up the submit button to log to the console
// document.getElementById('submit').addEventListener('click', function() {
//     // Get the value from the editor
//     console.log(editor.getValue());
// });
// // Hook up the Restore to Default button
// document.getElementById('restore').addEventListener('click', function() {
//     editor.setValue(starting);
// });
// Hook up the validation indicator to update its
// status whenever the editor changes
editor.on('change', function() {
    // Get an array of errors from the validator
    var errors = editor.validate();
    model.setText(JSON.stringify(editor.getValue()));
    model.format && model.format();
});


document.getElementById('update-json').addEventListener('click', function() {
    var json = schema1.getValue();
    $.post('/template/toschema',{jsonData:json},function(json) {
        schema.setValue(JSON.stringify(json, null, 4));
        schema.gotoLine(0);
    },'json');
});

document.getElementById('update-schema').addEventListener('click', function() {
    options.schema = JSON.parse(schema.getValue());
    editor.destroy();
    editor = new Shadow(document.getElementById('preview'), options);
    editor.on('change', function() {
    // Get an array of errors from the validator
    var errors = editor.validate();
    model.setText(JSON.stringify(editor.getValue()));
    model.format && model.format();
});
});


document.getElementById('update-form').addEventListener('click', function() {
    model.setText(JSON.stringify(editor.getValue()))
    model.format && model.format();
});

$('#full-screen').click(function(e){
	var value = editor.getValue()
	console.log(value)
	value = encodeURIComponent(JSON.stringify(value));
	console.log(value)
	var url = "/template/preview?schema=" + tpl + "&json=" + value;
	window.open(url)
});
