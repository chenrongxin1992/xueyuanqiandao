(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(27,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
	});
	
	/**
	 * 获取详细内容
	 */
	if(id!=""){
		$.post("/detailed/getFundOpenById","id="+id,function(data){
			if(data){
				$("#title").html(data.title);
				$("#name").html(data.name);
				$("#unit").html(data.unit);
				$("#year").html(data.year);
				$("#jobtitle").html(data.jobtitle);
				$("#gender").html(data.gender);
				$("#idcard").html(data.idcard);
				$("#mphone").html(data.mphone);
				$("#email").html(data.email);
				$("#qq").html(data.qq);
				$("#keyword").html(data.keyword);
				$("#fundnumber").html(data.fundnumber);
				$("#direction").html(data.direction);
				$("#issubsidize").html(data.issubsidize);
				$("#sum").html(data.sum);
				$("#data").html(data.data);
				$("#digest").html(data.digest);
//				$("#achieve").html(data.achieve);
			}
		},"json");
	}else{
		window.close();
	}
})();