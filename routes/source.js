/*
* 新建一个code
* @since 2015-10-12
* @author mingyang
*/
var express = require('express');
var router = express.Router();
var sourceModel = require('../models/sourceModel');

/* GET home page. */
router.get('/index', function(req, res, next) {
	var page = req.query.page || 1;
	var condition = req.query.condition || 1;
	var params = {
		page:page,
		condition:condition
	}
	//var source = new sourceManager();
	var source = new sourceModel();
	source.getSource(params,function(data){
		res.render('source/index', { 
			title: 'source',
			data: data.rows,
			total: data.total,
			page:page,
			condition:(condition==1)?'':condition
		});
	})
});

router.post('/saveSource', function(req, res, next) {
	var source = new sourceModel();
	var op_user = req.session.username || 'system';
	var params = {
		code: req.body.code,
		name: req.body.name,
		desc: req.body.desc,
		op_user:op_user,
		power: req.body.power,
		data:req.body.data,
		multiple:req.body.multiple
	}
	source.saveSource(params,function(data){
		res.send({data:data});
	});
});

router.post('/getJson', function(req, res, next) {
	var code = req.body.code;
	var params = {
			code:code
		}
	var source = new sourceModel();
	source.getJson(params,function(data){
		if(data){
			res.send({data:data});
		}else{
			res.send({data:{}});
		}
	})
});

router.get('/edit', function(req, res, next) {
	var code = req.query.code;
	var schema = req.query.schema || "demo.json";
	res.render('source/edit',{
		title:'edit',
		id:dataId,
		schema:schema,
		code:code
	});
});

router.get('/deleteSource', function(req, res, next) {
	var params = {code : req.query.code}
	var source = new sourceModel();
	source.deleteSource(params,function(data){
		res.send({msg:data})
	})
});

module.exports = router;