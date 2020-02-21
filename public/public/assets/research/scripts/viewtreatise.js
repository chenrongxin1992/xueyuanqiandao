(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(12,2);
	
		$("#close").live('click',function(){//关闭页面
			window.close();
		});
	});
	
	/**
	 * 获取详细内容
	 */
	if(id!=""){
		$.post("/detailed/getTreatiseById","id="+id,function(data){
			if(data){
				$("#treatise_name").html(data.name);					//[1] 著作名称 
				$("#etreatise_name").html(data.ename);					//[1] 著作名称(英文)
				$("#authors").html(function(){		  					//[2] 作者
			          var tmp = [], arr;
			          $.each(data.authors.split(';'), function(i, v){
			            arr = v.split(',');
			            tmp.push(arr[0]||arr[1]);
			          });
			          return tmp.join(', ');
			        });
				$("#publish").html(data.publish);						//[3] 出版社
				$("#epublish").html(data.epublish);						//[3] 出版社(英文)
				$("#publishyear").html(data.publishyear);				//[4] 出版年
				$("#publishaddr").html(data.publishaddr);				//[5] 出版地
				$("#epublishaddr").html(data.epublishaddr);				//[5] 出版地(英文)
				$("#isbn").html(data.isbn);								//[6] ISBN号码
				$("#pagination").html(data.pagination);					//[7] 页码
				$("#versions").html(data.versions);						//[8] 版本
				$("#digest").html(data.digest);							//[9] 摘要
				$("#edigest").html(data.edigest);						//[9] 英文摘要
				if(data.url != ""){										//[10] 封面图片
					$("#pic_url").attr("src",data.url);						
					$("#pic_url").css({ width : 400, height : 400});
				}else{
					$("#pic").html("");
				}
				getPro();
			}
		},"json");
	}else{
		window.close();
	}
	/***获取已关联成果***/
	function getPro(){
		var html = "", str = "";
		$.post("/list/getAllProjectList",'tkey=treatise&achid='+id,function(data){
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