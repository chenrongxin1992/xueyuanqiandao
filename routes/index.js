var express = require('express');
var router = express.Router();
//const qd = require('../db/xuqd')
//const meeting = require('../db/db_structure').meeting
const add_qd = require('../db/add_db').add_qd
const people = require('../db/add_db').people
const qdrecord = require('../db/add_db').qdrecord
const wx_userinfo = require('../db/add_db').wx_userinfo
const wx_userinfo1 = require('../db/add_db').wx_userinfo1
const request = require('request')
const moment = require('moment')
const async = require('async')
moment.locale('zh-CN')

let MyServer = "http://qiandao.szu.edu.cn:81",
	//CASserver = "https://auth.szu.edu.cn/cas.aspx/",
	CASserver = 'https://authserver.szu.edu.cn/authserver/',
	ReturnURL = "http://qiandao.szu.edu.cn:81";

//小程序秘钥：d1c54ee1214d731cf7e99f5c7169157a
//小程序id：wx8b884fc33f7cb4da
//微信
const wx_appid = 'wx8b884fc33f7cb4da',
	  wx_secret = 'd1c54ee1214d731cf7e99f5c7169157a'
//获取openid
router.post('/getuseropenid',function(req,res){
	console.log('code---->',req.body.code)
	let code = req.body.code
	//https://api.weixin.qq.com/sns/jscode2session?appid=appid&secret=secret&js_code=jscode&grant_type=authorization_code
	let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + wx_appid + '&secret=' + wx_secret +
			  '&js_code=' + req.body.code + '&grant_type=authorization_code'
	request(url,function(error,response,body){
		if(!error && response.statusCode==200){
			console.log('body---->',body)
			return res.end(body)
		}else{
			console.log('something wrong ',error)
			return res.end(error)
		}
	})
})

