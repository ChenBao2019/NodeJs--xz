// 用户路由器
//引入模块 
const express = require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由对象
var router = express.Router();
//添加用户注册路由
router.post('/reg',function(req,res){
	var obj = req.body;
	// console.log(obj);
	if(!obj.uname){
		//用户名为空
		res.send({code:401,msg:'uname required'});
		return;
	}
	if(!obj.upwd){
		//密码为空
		res.send({code:402,msg:'password required'});
		return;
	}
	if (!obj.email) {
		//邮箱为空
		res.send({code:403,msg:'email required'});
		return;
	}
	if(!obj.phone){
		//手机号为空
        res.send({code:404,msg:'phon required'});
        return;
	}
    //执行sql语句
    pool.query('insert into xz_user set ?',[obj],function(err,result){
    		if(err) throw err;
    		// console.log(result);
    		if(result.affectedRows > 0){
    			//注册成功
    			res.send({code:200,msg:'register suc'});
    		}
    	});	
});


//添加用户登录路由
router.post('/login',function(req,res){
	var obj = req.body;
	// console.log(obj);
	//验证数据是否为空
	if(!obj.uname){
		//用户名为空
		res.send({code:401,msg:'uname required'});
		return;
	}
	if (!obj.upwd) {
		//密码为空
		res.send({code:402,msg:'password required'});
		return;
	}
	//执行sql语句
	//验证用户名和密码是否存在
	pool.query('select * from xz_user where uname= ? and upwd= ?',
		[obj.uname,obj.upwd],function(err,result){
			if (err) throw err;
			// console.log(result);
			if (result.length > 0) {
				res.send('登录成功');
				return;
			}else{
				res.send('登录失败');
				return;
			}
		});	
});


//添加用户检索路由
router.get('/detail',function(req,res){
	// console.log(req.query);
	//验证提交的数据是否为空
	if (!req.query.uid) {
		res.send({code:405,msg:'uid required'});
		return;
	}
	//执行sql语句 查询相应数据
	pool.query('select * from xz_user where uid= ?',
		[req.query.uid],function(err,result){
			if(err)  throw err;
			// console.log(result);
			//判断查询结果是否为空
			if (result.length >0) {
				//用字符串模板输出
				res.send(`
					<h2>查询结果</h2>
					<table border="solid 1 black" style="text-align:center">
					     <tr>
					        <td>编号</td>
					        <td>用户名</td>
					        <td>密码</td>
					        <td>邮箱</td>
					        <td>电话</td>
					     </tr>
					     <tr>
					        <td>${result[0].uid}</td>
					        <td>${result[0].uname}</td>
					        <td>${result[0].upwd}</td>
					        <td>${result[0].email}</td>
					        <td>${result[0].phone}</td>
					     </tr>
					</table>
					`);
				return;
			}else{
				res.send('查无此人');
				return;
			}
		});
});


//添加修改用户路由
router.get('/update',function(req,res){
	var obj = req.query,i=400;
	// console.log(obj);
	//使用遍历批量验证是否为空
	for(var key in obj){
		i++;
		if (!obj[key]) {
			res.send({code: i,msg:key + 'required'});
			return;
		}
	}
	//执行sql语句
	pool.query('update xz_user set email=?,phone=?,user_name=?,gender=? where uid=?',
		[obj.email,obj.phone,obj.user_name,obj.gender,obj.uid],function(err,result){
			if(err) throw err;
			console.log(result);
			if (result.affectedRows >0) {
				res.send('修改成功');
				return;
			}else{
				res.send('修改失败');
				return;
			}
		});
});


//添加用户列表路由
router.get('/list',function(req,res){
	var pno =Math.floor(parseInt(req.query.pno));
	var size =Math.floor(parseInt(req.query.size)); 
	// console.log(pno,size);
	//如果为空，给一个默认值
	if(!pno){
		pno = 1;
	}
	if(!size){
		size = 3
	}
	console.log(pno,size);
	//执行分页查询sql语句
	//计算开始查询的值 开始的值=（页数 - 1）*每页的记录数
	var start = (pno-1)*size;
	pool.query('select * from xz_user limit ?,?',
		[start,size],function(err,result){
			if(err) throw err;
			// console.log(result);
			if (result.length >0 ) {
				res.send(result);
				return;
			}else{
				res.send('查询失败');
				return;
			}
		});
});


//添加删除用户模块
router.get('/delete',function(req,res){
	var obj = req.query;
	// console.log(obj);
	//判断uid是否为空
	if(!obj.uid){
		res.send({code:401,msg:'uid required'});
	}
	pool.query('delete  from xz_user where uid=?',
		[obj.uid],function(err,result){
			if(err) throw err;
			if (result.affectedRows > 0) {
				res.send('删除成功');
				return;
			}else{
				res.send('删除失败');
				return;
			}
		});
});

//导出路由
module.exports=router;











