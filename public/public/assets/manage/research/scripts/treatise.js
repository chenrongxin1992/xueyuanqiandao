$(function() {
	initSidebar(35,1);
	//加载默认列表	
	getList();
	function getList(){		
		var searchCondtion = "?name=" + $.trim($("#name").val())+"&authors=" + $.trim($("#authors").val())+"&year=" + $.trim($("#year").val()),
			url = "/list/getLabTreatiseList" + encodeURI(searchCondtion);
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
			name : '著作名称',
			value : function(record, option, data){
				return '<a href="/manage/viewtreatise?id=' + record.id
						+ '" target="_blank" style="color:#0000ee;" title="' +record.name+ '">' + record.name + '</a>';
			},
			width : 'auto',
			maxLen : 50,
			align : 'left'
		},{
			name : '作者',
			value : function(record, option, data){
			        var tmp = [], arr;
			        $.each(record.authors.split(';'), function(i, v){
			          arr = v.split(',');
			          tmp.push(arr[0]||arr[1]);
			        });
			        return tmp.join(', ');
			      },
			width : 100,
			maxLen : 20,
			align : 'center',
		},{
			name : '出版社',
			value : 'publish',
			width : 100,
			maxLen : 20,
			align : 'center'
		},{
			name : '出版年',
			value : 'publishyear',
			width : 70,
			maxLen : 10,
			align : 'center'
		},{
			name : 'ISBN号码',
			value : 'isbn',
			width : 80,
			maxLen : 10,
			align : 'center',
		},{
			name : '操作',
			value : function(record, option, data){
				return reHtml = '<a href="/manage/edittreatise?id=' + record.id
				+ '"><img class="editBtn"  src="../../public/images/checksRewrite.png" title="编辑"></a>'
				+ '<a href="javascript:;" id="'+record.id+'" class="delete"><img width="16px" height="16px" style="border:0" src="../../public/images/checksDelete.png" title="删除"></a>';
			},
			width : 70,
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
  //删除
  	$(".delete").live('click',function(){
  		if(confirm("确定要删除该记录吗？")){
	  		$.post("/delete/deleteResModel?tkey=treatise&id="+ $(this).attr("id") , function(data){
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
  		$.post("/list/getLabTreatiseexcel",{name:name,authors:authors,year:year},function(data){
  			if(data.success){
  				url = data.url;
  				window.open(url,"_self");//在新窗口打开并下载excel表
  			}
  		},"json");
  	});
});