(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");

	$(function(){
		initSidebar(25,1);
//		changeOne();
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#name").val("");
			$("#ename").val("");
			$("#principal").val("");
			$("#eprincipal").val("");
			$("#category").val("");
//			changeOne();//初始化第一个类型列表
			$("#typeone").val("");
			$("#typetwo").val("");
			$("#typethree").val("");
			$("#year").val("");
			$("#fundsource").val("");
			$("#restimebegin").val("");
			$("#restimeend").val("");
			$("#contractno").val("");
			$("#digest").val("");
			$("#edigest").val("");
			$("#participant").val("");
			$("#eparticipant").val("");
			$("#efundsource").val("");
			$("#money").val("");
		});
		//若是编辑模式则填充数据
		if(id!=""){
			getdetail();
			getAch();
		}
		
		//关联成果
		$("#connect").click(function(){
			getList();
		});
		//全选
		$("#selectall").live('click',function(){
	        var stat = this.checked;
	        $("input[name='achid']").each(function(){
	            this.checked = stat;
	        });
		});
		$("#select").live('click',function(){
	        $("input[name='achid']").each(function(){
	            this.checked = true;
	        });
	        $("#selectall").attr("checked",'true');
		});

		$("#reverse").live('click',function(){
	    	$("input[name='achid']").each(function(){
			   $(this).attr("checked",!this.checked);
			});
	    	check();
		});
		//选子checkbox检查全选状态
		$("input[name='achid']").live("click",function(){
			check();
		});
		//判断子checkbox是否全部选中
		function check(){
			var ischeckAll = true;
			$("input[name='achid']").each(function(){
				if(!$(this).attr("checked")){
					ischeckAll = false;
					return false;
				}
			});
			$("#selectall").attr("checked",ischeckAll);
		}
	});
	
	function getdetail(){
		$.post("/detailed/getProjectById","id="+id,function(data){
			if(data){
				$("#name").val(data.name);
				$("#ename").val(data.ename);
				$("#principal").val(data.principal);
				$("#eprincipal").val(data.eprincipal);
							
/*				$("#category").val(data.category);
				if(data.category=="纵向"){
					$("#one").val(data.typeone);
					$("#two").val(data.typetwo);
					$("#three").val(data.typethree);
					changeOne();
				}else{
					$("#typetitle").html("合作人");
					$("#typecontent").html('<input type="text" class="input-normal" id="partner" name="model.partner"/>');
					$("#partner").val(data.partner);
				}*/
				
				$("#year").val(data.year);
				$("#fundsource").val(data.fundsource);
				$("#restimebegin").val(data.restimebegin);
				$("#restimeend").val(data.restimeend);
				$("#contractno").val(data.contractno);
				$("#digest").val(data.digest);
				$("#edigest").val(data.edigest);
				
				$("#participant").val(data.participant);
				$("#eparticipant").val(data.eparticipant);
				$("#efundsource").val(data.efundsource);
				
				$("#money").val(data.money);
			}
		},"json");
	}
	
	function save(){
		var name = $("#name").val();
		var ename = $("#ename").val();
//		var category = $("#category").val();
		var principal = $("#principal").val();
		var eprincipal = $("#eprincipal").val();
		var year = $("#year").val();
		var fundsource = $("#fundsource").val();
		var digest = $("#digest").val();
		var edigest = $("#edigest").val();
		var restimebegin = $("#restimebegin").val();
		var restimeend = $("#restimeend").val();
		var contractno = $("#contractno").val();
	
		if(name==""||ename==""){
			$.alert("名称不能为空",$("#name"));
			$("#name").focus();
			return false;
		}
		if(principal==""||eprincipal==""){
			$.alert("负责人不能为空",$("#principal"));
			$("#principal").focus();
			return false;
		}
		if(year==""||year==null){
			$.alert("年份不能为空",$("#year"));
			$("#year").focus();
			return false;
		}
		if(fundsource==""||fundsource==null){
			$.alert("经费来源不能为空",$("#fundsource"));
			$("#fundsource").focus();
			return false;
		}
		if(restimebegin==""||restimeend==""){
			$.alert("研究时间不能为空",$("#restimeend"));
			$("#restimeend").focus();
			return false;
		}
		if(!restimebegin.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)||!restimebegin.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)) { 
			$.alert("研究时间日期格式不正确",$("#restimeend"));
			return false;
		}
		if(contractno==""||contractno==null){
			$.alert("合同号不能为空",$("#contractno"));
			$("#contractno").focus();
			return false;
		}
		if(digest==""||edigest==""){
			$.alert("摘要不能为空",$("#digest"));
			$("#digest").focus();
			return false;
		}
		var achstr = [];
		$(".isshow").each(function(){
			var v = $(this).data("str");
			if(!$(this).attr("checked")){
				achstr.push( (v.substring(0,v.length-1)+"0") );
			}else{
				achstr.push( (v.substring(0,v.length-1)+"1") );
			}
		});
		
		//序列化表单元素
		var formdata = $('form').serialize() +'&model.id='+ id +'&achstr='+ achstr.join(';');
		$.post("/add/saveOrUpdateProject",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/editproject?id="+data.id;
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}
	/**********项目类别**********/
	$("#category").live('change',function(){
		if($("#category").val()=="纵向"){
			var typehtml = "";
			typehtml += '<select id="typeone"  name="model.typeone">'
					 +  '   <option value="">--项目大类--</option>'
					 +  '</select>'
					 +  '<select id="typetwo"  name="model.typetwo">'
					 +  '	<option value="">--项目中类--</option>'
					 +  '</select>'
					 +  '<select id="typethree"  name="model.typethree">'
					 +  '	<option value="">--项目小类--</option>'
					 +  '</select>';
			$("#typecontent").html(typehtml);
			changeOne();
		}else{
			$("#typetitle").html("合作人");
			$("#typecontent").html('<input type="text" class="input-normal" id="partner" name="model.partner"/>');
			$("#partner").val("");
		}
		
	});
	/**
	 * 项目类型三联动改变
	 */
	
	$("#typeone").live('change',function(e){
		changeTwo();
	});
	$("#typetwo").live('change',function(e){
		changeThree();
	});
	function changeOne(){
		var typeOne = '<option value="">--项目大类--</option>';
		$.post("/list/getDatainput?datacode=CODE_PROJECTCAT&classcode=",function(data){
			if(data){
				for(var i=0; i<data.length; i++){
					typeOne += '<option id="'+data[i].classcode+'" value="'+data[i].datavalue+'">'+data[i].datavalue+'</option>';
				}
			}
			$("#typeone").html(typeOne);
 		$("#typeone").val($("#one").val());
 		changeTwo();
		},'json');
	}
	function changeTwo(){
		var typeTwo = '<option value="">--项目中类--</option>';
		var typeOne = $("#typeone option:selected").attr("id");
			$.post("/list/getDatainput?datacode=CODE_PROJECTCATB&classcode="+typeOne,function(data){
				if(data){
					for(var i=0; i<data.length; i++){
						typeTwo += '<option id="'+data[i].classcode+'" value="'+data[i].datavalue+'">'+data[i].datavalue+'</option>';
					}
				}
			$("#typetwo").html(typeTwo);
			$("#typetwo").val($("#two").val());
			changeThree();
			},'json');
	}
	function changeThree(){
		var value = $("#typetwo option:selected").val();
		if(value=="其他"){
			$("#typethree").replaceWith('<input id="typethree" class="input-normal" name="model.typethree"/>');
			$("#typethree").val($("#three").val());
		}else{
			var typeThree = '<select id="typethree" name="model.typethree"><option value="">--项目小类--</option>';
			var typeTwo = $("#typetwo option:selected").attr("id");
				$.post("/list/getDatainput?datacode=CODE_PROJECTCATC&classcode="+typeTwo,function(data){
					if(data){
						for(var i=0; i<data.length; i++){
							typeThree += '<option id="'+data[i].classcode+'" value="'+data[i].datavalue+'">'+data[i].datavalue+'</option>';
						}
					}
				typeThree += '</select>';
				$("#typethree").replaceWith(typeThree);
				$("#typethree").val($("#three").val());
				},'json');			
		}


	}
	/***获取已关联成果***/
	function getAch(){
		var html = "", str = "";
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
							 +	'<input type="checkbox" data-str="'+data.tbody[i].tname+","+data.tbody[i].achid+","+data.tbody[i].isshow+'" class="isshow" '+(data.tbody[i].isshow==1?'checked="checked"':'')+'/></td>';
						str  += data.tbody[i].tname+","+data.tbody[i].achid+","+data.tbody[i].isshow+";";
						ii++;
					}
				}
				if(ii==1){
					html += '<tr><td colspan="3" class="T-td-center">无关联成果</td></tr>';
				}
			}else{
				html += '<tr><td colspan="3" class="T-td-center">无关联成果</td></tr>';
			}

			if(str!=""){
				str = str.substring(0,str.length-1);
			}
			html += '</tbody></table>';
			$("#achstr").val(str);
			$("#showit").html(html);
			
		},'json');
	}

	/***获取成果列表***/
	function getList(){
		var html = "";
		$.post("/list/getUserAllAch",'tkey=project_achievement&relid='+id,function(data){
			
			if(data.tbody.length){
				for(var i=0; i<data.tbody.length; i++){
					html += '<tr class="T-even-tr">';
					if(data.tbody[i].isown){
						html +='<td class="T-td-center"><div class="T-td-wrap T-no-break">'
							 +'<input type="checkbox" class="td-check" checked="checked" name="achid" value="'+data.tbody[i].tname+','+data.tbody[i].achid+','+data.tbody[i].isshow+'"/>'
							 +'<input type="hidden" value="'+data.tbody[i].achname+'"/>'+data.tbody[i].num+'</div></td>';
					}else{
						html +='<td class="T-td-center"><div class="T-td-wrap T-no-break">'
							 +'<input type="checkbox" class="td-check" name="achid" value="'+data.tbody[i].tname+','+data.tbody[i].achid+','+data.tbody[i].isshow+'"/>'
							 +'<input type="hidden" value="'+data.tbody[i].achname+'"/>'+data.tbody[i].num+'</div></td>';
					}
						   
						html +='<td class="T-td-center"><div class="T-td-wrap T-no-break mw300" title="'+data.tbody[i].achname+'">'+data.tbody[i].achname+'</div></td>'
						     + '<td class="T-td-center"><div class="T-td-wrap T-no-break">'+data.tbody[i].tcname+'</div></td>'
						     + '</tr>';
				}
			}else{
				html += '<tr class="T-even-tr"><td class="T-td-center" colspan="3"><div class="T-td-wrap T-no-break" style="text-align: center;">暂无成果</div></td>';
			}
			dialog(html);
			
		},'json');
	}
	/****dialog弹窗****/
	function dialog(content){
		var tableStr = '<div style="margin:5px 0px;"><input type="text" placeholder="成果名称" class="normal-input" id="ach_name"/>'
			 + '<input type="button" class="btn normal-btn" id="search_btn" value="搜索"></div>'
			 + '<table class="T-table">'
			 + '<thead><tr><th style="width: 80px;text-align: left;"><div class="T-th-wrap"><input type="checkbox" class="th-check" id="selectall">序号</div></th>'
			 + '<th style="width: 200px;"><div class="T-th-wrap">成果名称</div></th>'
			 + '<th style="width: 150px;"><div class="T-th-wrap">成果类型</div></th>'
			 + '</tr></thead><tbody class="show-tbody">';

		tableStr += content;
		tableStr += '</tbody></table>';
		$.miniDialog({
			id: 'achieve_select_dialog',
			// 预设的Dialog的class名
			className: 'util-dialog role-select-dialog',
			title: '关联成果',
			width: 600,
			top: 50,
			content: tableStr,
			destroy: false,
			btns: ['<input id="dialogbt" class="btn ${className}" type="button" value="${value}">', {
				value: '提交',
				className: 'normal-btn btn-ok',
				callBack: function(h){
					var str = "", ii=1, tmp=[], htm="";
					htm += '<table><thead>'
						 +	'<tr><th style="width:50px;">序号</th><th>名称</th><th style="width:60px;">是否显示</th>'
						 +	'</thead><tbody>';
					$("input[name='achid']").each(function(){
						if($(this).attr("checked")){
							str += $(this).val() + ";";
							
							tmp = $(this).val().split(',');
							htm += '<tr><td class="T-td-center">' + ii + '</td>'
							 	+	'<td>' + $(this).next().val() + '</td>'
							 	+	'<td class="T-td-center"><input type="checkbox" data-str="'+$(this).val()+'" class="isshow" '+(tmp[2]==1?'checked="checked"':'')+'/></td>';
							str  += $(this).val()+";";
							
							ii++;
						}
					});
					if(str!=""){
						str = str.substring(0,str.length-1);
					}
					htm += '</tbody></table>';
					$("#achstr").val(str);
					$("#showit").html(htm);

					return false;
				}
			}, {
				value: '取消',
				className: 'normal-btn  btn-cancel',
				callBack: function(){
					return false;
				}
			}],
			afterOpen: function(){
				//dialog里搜索
				$("#search_btn").live('click',function(){
					var html = "";
					$.post("/list/getUserAllAch",'tkey=project_achievement&relid='+id+"&rename="+$("#ach_name").val(),function(data){
						
						if(data.tbody.length){
							for(var i=0; i<data.tbody.length; i++){
								html += '<tr class="T-even-tr">';
								if(data.tbody[i].isown){
									html +='<td class="T-td-center"><div class="T-td-wrap T-no-break">'
										 +'<input type="checkbox" class="td-check" checked="checked" name="achid" value="'+data.tbody[i].tname+','+data.tbody[i].achid+'"/>'
										 +'<input type="hidden" value="'+data.tbody[i].achname+'"/>'+data.tbody[i].num+'</div></td>';
								}else{
									html +='<td class="T-td-center"><div class="T-td-wrap T-no-break">'
										 +'<input type="checkbox" class="td-check" name="achid" value="'+data.tbody[i].tname+','+data.tbody[i].achid+'"/>'
										 +'<input type="hidden" value="'+data.tbody[i].achname+'"/>'+data.tbody[i].num+'</div></td>';
								}
									   
									html +='<td class="T-td-center"><div class="T-td-wrap T-no-break mw300" title="'+data.tbody[i].achname+'">'+data.tbody[i].achname+'</div></td>'
									     + '<td class="T-td-center"><div class="T-td-wrap T-no-break">'+data.tbody[i].tcname+'</div></td>'
									     + '</tr>';
							}
						}else{
							html += '<tr class="T-even-tr"><td class="T-td-center" colspan="3"><div class="T-td-wrap T-no-break" style="text-align: center;">暂无成果</div></td>';
						}
						$(".show-tbody").html(html);
					},'json');
					
				});
			}
		});
	}
})();
