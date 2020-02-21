(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(11,2);
		
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
	});
	
	/**
	 * 获取详细内容
	 */
	if(id!=""){
		$.post("/detailed/getPatentById","id="+id,function(data){
			if(data){
				$("#thesis_name").html(data.name);
				$("#ethesis_name").html(data.ename);
				$("#authors").html(function(){
			      var tmp = [], arr;
			      $.each(data.authors.split(';'), function(i, v){
			        arr = v.split(',');
			        tmp.push(arr[0]||arr[1]);
			      });
			      return tmp.join(', ');
			    });
				$("#patentname").html(data.patentname);
				$("#epatentname").html(data.epatentname);
				$("#patentno").html(data.patentno);
				$("#type").html(data.type);
				$("#certigier").html(data.certigier);
				$("#ecertigier").html(data.ecertigier);
				$("#year").html(data.year);
				$("#relevance").html(data.relevancename);
				getPro();
			}
		},"json");
	}else{
		window.close();
	}
	/***获取已关联成果***/
	function getPro(){
		var html = "", str = "";
		$.post("/list/getAllProjectList",'tkey=patent&achid='+id,function(data){
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