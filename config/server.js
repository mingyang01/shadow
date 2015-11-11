var http = require("http")
var url = require("url")
var querystring = require('querystring');
var config = require('./config.json');
var SpeedOpenOAuth = require('./speed.oauth.js').init;


http.createServer(function(request, response) {  
	var urlInfo = url.parse(request.url);
	var SPEED_CALLBACK_URL = 'http://' + request.headers.host + '/callback';
	
	if(urlInfo.pathname == '/favicon.ico') return;
	
	var oauth = new SpeedOpenOAuth( config.SPEED_APPKEY , config.SPEED_APPSECRET );
	var code_url = oauth.getAuthorizeURL( SPEED_CALLBACK_URL );
	
	if(urlInfo.pathname == '/') {
		//response.redirect(code_url)
		responseContent = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>SPEED开放平台 nodeJs SDK Demo</title></head><body><p>本Demo基于新浪微博nodeJs SDK修改，演示了nodeJs SDK的授权及接口调用方法，开发者可以在此基础上进行灵活多样的应用开发。</p><hr /><!-- 授权按钮 --><p><a href="' + code_url + '">点击进入授权页面</a></p></body></html>';
		
		response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});  
		response.write(responseContent);  
		response.end();
		
	}else if(urlInfo.pathname == '/callback') {
		var queryInfo = urlInfo.query.split('&');
		for (var i in queryInfo) {
			queryInfo[i] = queryInfo[i].split('=');
			queryInfo[queryInfo[i][0]] = queryInfo[i][1];
		}
		
		var code = queryInfo['code'];
		
		if (code) {
			var keys = [];
			keys['code'] = code;
			keys['redirect_uri'] = SPEED_CALLBACK_URL;
			
			oauth.getAccessToken( 'code', keys, function(err, httpResponse, data) {
				if (err) {
					return console.error('request failed:', err);
				}
				
				console.log(data);
				
				dataObj = JSON.parse(data);
				
				response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
				
				if (dataObj.code == 200) {
					responseContent = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>SPEED开放平台 nodeJs SDK Demo</title></head><body><center><b style="font-size:30">授权成功 <a href="/user-info?access_token=' + dataObj.access_token + '">用户状态</a></b><pre>' + data + '</pre></center></body></html>';
				}else {
					responseContent = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>SPEED开放平台 nodeJs SDK Demo</title></head><body><center><b style="font-size:30">授权失败 <a href="/">返回</a></b><pre>' + data + '</pre></center></body></html>';
				}
				
				response.write(responseContent);  
				response.end();  
			} ) ;
			
		}
	}else if(urlInfo.pathname == '/user-info') {
		var queryInfo = urlInfo.query.split('&');
		for (var i in queryInfo) {
			queryInfo[i] = queryInfo[i].split('=');
			queryInfo[queryInfo[i][0]] = queryInfo[i][1];
		}
		
		var token = queryInfo['access_token'];
		console.log(token);
		
		oauth.getStatus( token, function(err, httpResponse, data) {
			if (err) {
				return console.error('request failed:', err);
			}
			
			console.log(data);
			
			dataObj = JSON.parse(data);
			
			response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
			
			
			responseContent = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>SPEED开放平台 nodeJs SDK Demo</title></head><body><table>'
			for (var i in dataObj['data']) {
				responseContent += '<tr><td>' + i + '</td><td>' + dataObj['data'][i] + '</td></tr>';
			}
			responseContent += '</table></body></html>';
			
			
			response.write(responseContent);  
			response.end();  
		} ) ;
	}else {
		responseContent = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>SPEED开放平台 nodeJs SDK Demo</title></head><body><center><b style="font-size:30">404</b></center></body></html>';
		
		response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});  
		response.write(responseContent);  
		response.end();  
	}

}).listen(config.PORT);