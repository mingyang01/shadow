var PICTURE_DOMAINS = {
	'a' : 'http://imgtest.meiliworks.com', //tx
    'b' : 'http://d04.res.meilishuo.net', //tx
    'c' :'http://imgtest-dl.meiliworks.com', //dl
    'd' : 'http://d06.res.meilishuo.net', //dl
    'e' : 'http://d05.res.meilishuo.net', //ws
    'f' : 'http://d01.res.meilishuo.net', //ws
    'g' : 'http://d02.res.meilishuo.net', //tx
    'h' : 'http://d03.res.meilishuo.net', //tx
}

var PICTURE_DOMAINS_ALLOCATION = "aaddbbgggggggggggghhhhhhhhhhhhbbbbbbbbbbccddddddddggdddddddddddddddddeeeeeeeeeeeeeeeeeeeeeeeeeedddff";
function config(){

}

config.prototype.get_domain=function(){
	var key = PICTURE_DOMAINS_ALLOCATION[parseInt(Math.random()*PICTURE_DOMAINS_ALLOCATION.length)];
	if(!key) key = "g";
	return PICTURE_DOMAINS[key];
}



module.exports = config;