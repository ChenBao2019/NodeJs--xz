//商品路由器
//引入express模块
const express = require('express');
//引入连接池模块
const pool = require('../pool.js');
//创建路由对象
var router = express.Router();
 


//添加商品列表路由
router.get('/list',function(req,res){
	//判断数据是否为空   为空设置默认页码2，大小5
	var pno = Math.floor(parseInt(req.query.pno));
	var size = Math.floor(parseInt(req.query.size));
	console.log(pno,size);
	if(!pno){pno = 1;}
	if (!size){size = 9;}
	//执行sql语句
	//计算分页开始的值
	var start = (pno - 1) * size;
	pool.query('select lid,title,price from xz_laptop limit ?,?',
		[start,size],function(err,result){
			if(err) throw err;
			if (result.length > 0) {
				res.send(result);
				return;
			}else{
				res.send('查询失败');
				return;
			}
		});
});



//添加  添加商品路由
router.get('/add',function(req,res){
	var obj=req.query;
	console.log(obj);
	//判断是否为空
	var i=400;
	for(var key in obj){
		i++;
		if(!obj[key]){
			res.send({code:i,msg:key+'required'});
			return;
		}
	}
	//执行sql语句
	pool.query('insert into xz_laptop set ?',[obj],
		function(err,result){
			if(err) throw err;
			if(result.affectedRows >0){
				res.send('添加成功');
				return;
			}else{
				res.send('添加失败');
				return;
			}
		});
});



//添加商品详情路由
router.get('/detail',function(req,res){
	//取传递的数据并转数值
	var obj= Math.floor(parseInt(req.query.lid));
	console.log(obj);
	//判断是否为空
	if(!obj){
		res.send('请输入商品编号');
		return;
	}
	//执行sql语句
	pool.query('select * from xz_laptop where lid=?',[obj],
		function(err,result){
			// console.log(result);
			if(err) throw err;

			if(result){
				res.send(`
					商品编号：${result[0].lid}<br />
					商品名称：${result[0].lname}<br />
					商品价格：${result[0].price}<br />
					商品简介：${result[0].details}<br />
					`);
				return;
			}else{
				res.send('检索失败');
				return;
			}			
		});
});
//导出路由对象
module.exports=router;
























