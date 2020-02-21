(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	var editor =null;
	var editor2 =null;
	$(function(){
		initSidebar(19,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#name").val("");
			$("#ename").val("");
//			$("#dutyman").val("");
//			$("#edutyman").val("");
//			$("#year").val("");
//			$("#fundsource").val("");
//			$("#efundsource").val("");
			$("#restime").val("");
			$("#digest").val("");
			$("#edigest").val("");
			 editor.html("");
			 editor2.html("");
		});
		//填充数据
		if(id!=""){
			getdetail();
		}
		
		
	});
	
	
	function getdetail(){
		$.post("/detailed/getPosterInfo","id="+id,function(data){
			if(data){
				$("#name").val(data.name);
				$("#ename").val(data.ename);
//				$("#dutyman").val(data.dutyman);
//				$("#edutyman").val(data.edutyman);
//				$("#year").val(data.year);
//				$("#fundsource").val(data.fundsource);
//				$("#efundsource").val(data.efundsource);
				$("#restime").val(data.restime);
				 editor.html(data.digest);
				 editor2.html(data.edigest);
			}
		},"json");
	}
	
	function save(){
		var name = $("#name").val();
		var ename = $("#ename").val();
//		var dutyman = $("#dutyman").val();
//		var edutyman = $("#edutyman").val();
//		var year = $("#year").val();
//		var fundsource = $("#fundsource").val();
//		var efundsource = $("#efundsource").val();
		var restime = $("#restime").val();
		var digest = $("#digest").val();
		var edigest = $("#edigest").val();
		
		
		if(name==""||ename==""){
			$.alert("名称不能为空",$("#name"));
			return false;
		}
//		if(dutyman==""||edutyman==""){
//			$.alert("负责人不能为空",$("#dutyman"));
//			return false;
//		}
//		if(year==""||year==null){
//			$.alert("年份不能为空",$("#year"));
//			return false;
//		}
//		if(fundsource==""||efundsource==null){
//			$.alert("经费来源不能为空",$("#fundsource"));
//			return false;
//		}
		if(restime==""||restime==null){
			$.alert("时间不能为空",$("#restime"));
			return false;
		}
		if(digest==""||edigest==""){
			$.openError("摘要内容不能为空",3000);
			return false;
		}
		
		//序列化表单元素
		var formdata=$('form').serialize()+"&model.id="+id;
		$.post("/add/saveOrUpdatePoster",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/addposter?id="+data.id;
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}
//配置文本框
	KindEditor.ready(function(K) {
		editor = K.create('textarea[name="model.digest"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: true,
	      uploadJson: '/add/uploadImgFile?type=poster',
			afterCreate : function() {
				this.sync();
			},
			afterChange : function() {
				this.sync();
			},
			afterBlur:function(){
				this.sync();  
			},
			items : ['undo', 'redo' , 'bold', 'italic', 'underline', 'strikethrough', 'removeformat','|','lineheight','|','insertorderedlist', 'insertunorderedlist', 
					 'forecolor', 'hilitecolor', 'fontname', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright',
					 'justifyfull', 'link', 'unlink', '|', 'source','|','image'],
			
		});
		//英文
		editor2 = K.create('textarea[name="model.edigest"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: true,
	      uploadJson: '/add/uploadImgFile?type=poster',
			afterCreate : function() {
				this.sync();
			},
			afterChange : function() {
				this.sync();
			},
			afterBlur:function(){
				this.sync();  
			},
			items : ['undo', 'redo' , 'bold', 'italic', 'underline', 'strikethrough', 'removeformat','|','lineheight','|','insertorderedlist', 'insertunorderedlist', 
					 'forecolor', 'hilitecolor', 'fontname', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright',
					 'justifyfull', 'link', 'unlink', '|', 'source','|','image'],
			
		});
	});
})();

