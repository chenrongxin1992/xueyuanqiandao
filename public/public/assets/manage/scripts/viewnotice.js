(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(20,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
		getDetail();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getNoticeByid","id="+id,function(data){
		if(data){
			$("#title").html(data.title);
			$("#etitle").html(data.etitle);
			$("#time").html(data.time);
			$("#conten").html(data.content);
			$("#econten").html(data.econtent);
			var attach = '';
			if(data.attachments){
				var	attachments = data.attachments.split(',');
					attachmentsname = data.attachmentsname.split('||');
				attachments.forEach(function(element,i){
					attachmentsname.forEach(function(elements,j){
						if(i==j){
							attach +='<li>'
									+	'<a href="'+element+'">'+elements+'</a>'
									+'</li>';
						}
					});
				});				
			}

			$("#attachment").html(attach);
		}
	},"json");
	}
	
	
})();