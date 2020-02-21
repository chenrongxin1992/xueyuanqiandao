(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");

	$(function(){
		initSidebar(16,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#name").val("");
			$("#value").val("");
			$("#unit").val("");
			$("#brand").val("");
			$("#model").val("");
			$("#workplace").val("");
			$("#number").val("");
			$("#dutyman").val("");
			$("#manager").val("");
			
		});
		//填充数据
		if(id!=""){
			getdetail();
		}
		
		
	});
	
	
	function getdetail(){
		$.post("/detailed/getEquipmentInfo","id="+id,function(data){
			if(data){
				$("#name").val(data.name);
				$("#value").val(data.value);
				$("#unit").val(data.unit);
				$("#brand").val(data.brand);
				$("#model").val(data.model);
				$("#number").val(data.number);
				$("#dutyman").val(data.dutyman);
				$("#manager").val(data.manager);
				
				var pic = data.pic.split(";");
				var str = '';
				if(data.pic.length>0){
					for(var i=0; i<pic.length; i++){
						var a = pic[i].lastIndexOf('/');
						var s = pic[i].substring(a+1);
						str += '<div><img src="'+pic[i]+'" alt="'+s+'" style="max-width:550px;margin-bottom: -8px;"/><input type="button" style="margin-bottom: 8px;" class="normal-btn remove" value="移除"/><input type="hidden" name="pic" value="'+pic[i]+'"/></div>';
						
					}
					$(".img").append(str);
				}
			}
		},"json");
	}
	
	function save(){
		var name = $("#name").val();
		var value = $("#value").val();
		var unit = $("#unit").val();
		var brand = $("#brand").val();
		var model = $("#model").val();
		var number = $("#number").val();
		var dutyman = $("#dutyman").val();
		var manager = $("#manager").val();
		
		
		if(name==""||name==null){
			$.alert("名称不能为空",$("#name"));
			return false;
		}
		if(value==""||value==null){
			$.alert("价值不能为空",$("#value"));
			return false;
		}
		if(unit==""||unit==null){
			$.alert("单位不能为空",$("#unit"));
			return false;
		}
		if(brand==""||brand==null){
			$.alert("品牌不能为空",$("#brand"));
			return false;
		}
		if(model==""||model==null){
			$.alert("型号不能为空",$("#model"));
			return false;
		}
		if(number==""||number==""){
			$.alert("设备编号不能为空",$("#number"));
			return false;
		}
		if(dutyman==""||dutyman==null){
			$.alert("负责人不能为空",$("#dutyman"));
			return false;
		}
		if(manager==""||manager==""){
			$.alert("管理员不能为空",$("#manager"));
			return false;
		}
		
		var picstr = '';
		$("input[name='pic']").each(function(){
			picstr += $(this).val()+';';
		});
		if(picstr==''){
			$.openError("请上传设备照片",2000);
			return false;
		}
		picstr = picstr.substring(0, picstr.length-1);
		
		//序列化表单元素
		var formdata=$('form').serialize()+"&model.id="+id + "&model.pic="+picstr;
		$.post("/add/saveOrUpdateEqu",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/addequipment?id="+data.id;
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}
	
	$("#upload").live('click',function(){
		if($("#file").val()!=""){
			//提交表单	
			$("#addform").ajaxForm({
			    dataType: 'json',
			    success: function(data) {
					if(data.success){
						$.openSuccess('上传成功', 3000);
						var str = '<div><img src="'+data.url+'"/><input type="button" class="normal-btn remove" value="移除"/><input type="hidden" name="pic" value="'+data.url+'"/></div>';
						$(".img").append(str);
						$("#file").val("");
					}else{
						$.openError('上传失败', 3000);
					}					
			    }
			});
			$("#addform").submit();
		}else{
			$.alert("请选择文件",$("#file"));
		}
		
	});
	
})();

