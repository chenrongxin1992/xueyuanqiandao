(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(30,1);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
	});
	
	/**
	 * 获取详细内容
	 */
	if(id!=""){
		$.post("/detailed/getThesisById","id="+id,function(data){
			if(data){
				$("#thesis_name").html(data.name);
				$("#ethesis_name").html(data.ename);
				$("#authors").html(data.authorsname);
				$("#tutor").html(data.tutor);
				$("#publishyear").html(data.publishyear);
				$("#unit").html(data.unit);
				$("#eunit").html(data.eunit);
				$("#pags").html(data.pags);
				$("#digest").html(data.digest);
				$("#edigest").html(data.edigest);
				getPro();
			}
		},"json");
	}else{
		window.close();
	}

	/***获取已关联成果***/
	function getPro(){
		var html = "", str = "";
		$.post("/list/getAllProjectList",'tkey=thesis&achid='+id,function(data){
			html += '<table><thead>'
				 +	'<tr><th style="width:50px;">序号</th><th>项目名称</th>'
				 +	'</thead><tbody>';
			if(data.tbody.length){
				var ii = 1;
				for(var i=0; i<data.tbody.length; i++){
					if(data.tbody[i].isown){
						html += '<tr><td class="T-td-center">' + ii + '</td>'
							 +	'<td>' + data.tbody[i].name + '</td>';
						ii++;
					}
				}
				if(ii==1){
					html += '<tr><td colspan="2" class="T-td-center">无关联项目</td></tr>';
				}
			}else{
				html += '<tr><td colspan="2" class="T-td-center">无关联项目</td></tr>';
			}

			if(str!=""){
				str = str.substring(0,str.length-1);
			}
			html += '</tbody></table>';
			$("#connect_pro").html(html);
			
		},'json');
	}
})();