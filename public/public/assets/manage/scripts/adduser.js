(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	var checkaccount = false, oldaccount="";
	$(function(){
		initSidebar(24,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#name").val("");
			$(".account").val("");
			$("#pwd").val(111111);
			$('input[type="checkbox"]').each(function(){
				$(this).attr("checked",false);
			});
		});
		$.post("/list/getAllRoleList",function(data){
			var str ="";
			if(data){
				for(var i=0; i<data.length; i++){
					str += '<div style="line-height:20px;margin:5px 8px;"><input type="checkbox" class="check" id="'+data[i].id+'" style="vertical-align:middle"/><span style="margin-left: 5px;">'+data[i].name+'</span></div>';
				}
			}else{
				str += '<span>暂无角色</span>';
			}
			$("#role").html(str);
			
		},'json');
		$(".account").bind('blur',function(){	
			$.post("/add/checkAccount","account="+$(".account").val(),function(data){
				if(data.success){
					checkaccount = true;
				}else{
					//修改的
					if(id!="" && $(".account").val()==oldaccount)
						checkaccount = true;
					else{
						checkaccount = false;
						$.alert(data.error,$(".account"));
					}
				}
			},'json');
		});
		
		//填充数据
		if(id!=""){
			getdetail();
		}
	});
	
	
	function getdetail(){
		$("#reset").html('<input type="button" class="btn normal-btn" id="resetvalue" value="重置为默认密码111111"/>');
		$("#pwd").css("background","#ccc");
		$("#pwd").attr("readonly",true);
		$.post("/detailed/getUserRoleInfo","id="+id,function(data){
			if(data){
				checkaccount = true;
				oldaccount = data.account;
				$("#name").val(data.name);
				$(".account").val(data.account);
				for(var i=0; i<data.urolelist.length; i++){
					$('input[type="checkbox"]').each(function(){
						if($(this).attr("id")==data.urolelist[i].roleid){
							$(this).attr("checked",true);
						}
					});
				}
			}
		},"json");
		$("#resetvalue").bind('click',function(data){
			$.post("/add/changePassword?id=" + id,function(data){
				if(data.success){
					$.openSuccess('重置密码成功', 3000);
				}else{
					$.openError('重置密码失败', 3000);
				}
			});
		});
	}
	
	function getid(){
		var sid ="";
		$('input[type="checkbox"]').each(function(){
			if($(this).attr("checked")=="checked"){
				sid += $(this).attr("id")+",";
			}
		});
		return sid;
	}
	function save(){
		var name = $("#name").val();
		var account = $(".account").val();
		var pwd = $("#pwd").val();
		
		
		if(name==""||name==null){
			$.alert("姓名不能为空",$("#name"));
			return false;
		}
		if(account==""||account==null){
			$.alert("账号不能为空",$(".account"));
			return false;
		}
		if(checkaccount==false){
			$.alert("账号已存在",$(".account"));
			return false;
		}
		if(pwd==""||pwd==null){
			$.alert("密码不能为空",$("#pwd"));
			return false;
		}
		var sid = getid();
		if(sid==""){
			$.openError("请至少选择一个种角色",2000);
			return false;
		}
		sid = sid.substring(0,sid.length-1);
		//序列化表单元素
		var formdata=$('form').serialize()+"&model.id="+id+"&roleids="+sid+"&model.account="+account+"&model.password="+pwd;
		$.post("/add/saveOrUpdateUser",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/adduser?id="+data.id;
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}

})();

