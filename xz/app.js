//引express入模块
const express=require('express');
//引入body-parser中间件
const bodyParser= require('body-parser');
//引入用户路由器
const userRouter = require('./routes/user.js');
//引入商品路由器
const productRouter = require('./routes/product.js');
//创建服务器
var app=express();
app.listen(8080);
//使用bodu-parser中间件,将post得数据解析为对象
app.use(bodyParser.urlencoded({
	extended:false
}));
//托管资源
app.use(express.static('./public'));
//挂载用户路由
app.use('/user',userRouter);
//挂载商品路由
app.use('/product',productRouter);
 





















