(function(){
	$(function(){
		initSidebar(12,1);
	
		$("#edit").live('click',function(){//跳转页面
			window.location.href = "/manage/editlab";
		});
		getDetail();
	});
	
	/**
	 * 获取详细内容
	 */
	function getDetail(){
		$.post("/detailed/getLabInfo",function(data){
		if(data){
			$("#name").html(data.name);
			$("#ename").html(data.ename);
			$("#createtime").html(data.createtime);
			$("#description").html(data.description);
			$("#edescription").html(data.edescription);
			var pic = data.pic.split(";");
			var img = '';
			if(data.pic.length>0){
				for(var i=0; i<pic.length; i++){
					img += '<img src="'+pic[i]+'" style="border:0;display:block;width:600px;margin:6px;"/>';
				}
				$("#images").html(img);
			}
			
		}
	},"json");
	}
	
	
})();