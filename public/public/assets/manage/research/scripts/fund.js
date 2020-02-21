$(function() {
	initSidebar(27,1);
	//加载默认列表	
	getList();
	function getList(){
		var searchCondtion = "?name=" + $.trim($("#name").val())+"&title=" + $.trim($("#title").val())+"&year=" + $.trim($("#year").val()),
			url = "/list/getLabFundList" + encodeURI(searchCondtion);
	  T({
		 data : {
			pagehref : url,
			pagesize : 15,
			curpage : 1	
		},
		rowList : [{
			name :'序号',
		    value : 'num',
			width : 80,
			maxLen : 10,
			align : 'center'
		},{
			name : '题目',
			value : function(record, option, data){
				return '<a href="/manage/viewfund?id=' + record.id
						+ '" target="_blank" style="color:#2e6db6;" title="' +record.title+ '">' + record.title + '</a>';
			},
			width : 150,
			maxLen : 50,
			align : 'center'
		},{
			name : '姓名',
			value : 'name',
			width : 100,
			maxLen : 20,
			align : 'center',
		},{
			name : '年度',
			value : 'year',
			width : 80,
			maxLen : 20,
			align : 'center'
		},{
			name : '单位',
			value : 'unit',
			width : 80,
			maxLen : 10,
			align : 'center'
		},{
			name : '资助方向',
			value : 'direction',
			width : 100,
			maxLen : 10,
			align : 'center',
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

});