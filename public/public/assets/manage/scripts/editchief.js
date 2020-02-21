(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	var editor =null,eeditor=null;

	$(function(){
		initSidebar(13,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#name").val("");
			$("#ename").val("");
			$("#body_photo").attr("src","");
			$("#photo").val("");
			$("#tenure").val("");
			$("#introduction").val("");
			$("#eintroduction").val("");
			
		});
		//填充数据
		if(id!=""){
			getdetail();
		}
		
		
	});
	
	
	function getdetail(){
		$.post("/detailed/getLabChiefInfo","id="+id,function(data){
			if(data){
				$("#name").val(data.name);
				$("#ename").val(data.ename);
				$("#body_photo").attr("src",data.photo);
				$("#photo").val(data.photo);
				$("#tenure").val(data.tenure);
//				$("#introduction").val(data.introduction);
//				$("#eintroduction").val(data.eintroduction);
				 editor.html(data.introduction);
				 eeditor.html(data.eintroduction);
			}
		},"json");
	}
	
	function save(){
		var name = $("#name").val();
		var ename = $("#ename").val();
		var photo = $("#photo").val();
		var tenure = $("#tenure").val();
		var introduction = $("#introduction").val();
		var eintroduction = $("#eintroduction").val();
		
		
		if(name==""||ename==""){
			$.alert("姓名不能为空",$("#name"));
			return false;
		}
		if(photo==""||photo==null){
			$.alert("请选择上传照片",$("#changePhotoBtn"));
			return false;
		}
		if(tenure==""||tenure==null){
			$.alert("任期不能为空",$("#tenure"));
			return false;
		}
		if(introduction==""||eintroduction==""){
			$.alert("简介不能为空",$("#introduction"));
			return false;
		}
		
		//序列化表单元素
		var formdata=$('form').serialize()+"&model.id="+id;
		$.post("/add/saveOrUpdateLabChief",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/labchief";
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}
	//配置文本框
	KindEditor.ready(function(K) {
		editor = K.create('textarea[name="model.introduction"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: true,
	        uploadJson: '/add/uploadImgFile?type=news',
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
					 'justifyfull', 'link', 'unlink', '|', 'source','|','image'],
			
		});
	});

	KindEditor.ready(function(K) {
		eeditor = K.create('textarea[name="model.eintroduction"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: true,
	        uploadJson: '/add/uploadImgFile?type=news',
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
					 'justifyfull', 'link', 'unlink', '|', 'source','|','image'],
			
		});
	});
})();

