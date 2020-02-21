(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");

	var editor =null,eeditor=null;
	$(function(){
		initSidebar(34,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#title").val("");
			$("#etitle").val("");
			$("#time").val("");
//			$("#conten").val("");
//			$("#econten").val("");
			$("#type").val("");
		});
		//填充数据
		if(id!=""){
			getdetail();
		}
		
	});
	
	
	function getdetail(){
		$.post("/detailed/getRecruitByid","id="+id,function(data){
			if(data){
				$("#title").val(data.title);
				$("#etitle").val(data.etitle);
				$("#type").val(data.type);
				$("#time").val(data.time);
				$("#eshow").val(data.eshow);
//				$("#conten").val(data.content);
//				$("#econten").val(data.econtent);
				 editor.html(data.content);
				 eeditor.html(data.econtent);
			}
		},"json");
	}
	
	function save(){
		var title = $("#title").val();
		var etitle = $("#etitle").val();
		var time = $("#time").val();
		var content = $("#conten").val();
		var econtent = $("#econten").val();
		var eshow = $("#eshow").val();
		
		if(title==""){
			$.alert("标题不能为空",$("#title"));
			return false;
		}
		
		if(eshow=="1"){
			if(etitle==""){
				$.alert("英文标题不能为空",$("#etitle"));
				return false;
			}
			if(econtent==""){
				$.openError("英文内容不能为空",3000);
				return false;
			}
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
		
		//序列化表单元素
		var formdata=$('form').serialize()+"&model.id="+id;
		$.post("/add/saveOrUpdateRecruit",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/addrecruit?id="+data.id;
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

