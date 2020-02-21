(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(26,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
	});
	
	/**
	 * 获取详细内容
	 */
	if(id!=""){
		$.post("/detailed/getCommunicationById","id="+id,function(data){
			if(data){
				$("#name").html(data.name);
				$("#ename").html(data.ename);
				$("#type").html(data.type);
				$("#etype").html(data.etype);
				$("#joinman").html(data.joinman);
				$("#ejoinman").html(data.ejoinman);
				$("#time").html(data.time);
				$("#address").html(data.address);
				$("#eaddress").html(data.eaddress);
				$("#intro").html(data.intro);
				$("#eintro").html(data.eintro);
			}
		},"json");
	}else{
		window.close();
	}
})();