//保存用户信息
router.post('/saveuserinfo',function(req,res){
	console.log('userinfo---->',req.body.userinfo)
	console.log('code---->',req.body.code)
	let code = req.body.code,userinfo = req.body.userinfo
	//https://api.weixin.qq.com/sns/jscode2session?appid=appid&secret=secret&js_code=jscode&grant_type=authorization_code
	let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + wx_appid + '&secret=' + wx_secret +
			  '&js_code=' + req.body.code + '&grant_type=authorization_code'
	request(url,function(error,response,body){
		if(!error && response.statusCode==200){
			
			body = JSON.parse(body)
			console.log('openid---->',body.openid)
			let search = add_qd.findOne({})
				search.where('state').equals(1)
				search.sort({'timestamp':-1})
				search.exec(function(finderr,ntdoc){
					if(finderr){
						res.end(finderr)
					}
					return res.json({'openid':body.openid,'notice':ntdoc})
				})
			// let search = wx_userinfo1.findOne({})
			// 	search.where('openid').equals(body.openid)
			// 	search.exec(function(searcherr,doc){
			// 		if(searcherr){
			// 			console.log('searcherr',searcherr)
			// 			return res.end(searcherr)
			// 		}
			// 		if(!doc){
			// 			console.log('没存在记录，保存,先找员工表看是否有该人')
			// 			let search = add_qd.findOne({})
			// 				search.where('state').equals(1)
			// 				search.sort({'timestamp':-1})
			// 				search.exec(function(finderr,ntdoc){
			// 				if(finderr){
			// 					res.end(finderr)
			// 				}
			// 				return res.json({'openid':body.openid,'notice':ntdoc})
			// 				})
			// 			// let search1 = people.findOne({})
			// 			// 	search1.where('cardno').equals(req.body.cardno)
			// 			// 	search1.exec(function(err1,doc1){
			// 			// 		if(err1){
			// 			// 			console.log('err1',err1)
			// 			// 			return res.end(err1)
			// 			// 		}
			// 			// 		// if(doc1){
			// 			// 		// 	console.log('有该员工')
			// 			// 		// 	let newwx_userinfo = new wx_userinfo1({
			// 			// 		// 		name : doc1.name,
			// 			// 		// 		cardno:doc1.cardno,
			// 			// 		// 		usertype:doc1.usertype,
			// 			// 		// 		userstate:doc1.userstate,
			// 			// 		// 		phone:doc1.phone,  
			// 			// 		// 		openid:(body.openid)?body.openid:null,
			// 			// 		// 		avatarUrl:(userinfo.avatarUrl)?userinfo.avatarUrl:null,
			// 			// 		// 		city:(userinfo.city)?userinfo.city:null,
			// 			// 		// 		country:(userinfo.country)?userinfo.country:null,
			// 			// 		// 		gender:(userinfo.gender)?userinfo.gender:null,
			// 			// 		// 		language:(userinfo.language)?userinfo.language:null,
			// 			// 		// 		nickName:(userinfo.nickName)?userinfo.nickName:null,
			// 			// 		// 		province:(userinfo.province)?userinfo.province:null
			// 			// 		// 	})
			// 			// 		// 	newwx_userinfo.save(function(err,peopleinfo){
			// 			// 		// 		if(err){
			// 			// 		// 			console.log('save userinfo err',err)
			// 			// 		// 			return res.end(err)
			// 			// 		// 		}
										
			// 			// 		// 	})
						
			// 			// 		// }
								
			// 			// 	})
			// 		}
			// 		if(doc && typeof(doc)!='undefined'){
			// 			console.log('存在记录，更新数据')
			// 			let search = add_qd.findOne({})
			// 				search.where('state').equals(1)
			// 				search.sort({'timestamp':-1})
			// 				search.exec(function(finderr,ntdoc){
			// 					if(finderr){
			// 						res.end(finderr)
			// 					}
			// 					return res.json({'openid':body.openid,'notice':ntdoc,'peopleinfo':doc})
			// 				})
			// 			// let obj = {
			// 			// 	avatarUrl:(userinfo.avatarUrl)?userinfo.avatarUrl:null,
			// 			// 	city:(userinfo.city)?userinfo.city:null,
			// 			// 	country:(userinfo.country)?userinfo.country:null,
			// 			// 	gender:(userinfo.gender)?userinfo.gender:null,
			// 			// 	language:(userinfo.language)?userinfo.language:null,
			// 			// 	nickName:(userinfo.nickName)?userinfo.nickName:null,
			// 			// 	province:(userinfo.province)?userinfo.province:null
			// 			// }
			// 			// wx_userinfo1.updateOne({'openid':body.openid},obj,function(updateerr){
			// 			// 	if(updateerr){
			// 			// 		console.log('updateerr',updateerr)
			// 			// 		return res.end(updateerr)
			// 			// 	}
							
			// 			// 	//return res.json({'openid':body.openid})
			// 			// })
			// 		}
			// 	})
		}else{
			console.log('something wrong ',error)
			return res.json({'msg':error})
		}
	})
})
//已有用户信息，直接跳到主页
router.post('/wx_getnoticecode',function(req,res){
	let search = add_qd.findOne({})
		search.where('state').equals(1)
		search.sort({'timestamp':-1})
		search.exec(function(finderr,ntdoc){
			if(finderr){
				res.end(finderr)
			}
			return res.json({'notice':ntdoc})
		})
})
//返回最新通知信息
router.post('/wx_newqd',function(req,res){
	let search = add_qd.findOne({})
		//search.where('state').equals(1)
		search.where('code').equals(req.body.code)
		search.sort({'timestamp':-1})
		search.exec(function(finderr,ntdoc){
			if(finderr){
				res.end(finderr)
			}
			
			if(req.body.openid){
				let search1 = wx_userinfo1.findOne({})
					search1.where('openid').equals(req.body.openid)
					search1.exec(function(wxerr,wxdoc){
						if(wxerr){
							console.log('search1 wxerr',wxerr)
							res.end(wxerr)
						}
						if(!wxdoc){
							console.log('还没绑定该人员信息')
							return res.json({'notice':ntdoc,'wxdoc':null})
						}
						if(wxdoc){
							console.log('有该人信息，返回')
							return res.json({'notice':ntdoc,'wxdoc':wxdoc})
						}
					})
				}else{
					return res.json({'notice':ntdoc,'wxdoc':null})
				}
			
		})
})
//签到
router.post('/wx_add_qd_1',function(req,res){
	async.waterfall([
		function(cb){
			//是否已有记录
			let search = qdrecord.findOne({})
				search.where('cardno').equals(req.body.cardno)
				search.where('code').equals(req.body.code)
				search.exec(function(err,doc){
					console.log(err,doc)
					if(err){
						cb(err)
					}
					if(!doc){
						console.log('1111')
						cb(null,null)
					}
					if(doc){
						console.log('2222')
						cb(null,'已知悉，直接跳转')
					}
				})
		},
		function(docc,cb){
			if(docc){
				console.log('已有记录，跳过')
				cb(null,docc)
			}else{
				console.log('没有签到记录')

			let search = people.findOne({})
				search.where('cardno').equals(req.body.cardno)
				search.exec(function(err,doc){
				if(err){
					cb(err)
					//return res.json({'code':-1,'msg':err})
				}
				if(doc==null){
					cb(1,'请输入有效的校园卡号')
					//return res.json({'code':-1,'msg':'请输入有效的校园卡号'})
				}
				if(doc!=null){
					console.log('存在该人,看人员属性是否在筛选的人里面',doc)
					let tempchoose = '1'
					if(doc.usertype=='管理技术岗'){
						tempchoose = '1'
					}else if(doc.usertype=='教师岗'){
						tempchoose='2'
					}else if(doc.usertype=='博士后'){
						tempchoose='3'
					}else{
						tempchoose='4'
					}
					let search1 = add_qd.findOne({'choose':{'$regex':tempchoose}})
						search1.where('code').equals(req.body.code)
						search1.exec(function(error1,doc1){
							if(error1){
								cb(error1)
							}
							else if(doc1){
								console.log('在本次签到范围')
								console.log('增加微信用户信息，先存该人信息，再存签到记录')
								console.log('判断有没有记录，有的话人员信息就不存了')
								let newsearch = wx_userinfo1.findOne({})
									newsearch.where('openid').equals(req.body.wxinfo.openid)
									newsearch.exec(function(new_wxerr,new_wxdoc){
										if(new_wxerr){
											console.log('220---',new_wxerr)
											cb(new_wxerr)
										}
										if(!new_wxdoc){
											console.log('没记录，保存----')
											let newwx_userinfo = new wx_userinfo1({
												name : doc.name,
											    cardno:doc.cardno,
											    usertype:doc.usertype,
											    userstate:doc.userstate,
											    phone:doc.phone,  
											    openid:req.body.wxinfo.openid,
											    avatarUrl : req.body.wxinfo.avatarUrl,
											    city:(req.body.wxinfo.city)?req.body.wxinfo.city:null,
											    country:(req.body.wxinfo.country)?req.body.wxinfo.country:null,
											    gender:(req.body.wxinfo.gender)?req.body.wxinfo.gender:null,
											    language:(req.body.wxinfo.language)?req.body.wxinfo.language:null,
											    nickName:req.body.wxinfo.nickName,
											    province:(req.body.wxinfo.province)?req.body.wxinfo.province:null
											})
											newwx_userinfo.save(function(wxerr){
												if(wxerr){
													console.log('存完整微信用户信息失败',wxerr)
													return false
												}
												console.log('存完整微信用户信息成功')
												let new_qdrecord = new qdrecord({
						            				code:req.body.code,
						            				name:doc.name,
						            				cardno:doc.cardno,
						            				usertype : doc.usertype,
						            				userstate:doc.userstate,
						            				phone:doc.phone,
						            				openid:req.body.wxinfo.openid,
												    avatarUrl : req.body.wxinfo.avatarUrl,
												    city:(req.body.wxinfo.city)?req.body.wxinfo.city:null,
												    country:(req.body.wxinfo.country)?req.body.wxinfo.country:null,
												    gender:(req.body.wxinfo.gender)?req.body.wxinfo.gender:null,
												    language:(req.body.wxinfo.language)?req.body.wxinfo.language:null,
												    nickName:req.body.wxinfo.nickName,
												    province:(req.body.wxinfo.province)?req.body.wxinfo.province:null
						            			})
						            			new_qdrecord.save(function(err){
						            				if(err){
						            					console.log('保存记录',err)
						            					return res.end(err)
						            				}
						            				cb()
						            			})
											})
										}
										if(new_wxdoc){
											console.log('有绑定记录，跳过这步')
											let new_qdrecord = new qdrecord({
						            				code:req.body.code,
						            				name:doc.name,
						            				cardno:doc.cardno,
						            				usertype : doc.usertype,
						            				userstate:doc.userstate,
						            				phone:doc.phone,
						            				openid:req.body.wxinfo.openid,
												    avatarUrl : req.body.wxinfo.avatarUrl,
												    city:(req.body.wxinfo.city)?req.body.wxinfo.city:null,
												    country:(req.body.wxinfo.country)?req.body.wxinfo.country:null,
												    gender:(req.body.wxinfo.gender)?req.body.wxinfo.gender:null,
												    language:(req.body.wxinfo.language)?req.body.wxinfo.language:null,
												    nickName:req.body.wxinfo.nickName,
												    province:(req.body.wxinfo.province)?req.body.wxinfo.province:null
						            			})
						            			new_qdrecord.save(function(err){
						            				if(err){
						            					console.log('保存记录',err)
						            					return res.end(err)
						            				}
						            				cb()
						            			})
										}
									})
							}
							else{
								console.log('不在本次签到范围')
								cb(1,'你不在本次通知范围')
							}
						})//search1
	            }//doc!=null
			})
		}
	}
	],function(error,result){
		if(error){
			return res.json({'code':-1,'msg':result})
		}
		return res.json({'code':0,'msg':result})
	})
	
})
router.get('/wx_index', function(req, res, next) {
	let search = add_qd.findOne({})
		search.where('state').equals(1)
		search.sort({'timestamp':-1})
		search.exec(function(err,doc){
			if(err){
				return res.end(err)
			}
			//return res.redirect('/xyqd/newqd?code='+doc.code+'&w=w')
			return res.redirect('/newqd?code='+doc.code+'&w=w')
		})
  //res.render('index', { title: 'Express' });
});
//获取通知列表
router.post('/wx_getnoticelist',function(req,res){
	let search = add_qd.find({})
		search.where('state').equals(1)
		search.sort({'timestamp':-1})
		search.exec(function(finderr,ntdoc){
			if(finderr){
				res.end(finderr)
			}
			res.json({'noticelist':ntdoc})
		})
})
//网页版
/* GET home page. qiandao.szu.edu.cn:81/xyqd/newqd?code=3639vjh7&w=w*/
router.get('/', function(req, res, next) {
	let search = add_qd.findOne({})
		search.where('state').equals(1)
		search.sort({'timestamp':-1})
		search.exec(function(err,doc){
			if(err){
				return res.end(err)
			}
			return res.redirect('/xyqd/newqd?code='+doc.code+'&w=w')
			//return res.redirect('/newqd?code='+doc.code+'&w=w')
		})
  //res.render('index', { title: 'Express' });
});

