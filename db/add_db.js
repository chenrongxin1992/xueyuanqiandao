/**
 *  @Author:    chenrongxin
 *  @Create Date:   2019-6-1
 *  @Description:   题目类别表
 */

    const mongoose = require('mongoose')
    mongoose.Promise = global.Promise;
    //服务器上
    const DB_URL = 'mongodb://xueyuanqiandao:youtrytry@localhost:27017/xueyuanqiandao'
    //本地
    //const DB_URL = 'mongodb://localhost:27017/dxxxhjs'
    mongoose.connect(DB_URL,{useNewUrlParser:true,useUnifiedTopology: true})//{ useUnifiedTopology: true }

    /**
      * 连接成功
      */
    mongoose.connection.on('connected', function () {    
        console.log('Mongoose connection open to ' + DB_URL);  
    });    

    /**
     * 连接异常
     */
    mongoose.connection.on('error',function (err) {    
        console.log('Mongoose connection error: ' + err);  
    });    
     
    /**
     * 连接断开
     */
    mongoose.connection.on('disconnected', function () {    
        console.log('Mongoose connection disconnected');  
    });   

//var mongoose = require('./db'),
    let Schema = mongoose.Schema,
    moment = require('moment')

//用户
var meetingSchema = new Schema({ 
    room_name :{type:String},
    title : {type:String},//主题
    num : {type:Number},//人数
    start : {type:String},//开始时间
    alldaystart : {type:String},//api开始时间 2019-12-18 08:30
    end : {type:String},//结束时间
    endtimestamp:{type:String},
    alldayend : {type:String},//api结束时间 2019-12-18 20:30
    date : {type:String},//日期
    fuzeren : {type:String},//负责人
    phone : {type:String},
    applyname : {type:String},
    applytime : {type:String,default:moment().format('YYYY-MM-DD HH:mm')},
    applytimestamp : {type:String,default:moment().format('X')},
    date_timestamp : {type:String},//日期时间戳
    allDay : {type:Boolean,default:false},
    judgedate : {type:String},//全天申请的时候使用，用于判断是否过期变灰，默认等于req.body.end
    isok : {type:Number,default:0}//是否批准 0否 1准
},{collection:'meeting'})

var add_qdSchema = new Schema({  
    title : {type:String},
    content:{type:String},
    link:{type:String},
    code:{type:String},
    state:{type:Number,default:0},
    choose:{type:String,default:'1,2,3,4'},
    timestamp:{type:String,default:moment().format('X')}
})

//人员
var peopleSchema = new Schema({  
    name : {type:String},
    cardno:{type:String},
    usertype:{type:String},
    userstate:{type:String},
    phone:{type:String},
    timestamp:{type:String,default:moment().format('X')}
})

//签到记录
var qdrecordSchema = new Schema({  
    code:{type:String},
    name : {type:String},
    cardno:{type:String},
    usertype:{type:String},
    userstate:{type:String},
    phone:{type:String},
    qddate:{type:String,default:moment().format('YYYY-MM-DD HH:mm:ss')},
    timestamp:{type:String,default:moment().format('X')}
})

exports.meeting = mongoose.model('meeting',meetingSchema)
exports.add_qd = mongoose.model('add_qd',add_qdSchema);
exports.people = mongoose.model('people',peopleSchema);
exports.qdrecord = mongoose.model('qdrecord',qdrecordSchema);