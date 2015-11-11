/*
*  模板相关的操作 新建数据源等
*  @author mingyang
*  @since 2015 10 20    
*/
var express = require('express');
var request = require('request');
var fs = require('fs');
var router = express.Router();
var config = require('../config/uploadImageConfig/uploadImageConfig');
var sourceModel = require('../models/sourceModel');
var templateModel = require('../models/templateModel');
var schemaModel = require('../models/schemaModel');
var redisModel = require('../models/redisModel');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var source = new sourceModel();
var template = new templateModel();
var schema = new schemaModel();
var redis = new redisModel();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/schema', function(req, res, next) {
	var schema = req.query.schema || "demo.json";
    res.render('template/schema', {
        title: 'Shadow',
        schema: schema,
    });
});

router.post('/toschema', function(req, res, next) {
    var option = JSON.parse(req.body.jsonData);
    var sch = GenerateSchema.json('Product',option);
    res.send(sch); 
});


router.get('/preview', function(req, res, next) {
	var schema = req.query.schema || "person.json"
    res.render('template/preview', {
        title: 'Preview',
        schema: schema
    });
});


router.get('/doc', function(req, res, next) {
	var schema = req.query.doc || "schema-doc"
    res.render('template/' + schema, {
        title: 'doc'
    });
});

//创建模板入口
router.get('/index', function(req, res, next) {
    var code = req.query.code || '';
    var page = req.query.page || 1;

    schema.getSchema({code : code},function(schema){
        var flag = false;
        if(schema){flag = true}
        var params = {code : code}
        source.getSourceByCondition(params,function(data){
            var power = '';
            var multiple = '';
            if(code&&data&&schema){
                power= data.power || '';
                multiple = data.multiple;
            }
            res.render('template/index',{
                title : "index",
                code : code,
                page : page,
                flag : flag,
                power: power,
                multiple:multiple
            })
        })
    });
    
});


router.post('/saveTemplate', function(req, res, next) {
    var code = req.body.code || '';
    var status = req.body.status || 0;
    var start_time = req.body.start_time || 0;
    var end_time = req.body.end_time || 0;
    var op_user = req.session.username || 'system';
    if(code&&op_user){
        var params = {
            code : code,
            data : req.body.data,
            op_user : op_user,
            start_time : start_time,
            end_time : end_time,
            status :  status
        }
        template.saveTemplate(params,function(data){
            if(data.succ==1){
                var results = {succ:1,msg:"保存成功"}
                res.send(results)
            }else{
                var results = {succ:1,msg:"遇到未知错误"}
                res.send(results)
            }
            
        })
    }else{
        var results = {succ:0,msg:"不能有空表单项"}
        res.send(results)
    }
});

router.get('/changeOneStatus',function(req,res,next){
    var _id = req.query.id;
    console.log(_id)
    var params = {
        condition : " id = "+_id,
        update : " status= 1 "
    }
    template.updateByCondition(params,function(data){
        res.json({succ:1})
    })
})

router.get('/changeAllStatus',function(req,res,next){
    var code = req.query.code;
    var status = req.query.status;
    var params = {
        condition : " code = '"+code+"'",
        update : " status= "+status
    }
    template.updateByCondition(params,function(data){
        res.json({succ:1})
    })
})

router.get('/getTemplate', function(req, res, next){
    var params = {
        code : req.query.code||0,
        page : req.query.page||1
    }
    if(params.code){
        template.getTemplate(params,function(data){
            if(data.succ==1){
                res.json({succ:1,data:data.data})
            }else{
                res.json({succ:0,data:"请检查唯一值"})
            }
        })
    }else{
        res.json({succ:0,data:"请检查唯一值"})
    }
})

router.get('/show',function(req, res, next){
    var code = req.query.code;
    var _id = req.query._id;
    var previewFlag = req.query.previewFlag||0;
    res.render('template/show',{
        code : code,
        _id : _id,
        previewFlag:previewFlag
    })
    

})

router.post('/toTemplate',function(req, res, next){
    var code = req.body.code;
    var _id = req.body._id;
    var flag = req.body.previewFlag||0;
    if(flag==1){
        template.showPreview({id:_id,code:code},function(json){
            var data = '';
            if(json.succ==1){
                data = json.rows;
            }
            schema.getSchema({code : code},function(schema){
                return res.json({
                    succ:1,
                    data:data,
                    schema:schema
                });
            });

        })

    }else{
        template.findDataById(_id,function(json){
            var data = '';
            if(json.succ==1){
                data = json.rows;
            }
            schema.getSchema({code : code},function(schema){
                return res.json({
                    succ:1,
                    data:data,
                    schema:schema
                });
            });

        })
    }
})

router.get('/changePower',function(req, res, next){
    var params = {
        code:req.query.code,
        power:req.query.power
    }
    source.updatePower(params,function(data){
        if(data.succ==1){
            res.json({succ:1,msg:"保存成功"})
        }else{
            res.json({succ:0,msg:"未知错误"})
        }

    })
})

router.post('/saveData',function(req, res, next){
    var _id = req.body._id;
    var data = JSON.stringify(req.body.data);
    var params = {
        condition : " id = "+_id,
        update : " data = "+data
    }
    template.updateByCondition(params ,function(json){
        if(json.succ==1){
            res.json({succ:1})
        }
    })
})


router.get('/deleteTemplate',function(req, res, next){
    template.deleteTemplate(req.query._id ,function(json){
        if(json.succ==1){
            res.json({succ:1,data:"删除成功"})
        }else{
            res.json({succ:0,data:json.data})
        }
    })
})

