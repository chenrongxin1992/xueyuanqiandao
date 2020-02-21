(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(38,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#describe").val("");
			$("#sort").val("");
			$("#url").val("");
		});
		//填充数据
		if(id!=""){
			getdetail();
		}
		
		$("#link").live('change',function(){
			$(".tip").append($(this).val());
		});
	});

	
	function getdetail(){
		$.post("/detailed/getIndexPicByid","id="+id,function(data){
			if(data){
				$("#modelid").val(id);//主键
				$("#pic").val(data.pic);
				$("#describe").val(data.describe);
				$("#sort").val(data.sort);
				$("#url").val(data.url);
				
				if(data.pic!=""){
					var str = '<img src="'+data.pic+'" style="max-width: 400px;	max-height: 600px;margin: 8px 0 -8px 8px;"/><input type="button" style="margin-bottom:8px;" class="normal-btn" id="delete" value="删除"/>';
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
		var pic = $("#pic").val();
		
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
					$.openSuccess('保存成功', 1500, function(){
						window.location.href = "/manage/addindexpic?id="+data.id;
					});
				}else{
					$.openError('保存失败', 2000);
				}
		    }
		});
		$("#addform").submit();
	}

})();

