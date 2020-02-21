(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(23,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
		getDetail();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getRegulationsByid","id="+id,function(data){
		if(data){
			$("#title").html(data.title);
			$("#pdf").html(data.pdfname);
			$("#link").attr("href",data.pdf);
			$("#conten").html(data.content);
		}
	},"json");
	}
	
	
})();