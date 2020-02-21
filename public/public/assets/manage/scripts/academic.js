$(function() {
	initSidebar(26,1);
	//加载默认列表	
	getList();
	function getList(){		
		var searchCondtion = "?name=" + $.trim($("#name").val())+ "&type=" + $.trim($("#type").val()) + "&year=" + $.trim($("#year").val()),
			url = "/list/getLabCommunicationList" + encodeURI(searchCondtion);
	  T({
		 data : {
			pagehref : url,
			pagesize : 15,
			curpage : 1	
		},
		rowList : [{
			name :'序号',
		    value : 'num',
			width : 60,
			maxLen : 10,
			align : 'center'
		},{
			name : '名称',
			value : function(record, option, data){
				var str ="";
				if(record.name.length > 30){
					str = record.name.substr(0, 30);
					return '<a href="/manage/viewacademic?id=' + record.id
					+ '" target="_blank" style="color:#0000ee;" title="' +record.name+ '">' + str+ "..." + '</a>';
				}
				else{
					str = record.name;
					return '<a href="/manage/viewacademic?id=' + record.id
					+ '" target="_blank" style="color:#0000ee;" title="' +record.name+ '">' + str + '</a>';
				}
			},
			width : '200',
			align : 'left'
		},{
			name : '交流类型',
			value : 'type',
			width : 100,
			maxLen : 10,
			align : 'center'
		},{
			name : '时间',
			value : 'time',
			width : 90,
			maxLen : 20,
			align : 'center',
		},{
			name : '地点',
			value : 'address',
			width : 100,
			maxLen : 20,
			align : 'center'
		},{
			name : '参加人员',
			value : 'joinman',
			width : 150,
			maxLen : 10,
			align : 'center'
		},{
			name : '操作',
			value : function(record, option, data){
				return reHtml = '<a href="/manage/addacademic?id=' + record.id
				+ '"><img class="editBtn"  src="../../public/images/checksRewrite.png" title="编辑"></a>'
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
  		window.location.href="/manage/addacademic";
  	});
//删除
  	$(".delete").live('click',function(){
  		if(confirm("确定要删除该记录吗？")){
	  		$.post("/delete/deleteLabModel?tkey=communication&id="+ $(this).attr("id") , function(data){
				if (!data.success){
					$.openError(data.error, 1500);
					return ;
				}else{
					$.openSuccess('删除成功', 2000,function(){
						getList();
					});
					
				}
			}, "json");
  		}
  	});
});