router.post('/changestate',function(req,res){
	async.waterfall([
		// function(cb){
		// 	add_qd.updateOne({'state':1},{'state':0},function(err){
		// 		if(err){
		// 			cb(err)
		// 		}
		// 		cb()
		// 	})
			
		// },
		function(cb){
			let search = add_qd.findOne({})
				search.where('code').equals(req.body.code)
				search.exec(function(err,doc){
					if(err){
						cb(err)
					}
					add_qd.updateOne({'_id':doc._id},{'state':1},function(error){
						if(error){
							cb(error)
						}
						cb()
					})
				})
		}
		],function(error,result){
			if(error){
				return res.json({'code':-1,'msg':error})
			}
			return res.json({'code':0,'msg':'success'})
		})
	
})

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
//add_qd
router.get('/add_qd',function(req,res){
	res.render('add_qd', { title: '添加签到事件'});
}).post('/add_qd',function(req,res){
	let title = req.body.title,
		content = req.body.content
	console.log('title ----- ',title)
	let temp_timeStamp = moment().format('X'),
		temp_num = temp_timeStamp.substring(6),
		temp_randomStr = random_str(),
		randomStr = temp_num + temp_randomStr
	let new_addqd = new add_qd({
		title:title,
		content:content,
		link:baselink+randomStr+'&w=w',
		code:randomStr,
		choose:req.body.choose
	})
	new_addqd.save(function(error){
		if(error){
			console.log('save new_addqd error',error)
			return res.json({'code':-1,'msg':error})
		}
		return res.json({'code':0,'msg':'success'})
	})
})
//qdlink
router.get('/qdlink',function(req,res){
	res.render('qdlink')
}).get('/qdlink_data',function(req,res){
	let page = req.query.page,
		limit = req.query.limit
	page ? page : 1;//当前页
	limit ? limit : 15;//每页数据
	let total = 0
	console.log('page limit',page,limit)
	async.waterfall([
		function(cb){
			//get count
			let search = add_qd.find({}).count()
				search.exec(function(err,count){
					if(err){
						console.log('qdlink_data get total err',err)
						cb(err)
					}
					console.log('qdlink_data count',count)
					total = count
					cb(null)
				})
		},
		function(cb){//$or:[{year:2018},{year:/2018/}]//{$or:[{name:name},{principal:principal},{year:year},{year:{$regex:year}}]}
			let numSkip = (page-1)*limit
				limit = parseInt(limit)
				console.log('不带搜索参数')
				let search = add_qd.find({})
					//search.where('beizhu').equals('1')
					//search.sort({'publishyear':-1})//正序
					search.limit(limit)
					search.skip(numSkip)
					search.sort({'timestamp':-1})
					search.exec(function(error,docs){
						if(error){
							console.log('qdlink_data error',error)
							cb(error)
						}
						cb(null,docs)
					})		
		}
	],function(error,result){
		if(error){
			console.log('qdlink_data async waterfall error',error)
			return res.json({'code':-1,'msg':err.stack,'count':0,'data':''})
		}
		console.log('qdlink_data async waterfall success')
		let tempresult = []
		result.forEach(function(item,index){
			//console.log('dd',item)
			let tempitem = {}
			tempitem.title = item.title
			tempitem.content = item.content
			tempitem.link = item.link
			tempitem.code = item.code
			tempitem._id = item._id
			tempitem.state = item.state
			let choose = (item.choose).split(','),choose1=''
			//console.log(typeof(choose),choose)
			choose.forEach(function(newitem,newindex){
				//console.log('ww',newitem)
				if(newitem==1){
					choose1 =  choose1 + '管理技术岗,'
				}
				else if(newitem==2){
					choose1 = choose1 + '教师岗,'
				}
				else if(newitem==3){
					choose1 = choose1 + '博士后,'
				}
				else{
					choose1 = choose1 + '专职研究人员'
				}
			})
			console.log('choose1',choose1)
			tempitem.choose1 = choose1
			console.log('tempitem',tempitem)
			tempresult.push(tempitem)
		})
		//result.choose1 = choose1
		return res.json({'code':0,'msg':'获取数据成功','count':total,'data':tempresult})
	})
})
const path = require('path')
const uploadDir = path.resolve(__dirname, '../uploads');
const multiparty = require('multiparty')
const ejsExcel = require('ejsexcel')
const fs = require('fs')
router.get('/newpeople',function(req,res){
	let	new_people = new people({
						    name : '彭小刚',
						    cardno : '14759',
						    usertype : '教师岗',
						    userstate : '在职',
						    phone : 'xx'
						})
						new_people.save(function(err){
						    if(err){						    	
						    	cb(err)
						    }
						    return res.end('ok')
						})
})
//fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir)
//导入人员
router.post('/excelimport',function(req,res){
	console.log('in excelimport router')
	var form = new multiparty.Form();
    //设置编码
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = uploadDir
    fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir)
    console.log('form.uploadDir-->',form.uploadDir)
    //设置单文件大小限制
    //form.maxFilesSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和
    
    form.parse(req, function(err, fields, files) {
    	if(err){
    		console.log('parse err',err.stack)
    	}
    	else{
    		console.log('fields->',fields)
    		console.log('files->',files)
    		//同步重命名文件名
		    //fs.renameSync(files.path,files.originalFilename);
		    console.log('读取文件路径-->',files.file[0].path)

		    let exBuf=fs.readFileSync(files.file[0].path)
		    console.log('exBuf-->',exBuf)
		    //使用ejsExcel的getExcelArr将buffer读取为数组
		    ejsExcel.getExcelArr(exBuf).then(exlJson=>{
		    	console.log("---------------- read success:getExcelArr ----------------");
			    let workBook=exlJson;
			    let workSheets=workBook[0];//第一个工作表
			    console.log('workBook-->',workBook)
			    console.log('workSheets-->',workSheets)
			    //res.end(workSheets)
			    //return false
			    let count = 0//计数，排除第一行
			    async.eachLimit(workSheets,1,function(item,cb){
					if(count === 0){
					    count++
					    cb()
					}else{					   
					    console.log('check item-->',item.length)
						let	new_people = new people({
						    name : item[0].trim(),
						    cardno : item[1].trim(),
						    usertype : item[2].trim(),
						    userstate : item[3].trim()//,
						    //phone : item[4].trim()
						})
						new_people.save(function(err){
						    if(err){						    	
						    	cb(err)
						    }
						    cb()
						})
						    	//cb()
					}//排除第一行
				},function(err){
					if(err){
					    console.log('async err')
					    return res.json({'code':-1,'msg':err.stack})
					}else{
					   	//删除上传的文件
						console.log('----- 删除上传文件 -----')
						fs.unlinkSync(files.file[0].path)
						return res.json({'code':0,'msg':'导入成功'})
					}
			})//async	 			    
			}).catch(error=>{
				console.log("************** 读表 error!");
				console.log(error); 
				return res.json({'code':-1,'msg':error})
			});
   		}//err
    })//form
})
router.get('/checkpeolist',function(req,res){
	let search = people.find({})
		search.sort({'usertype':-1})
		search.sort({'cardno':1})
		search.exec(function(err,docs){
			if(err){
				return res.end(err)
			}
			return res.render('checkpeolist',{'data':docs})
		})
}).post('/add_people',function(req,res){
	let search = people.findOne({})
		search.where('cardno').equals(req.body.cardno)
		search.exec(function(err,doc){
			if(err){
				return res.json({'code':-1,'msg':err})
			}
			if(doc){
				return res.json({'code':-1,'msg':'该卡号已存在'})
			}
			if(!doc){
				let newpeople = new people({
					name:req.body.name,
					cardno:req.body.cardno,
					usertype:req.body.usertype,
					userstate:req.body.userstate,
					phone:req.body.phone
				})
				newpeople.save(function(err){
					if(err){
						return res.json({'code':-1,'msg':err})
					}
					return res.json({'code':0,'msg':'success'})
				})
			}
		})
	
}).get('/addpeople',function(req,res){
	res.render('addpoeple')
})
//删除事项
router.post('/qddel',function(req,res){
	add_qd.deleteOne({'_id':req.body._id},function(err){
		if(err){
			console.log('deleteOne err',err)
			return res.json({'code':-1,'msg':err})
		}
		return res.json({'code':0,'msg':'deleteOne success'})
	})
})
//随机生成字符串
/*
*js生成随即字符串原来如此简单
*toString() radix argument must be between 2 and 36
*/
function random_str() {
	let str =  Math.random().toString(36).substring(5, 9)//4位长度
    return str
}
const baselink = 'qiandao.szu.edu.cn:81/xyqd/newqd?code='
router.get('/newqd',function(req,res){
	let search = add_qd.findOne({})
		search.where('code').equals(req.query.code)
		search.exec(function(err,doc){
			if(err){
				res.end(err)
			}
			// if(doc.content==null){
			// 	doc.content = ''
			// }
			res.render('newqd',{'data':doc})
		})
}).post('/add_qd_1',function(req,res){
	async.waterfall([
		function(cb){
			let search = qdrecord.findOne({})
				search.where('cardno').equals(req.body.cardno)
				search.where('code').equals(req.body.code)
				search.exec(function(err,doc){
					console.log(err,doc)
					if(err){
						cb(err)
					}
					if(!doc){
						console.log('1111')
						cb(null,null)
					}
					if(doc){
						console.log('2222')
						cb(null,'已知悉，直接跳转')
					}
				})
		},
		function(docc,cb){
			if(docc){
				console.log('已有记录，跳过')
				cb(null,docc)
			}else{
				console.log('没有签到记录')

			let search = people.findOne({})
				search.where('cardno').equals(req.body.cardno)
				search.exec(function(err,doc){
				if(err){
					cb(err)
					//return res.json({'code':-1,'msg':err})
				}
				if(doc==null){
					cb(1,'请输入有效的校园卡号')
					//return res.json({'code':-1,'msg':'请输入有效的校园卡号'})
				}
				if(doc!=null){
					console.log('存在该人,看人员属性是否在筛选的人里面',doc)
					let tempchoose = '1'
					if(doc.usertype=='管理技术岗'){
						tempchoose = '1'
					}else if(doc.usertype=='教师岗'){
						tempchoose='2'
					}else if(doc.usertype=='博士后'){
						tempchoose='3'
					}else{
						tempchoose='4'
					}
					let search1 = add_qd.findOne({'choose':{'$regex':tempchoose}})
						search1.where('code').equals(req.body.code)
						search1.exec(function(error1,doc1){
							if(error1){
								cb(error1)
							}
							else if(doc1){
								console.log('在本次签到范围')
								let new_qdrecord = new qdrecord({
		            				code:req.body.code,
		            				name:doc.name,
		            				cardno:doc.cardno,
		            				usertype : doc.usertype,
		            				userstate:doc.userstate,
		            				phone:doc.phone
		            			})
		            			new_qdrecord.save(function(err){
		            				if(err){
		            					console.log('保存记录',err)
		            					return res.end(err)
		            				}
		            				cb()
		            				//return res.json({'code':0,'msg':'success'})
		            				//res.setHeader('Content-Type', 'text/plain;charset=utf-8');
		            				//res.end('已保存，显示签到记录')
		            				//let viewurl = 'http://qiandao.szu.edu.cn:81/xyqd/viewqdstate?code='+req.query.code
		            				//res.redirect(viewurl)
		            			})
							}
							else{
								console.log('不在本次签到范围')
								cb(1,'你不在本次通知范围')
							}
						})//search1
					
	            }//doc!=null
			})
		}
	}
	],function(error,result){
		if(error){
			return res.json({'code':-1,'msg':result})
		}
		return res.json({'code':0,'msg':result})
	})
	
})
router.get('/newqd_1',function(req,res){
	if(!req.query.ticket){
		let ReturnURL = 'http://qiandao.szu.edu.cn:81/xyqd' + req.originalUrl
		console.log('ReturnURL url-->',ReturnURL)
		console.log('finalReturnURL--->','http://qiandao.szu.edu.cn:81/xyqd'+req.baseUrl)
		let url = CASserver + 'login?service=' + ReturnURL
		console.log('check redirecturl -->',url)
		console.log('跳转获取ticket')

		if(req.session.user){
			console.log('没有ticket,有session')
			console.log('session-->',req.session.user)
            let search = qdrecord.findOne({})
            	search.where('cardno').equals(req.session.user.alias)
            	search.where('code').equals(req.query.code)
            	search.exec(function(err,doc){
            		if(err){
            			console.log('search err-->',err)
            			return res.json({'code':-1,'msg':err})
            		}
            		if(doc){
            			console.log('有记录，证明已经收到通知')
            			let viewurl = 'http://qiandao.szu.edu.cn:81/xyqd/viewqdstate?code='+req.query.code
            			res.redirect(viewurl)
            			//res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            			//res.end('有记录，证明已经收到通');
            		}
            		if(!doc){
            			console.log('无记录，添加记录保存')
            			let new_qdrecord = new qdrecord({
            				code:req.query.code,
            				name:req.session.user.cn,
            				cardno:req.session.user.alias,
            				usertype : req.session.user.usertype,
            				userstate:req.session.user.userstate,
            				phone:req.session.user.phone
            			})
            			new_qdrecord.save(function(err){
            				if(err){
            					console.log('保存记录',err)
            					return res.end(err)
            				}
            				res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            				//res.end('已保存，显示签到记录')
            				let viewurl = 'http://qiandao.szu.edu.cn:81/xyqd/viewqdstate?code='+req.query.code
            				res.redirect(viewurl)
            			})
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
            let search = qdrecord.findOne({})
            	search.where('cardno').equals(req.session.user.alias)
            	search.where('code').equals(req.query.code)
            	search.exec(function(err,doc){
            		if(err){
            			console.log('search err-->',err)
            			return res.json({'code':-1,'msg':err})
            		}
            		if(doc){
            			//res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            			console.log('有记录，证明已经收到通知')
            			//res.end('有记录，证明已经收到通,显示该通知签到情况');
            			let viewurl = 'http://qiandao.szu.edu.cn:81/xyqd/viewqdstate?code='+req.query.code
            			res.redirect(viewurl)
            		}
            		if(!doc){
            			console.log('无记录，添加记录保存')
            			let new_qdrecord = new qdrecord({
            				code:req.query.code,
            				name:req.session.user.cn,
            				cardno:req.session.user.alias,
            				usertype : req.session.user.usertype,
            				userstate:req.session.user.userstate,
            				phone:req.session.user.phone
            			})
            			new_qdrecord.save(function(err){
            				if(err){
            					console.log('保存记录',err)
            					return res.end(err)
            				}
            				res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            				let viewurl = 'http://qiandao.szu.edu.cn:81/xyqd/viewqdstate?code='+req.query.code
            				res.redirect(viewurl)
            				//res.end('已保存，显示签到记录')
            			})
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
				       let user = pipei(body,'user') ,//工号
						   eduPersonOrgDN = pipei(body,'eduPersonOrgDN') ,//学院
						   alias = pipei(body,'alias') ,//校园卡号
						   cn = pipei(body,'cn') ,//姓名
						   gender = pipei(body,'gender'),//性别
						   containerId = pipei(body,'containerId'),//个人信息（包括uid，）
						   nianji = null
						console.log('user--->',user)
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
						//return false
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
						   		req.session.user = null
						   		console.log('check req.session.user-->',req.session.user)
						   		console.log('ticket is unvalid')
						   		return res.redirect(finalReturnURL)
						   		//return res.json({'errCode':-1,'errMsg':'ticket is unvalid,请重新扫码！'})
						   }else{
						   		let search = people.findOne({})
						   			search.where('cardno').equals(arg.alias)
						   			search.exec(function(err,doc){
						   				if(err){
						   					console.log('err',err)
						   					return false
						   				}

						   				if(doc){
						   					arg.usertype = doc.usertype
						   					arg.userstate = doc.userstate
						   					arg.phone = doc.phone
						   					req.session.user = arg
						   					console.log('finalReturnURL--->',finalReturnURL)
						   					return res.redirect(ReturnURL)
						   				}
						   			})				
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
	if(qdtype == '上午' || qdtype == '早上'){
		qdtype = '上午'
		shangban = 1
	}else{
		qdtype = '下午'
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
}).get('/viewqdstate_',function(req,res){
	let allpeople = [],yqd = [],wqd = [],shijian,querytype = '',querytype1=''
	async.waterfall([
		function(cb){
			let search = qdrecord.find({})
				search.where('code').equals(req.query.code)
				search.sort({'usertype':-1})
				search.sort({'cardno':1})
				search.exec(function(error,docs){
					if(error){
						cb(error)
					}
					if(docs.length==0){
						cb('还没有人签到')
					}
					if(docs.length!=0){
						yqd = docs
						cb(null)
					}
				})
		},
		function(cb){
			let search = add_qd.findOne({})
				search.where('code').equals(req.query.code)
				search.exec(function(err,doc){
					if(err){
						cb(err)
					}
					shijian = doc
					querytype = shijian.choose.split(',')
					querytype.forEach(function(item,index){
						if(item==1){
							querytype1=querytype1+'管理技术岗,'
						}
						if(item==2){
							querytype1 = querytype1+'教师岗,'
						}
						if(item==3){
							querytype1=querytype1+'博士后,'
						}
						if(item==4){
							querytype1 = querytype1 + '专职研究人员'
						}
					})
					cb()
				})
		},
		function(cb){
			console.log('querytype1---->',querytype1)
			return false
			let search = people.find({'usertype':{$regex:querytype1}})
				search.sort({'usertype':-1})
				search.sort({'cardno':1})
				search.exec(function(error,docs){
					if(error){
						cb(error)
					}
					if(docs.length==0){
						cb('人员列表为空')
					}
					if(docs.length!=0){
						allpeople = docs
						cb(null)
					}
				})
		},
		function(cb){
			//async.each(yqd,1,function())
			console.log('所有人------------',allpeople.length)
			console.log('已知悉------------',yqd.length)
			allpeople.forEach(function(item,index){
				console.log('外循环人数',allpeople.length)
				yqd.forEach(function(newitem,newindex){
					if(item.cardno == newitem.cardno){
						console.log('当前名单',item.name,newitem.name)
						//console.log('//有一个已签到')
						if (allpeople.indexOf(item) > -1) {
                            let i = allpeople.indexOf(item);
                            allpeople.splice(i, 1);
                            console.log('删除第几个-----',i+1)
                            console.log('剩下名单多少人',allpeople.length)
                        }
					}else{
						//console.log('未签到push进数组wqd')
						//wqd.push(item)
						//wqd = uniqObjInArray(wqd)
						// if(wqd.length>225){
						// 	wqd = []
						// }
					}
				})
			})

			wqd = allpeople
			cb()
		}//,
		// function(cb){
		// 	let search = add_qd.findOne({})
		// 		search.where('code').equals(req.query.code)
		// 		search.exec(function(err,doc){
		// 			if(err){
		// 				cb(err)
		// 			}
		// 			shijian = doc
		// 			cb()
		// 		})
		// }
	],function(error,result){
		if(error){
			console.log('async waterfall err',error)
			return res.end(error)
		}
		//res.json({'yqd':yqd,'wqd':wqd})
		return res.render('viewqdstate',{'yqd':yqd,'wqd':wqd,'shijian':shijian})
	})
}).get('/viewqdstate',function(req,res){
	let allpeople = [],yqd = [],wqd = [],shijian,querytype = '',querytype1=''
	async.waterfall([
		function(cb){
			let search = qdrecord.find({})
				search.where('code').equals(req.query.code)
				search.sort({'usertype':-1})
				search.sort({'cardno':1})
				search.exec(function(error,docs){
					if(error){
						cb(error)
					}
					if(docs.length==0){
						cb('还没有人签到')
					}
					if(docs.length!=0){
						yqd = docs
						cb(null)
					}
				})
		},
		function(cb){
			let search = add_qd.findOne({})
				search.where('code').equals(req.query.code)
				search.exec(function(err,doc){
					if(err){
						cb(err)
					}
					shijian = doc
					querytype = shijian.choose.split(',')
					querytype.forEach(function(item,index){
						if(item==1){
							querytype1=querytype1+'管理技术岗;'
						}
						if(item==2){
							querytype1 = querytype1+'教师岗;'
						}
						if(item==3){
							querytype1=querytype1+'博士后;'
						}
						if(item==4){
							querytype1 = querytype1 + '专职研究人员'
						}
					})
					cb()
				})
		},
		function(cb){
			console.log('querytype1--->',querytype1)
			//return false
			querytype1 = querytype1.split(';')
			async.eachLimit(querytype1,1,function(item,callback){
				console.log('item',item)
				if(item){
					let search = people.find({'usertype':{'$regex':item}})
					//search.sort({'usertype':-1})
					search.sort({'cardno':1})
					search.exec(function(error,docs){
						if(error){
							callback(error)
						}
						if(docs.length==0){
							allpeople.unshift(null)
							callback()
							//cb('人员列表为空')
						}
						if(docs.length!=0){
							console.log('dddd',docs.length)
							docs.forEach(function(newitem,newindex){
								allpeople.push(newitem)
							})

							callback()							//cb(null)
						}
					})
				}else{
					callback()
				}
				
			},function(error){
				if(error){
					cb(error)
				}
				console.log('allpeople',allpeople.length)
				//return
				cb()
			})
			// let search = people.find({})
			// 	search.sort({'usertype':-1})
			// 	search.sort({'cardno':1})
			// 	search.exec(function(error,docs){
			// 		if(error){
			// 			cb(error)
			// 		}
			// 		if(docs.length==0){
			// 			cb('人员列表为空')
			// 		}
			// 		if(docs.length!=0){
			// 			allpeople = docs
			// 			cb(null)
			// 		}
			// 	})
		},
		function(cb){
			//限制并发个数
			wqd = allpeople
			console.log('wqd 人数',wqd.length,yqd.length)
			async.eachLimit(yqd,1,function(item,callback){
				console.log('可以到这里')
				removeArr(wqd,item)
				console.log('wqd 人数',wqd.length,yqd.length)
				callback()
			},function(err){
				if(err){
					console.log('err',err)
					return res.json(err)
				}
				//console.log('newarr',wqd)
				cb()
				//return res.json(wqd.length)
			})
			
			// async.eachLimit(allpeople,1,function(item,callback){
			// 	console.log('dddd')
			// 	async.eachLimit(yqd,1,function(newitem,callback1){
			// 		if(item.cardno == newitem.cardno){
			// 			console.log('找到-----删除')
			// 			let i = allpeople.indexOf(item)
			// 			allpeople.splice(i,1)
			// 			callback1();
			// 		}else{
			// 			//wqd.push(item)
			// 			console.log('没找到')
			// 			callback1();
			// 		}
			// 	},function(err){
			// 		if(err){
			// 			console.log('内循环出错')
			// 			callback(err)
			// 		}
			// 		wqd.push(item)
			// 	    console.log("result");
			// 	    callback();
			// 	});
			// },function(err1){
			// 	if(err1){
			// 		console.log('外循环出错')
			// 		return res.end(err1)
			// 	}
			//     console.log("result:"+wqd);
			//     return res.json(wqd.length)
			//     cb()
			// });
		}//,
		// function(cb){
		// 	let search = add_qd.findOne({})
		// 		search.where('code').equals(req.query.code)
		// 		search.exec(function(err,doc){
		// 			if(err){
		// 				cb(err)
		// 			}
		// 			shijian = doc
		// 			cb()
		// 		})
		// }
	],function(error,result){
		if(error){
			console.log('async waterfall err',error)
			return res.end(error)
		}
		//res.json({'yqd':yqd,'wqd':wqd})
		return res.render('viewqdstate',{'yqd':yqd,'wqd':wqd,'shijian':shijian})
	})
}).post('/delpeople',function(req,res){
	people.deleteOne({'_id':req.body._id},function(err){
		if(err){
			console.log('deleteOne err',err)
			return res.json({'code':-1,'msg':err})
		}
		return res.json({'code':0,'msg':'deleteOne success'})
	})
}).get('/wx_viewqdstate',function(req,res){
	console.log('code---->',req.query.code)
	let allpeople = [],yqd = [],wqd = [],shijian,querytype = '',querytype1=''
	async.waterfall([
		function(cb){
			let search = qdrecord.find({})
				search.where('code').equals(req.query.code)
				search.sort({'usertype':-1})
				search.sort({'cardno':1})
				search.exec(function(error,docs){
					console.log('check doc---->',docs.length)
					if(error){
						cb(error)
					}
					if(docs.length==0){
						cb('还没有人签到')
					}
					if(docs.length!=0){
						yqd = docs
						cb(null)
					}
				})
		},
		function(cb){
			let search = add_qd.findOne({})
				search.where('code').equals(req.query.code)
				search.exec(function(err,doc){
					if(err){
						cb(err)
					}
					shijian = doc
					querytype = shijian.choose.split(',')
					querytype.forEach(function(item,index){
						if(item==1){
							querytype1=querytype1+'管理技术岗,'
						}
						if(item==2){
							querytype1 = querytype1+'教师岗,'
						}
						if(item==3){
							querytype1=querytype1+'博士后,'
						}
						if(item==4){
							querytype1 = querytype1 + '专职研究人员'
						}
					})
					cb()
				})
		},
		function(cb){
			console.log('querytype1--->',querytype1)
			//return false
			querytype1 = querytype1.split(',')
			async.eachLimit(querytype1,1,function(item,callback){
				console.log('item',item)
				if(item){
					let search = people.find({'usertype':{'$regex':item}})
					//search.sort({'usertype':-1})
					search.sort({'cardno':1})
					search.exec(function(error,docs){
						if(error){
							callback(error)
						}
						if(docs.length==0){
							allpeople.unshift(null)
							callback()
							//cb('人员列表为空')
						}
						if(docs.length!=0){
							console.log('dddd',docs.length)
							docs.forEach(function(newitem,newindex){
								allpeople.push(newitem)
							})

							callback()							//cb(null)
						}
					})
				}else{
					callback()
				}
				
			},function(error){
				if(error){
					cb(error)
				}
				console.log('allpeople',allpeople.length)
				//return
				cb()
			})

		},
		function(cb){
			//限制并发个数
			wqd = allpeople
			console.log('wqd 人数',wqd.length,yqd.length)
			async.eachLimit(yqd,1,function(item,callback){
				removeArr(wqd,item)
				callback()
			},function(err){
				if(err){
					console.log('err',err)
					return res.json(err)
				}
				//console.log('newarr',wqd)
				cb()
				//return res.json(wqd.length)
			})
			
			
			
		}//,
		
	],function(error,result){
		if(error){
			console.log('async waterfall err',error)
			return res.end(error)
		}
		//res.json({'yqd':yqd,'wqd':wqd})
		return res.json({'yqd':yqd,'wqd':wqd,'shijian':shijian})
		//return res.render('viewqdstate',{'yqd':yqd,'wqd':wqd,'shijian':shijian})
	})
})
router.post('/qj',function(req,res){
	let qddate = req.body.qddate,
		qdtime = req.body.qdtime,
		qdweek = req.body.qdweek,
		qdtype = req.body.qdtype,
		month = req.body.month
	console.log(qddate,qdtime,qdweek,qdtype)
	if(qdtype == '上午' || qdtype == '早上'){
		qdtype = '上午'
		shangban = 1
	}else{
		qdtype = '下午'
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
		month : month,
		qingjia : '1'
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
			temparr = req.originalUrl.split('&')
			console.log('temparr-->',temparr)
			let finalReturnURL = 'http://qiandao.szu.edu.cn:81/dxxxhjs' + temparr[0]
			console.log('finalReturnURL-->',finalReturnURL)


				//finalReturnURL = 'http://qiandao.szu.edu.cn:81/xyqd'+req.baseUrl
			//console.log('ReturnURL url-->',ReturnURL)
			//console.log('req-->',req.baseUrl)//finalReturnURL
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
						   		req.session.user = null
						   		console.log('check req.session.user-->',req.session.user)
						   		console.log('ticket is unvalid')
						   		console.log('回去----->',finalReturnURL)
						   		return res.redirect(finalReturnURL)
						   		//return res.json({'errCode':-1,'errMsg':'ticket is unvalid,请重新扫码！'})
						   }else{
						   		req.session.user = arg
						   		console.log('回去----->',finalReturnURL)
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
// Array.prototype.indexOf = function(val) {
// 	for (var i = 0; i < this.length; i++) {
// 		if (this[i] == val) return i;
// 	}
// 	return -1;
// }
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
}
//对象数组的去重
function uniqObjInArray(objarray){
    let len = objarray.length;
    let tempJson = {
        
    };
    let res = [];
    for(let i = 0;i < len;i++){
        //取出每一个对象
        tempJson[JSON.stringify(objarray[i])] = true;
    }
    console.log("tempJson is ",tempJson);
    let keyItems= Object.keys(tempJson);
    for(let j = 0;j < keyItems.length;j++){
        res.push(JSON.parse(keyItems[j]));
    }
    return res;
}
function removeArr(_arr,_obj){
	console.log('进来了',_obj.cardno)
	let length = _arr.length
	console.log('length',length)
	for(let i = 0;i<length;i++){
		//console.log('????????',_arr)
		//return false
		if(_arr[i].cardno == _obj.cardno){
			console.log('找到了')
			if(i==0){
				_arr.shift()
				return _arr
			}
			else if(i==length-1){
				_arr.pop()
				return _arr
			}
			else{
				_arr.splice(i,1)
				return _arr
			}
		}
		// }else{
		// 	console.log('没找到')
		// }
	}//for
}
//emp.remove('fd');
module.exports = router;
