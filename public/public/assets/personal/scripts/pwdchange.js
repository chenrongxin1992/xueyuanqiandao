$(function() {
	initSidebar(2,3);
	$("#submit").click(function(){
		var oldpwd = $("#old").val();
		var newpwd = $("#new").val();
		var renew = $("#renew").val();
		
		if(oldpwd==""){
			$.alert("旧密码不能为空",$("#old"));
			return false;
		}
		if(newpwd==""){
			$.alert("新密码不能为空",$("#new"));
			return false;
		}
		if(renew==""){
			$.alert("确认密码不能为空",$("#renew"));
			return false;
		}
		if(renew!=newpwd){
			$.alert("确认密码跟新密码不相同",$("#renew"));
			return false;
		}
		$.post("/add/changeOwnPassword",{"oldpassword":oldpwd,"newpassword":newpwd},function(data){
			if(data.success){
				$.openSuccess("修改密码成功",3000);
			}else{
				$.openError(data.error,3000);
			}
		},'json');
	});
});