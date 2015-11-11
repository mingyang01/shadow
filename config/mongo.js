var mongoose = require('mongoose')
, Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/smart');

var BlogSchema = new Schema({
   id        : {type : Number, index : true}
  ,title       : {type : String}
});

mongoose.model("Blog", BlogSchema);

var Blog = mongoose.model("Blog"); //获得model实例

var blog1 = new Blog();
blog1.id = 4;
blog1.title="ully";

blog1.save(function(err) {  //存储
  if (err) {
    console.log('save failed');
  }
  console.log('save success');
});

Blog.find({title:/ll/},function(err,docs){//查询id为4的记录
     console.log(docs);
     console.log('find success');
});

// Blog.update({id:4,title:"upill"},function(err,docs){//更新
//      console.log(docs);
//      console.log('update success');
// });

// Blog.remove({id:4},function(err,docs){//删除id为4的记录
//      console.log(docs);
//      console.log('remove success');
// });