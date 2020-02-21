(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");

	$(function(){
		initSidebar(14,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#name").val("");
			$("#tenure").val("");
			$("#titles").val("");
			$("#profession").val("");
			$("#prefecture").val("");
			$("#workplace").val("");
			
		});
		//填充数据
		if(id!=""){
			getdetail();
		}
		
		
	});
	
	
	function getdetail(){
		$.post("/detailed/getAcaComInfo","id="+id,function(data){
			if(data){
				$("#name").val(data.name);
				$("#tenure").val(data.tenure);
				$("#titles").val(data.titles);
				$("#profession").val(data.profession);
				$("#prefecture").val(data.prefecture);
				$("#workplace").val(data.workplace);
				$("#ename").val(data.ename);
				$("#etenure").val(data.etenure);
				$("#etitles").val(data.etitles);
				$("#eprofession").val(data.eprofession);
				$("#eprefecture").val(data.eprefecture);
				$("#eworkplace").val(data.eworkplace);
			}
		},"json");
	}
	
	function save(){
		var name = $("#name").val();
		var tenure = $("#tenure").val();
		var titles = $("#titles").val();
		var profession = $("#profession").val();
		var prefecture = $("#prefecture").val();
		var workplace = $("#workplace").val();
		
		
		if(name==""||name==null){
			$.alert("姓名不能为空",$("#name"));
			return false;
		}
		if(tenure==""||tenure==null){
			$.alert("任职不能为空",$("#tenure"));
			return false;
		}
		if(titles==""||titles==null){
			$.alert("职称不能为空",$("#titles"));
			return false;
		}
		if(profession==""||profession==null){
			$.alert("专业不能为空",$("#profession"));
			return false;
		}
		if(prefecture==""||prefecture==null){
			$.alert("任期不能为空",$("#prefecture"));
			return false;
		}
		if(workplace==""||workplace==""){
			$.alert("工作单位不能为空",$("#workplace"));
			return false;
		}
		
		//序列化表单元素
		var formdata=$('form').serialize()+"&model.id="+id;
		$.post("/add/saveOrUpdateAcaComm",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/addcommittee?id="+data.id;
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}
})();

