(function(){
	$(function(){
		var id = getQueryString("id")==null ? "" : getQueryString("id");
		initSidebar(36,1);
		getDetail(id);
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(id){
		$.post("/detailed/getSoftwareByid?id="+id,function(data){
		if(data){
			$("#name").html(data.name);
			$("#ename").html(data.ename);
			$("#introduce").html(data.introduce);
			$("#eintroduce").html(data.eintroduce);
			$("#url").html(data.url);
			$("#sort").html(data.sort);
			var img = '<img src="'+data.pic+'" style="border:0;display:block;width:600px;margin:6px;"/>';
			$("#images").html(img);
		}
	},"json");
	}
	
	
})();