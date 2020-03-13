//数据信息查询
var user= {
	insert:"INSERT INTO user(pname,password,salt_value) VALUES(?,?,?)",
	checkAll:"SELECT * FROM user WHERE pname=? AND password=?",
	checkName:"SELECT * FROM user WHERE pname=?",
	checkPwd:"SELECT * FROM user WHERE password=?",
}

module.exports = user