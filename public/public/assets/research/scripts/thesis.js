$(function() {
	initSidebar(9,2);
	//加载默认列表	
	getList();
	function getList(){		
		var searchCondtion = "?name=" + $.trim($("#name").val())+"&authors=" + $.trim($("#authors").val())+"&year=" + $.trim($("#year").val()),
			url = "/list/getThesisList" + encodeURI(searchCondtion);
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
			name : '论文名称',
			value : function(record, option, data){
				return '<a href="/research/viewthesis?id=' + record.id
						+ '" target="_blank" style="color:#0000ee;" title="' +record.name+ '">' + record.name + '</a>';
			},
			width : 'auto',
			maxLen : 40,
			align : 'left'
		},{
			name : '作者',
			value : 'authorsname',
			width : 100,
			maxLen : 20,
			align : 'center',
		},{
			name : '指导老师',
			value : 'tutor',
			width : 100,
			maxLen : 20,
			align : 'center'
		},{
			name : '年份',
			value : 'publishyear',
			width : 60,
			maxLen : 10,
			align : 'center'
		},{
			name : '单位',
			value : 'unit',
			width : 100,
			maxLen : 10,
			align : 'center',
		},{
			name : '操作',
			value : function(record, option, data){
				return reHtml = '<a  href="/research/addthesis?id=' + record.id
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
  		window.location.href="/research/addthesis";
  	});
//删除
  	$(".delete").live('click',function(){
  		if(confirm("确定要删除该记录吗？")){
	  		$.post("/delete/deleteResModel?tkey=thesis&id="+ $(this).attr("id") , function(data){
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
  	
	//下载表格
  	$("#creatExcel").live("click",function(){
  		var url="",
  			name = $.trim($("#name").val()),
  			authors = $.trim($("#authors").val()),
  		    year = $.trim($("#year").val());
  		$.post("/list/getThesisa",{name:name,authors:authors,year:year},function(data){
  			if(data.success){
  				url = data.url;
  				window.open(url,"_self");//在新窗口打开并下载excel表
  			}
  		},"json");
  	});
  	
});