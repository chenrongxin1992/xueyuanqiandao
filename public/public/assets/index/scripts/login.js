$(function(){
	$("#login_form input[name='username']").focus();
	//输入框输入
	 $("#login_form .text").bind("focus", function(){
		 $(this).parent().addClass("focus-in");
	 }).blur(function(){
		 $(this).parent().removeClass("focus-in");
	 }).bind("keyup change", function(){
		 if ($(this).val() != "")
			 $(this).parent().addClass("text-hide");
		 else{
			 $(this).parent().removeClass("text-hide");
		 }
	 });
	
	 //登录框验证码回车按钮
	 $("#login_form input[type='text'], #login_form input[type='validecode']").bind("keyup", function(e){
		 if (e.keyCode == 13) login();
	 });
/*********************************************************************************/	 
	//更换验证码
		$("#change_code, #change_code_text").click(function (){
			changeCode();
		});
	 /**
	 * 更改验证码
	 */
	 function changeCode(){
		var src = $("#change_code img").attr("src").split("?")[0];
		$("#change_code img").attr("src", src + "?t=" + new Date().getTime());
	 }
/**********************************************************************************/	 
	//登录
		$("#post_login").click(function(){
			login();
		});
		/**
		 * 登录
		 */
		function login(){
			var username 	= $.trim($("#login_form input[name='username']").val()),
			 	password 	= $.trim($("#login_form input[name='password']").val());
			 	validecode  = $.trim($("#login_form input[name='validecode']").val());
			if (username == ""){
				showLoginError("登录账号不能为空！");
				return ;
			}
			if (password == ""){
				showLoginError("登录密码不能为空！");
				return ;
			}
			if (!/^.{4}$/.test(validecode)){
				showLoginError("验证码格式不正确！");
				return ;
			}
			
			$.post("/other/ajaxLogin", {
				account  : username,
				password : password,
				code	 : validecode
			}, function(data){
				if (data.success){
					window.location.href = data.url;
				}else{
					showLoginError(data.error);
					changeCode();
					$("#login_form input[name='validecode']").val("");
				}
			}, "json");
		}
		
		/**
		 * 显示错误
		 */
		function showLoginError(tip){
			$("#login_fail").text(tip);
			if ($("#login_fail:hidden").length > 0){
				$("#login_fail").slideToggle();
			}
		}
});
	