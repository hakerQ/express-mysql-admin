const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const app = express()

// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 

//设置跨域访问 
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Cache-Control','no-cache');
	res.header('pragma','no-cache');
  next();
});


//引入user.js
const users = require('./routes/api/users.js')

//使用routes中间件
app.use('/', users)




//const port = process.env.PORT || 3000

app.listen(3000,()=>{
	console.log('3000服务已启动')
})