(function(){

	var editor =null,eeditor=null;
	$(function(){
		initSidebar(12,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#name").val("");
			$("#ename").val("");
			$("#createtime").val("");
//			$("#description").val("");
//			$("#edescription").val("");
			
		});
		//填充数据
		getdetail();
		
		//移除照片
		$(".remove").live('click',function(){
			$(this).parent().remove();
		});
		
	});
	
	
	function getdetail(){
		$.post("/detailed/getLabInfo",function(data){
			if(data){
				$("#name").val(data.name);
				$("#ename").val(data.ename);
				$("#createtime").val(data.createtime);
//				$("#description").val(data.description);
//				$("#edescription").val(data.edescription);
				 editor.html(data.description);
				 eeditor.html(data.edescription);
				var pic = data.pic.split(";");
				var str = '';
				if(data.pic.length>0){
					for(var i=0; i<pic.length; i++){
						var a = pic[i].lastIndexOf('/');
						var s = pic[i].substring(a+1);
						str += '<div><img src="'+pic[i]+'" alt="'+s+'" style="width:550px;margin-bottom: -8px;"/><input type="button" style="margin-bottom: 8px;" class="normal-btn remove" value="移除"/><input type="hidden" name="pic" value="'+pic[i]+'"/></div>';
						
					}
					$(".img").append(str);
				}
				
			}
		},"json");
	}
	
	function save(){
		var name = $("#name").val();
		var ename = $("#ename").val();
		var createtime = $("#createtime").val();
		var description = $("#description").val();
		var edescription = $("#edescription").val();
		var picstr = '';
		var num = 0;
		$("input[name='pic']").each(function(){
			picstr += $(this).val()+';';
			num++;
		});
		console.log(picstr);
		
		if(name==""||ename==""){
			$.alert("实验室名称不能为空",$("#name"));
			return false;
		}
		if(createtime==""||createtime==null){
			$.alert("创建时间不能为空",$("#createtime"));
			return false;
		}
//		if(description==""||edescription==""){
//			$.alert("简介不能为空",$("#description"));
//			return false;
//		}
		if(description==""||edescription==""){
			$.openError("简介不能为空",3000);
			return false;
		}
		if(num!=3){
			$.openError("请上传三张实验室照片",2000);
			return false;
		}
		picstr = picstr.substring(0, picstr.length-1);
		//序列化表单元素
		var formdata=$('form').serialize()+"&model.pic="+picstr;
		$.post("/add/updateLab",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/lab";
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
	//编辑器
	KindEditor.ready(function(K) {
		editor = K.create('textarea[name="model.description"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: false,
			afterCreate : function() {
				this.sync();
			},
			afterChange : function() {
				this.sync();
			},
			afterBlur:function(){
				this.sync();  
			},
			items : ['undo', 'redo' , 'bold', 'italic', 'underline', 'strikethrough', 'removeformat','|','lineheight','insertorderedlist', 'insertunorderedlist', 
					 'forecolor', 'hilitecolor', 'fontname', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright',
					 'justifyfull', 'link', 'unlink', '|', 'source'],
			
		});
	});
	KindEditor.ready(function(K) {
		eeditor = K.create('textarea[name="model.edescription"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: false,
			afterCreate : function() {
				this.sync();
			},
			afterChange : function() {
				this.sync();
			},
			afterBlur:function(){
				this.sync();  
			},
			items : ['undo', 'redo' , 'bold', 'italic', 'underline', 'strikethrough', 'removeformat','|','lineheight','insertorderedlist', 'insertunorderedlist', 
					 'forecolor', 'hilitecolor', 'fontname', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright',
					 'justifyfull', 'link', 'unlink', '|', 'source'],
			
		});
	});
})();

