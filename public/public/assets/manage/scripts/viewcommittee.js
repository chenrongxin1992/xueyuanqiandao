(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(14,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
		getDetail();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getAcaComInfo","id="+id,function(data){
		if(data){
			$("#name").html(data.name);
			$("#tenure").html(data.tenure);
			$("#titles").html(data.titles);
			$("#profession").html(data.profession);
			$("#prefecture").html(data.prefecture);
			$("#workplace").html(data.workplace);
			
			$("#ename").html(data.ename);
			$("#etenure").html(data.etenure);
			$("#etitles").html(data.etitles);
			$("#eprofession").html(data.eprofession);
			$("#eprefecture").html(data.eprefecture);
			$("#eworkplace").html(data.eworkplace);
		}
	},"json");
	}
	
	
})();