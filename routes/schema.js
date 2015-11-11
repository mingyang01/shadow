/*
* 根据json生成jsonSchema
* @since 2015-10-12
* @author mingyang
*/
var express = require('express');
var router = express.Router();
var schemaModel = require('../models/schemaModel');
var sourceModel = require('../models/sourceModel');
var GenerateSchema = require('generate-schema');

var schema = new schemaModel();
var source = new sourceModel();

router.get('/index', function(req, res, next) {
	var code = req.query.code || '';
	res.render('schema/index',{
    	title : "schema",
    	code : code
    }) 
});

router.post('/toSchema',function(req, res, next) {
	var code = req.body.code;
	var json = JSON.parse(req.body.json);
	schema.getSchema({code : code} , function(data){
		if(data){
			res.send({data:data})
		}else{
			var results = GenerateSchema.json('product',json);
			results = JSON.stringify(results);
    		res.send({data:results});
		}
	});
});

router.post('/saveSchema',function(req, res, next) {
	var name = req.session.username;
	var params = {
		code: req.body.code,
		data: req.body.data,
		op_user : name
	}

	schema.saveSchema(params , function(callback){
		if(callback){
			res.send({msg:"保存成功"})
		}
	});
 
});

module.exports = router;
