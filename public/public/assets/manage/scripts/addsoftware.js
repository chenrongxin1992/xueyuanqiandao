(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(36,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#name").val("");
			$("#ename").val("");
			$("#introduce").val("");
			$("#eintroduce").val("");
			
			$("#url").val("");
		});
		//填充数据
		if(id!=""){
			getdetail();
		}
		$("#tname").live('change',function(){
			change("");
		});
		$("#link").live('change',function(){
			$(".tip").append($(this).val());
		});
	});

	
	function getdetail(){
		$.post("/detailed/getSoftwareByid","id="+id,function(data){
			if(data){
				$("#modelid").val(id);//主键
				$("#pic").val(data.pic);
				
				$("#sort").val(data.sort);
				
				$("#name").val(data.name);
				$("#ename").val(data.ename);
				$("#introduce").val(data.introduce);
				$("#eintroduce").val(data.eintroduce);
				$("#url").val(data.url);
				
				if(data.pic!=""){
					var str = '<img src="'+data.pic+'" style="max-width: 200px;	max-height: 300px;margin: 8px 0 -8px 8px;"/><input type="button" style="margin-bottom:8px;" class="normal-btn" id="delete" value="删除"/>';
					$("#file").html(str);
				}
				$("#delete").bind('click',function(){
					//清空
					$("#file").html("");
					$("#link").val("");
				});
			}
		},"json");
	}
	
	function save(){
		var name = $("#name").val();
		var introduce = $("#introduce").val();
		var url = $("#url").val();
		var pic = $("#pic").val();
		var sort = $("#sort").val();
		
		if(name==""||name==null){
			$.alert("名称不能为空",$("#name"));
			return false;
		}
		if(introduce==""||introduce==null){
			$.alert("介绍不能为空",$("#introduce"));
			return false;
		}
		if(url==""||url==null){
			$.alert("网址不能为空",$("#url"));
			
			return false;
		}
		if(url!=""){
			var re = /[a-zA-z]+:\/\/[^s]*/;
			if(!re.test(url)){
				$.alert("网址不规范",$("#url"));
				return false;
			}
		}
		if(sort==""|| sort==null){
			$.alert("排序不能为空",$("#sort"));
			return false;
		}
		if(sort!=""){
			var re = /\d+/;
			if(!re.test(sort)){
				$.alert("请填写数字",$("#sort"));
				return false;
			}
		}
		
		if(pic==""){
			if(link==""||link==null){
				$.alert("图片不能为空",$("#link"));
				return false;
			}			
		}
		
		//提交表单	
		$("#addform").ajaxForm({
		    dataType: 'json',
		    success: function(data) {   
				if(data.success){
					$.openSuccess('保存成功', 3000);
					window.location.href = "/manage/addsoftware?id="+data.id;
				}else{
					$.openError('保存失败', 3000);
				}
		    }
		});
		$("#addform").submit();
	}

})();

