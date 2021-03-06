// This is the starting value for the editor
// We will use this to seed the initial editor
// and to provide a "Restore to Default" button.
var starting = {
    name: "John Smith",
    age: 35,
    gender: "male"
};
// Initialize the editor
var editor = new JSONEditor(document.getElementById('editor'), {
    theme: 'bootstrap3',
    iconlib: 'bootstrap3',
    // Enable fetching schemas via ajax
    ajax: true,
    // The schema for the editor
    schema: {
        $ref: "/schema/person.json",
        format: "row"
    },
    // Seed the form with a starting value
    startval: starting,
    disable_edit_json: true,
    disable_properties: true,

});
// Hook up the submit button to log to the console
document.getElementById('submit').addEventListener('click', function() {
    // Get the value from the editor
    console.log(editor.getValue());
});
// Hook up the Restore to Default button
document.getElementById('restore').addEventListener('click', function() {
    editor.setValue(starting_value);
});
// Hook up the validation indicator to update its
// status whenever the editor changes
editor.on('change', function() {
    // Get an array of errors from the validator
    var errors = editor.validate();
    var indicator = document.getElementById('valid_indicator');
    // Not valid
    if (errors.length) {
        indicator.className = 'label alert';
        indicator.textContent = 'not valid';
    }
    // Valid
    else {
        indicator.className = 'label success';
        indicator.textContent = 'valid';
    }
});
