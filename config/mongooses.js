var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/smart');

module.exports = mongodb;

function mongodb (){
	return mongoose;
}
// mongodb.prototype.setModel = function (name,config){
// 	mongoose.model("Blog", BlogSchema);
// }