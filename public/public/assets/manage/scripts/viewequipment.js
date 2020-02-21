(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(16,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
		getDetail();
		getList();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getEquipmentInfo","id="+id,function(data){
		if(data){
			$("#name").html(data.name);
			$("#value").html(data.value);
			$("#unit").html(data.unit);
			$("#brand").html(data.brand);
			$("#model").html(data.model);
			$("#number").html(data.number);
			$("#dutyman").html(data.dutyman);
			$("#manager").html(data.manager);
			$("#now").html(data.user==""?"无":data.user);
			$("#pic").html(data.pic==""?"无":"<img src="+data.pic+" style='max-width:592px;margin-top:8px;'>");
		}
	},"json");
	}
	function getList(){
		var searchCondtion = "?equid=" + id,
			url = "/list/getEquipmentUseList" + encodeURI(searchCondtion);
	  T({
		 data : {
			pagehref : url,
			pagesize : 5,
			curpage : 1	
		},
		rowList : [{
			name :'序号',
		    value : 'num',
			width : 80,
			maxLen : 10,
			align : 'center'
		},{
			name : '领用人',
			value : 'username',
			width : 80,
			maxLen : 20,
			align : 'center'
		},{
			name : '开始时间',
			value : 'begintime',
			width : 80,
			maxLen : 20,
			align : 'center'
		},{
			name : '结束时间',
			value : 'endtime',
			width : 80,
			maxLen : 20,
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
	
})();