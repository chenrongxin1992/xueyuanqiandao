(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");

	var editor =null;
	$(function(){
		initSidebar(23,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#title").val("");
			$("#address").html("");
			$("#pdf").val("");
//			$("#conten").val("");
			
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
		$.post("/detailed/getRegulationsByid","id="+id,function(data){
			if(data){
				$("#modelid").val(id);//主键
				$("#pdfname").val(data.pdfname);//原PDF名称
				$("#title").val(data.title);
				$("#pdf").val(data.pdf);
//				$("#conten").val(data.content);
				 editor.html(data.content);
				var str = '<a href="'+data.pdf+'">'+data.pdfname+'</a><input type="button" class="normal-btn" id="delete" value="删除"/>';
				$("#file").html(str);
				$("#delete").bind('click',function(){
					//清空
					$("#file").html("");
					$("#link").val("");
					$("#pdf").val("");
					$("#pdfname").val("");
				});
			}
		},"json");
	}
	
	function save(){
		var title = $("#title").val();
		var content = $("#conten").val();
		var link = $("#link").val();
		var pdf = $("#pdf").val();
		
		if(title==""||title==null){
			$.alert("标题不能为空",$("#title"));
			return false;
		}
		if(pdf==""){
			if(link==""||link==null){
				$.alert("请选择PDF",$("#link"));
				return false;
			}			
		}

//		if(content==""||content==null){
//			$.alert("内容不能为空",$("#conten"));
//			return false;
//		}
		if(content==""||content==null){
			$.openError("内容不能为空",3000);
			return false;
		}
		//提交表单	
		$("#addform").ajaxForm({
		    dataType: 'json',
		    success: function(data) {   
				if(data.success){
					$.openSuccess('保存成功', 3000);
					window.location.href = "/manage/addrule?id="+data.id;
				}else{
					$.openError('保存失败', 3000);
				}					
		    }
		});
		$("#addform").submit();
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
})();