router.get('/updateTime',function(req, res, next){
    var params = {
        _id : req.query._id,
        start_time: req.query.start_time ,
        op_user : req.session.username,
        end_time: req.query.end_time
    }
    template.updateTime(params ,function(json){
        if(json.succ==1){
            res.json({succ:1,msg:"保存成功"})
        }else{
            res.json({succ:0,data:json.data})
        }
    })
})

router.post('/uploadImage',multipartMiddleware,function(req, resp, next){

    
    var file = req.files.codecsv;
    var params = {
        url : 'http://172.16.0.199:8080/pic/commupload'
    }
    var r = request.post(params,function(erro,res,body){
        if(erro){
            console.log(erro)
        }else{
            if(body){
                var body=JSON.parse(body)
                if(body.ret=="0"){
                    console.log(body)
                    var domain = new config();
                    var imgUrl = domain.get_domain();
                    var json = {
                        img :body.data,
                        url :imgUrl+'/'+body.data.n_pic_file
                    }
                    console.log(json)
                    resp.json(json)
                }
                
            }
        }

    });
    var form = r.form();
    form.append('kind', 'pic');
    form.append('file', fs.createReadStream(file.path));

})

router.get('/chageQaStatus',function(req,res,next){
    var _id = req.query._id;
    var is_test = req.query.is_test;
    var params = {
        _id : _id,
        is_test : is_test
    }
    template.chageQaStatus(params,function(data){
        if(data.succ==1){
            res.json({succ:1})
        }else{
            res.json({succ:0})
        }
    })
})
//添加预览
router.post('/addPreview',function(req,res,next){
    var username = req.session.username;
    var name = req.session.name;
    var params = '';
    
    template.getTemplateById({id:req.body._id},function(json){
        if(json.succ==1){
            var rows = json.rows;
            params = {
                id:rows.id,
                code:rows.code,
                op_user:username,
                data:rows.data,
                start_time:rows.start_time,
                end_time:rows.end_time
            }
            //redis存储
            var redis_key = 'preview:' + params.code
            var value = name+":"+req.body._id
            redis.set(redis_key,value,function(err,results){
                if(err){
                    console.log(err)
                }else{
                    redis.expire(redis_key, 1800);
                    template.addPreview(params,function(data){
                        if(data.succ==1){
                            return res.json({succ:1});
                        }else{
                            return res.json({succ:0});
                        }
                    })
                }
            })
        }else{
            return res.json({succ:0});
        }
    })

})

router.get('/getPreview',function(req,res,next){
    var code = req.query.code;
    var username = req.session.username;
    var name = req.session.name;
    var _id =  req.query._id;
    var redis_key = 'preview:' + code;
    redis.get(redis_key,function(err,results){
        if(err){
            console.log(err)
            return res.json({succ:0});
        }else{
            if(results){
                redis.ttl(redis_key,function(erro,time){
                    var value = results.split(':')[0];
                    var status = (name==value);
                    return res.json({succ:1,results:{time:time,user:value,status:status}});
                })
            }else{
                return res.json({succ:0});
            }
            
        }
    })
})

router.post('/updatePreview',function(req,res,next){
    var params = {
        id:req.body._id,
        code:req.body.code,
        data:req.body.data,
        op_user:req.session.name
    }
    template.updatePreview(params,function(data){
        if(data.succ==1){
            return res.json({succ:1});
        }else{
            return res.json({succ:0});
        }
    })
})

router.get('/showPreview',function(req,res,next){
    var params = {
        id:req.query._id,
        code:req.query.code
    }
    template.showPrevie(params,function(data){
        if(data.succ==1){
            return res.json({succ:1,rows:data})
        }
    })

})

router.post('/checkUrl',function(req,res,next){
    request.post(req.body.url,function(erro,response,body){
        if(erro){
            console.log(erro)
            res.json({succ:0})
        }else{
           res.json({succ:1})
        }
    })
})

router.get('/clearRedisData',function(req,res,next){
    var redis_key = 'preview:' + req.query.code;
    var name = req.session.name;
    redis.get(redis_key,function(err,results){
        if(results){
            var value = results.split(":")[0]
            if(value==name){
               redis.expire(redis_key,-1);
            }
            return res.json({succ:1})
        }
        return res.json({succ:0})
    });
})

router.get('/checkTime',function(req,res,next){
    var params = {
        code : req.query.code,
        start_time : req.query.start_time,
        end_time : req.query.end_time,
        _id:req.query._id
    }
    template.checkTime(params,function(data){
        if(data.succ==1){
            res.json({succ:1,checked:data.checked});
        }else{
             res.json({succ:0});
        }
    })
})

router.get('/clearPreviewByCode',function(req,res,next){
    template.deletePreview({code:req.query.code},function(data){
        if(data.succ==1){
            res.json({succ:1})
        }else{
            res.json({succ:0})
        }
    })
})

router.get('/aotuSaveJudge',function(req,res,next){
    var redis_key = 'preview:' + req.query.code;
    var name = req.session.name;
    var _id = req.query._id;
    console.log(_id)
    redis.get(redis_key,function(err,results){
        if(err){console.log(err);return res.json({succ:0});}
        else{
            if(results){
                var nameValue = results.split(":")[0];
                var idValue = results.split(":")[1];
                if(idValue==_id&&nameValue==name){
                    return res.json({succ:1})
                }else{
                    return res.json({succ:0})
                }
            }else{
                return res.json({succ:0})
            }
        }
    })
})


module.exports = router;
