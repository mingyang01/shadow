var http = require("http")
var url = require("url")
var querystring = require('querystring');
var config = require('../config/config.json');
var querystring = require('querystring');
var SpeedOpenOAuth = require('../config/speed.oauth.js').init;

function Oauth(){

}

Oauth.prototype.checkUser=function(req,res,next){
	var urlInfo = url.parse(req.url);
	var CALLBACK = 'http://' + req.headers.host + urlInfo.pathname;
	var SPEED_CALLBACK_URL = 'http://' + req.headers.host + '/';
	var oauth = new SpeedOpenOAuth( config.SPEED_APPKEY , config.SPEED_APPSECRET );
	var code_url = oauth.getAuthorizeURL( SPEED_CALLBACK_URL,'token');
	
	var code = req.query.code || '';
	if(code){
		var keys = [];
		keys['code'] = code;
		keys['redirect_uri'] = SPEED_CALLBACK_URL;

		oauth.getAccessToken( 'code', keys, function(err, httpResponse, data) {
			if (err) {
				return console.error('request failed:', err);
			}

			var data = JSON.parse(data);
			var token = data.access_token;
			oauth.getStatus( token, function(err, httpResponse, data) {
				if (err) {
					return console.error('request failed:', err);
				}
				console.log(data)
				req.session.user = data;
				res.user = data;
			    return res.redirect(CALLBACK);
			    //res.setStatus(200);
				//res.end();
				next();
		    })
		})


	}else{
		res.redirect(code_url);
		//res.setStatus(200);
		//res.end();
	}
	
}

module.exports = Oauth




