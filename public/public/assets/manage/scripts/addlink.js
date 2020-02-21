$(function(){
	initSidebar(39,1);
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	//填充数据
	if(id!=""){
		getdetail();
	}
	
	function getdetail(){
		$.post("/detailed/getModelByid","tkey=relatedlink"+"&id="+id,function(data){
			if(data){
				$("#tname").val(data.type);
				$(".sitename").val(data.name);
				$(".siteurl").val(data.url);
				$("#eshow").val(data.eshow);
				$("#ename").val(data.ename);

				 //图标
				var str = '<img src="'+data.icon+'" />'
					+'<span class="delete_icon remove" title="移除" data-url="'+data.icon+'">移除</span>'
					+'<input type="hidden" name="model.icon" value="'+data.icon+'" class="icon-pic"/>';
				$(".icon-tip").html(str);
				if(data.picurl){
					//二维码
					var str = '<img src="'+data.picurl+'" />'
						+'<span class="delete_icon remove" title="移除" data-url="'+data.picurl+'">移除</span>'
						+'<input type="hidden" name="model.picurl" value="'+data.picurl+'" class="code-pic"/>';
					$(".code-tip").html(str);
				}
			}
		},"json");
	}
	//保存
	$("#add_btn").click(function(){
		var type = $("#tname").val(),
			siteName = $(".sitename").val(),
			siteUrl = $(".siteurl").val(),
			iconPic = $(".icon-pic").val(),
			codePic = $(".code-pic").val();
		var formdata = $('#addform').serialize();

		if(type==""){
			$.alert("请选择类别",$("#tname"));
			return false;
		}
		if(siteName==""){
			$.alert("请填写网站名称",$(".sitename"));
			return false;
		}
		if(typeof iconPic=="undefined"||iconPic==""){
			$.alert("请上传图标",$("#icon_pic"));
			return false;
		}
		if(type=="微信"){
			if(codePic=="undefined"||codePic==""){
				$.alert("请上传二维码图片",$("#code_pic"));
				return false;
			}
		}else{
			if(siteUrl==""){
				$.alert("请填写网站地址",$(".siteurl"));
				return false;
			}
		}
		formdata += "&model.id=" + id;
		$.post("/add/saveOrUpdateRelatedlink",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 2000, function(){window.location.href = "/manage/addlink";});
				
			}else{
				$.openError('保存失败，请重试', 3000);
			}
		},'json');
	});
	
	//图片上传
	$(".icon-upload").click(function(){
		if($("#icon_pic").val()!=""){
			//提交表单	
			$("#addform").ajaxForm({
			    dataType: 'json',
			    success: function(data) {
					if(data.success){
						$.openSuccess('上传成功', 3000);
						var str = '<img src="'+data.url+'" />'
							+'<span class="delete_icon remove" title="移除" data-url="'+data.url+'">移除</span>'
							+'<input type="hidden" name="model.icon" value="'+data.url+'" class="icon-pic"/>';
						$(".icon-tip").html(str);
						$("#icon_pic").val("");
					}else{
						$.openError('上传失败', 3000);
					}					
			    }
			});
			$("#addform").submit();
		}else{
			$.alert("请选择文件",$("#icon_pic"));
		}
		
	});
	//二维码上传
	$(".code-upload").click(function(){
		if($("#code_pic").val()!=""){
			//提交表单	
			$("#addform").ajaxForm({
			    dataType: 'json',
			    success: function(data) {
					if(data.success){
						$.openSuccess('上传成功', 3000);
						var str = '<img src="'+data.url+'" />'
							+'<span class="delete_icon remove" title="移除" data-url="'+data.url+'">移除</span>'
							+'<input type="hidden" name="model.picurl" value="'+data.url+'" class="code-pic"/>';
						$(".code-tip").html(str);
						$("#code_pic").val("");
					}else{
						$.openError('上传失败', 3000);
					}					
			    }
			});
			$("#addform").submit();
		}else{
			$.alert("请选择文件",$("#code_pic"));
		}
		
	});
	//移除图片
	$(".remove").live('click',function(){
		$.get("/delete/deleteFile","filePath="+$(this).data("url"),function(data){
			if(!data.success){
				$.openError(data.error, 2000);
			}
		},'json');
		$(this).parent().empty();
	});
});