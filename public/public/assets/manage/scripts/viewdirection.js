(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(15,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
		getDetail();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getResDirInfo","id="+id,function(data){
		if(data){
			$("#name").html(data.name);
			$("#ename").html(data.ename);
			$("#conten").html(data.content);
			$("#econtent").html(data.econtent);
		}
	},"json");
	}
	
	
})();