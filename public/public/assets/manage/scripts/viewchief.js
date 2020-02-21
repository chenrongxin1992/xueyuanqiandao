(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(13,1);
	
		$("#edit").live('click',function(){//跳转页面
			window.location.href = "/manage/addchief?id="+id;
		});
		getDetail();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getLabChiefInfo","id="+id,function(data){
		if(data){
			$("#name").html(data.name);
			$("#ename").html(data.ename);
			$("#tenure").html(data.tenure);
			$("#body_photo").attr("src",data.photo);
			$("#introduction").html(data.introduction);
			$("#eintroduction").html(data.eintroduction);
		}
	},"json");
	}
	
	
})();