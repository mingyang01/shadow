var mysql = require('mysql');
var client = mysql.createConnection({
  host     : '172.17.82.50',
  port     : '3306',
  user     : 'root',
  password : 'root'
});
function nodemysql(table){

	(function(){
		console.log('use... ');
	    client.query('use '+table, function(error, results) {
	        if(error) {
	            console.log('mysql connect Error: ' + error.message);
	            client.end();
	            return;
	        }else{
	        	console.log("connect success");
	    }
	    });
	    console.log('use data base done');
	})(client);
	return client;

}
module.exports = nodemysql;
