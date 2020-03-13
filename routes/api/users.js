const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const utils = require('./util.js')
const db = require('../../config/db.js')
const user = require('../../models/User.js')

// 注册接口
router.get('/register', function(req, res){
	//res.send(param)
	var param = req.query || req.params
	var name = param.userName
	var pwd = param.password
	var timestamp =  (new Date()).valueOf()
	var encrypt_pwd_service = utils.md5(utils.md5(utils.md5(name + utils.md5(pwd))) + timestamp)
	db.queryArgs(user.checkName,name, (err, result)=>{
		if(err) throw err
		else{
			if(result.length !==0 ){
				res.send({
					status: 0,
					message: '该用户名已被注册'
				})
				res.end()
			}else if(result.length == 0){
				db.queryArgs(user.insert,[name,encrypt_pwd_service,timestamp],(err, result)=>{
					if(err) throw err
					else{
						res.send({
							status:1,
							message:'恭喜,注册成功'
						})
						res.end()
					}
				})
			}
		}
	})	
})

// 登录接口
router.post('/login', function(req, res){
	// var name = req.body.userName
	// var pwd = req.body.password
	var {userName,password,token} = req.body
	console.log(userName,password,token)
	//var time = (new Date()).valueOf()
	//储存密码
	var encrypt_pwd = utils.md5(utils.md5(userName + utils.md5(password)))
	//客户端密码
	//var client = utils.md5(utils.md5(utils.md5(name + utils.md5(pwd))) + time)
	//服务端密码
	//var service = utils.md5(encrypt_pwd + time)
	let tokensecret ='josonwebtoken20200213'
	db.queryArgs(user.checkName, userName, (err, result) => {
		if(err) throw err
		else{
			if(result == 0){
				res.send({
					status:-1,
					message: '该用户不存在'
				})
				res.end()
			}else{
				let resp = result[0]
				let timestamp = resp.salt_value
				var encrypt_pwd_service = utils.md5(encrypt_pwd + timestamp)
				
				let token_id = {
					name_id: resp.pname,
					pwd_id:resp.password
				}
				// 生成token
				let userToken = jwt.sign(token_id,tokensecret,{expiresIn:180})
				if(resp.pname == userName && resp.password == encrypt_pwd_service){
					res.send({
						status:2,
						message: '恭喜,登录成功',
						token: userToken
					})
					res.end()
				}else{
					res.send({
						status:3,
						message:'密码错误'
					})
					res.end()
				}
			}
		}	
	})
})
module.exports = router