$(function(){
	initSidebar(39,1);

	//新增
  	$("#btn_add").click(function(){
  		window.location.href="/manage/addlink";
  	});
  	getList();
	function getList(){
		var searchCondtion = "?name=" + $.trim($("#title").val()),
			url = "/list/getRelatedlinkList" + encodeURI(searchCondtion);
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
			name : '类别',
			value : 'type',
			width : 60,
			maxLen : 10,
			align : 'center'
		},{
			name : '名称',
			value : 'name',
			width : 150,
			maxLen : 24,
			align : 'center'
		},{
			name : '网址',
			value : 'url',
			width : 'auto',
			maxLen : 80,
			align : 'center'
		},{
			name : '操作',
			value : function(record, option, data){
				return reHtml = '<a data-id="'+record.id+'" class=" menu_upTop" href="javascript:" title="上移"></a>'
					+	'<a data-id="'+record.id+'" class=" menu_downTop" href="javascript:" title="下移"></a>'
					+	'<a  href="/manage/addlink?id=' + record.id + 	'" class="menu_edit" title="编辑"></a>'
					+ 	'<a href="javascript:;" id="'+record.id+'" class="menu_delete" title="删除"></a>';
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
  	$("#title").bind("keyup",function(e){
  		 if (e.keyCode == 13) getList();
  	});
	//移除
  	$(".menu_delete").live('click',function(){
  		if(confirm("确定要删除该记录吗？")){
	  		$.post("/delete/deleteRelatedlink","id="+ $(this).attr("id") , function(data){
				if (!data.success){
					$.openError(data.error, 1500);
					return ;
				}else{
					$.openSuccess('删除成功', 3000);
					getList();
				}
			}, "json");
  		}
  	});
	//上移
	$(".menu_upTop").live('click',function(e){
		var id = $(this).data("id");
		if(id!=""&&id!=null){
			$.post("/add/upOrDownRelatedlink?id="+id+"&direction=up",function(data){
				if(data.success){
					getList();
				}else{
					$.openError(data.error,3000);
				}
			},'json');		
		}

	});
	//下移
	$(".menu_downTop").live('click',function(e){
		var id = $(this).data("id");
		$.post("/add/upOrDownRelatedlink?id="+id+"&direction=down",function(data){
			if(data.success){
				getList();
			}else{
				$.openError(data.error,3000);
			}
		},'json');
	});
});