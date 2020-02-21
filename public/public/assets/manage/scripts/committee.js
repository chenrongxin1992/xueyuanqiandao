$(function() {
	initSidebar(14,1);
	//加载默认列表	
	getList();
	function getList(){
		var searchCondtion = "?name=" + $.trim($("#name").val())+"&tenure=" + $.trim($("#tenure").val())+"&titles=" + $.trim($("#title").val()),
			url = "/list/getAcaComList" + encodeURI(searchCondtion);
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
			name : '姓名',
			value : function(record, option, data){
				return '<a href="/manage/viewcommittee?id=' + record.id
						+ '" target="_blank" style="color:#0000ee;" title="' +record.name+ '">' + record.name + '</a>';
			},
			width : 100,
			maxLen : 50,
			align : 'center'
		},{
			name : '任职',
			value : 'tenure',
			width : 80,
			maxLen : 20,
			align : 'center'
		},{
			name : '职称',
			value : 'titles',
			width : 80,
			maxLen : 20,
			align : 'center'
		},{
			name : '专业',
			value : 'profession',
			width : 100,
			maxLen : 20,
			align : 'center'
		},{
			name : '任期',
			value : 'prefecture',
			width : 100,
			maxLen : 20,
			align : 'center',
		},{
			name : '工作单位',
			value : 'workplace',
			width : 100,
			maxLen : 20,
			align : 'center'
		},{
			name : '操作',
			value : function(record, option, data){
				return reHtml = '<a  href="/manage/addcommittee?id=' + record.id
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
  		window.location.href="/manage/addcommittee";
  	});
//删除
  	$(".delete").live('click',function(){
  		if(confirm("确定要删除该记录吗？")){
  	  		$.post("/delete/deleteLabModel?tkey=academic_committee&id="+ $(this).attr("id") , function(data){
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
});