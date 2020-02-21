(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");

	$(function(){
		initSidebar(18,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#title").val("");
			$("#year").val("");
			$("#link").val("");
			
		});
		//填充数据
		if(id!=""){
			getdetail();
		}
		
		
	});
	
	
	function getdetail(){
		$.post("/detailed/getAnnualReportByid","id="+id,function(data){
			if(data){
				$("#title").val(data.title);
				$("#year").val(data.year);
				$("#link").val(data.link);
			}
		},"json");
	}
	
	function save(){
		var title = $("#title").val();
		var year = $("#year").val();
		var link = $("#link").val();
		
		
		if(title==""||title==null){
			$.alert("题目不能为空",$("#name"));
			return false;
		}
		if(year==""||year==null){
			$.alert("年份不能为空",$("#year"));
			return false;
		}
		if(link==""||link==null){
			$.alert("下载链接不能为空",$("#link"));
			return false;
		}
		
		//序列化表单元素
		var formdata=$('form').serialize()+"&model.id="+id;
		$.post("/add/saveOrUpdateAnnualReport",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/addannual?id="+data.id;
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}
})();

