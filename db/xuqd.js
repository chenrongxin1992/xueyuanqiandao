/**
 *  @Author:    chenrongxin
 *  @Create Date:   2018-03-12
 *  @Description:   签到表
 */
var mongoose = require('./db'),
    Schema = mongoose.Schema,
    moment = require('moment')

var qdSchema = new Schema({  
    month : {type:String},   
    cn : {type:String},//姓名
    alias : {type:String},//校园卡号
    sex : {type:String},
    qdweek : {type:String},//星期
    qddate : {type:String},//2018-03-12
    qdtime : {type:String},
    qdtype : {type:String},
    qiandaoshijianchuo : {type:String,default:null},
    shangban : {type:String,default:0},//0/1
    xiaban : {type:String,default:0},   //0/1
    qingjia : {type:String,default:0}//0/1
})

var add_qdSchema = new Schema({  
    title : {type:String}
})

module.exports = mongoose.model('qd',qdSchema);
module.exports = mongoose.model('add_qd',add_qdSchema);