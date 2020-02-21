$(function() {
	initSidebar(4,2);
	//加载默认列表	
	getList();
	function getList(){
		var searchCondtion = "?name=" + $.trim($("#name").val()),
			url = "/list/getUserTeamList" + encodeURI(searchCondtion);
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
			name : '名称',
			value : function(record, option, data){
				return '<a href="/research/viewteam?id=' + record.id
						+ '" target="_blank" style="color:#2e6db6;" title="' +record.name+ '">' + record.name + '</a>';
			},
			width : 150,
			maxLen : 50,
			align : 'center'
		},{
			name : '简介',
			value : 'intro',
			width : 80,
			maxLen : 30,
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

});