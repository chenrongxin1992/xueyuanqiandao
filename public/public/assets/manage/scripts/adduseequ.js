(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");

	$(function(){
		initSidebar(22,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#equname").val("");
			$("#user").val("");
			$("#begintime").val("");
			$("#endtime").val("");
			
		});
		//填充数据
		equ_list();
		if(id!=""){
			getdetail();
		}
		
		
	});
	function equ_list(){
		//所有设备列表
		var html = "";
		var str = "";
		$.post("/list/getAllEquList",function(data){
			if(data){
				for(var i=0; i<data.length; i++){
					html += '<option id="'+data[i].id+'" value="'+data[i].id+'">'+data[i].name+'</option>';
				};
			}else{
				html += '<option id="">暂无设备</option>';
			}
			$("#equname").html(html);
		},'json');
		//使用人列表
		$.post("/list/getAllResUser",function(data){
			if(data){
				for(var i=0; i<data.length; i++){
					str += '<option id="'+data[i].id+'" value="'+data[i].id+'">'+data[i].name+'</option>';
				};
			}else{
				str += '<option id="">暂无人员</option>';
			}
			$("#user").html(str);
		},'json');
	}
	
	function getdetail(){
		
		$.post("/detailed/getEquipmentUseInfo","id="+id,function(data){
			if(data){
				$("#equname").val(data.eid);
				$("#user").val(data.uid);
				$("#begintime").val(data.begintime);
				$("#endtime").val(data.endtime);
			}
		},"json");
	}
	
	function save(){
		var equname = $("#equname").val();
		var user = $("#user").val();
		var begintime = $("#begintime").val();
		var endtime = $("#endtime").val();
		
		
		if(equname==""||equname==null){
			$.alert("设备名称不能为空",$("#equname"));
			return false;
		}
		if(user==""||user==null){
			$.alert("领用人不能为空",$("#user"));
			return false;
		}
		if(begintime==""||begintime==null){
			$.alert("开始时间不能为空",$("#begintime"));
			return false;
		}
		if(endtime==""||endtime==null){
			$.alert("结束时间不能为空",$("#endtime"));
			return false;
		}
		
		//序列化表单元素
		var formdata=$('form').serialize()+"&model.id="+id;
		$.post("/add/saveOrUpdateEquUse",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/adduseequ?id="+data.id;
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}
})();

