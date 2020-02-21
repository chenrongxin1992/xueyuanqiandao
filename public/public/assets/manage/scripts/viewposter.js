(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(19,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
		getDetail();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getPosterInfo","id="+id,function(data){
		if(data){
			$("#name").html(data.name);
			$("#ename").html(data.ename);
//			$("#dutyman").html(data.dutyman);
//			$("#edutyman").html(data.edutyman);
//			$("#year").html(data.year);
//			$("#fundsource").html(data.fundsource);
//			$("#efundsource").html(data.efundsource);
			$("#restime").html(data.restime);
			$("#digest").html(data.digest);
			$("#edigest").html(data.edigest);
		}
	},"json");
	}
	
	
})();