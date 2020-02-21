(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	var editor =null,eeditor=null;
	$(function(){
		initSidebar(17,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#title").val("");
			$("#time").val("");
			$("#conten").val("");
			
		});
		//填充数据
		if(id!=""){
			getdetail();
		}
		
		
	});
	
	
	function getdetail(){
		$.post("/detailed/getNewsByid","id="+id,function(data){
			if(data){
				$("#title").val(data.title);
				$("#etitle").val(data.etitle);
				$("#time").val(data.time);
				$("#eshow").val(data.eshow);
				 editor.html(data.content);
				 eeditor.html(data.econtent);
			}
		},"json");
	}
	
	function save(){
		var title = $("#title").val();
		var time = $("#time").val();
		var content = $("#conten").val();
		
		
		if(title==""){
			$.alert("标题不能为空",$("#title"));
			return false;
		}
		if(time==""||time==null){
			$.alert("发布时间不能为空",$("#time"));
			return false;
		}
		if(content==""){
			$.openError("内容不能为空",3000);
			return false;
		}
		
		//序列化表单元素
		var formdata=$('form').serialize()+"&model.id="+id;
		$.post("/add/saveOrUpdateNews",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/addnews?id="+data.id;
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}
//配置文本框
KindEditor.ready(function(K) {
	editor = K.create('textarea[name="model.content"]', {
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
	eeditor = K.create('textarea[name="model.econtent"]', {
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

