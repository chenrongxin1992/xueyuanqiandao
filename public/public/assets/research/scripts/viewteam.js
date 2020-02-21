(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(4,2);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
		getDetail();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getTeamInfo","id="+id,function(data){
		if(data){
			$("#name").html(data.name);
			$("#intro").html(data.intro);
			$("#ename").html(data.ename);
			$("#eintro").html(data.eintro);
			var str = "";
			for(var i=0; i<data.userlist.length; i++){
				str += data.userlist[i].name +"（"+data.userlist[i].duty +"）<br/>";
			}
			$("#member").html(str);
		}
	},"json");
	}
	
	
})();