$(function() {
	initSidebar(18,1);
	//加载默认列表	
	getList();
	function getList(){
		var searchCondtion = "?name=" + $.trim($("#name").val())+"&year=" + $.trim($("#year").val()),
			url = "/list/getAnnualReportList" + encodeURI(searchCondtion);
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
			name : '题目',
			value : function(record, option, data){
				return '<a href="/manage/viewannual?id=' + record.id
						+ '" target="_blank" style="color:#0000ee;" title="' +record.title+ '">' + record.title + '</a>';
			},
			width : 'auto',
			maxLen : 50,
			align : 'left'
		},{
			name : '年份',
			value : 'year',
			width : 100,
			maxLen : 20,
			align : 'center'
		},{
			name : '下载链接',
			value : function(record, option, data){
				return '<a href="http://'+ record.link
				+ '" target="_blank" style="color:#0000ee;">' + record.link + '</a>';
			},
			width : 150,
			maxLen : 50,
			align : 'center'
		},{
			name : '操作',
			value : function(record, option, data){
				return reHtml = '<a  href="/manage/addannual?id=' + record.id
				+ '"><img class="editBtn"   src="../../public/images/checksRewrite.png" title="编辑"></a>'
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
  	$("#authors").bind("keyup",function(e){
 		 if (e.keyCode == 13) getList();
 	});
  	$("#year").bind("keyup",function(e){
 		 if (e.keyCode == 13) getList();
 	});
//重置
  	$("#btn_reset").click(function(){
  		window.location.reload();
  	});
//新增
  	$("#btn_add").click(function(){
  		window.location.href="/manage/addannual";
  	});
//删除
  	$(".delete").live('click',function(){
  		$.post("/delete/deleteLabModel?tkey=annual_report&id="+ $(this).attr("id") , function(data){
			if (!data.success){
				$.openError(data.error, 1500);
				return ;
			}else{
				$.openSuccess('删除成功', 3000);
				getList();
			}
		}, "json");
  	});
});