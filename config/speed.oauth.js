var config = require('./config.json');
var querystring = require('querystring');
var request = require('request');

var init = function( appkey , appsecret ) {
	this.host_online 	= "http://api.speed.meilishuo.com/";
	this.host_offline	= "http://apitest.speed.meilishuo.com/";
	
	this.getAuthorizeURL  = function( url, response_type, state, display ) {
		
		var params = [];
		params['client_id'] = appkey;
		params['redirect_uri'] = url;
		params['response_type'] = response_type ? response_type : 'code';
		params['state'] = state;
		params['display'] = display;
		
		return this.authorizeURL() + "?" + this.http_build_query(params);
	}
	
	this.http_build_query = function(params) {
		var queryString = [];
		
		if (params) {
			for (var i in params) {
				if (params[i]) {
					queryString[i] = params[i];
				}
			}
			
			queryString = querystring.stringify(queryString);
		}
		
		return queryString;
	}
	
	this.authorizeURL = function() {
		return this.getApiHost() + 'oauth/authorize';
	}
	
	this.accessTokenURL = function() {
		return this.getApiHost() + 'oauth/access_token';
	}
	
	this.getApiHost = function(){
		if (config.SERVER_ONLINE) {
			return this.host_online;
		}else{
			return this.host_offline;
		}
	}
	
	this.getAccessToken = function( type, keys, fn ) {
		
		var params = {};
		params['client_id'] = appkey;
		params['client_secret'] = appsecret;
		
		if ( type === 'token' ) {
			params['grant_type'] = 'refresh_token';
			params['refresh_token'] = keys['refresh_token'];
		} else if ( type === 'code' ) {
			params['grant_type'] = 'authorization_code';
			params['code'] = keys['code'];
			params['redirect_uri'] = keys['redirect_uri'];
		} else if ( type === 'password' ) {
			params['grant_type'] = 'password';
			params['username'] = keys['username'];
			params['password'] = keys['password'];
		} else {
			console.log("wrong auth type");
		}

		request.post({url:this.accessTokenURL(), formData: params}, fn);
	}
	
	this.getStatus = function( token, fn ) {
		console.log(token)
		request.post({url:this.getApiHost() + 'oauth/statuses', formData: {
			client_id		: appkey,
			access_token	: token
		}}, fn);
	}
	
	return this;
}

exports.init = init;