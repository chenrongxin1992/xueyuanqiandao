(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(22,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
		getDetail();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getEquipmentUseInfo","id="+id,function(data){
		if(data){
			$("#equname").html(data.equname);
			$("#user").html(data.username);
			$("#begintime").html(data.begintime);
			$("#endtime").html(data.endtime);
		}
	},"json");
	}
	
	
})();