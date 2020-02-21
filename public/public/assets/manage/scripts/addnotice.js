(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");

	var editor =null,eeditor=null;
	$(function(){
		initSidebar(20,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#title").val("");
			$("#etitle").val("");
			$("#time").val("");
			
		});
		//填充数据
		if(id!=""){
			getdetail();
		}
		
		
	});
	
	function getdetail(){
		$.post("/detailed/getNoticeByid","id="+id,function(data){
			if(data){
				$("#title").val(data.title);
				$("#etitle").val(data.etitle);
				$("#time").val(data.time);
				$("#eshow").val(data.eshow);
//				$("#econten").val(data.econtent);
				 editor.html(data.content);
				 eeditor.html(data.econtent);
				 //附件
				var attach = '';
				if(data.attachments){
					var	attachments = data.attachments.split(','),
						attachmentsname = data.attachmentsname.split('||');
					attachments.forEach(function(element,i){
						attachmentsname.forEach(function(elements,j){
							if(i==j){
								attach +='<li>'
										+	'<a href="'+element+'">'+elements+'</a>'
										+	'<span class="delete_icon remove" title="移除附件" data-url="'+data.attachments+'">移除</span>'
										+	'<input type="hidden" name="files" value="'+element+'"/>'
										+	'<input type="hidden" name="filesname" value="'+elements+'"/>'
										+'</li>';
							}
						});
					});				
				}

				$(".file_list").html(attach);
			}
		},"json");
	}
	
	function save(){
		var title = $("#title").val(),
			time = $("#time").val(),
			content = $("#conten").val(),
			attachments = [],
			attachmentsname = [];
		
		if(title==""){
			$.alert("标题不能为空",$("#title"));
			return false;
		}
		if(time==""||time==null){
			$.alert("发布时间不能为空",$("#time"));
			return false;
		}
//		if(content==""||econtent==""){
//			$.alert("内容不能为空",$("#conten"));
//			return false;
//		}
		if(content==""){
			$.openError("内容不能为空",3000);
			return false;
		}
		$("input[name='files']").each(function(){
			attachments.push($(this).val());
		});
		$("input[name='filesname']").each(function(){
			attachmentsname.push($(this).val());
		});
		
		//序列化表单元素
		var formdata=$('form').serialize()
			+"&model.id="+id
			+"&model.attachments="+attachments.join(',')
			+"&model.attachmentsname="+attachmentsname.join('||');
		$.post("/add/saveOrUpdateNotice",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/addnotice?id="+data.id;
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}
	//编辑器
	KindEditor.ready(function(K) {
		editor = K.create('textarea[name="model.content"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: true,
	        uploadJson: '/add/uploadImgFile?type=notices',
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
					 'justifyfull', 'link', 'unlink', '|', 'source','image'],
			
		});
	});
	KindEditor.ready(function(K) {
		eeditor = K.create('textarea[name="model.econtent"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: true,
	        uploadJson: '/add/uploadImgFile?type=notices',
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
					 'justifyfull', 'link', 'unlink', '|', 'source','image'],
			
		});
	});
	//上传附件
	$("#upload").live('click',function(){
		if($("#file").val()!=""){
			//提交表单	
			$("#addform").ajaxForm({
			    dataType: 'json',
			    success: function(data) {
					if(data.success){
						$.openSuccess('上传成功', 2000);
						var str = '<li><a href="'+data.url+'">'+data.oldname+'</a>'
							+'<span class="delete_icon remove" title="移除附件" data-url="'+data.url+'">移除</span>'
							+'<input type="hidden" name="files" value="'+data.url+'"/>'
							+'<input type="hidden" name="filesname" value="'+data.oldname+'"/></li>';
						$(".file_list").append(str);
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
	//移除附件
	$(".remove").live('click',function(){
		$.get("/delete/deleteFile","filePath="+$(this).data("url"),function(data){
			if(!data.success){
				$.openError(data.error, 2000);
			}
		},'json');
		$(this).parent().remove();
	});
})();

