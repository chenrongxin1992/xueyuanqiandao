(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");

	var editor =null,eeditor=null;
	$(function(){
		initSidebar(15,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#name").val("");
			$("#ename").val("");
//			$("#conten").val("");
//			$("#econtent").val("");
			
		});
		//填充数据
		if(id!=""){
			getdetail();
		}
		
	});
	
	
	function getdetail(){
		$.post("/detailed/getResDirInfo","id="+id,function(data){
			if(data){
				$("#name").val(data.name);
				$("#ename").val(data.ename);
//				$("#conten").val(data.content);
//				$("#econtent").val(data.econtent);
				 editor.html(data.content);
				 eeditor.html(data.econtent);
			}
		},"json");

	}
	
	function save(){
		var name = $("#name").val();
		var ename = $("#ename").val();
		var content = $("#conten").val();
		var econtent = $("#econtent").val();
		
		if(name==""||ename==""){
			$.alert("名称不能为空",$("#name"));
			return false;
		}
//		if(content==""||econtent==""){
//			$.alert("内容不能为空",$("#conten"));
//			return false;
//		}
		if(content==""||econtent==""){
			$.openError("内容不能为空",3000);
			return false;
		}
		
		//序列化表单元素
		var formdata=$('form').serialize()+"&model.id="+id;
		$.post("/add/saveOrUpdateResDir",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/adddirection?id="+data.id;
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
		eeditor = K.create('textarea[name="model.econtent"]', {
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

