$(function() {
	initSidebar(24,1);
	$.post("/list/getAllRoleList",function(data){
		var str = '<option value="">--请选择角色--</option>';
		if(data){
			for(var i=0; i<data.length; i++){
				str += '<option value="'+data[i].id+'">'+data[i].name+'</option>';
			}
		}else{
			str += '<option value="">暂无角色</option>';
		}
		$("#role").html(str);
		
	},'json');
	//加载默认列表	
	getList();
	function getList(){
		var searchCondtion = "?name=" + $.trim($("#name").val())+"&roleid=" + $("#role").val(),
			url = "/list/getAllUserList" + encodeURI(searchCondtion);
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
				return '<a href="/manage/viewuser?id=' + record.id
						+ '" target="_blank" style="color:#0000ee;" title="' +record.name+ '">' + record.name + '</a>';
			},
			width : 150,
			maxLen : 30,
			align : 'center'
		},{
			name : '登录账号',
			value : 'account',
			width : 80,
			maxLen : 20,
			align : 'center'
		},{
			name : '角色',
			value : 'rolename',
			width : 80,
			maxLen : 20,
			align : 'center'
		},{
			name : '操作',
			value : function(record, option, data){
				return reHtml = '<a data-id="'+ record.id +'" class=" menu_upTop" href="javascript:" title="上移"></a>'
						+ '<a data-id="'+ record.id +'" class=" menu_downTop" href="javascript:" title="下移"></a>'
						+ '<a  href="/manage/adduser?id=' + record.id
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
  		window.location.href="/manage/adduser";
  	});
//删除
  	$(".delete").live('click',function(){
  		if(confirm("确定要删除该记录吗？")){
	  		$.post("/delete/deleteUser?id="+ $(this).attr("id") , function(data){
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
			moveUser(id, 'up');
		}

	});
	//下移
	$(".menu_downTop").live('click',function(e){
		var id = $(this).data("id");
		if(id!=""&&id!=null){
			moveUser(id, 'down');
		}
	});
	function moveUser(id, direction){
		$.post("/add/upOrDownUserInfor?id="+ id +"&direction="+ direction ,function(data){
			if(data.success){
				getList();
			}else{
				$.openError(data.error,3000);
			}
		},'json');
	}
});