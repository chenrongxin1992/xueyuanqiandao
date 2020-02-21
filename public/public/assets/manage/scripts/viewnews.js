(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(17,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
		getDetail();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getNewsByid","id="+id,function(data){
		if(data){
			$("#title").html(data.title);
			$("#etitle").html(data.etitle);
			$("#time").html(data.time);
			$("#conten").html(data.content);
			$("#econten").html(data.econtent);
		}
	},"json");
	}
	
	
})();