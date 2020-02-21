$(function() {
	initSidebar(37,1);
	//加载默认列表	
	getList();
	
	function getList(){
		var searchCondtion = "?time=" + $.trim($("#time").val()),
		url = "/list/getBackupsList" + encodeURI(searchCondtion);
	  T({
		 data : {
			pagehref : url,
			pagesize : 15,
			curpage : 1	
		},
		rowList : [{
			name :'序号',
		    value : 'num',
			width : 50,
			maxLen : 10,
			align : 'center'
		},{
			name : '名称',
			value : 'name',
			width : 'auto',
			maxLen : 100,
			align : 'left'
		},{
			name : '备份时间',
			value : 'cretime',
			width : 150,
			maxLen : 100,
			align : 'center'
		},{
			name : '操作',
			value : function(record, option, data){
				return reHtml = '<a  href="javascript:;" name="'+record.name+'" time="'+record.cretime+'" class="backups"><img class="editBtn"  src="../../public/images/backups.png" title="还原"></a>'
				+ '<a href="javascript:;" id="'+record.id+'" class="delete"><img width="16px" height="16px" style="border:0" src="../../public/images/checksDelete.png" title="删除"></a>';
			},
			width : 80,
			maxLen : 10,
			align : 'center'
		}],
		success : function(table, footer, data){
			var htmlStr = '共有<span class="count-record">'
						+data.pageArgument.total
						+ '</span>条记录，共<span class="count-page">'
						+data.pageArgument.pagecount
						+ '</span>页，当前是第<span class="cur-page">'
						+ data.pageArgument.curpage
						+ '</span>页';
			$('.table-list').html(table);	//数据
			$('.table-info').html(htmlStr);	
			$('.list-footer').html(footer);	//分页
		      }	
	       });
       }
       	
//搜索
  	$("#btn_search").click(function(){
  		getList();
  	});
  	//按enter键探索
  	$("#name").bind("keyup",function(e){
  		 if (e.keyCode == 13) getList();
  	});

//重置
  	$("#btn_reset").click(function(){
  		window.location.reload();
  	});
//新增备份
  	$("#btn_add").click(function(){
  		if(confirm("确定要备份数据吗？")){
			$.post("/add/backups", function(data){
	 			if (!data.success){
	 				$.openError(data.error, 1500);
	 				return ;
	 			}else{
	 				$.openSuccess('备份成功', 2000, function(){
	 					getList();
	 				});
	 			}
			},"json");
  		}
//  		if(confirm("该功能需待数据库与网站系统布署在同一服务器上才可使用！")){}
  		
  	});
//还原
  	$(".backups").live('click',function(){
  	   if(confirm("系统数据将还原到 "+ $(this).attr("time") +", 请确定是否需要还原数据！")){
  		 $.post("/add/recover?name="+ $(this).attr("name") , function(data){
 			if (!data.success){
 				$.openError(data.error, 1500);
 				return ;
 			}else{
 				$.openSuccess('还原成功', 2000, function(){
 	 				getList();
 				});
 			}
 		}, "json");
  	   }
//  		if(confirm("该功能需待数据库与网站系统布署在同一服务器上才可使用！")){}
  	});
  //删除
  	$(".delete").live('click',function(){
  	   if(confirm("确定要删除该记录吗？")){
  		 $.post("/delete/deleteLabModel?tkey=backups&id="+ $(this).attr("id") , function(data){
 			if (!data.success){
 				$.openError(data.error, 1500);
 				return ;
 			}else{
 				$.openSuccess('删除成功', 1000,function(){
 					getList();
 				});
 			}
 		}, "json");
  	   }
  	});  	
  	
});