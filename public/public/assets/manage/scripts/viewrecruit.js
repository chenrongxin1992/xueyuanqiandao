(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(34,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
		getDetail();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getRecruitByid","id="+id,function(data){
		if(data){
			$("#title").html(data.title);
			$("#etitle").html(data.etitle);
			$("#time").html(data.time);
			$("#type").html(data.type);
			$("#conten").html(data.content);
			$("#econten").html(data.econtent);
		}
	},"json");
	}
	
	
})();