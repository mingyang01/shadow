function parseQuery() {
    var queryArray = window.location.search.substr(1)
            .split("&").map(function(v){ return v.split('=')})
        , queryMap = {}
        , single;

    for (var i = queryArray.length - 1; i >= 0; i--) {
        single =  queryArray[i];
        queryMap[single[0]] = single[1];
    };

    return queryMap;
}

var queryMap = parseQuery();


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
    disable_edit_json: true,
    disable_properties: true
};
// Seed the form with a starting value
var starting = decodeURIComponent(queryMap.json);
if (starting) {
    options.startval =  JSON.parse(starting)
}

// Initialize the editor
var editor = new Shadow(document.getElementById('preview'), options);

// Hook up the validation indicator to update its
// status whenever the editor changes
editor.on('change', function() {
    // Get an array of errors from the validator
    var errors = editor.validate();
    // var indicator = document.getElementById('valid_indicator');
    // // Not valid
    // if (errors.length) {
    //     indicator.className = 'label alert';
    //     indicator.textContent = 'not valid';
    // }
    // // Valid
    // else {
    //     indicator.className = 'label success';
    //     indicator.textContent = 'valid';
    // }
});


// Add a resolver function to the beginning of the resolver list
// This will make it run before any other ones
Shadow.defaults.resolvers.unshift(function(schema) {
    if (schema.type === "date") {
        return "date";
    }
    // If no valid editor is returned, the next resolver function will be used
});
