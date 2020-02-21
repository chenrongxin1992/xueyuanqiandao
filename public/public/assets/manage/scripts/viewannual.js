(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(18,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
		getDetail();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getAnnualReportByid","id="+id,function(data){
		if(data){
			$("#title").html(data.title);
			$("#year").html(data.year);
			$("#link").html(data.link);
		}
	},"json");
	}
	
	
})();