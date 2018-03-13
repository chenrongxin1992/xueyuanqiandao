var express = require('express');
var router = express.Router();
const qd = require('../db/xuqd')
const request = require('request')
const moment = require('moment')
const async = require('async')
moment.locale('zh-CN')

let MyServer = "http://116.13.96.53:81",
	//CASserver = "https://auth.szu.edu.cn/cas.aspx/",
	CASserver = 'https://authserver.szu.edu.cn/authserver/',
	ReturnURL = "http://116.13.96.53:81";


/* GET home page. */
router.get('/', function(req, res, next) {
	return res.redirect('/xyqd/qd?w=w')
  //res.render('index', { title: 'Express' });
});

//正则匹配
function pipei(str,arg){
	let zhengze = '<cas:' + arg + '>(.*)<\/cas:' + arg + '>' 
	let res = str.match(zhengze)
	if(res){
		return res[1]
	}else{
		return null
	}
}

router.get('/qd',function(req,res){
	if(!req.query.ticket){
		let ReturnURL = 'http://qiandao.szu.edu.cn:81/xyqd' + req.originalUrl
		console.log('ReturnURL url-->',ReturnURL)
		console.log('finalReturnURL--->','http://qiandao.szu.edu.cn:81/xyqd'+req.baseUrl)
		let url = CASserver + 'login?service=' + ReturnURL
		console.log('check redirecturl -->',url)
		console.log('跳转获取ticket')

		if(req.session.user){
			console.log('没有ticket,学生有session')
			console.log('session-->',req.session.user)
			let qddate = moment().format("YYYY-MM-DD"),
              	//qdtime = moment().format("hh:mm:ss"),
              	qdweek = moment().format("dddd"),
              	qdtype = moment().format("a")
            console.log(qddate,qdweek,qdtype)

            let search = qd.findOne({})
            	search.where('qddate').equals(qddate)
            	//search.where('qdtime').equals(qdtime)
            	search.where('qdweek').equals(qdweek)
            	search.where('qdtype').equals(qdtype)
            	search.where('cn').equals(req.session.user.cn)
            	search.exec(function(err,doc){
            		if(err){
            			console.log('search err-->',err)
            			return res.json({'code':-1,'msg':err})
            		}
            		if(doc){
            			console.log('doc-->',doc)
            			if(doc.shangban == 1){
            				console.log('上班签到过了')
            				res.render('qd', { 'user': req.session.user,'qdtype':'shangban' });
            			}else{
            				console.log('下班签到过了')
            				res.render('qd', { 'user': req.session.user,'qdtype':'xiaban' });
            			}
            		}
            		if(!doc){
            			console.log('没有签到')
            			res.render('qd', { 'user': req.session.user,'qdtype':'meiyou'});
            		}
            	})
		}
		else{
			console.log('没有ticket，去获取ticket')
			return res.redirect(url)
		}
	}
	else{
		if(req.session.user){
			console.log('有ticket,也有session')
			console.log('session-->',req.session.user)
			let qddate = moment().format("YYYY-MM-DD"),
              	//qdtime = moment().format("hh:mm:ss"),
              	qdweek = moment().format("dddd"),
              	qdtype = moment().format("a")
              	console.log(qddate,qdweek,qdtype)
            let search = qd.findOne({})
            	search.where('qddate').equals(qddate)
            	//search.where('qdtime').equals(qdtime)
            	search.where('qdweek').equals(qdweek)
            	search.where('qdtype').equals(qdtype)
            	search.where('cn').equals(req.session.user.cn)
            	search.exec(function(err,doc){
            		if(err){
            			console.log('search err-->',err)
            			return res.json({'code':-1,'msg':err})
            		}
            		if(doc){
            			console.log('doc-->',doc)
            			if(doc.shangban == 1){
            				console.log('上班签到过了')
            				res.render('qd', { 'user': req.session.user,'qdtype':'shangban' });
            			}else{
            				console.log('下班签到过了')
            				res.render('qd', { 'user': req.session.user,'qdtype':'xiaban' });
            			}
            		}
            		if(!doc){
            			console.log('没有签到')
            			res.render('qd', { 'user': req.session.user,'qdtype':'meiyou'});
            		}
            	})
		}
		else{
			let ReturnURL = 'http://qiandao.szu.edu.cn:81/xyqd' + req.originalUrl,
				finalReturnURL = 'http://qiandao.szu.edu.cn:81/xyqd'+req.baseUrl
			console.log('ReturnURL url-->',ReturnURL)
			console.log('req-->',req.baseUrl)//finalReturnURL
			console.log('you ticket, meiyou session')
			let ticket = req.query.ticket
			console.log('check ticket-->',ticket)
			let url = CASserver + 'serviceValidate?ticket=' + ticket + '&service=' + ReturnURL
			console.log('check url -->',url)
			request(url, function (error, response, body) {
				    if (!error && response.statusCode == 200) {
				    	console.log('body -- >',body)
				       let user = pipei(body,'user'),//工号
						   eduPersonOrgDN = pipei(body,'eduPersonOrgDN'),//学院
						   alias = pipei(body,'alias'),//校园卡号
						   cn = pipei(body,'cn'),//姓名
						   gender = pipei(body,'gender'),//性别
						   containerId = pipei(body,'containerId'),//个人信息（包括uid，）
						   nianji = null
						if(containerId){
							RankName = containerId.substring(18,21)//卡类别 jzg-->教职工
						}else{
							RankName = null
						}
						if(user){
						   	nianji = user.substring(0,4)
						}else{
						   	nianji = null
						}
						console.log('check final result -->',user,eduPersonOrgDN,alias,cn,gender,containerId,RankName)
						let arg = {}
							arg.nianji = nianji
						   	arg.user = user
						   	arg.eduPersonOrgDN = eduPersonOrgDN
						   	arg.alias = alias
						   	arg.cn = cn
						   	arg.gender = gender
						   	arg.containerId = containerId
						   	arg.RankName = RankName
						   	//arg.code = code
						   	//arg.stuXueHao = stuXueHao
						    console.log('check arg-->',arg)

						   console.log('check arg-->',arg)
						   if(arg.user == null){
						   		console.log('ticket is unvalid,重新回去获取ticket，清空session')
						   		delete req.session.user
						   		console.log('check req.session.user-->',req.session.user)
						   		console.log('ticket is unvalid')
						   		return res.redirect(finalReturnURL)
						   		//return res.json({'errCode':-1,'errMsg':'ticket is unvalid,请重新扫码！'})
						   }else{
						   		req.session.user = arg
						   		return res.redirect(finalReturnURL)
						   		//return res.redirect(ReturnURL)
						  }
				     }else{
				     	console.log(error)
				     }
			    })
		}
	}
}).post('/qd',function(req,res){
	let qddate = req.body.qddate,
		qdtime = req.body.qdtime,
		qdweek = req.body.qdweek,
		qdtype = req.body.qdtype,
		month = req.body.month
	console.log(qddate,qdtime,qdweek,qdtype)
	let shangban = 0,
		xiaban = 0
	if(qdtype == '上午'){
		shangban = 1
	}else{
		xiaban = 1
	}
	let new_qd = new qd({
		cn : req.session.user.cn,
		alias : req.session.user.alias,
		sex : req.session.user.sex,
		qddate : qddate,
		qdtime : qdtime,
		qdweek : qdweek,
		qdtype : qdtype,
		shangban : shangban,
		xiaban : xiaban,
		month : month
	})
	new_qd.save(function(err){
		if(err){
			console.log('err-->',err)
			return res.json({'code':-1,'mag':err})
		}
		return res.json({'code':0,'msg':'success'})
	})
})
router.get('logout',function(req,res){
	req.session.user = null
	req.session.student = null
	return res.redirect('/xyqd/qd')
})
router.get('/recordoverview',function(req,res){
	console.log('ddd')
	if(!req.query.ticket){
		let ReturnURL = 'http://qiandao.szu.edu.cn:81/xyqd' + req.originalUrl
		console.log('ReturnURL url-->',ReturnURL)
		console.log('finalReturnURL--->','http://qiandao.szu.edu.cn:81/xyqd'+req.baseUrl)
		let url = CASserver + 'login?service=' + ReturnURL
		console.log('check redirecturl -->',url)
		console.log('跳转获取ticket')

		if(req.session.user){
			console.log('没有ticket,学生有session')
			console.log('session-->',req.session.user)
			res.render('recordoverview', { 'user': req.session.user});
		}
		else{
			console.log('没有ticket，去获取ticket')
			return res.redirect(url)
		}
	}
	else{
		if(req.session.user){
			console.log('有ticket,也有session')
			console.log('session-->',req.session.user)
			res.render('recordoverview', { 'user': req.session.user});
		}
		else{
			let ReturnURL = 'http://qiandao.szu.edu.cn:81/xyqd' + req.originalUrl,
				finalReturnURL = 'http://qiandao.szu.edu.cn:81/xyqd'+req.baseUrl
			console.log('ReturnURL url-->',ReturnURL)
			console.log('req-->',req.baseUrl)//finalReturnURL
			console.log('you ticket, meiyou session')
			let ticket = req.query.ticket
			console.log('check ticket-->',ticket)
			let url = CASserver + 'serviceValidate?ticket=' + ticket + '&service=' + ReturnURL
			console.log('check url -->',url)
			request(url, function (error, response, body) {
				    if (!error && response.statusCode == 200) {
				    	console.log('body -- >',body)
				       let user = pipei(body,'user'),//工号
						   eduPersonOrgDN = pipei(body,'eduPersonOrgDN'),//学院
						   alias = pipei(body,'alias'),//校园卡号
						   cn = pipei(body,'cn'),//姓名
						   gender = pipei(body,'gender'),//性别
						   containerId = pipei(body,'containerId'),//个人信息（包括uid，）
						   nianji = null
						if(containerId){
							RankName = containerId.substring(18,21)//卡类别 jzg-->教职工
						}else{
							RankName = null
						}
						if(user){
						   	nianji = user.substring(0,4)
						}else{
						   	nianji = null
						}
						console.log('check final result -->',user,eduPersonOrgDN,alias,cn,gender,containerId,RankName)
						let arg = {}
							arg.nianji = nianji
						   	arg.user = user
						   	arg.eduPersonOrgDN = eduPersonOrgDN
						   	arg.alias = alias
						   	arg.cn = cn
						   	arg.gender = gender
						   	arg.containerId = containerId
						   	arg.RankName = RankName
						   	//arg.code = code
						   	//arg.stuXueHao = stuXueHao
						    console.log('check arg-->',arg)

						   console.log('check arg-->',arg)
						   if(arg.user == null){
						   		console.log('ticket is unvalid,重新回去获取ticket，清空session')
						   		delete req.session.user
						   		console.log('check req.session.user-->',req.session.user)
						   		console.log('ticket is unvalid')
						   		return res.redirect(finalReturnURL)
						   		//return res.json({'errCode':-1,'errMsg':'ticket is unvalid,请重新扫码！'})
						   }else{
						   		req.session.user = arg
						   		return res.redirect(finalReturnURL)
						   		//return res.redirect(ReturnURL)
						  }
				     }else{
				     	console.log(error)
				     }
			    })
		}
	}
})
router.get('/record',function(req,res){
	let month = req.query.m
	if(month.length == 1){
		month = '0' + month
	}
	let arr = []
	console.log('check month-->',month)
	let search = qd.find({})
		search.where('month').equals(month)
		search.sort({'cn':1})
		search.sort({'qddate':1})
		search.exec(function(err,doc){
			if(err){
				console.log('eachLimit err-->',err)
				return res.json({'code':-1,'msg':err})
				//callback(err)
			}
			if(doc){
				console.log('check doc-->',doc)
				arr.push(doc)
				console.log('check arr-->',arr)
				return res.json({'code':-1,'msg':arr})
				//callback()
			}
			if(!doc){
				console.log('no result')
				return res.json({'code':-1,'msg':'no result'})
			}
		})
})
module.exports = router;
