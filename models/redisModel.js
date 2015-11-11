function newReids(){
	var redisObj = require('redis'),
	PORT = 6379,
	HOST = '127.0.0.1',
	OPTS = {},
	redis = redisObj.createClient(PORT,HOST,OPTS);
	redis.on('ready',function(){
		console.log('redis ready');
	})
	return redis;
}

module.exports = newReids;
