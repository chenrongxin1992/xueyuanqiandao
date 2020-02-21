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
				if(data.issubsidize){
					$("#issubsidize").html("是");
				}else{
					$("#issubsidize").html("否");
				}
				
				$("#sum").html(data.sum);
				$("#data").html(data.data);
				$("#digest").html(data.digest);
				getAch();
			}
		},"json");
	}else{
		window.close();
	}
	/***获取已关联成果***/
	function getAch(){
		var html = "";
		$.post("/list/getUserAllAch",'tkey=fund_achievement&relid='+id,function(data){
			if(data.tbody.length){
				for(var i=0; i<data.tbody.length; i++){
					if(data.tbody[i].isown){
						html +=data.tbody[i].achname+'&nbsp;&nbsp;&nbsp;';
					}
				}
			}
			$("#achieve").html(html);
			
		},'json');
	}
})();