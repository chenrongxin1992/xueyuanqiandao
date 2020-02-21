(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(3,2);
		
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
	});
	
	/**
	 * 获取详细内容
	 */
	if(id!=""){
		$.post("/detailed/getProjectById","id="+id,function(data){
			if(data){
				$("#name").html(data.name);
				$("#ename").html(data.ename);
				$("#principal").html(data.principal);
				$("#eprincipal").html(data.eprincipal);
				$("#fundsource").html(data.fundsource);
				$("#year").html(data.year);
				$("#restimebegin").html(data.restimebegin);
				$("#restimeend").html(data.restimeend);
				$("#efundsource").html(data.efundsource);
				$("#digest").html(data.digest);
				$("#edigest").html(data.edigest);
				$("#participant").html(data.participant);
				
				$("#eparticipant").html(data.eparticipant);
				
				$("#money").html(data.money);
				getAch();
			}
		},"json");
	}else{
		window.close();
	}
	/***获取已关联成果***/
	function getAch(){
		var html = "";
		$.post("/list/getUserAllAch",'tkey=project_achievement&relid='+id,function(data){
			html += '<table><thead>'
				 +	'<tr><th style="width:50px;">序号</th><th>名称</th><th style="width:60px;">是否显示</th>'
				 +	'</thead><tbody>';
			if(data.tbody.length){
				var ii = 1;
				for(var i=0; i<data.tbody.length; i++){
					if(data.tbody[i].isown){
						html += '<tr><td class="T-td-center">' + ii + '</td>'
							 +	'<td>' + data.tbody[i].achname + '</td>'
							 +	'<td class="T-td-center">'
							 + (data.tbody[i].isshow==1?'是':'否')+'</td>';
						ii++;
				
					}
				}
				if(ii==1){
					html += '<tr><td colspan="3" class="T-td-center">无关联成果</td></tr>';
				}
			}else{
				html += '<tr><td colspan="3" class="T-td-center">无关联成果</td></tr>';
			}
			html += '</tbody></table>';
			$("#achieve").html(html);
			
		},'json');
	}
})();