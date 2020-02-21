(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(7,2);
	$("#close").live('click',function(){//关闭页面
		window.close();
	});
	});
	
	/**
	 * 获取详细内容
	 */
	if(id!=""){
		$.post("/detailed/getPerArtById","id="+id,function(data){
			if(data){
				$("#periodical").html(data.periodical);
				$("#eperiodical").html(data.eperiodical);
				$("#thesis_name").html(data.name);
				$("#ethesis_name").html(data.ename);
				var str = data.authors.split(";");
				var tmp, arr=[];
				$.each(str, function(i, v){
                  tmp = v.split(',');
                  arr.push(tmp[0]);
                  arr.push("、");
                });
				arr.pop();
				$("#authors").html(arr);
				$("#publishyear").html(data.publishyear);
				$("#issue").html(data.issue);
				$("#issn").html(data.issn);
				$("#pagination").html(data.pagination);
				$("#digest").html(data.digest);
				$("#edigest").html(data.edigest);
				
				$("#mstatus").html(data.status);
				$("#include").html(data.include);
				$("#pdfurl").html(data.pdfurl);
				
				$("#reelnumber").html(data.reelnumber);
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
		$.post("/list/getAllProjectList",'tkey=periodical_article&achid='+id,function(data){
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