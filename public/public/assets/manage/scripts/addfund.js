(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");

	$(function(){
		initSidebar(27,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#title").val("");
			$("#name").val("");
			$("#unit").val("");
			$("#year").val("");
			$("#jobtitle").val("");
			$("#gender").val(1);
			$("#idcard").val("");
			$("#mphone").val("");
			$("#email").val("");
			$("#qq").val("");
			$("#keyword").val("");
			$("#fundnumber").val("");
			$("#direction").val("海岸带");
			$("#issubsidize").val(1);
			$("#sum").val("");
			$("#data").val("");
			$("#digest").val("");
			
		});
	});
	$(function(){
		//若是编辑则填充数据
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
		$.post("/detailed/getFundOpenById","id="+id,function(data){
			if(data){
				$("#title").val(data.title);
				$("#name").val(data.name);
				$("#unit").val(data.unit);
				$("#year").val(data.year);
				$("#jobtitle").val(data.jobtitle);
				$("#gender").val(data.gender);
				$("#idcard").val(data.idcard);
				$("#mphone").val(data.mphone);
				$("#email").val(data.email);
				$("#qq").val(data.qq);
				$("#keyword").val(data.keyword);
				$("#direction").val(data.direction);
				$("#fundnumber").val(data.fundnumber);
				$("#issubsidize").val(data.issubsidize);
				$("#sum").val(data.sum);
				$("#data").val(data.data);
				$("#digest").val(data.digest);
			}
		},"json");
	}
	
	function save(){
		var title = $("#title").val();
		var name = $("#name").val();
		var unit = $("#unit").val();
		var year = $("#year").val();
		var jobtitle = $("#jobtitle").val();
		var idcard = $("#idcard").val();
		var mphone = $("#mphone").val();
		var email = $("#email").val();
		var qq = $("#qq").val();
		var keyword = $("#keyword").val();
		var fundnumber = $("#fundnumber").val();
		var sum = $("#sum").val();
		var digest = $("#digest").val();
	
		if(title==""||title==null){
			$.alert("题目不能为空",$("#title"));
			return false;
		}
		if(name==""||name==null){
			$.alert("姓名不能为空",$("#name"));
			return false;
		}
		if(unit==""||unit==null){
			$.alert("单位不能为空",$("#unit"));
			return false;
		}
		if(year==""||year==null){
			$.alert("年度不能为空",$("#year"));
			return false;
		}
		if(jobtitle==""||jobtitle==null){
			$.alert("职称不能为空",$("#jobtitle"));
			return false;
		}
		if(idcard==""||idcard==null){
			$.alert("身份证号不能为空",$("#idcard"));
			return false;
		}
		if(mphone==""||mphone==null){
			$.alert("手机不能为空",$("#mphone"));
			return false;
		}
		if(email==""||email==null){
			$.alert("Email不能为空",$("#email"));
			return false;
		}
		if(qq==""||qq==null){
			$.alert("QQ不能为空",$("#qq"));
			return false;
		}
		if(keyword==""||keyword==null){
			$.alert("关键字不能为空",$("#keyword"));
			return false;
		}
		if(fundnumber==""||fundnumber==null){
			$.alert("基金文档编号不能为空",$("#fundnumber"));
			return false;
		}
		if(sum==""||sum==null){
			$.alert("资助金额不能为空",$("#sum"));
			return false;
		}
		if(digest==""||digest==null){
			$.alert("摘要不能为空",$("#digest"));
			return false;
		}
		
		//序列化表单元素
		var formdata=$('form').serialize()+'&model.id='+id;
		$.post("/add/saveOrUpdateFund",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/addfund?id="+data.id;
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}
	
	/***获取已关联成果***/
	function getAch(){
		var html = "" , str = "";
		
		$.post("/list/getUserAllAch",'tkey=fund_achievement&relid='+id,function(data){
			html += '已关联成果：';
			if(data.tbody.length){
				for(var i=0; i<data.tbody.length; i++){
					if(data.tbody[i].isown){
						html +=data.tbody[i].achname+'&nbsp;&nbsp;&nbsp;';
						str  +=data.tbody[i].tname+","+data.tbody[i].achid+";";
					}
				}
			}
			if(str!=""){
				str = str.substring(0,str.length-1);
			}
			$("#achstr").val(str);
			$("#showit").html(html);
			
		},'json');
	}
	
	/***获取成果列表***/
	function getList(){
		var html = "";
		var datastr = 'tkey=fund_achievement&relid='+id;
		$.post("/list/getUserAllAch",datastr,function(data){
			html = '<table class="T-table">'
				 + '<thead><tr><th style="width: 80px;text-align: left;"><div class="T-th-wrap">'
				 +'<input type="checkbox" class="th-check" id="selectall">序号</div></th>'
				 + '<th style="width: 200px;"><div class="T-th-wrap">成果名称</div></th>'
				 + '<th style="width: 150px;"><div class="T-th-wrap">成果类型</div></th>'
				 + '</tr></thead><tbody>';
			
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
				html += '<tr class="T-even-tr"><td class="T-td-center"><div class="T-td-wrap T-no-break">暂无成果</div></td>';
			}
			html += '</tbody></table>';
			dialog(html);
			
		},'json');
	}
	/****dialog弹窗****/
	function dialog(content){
		$.miniDialog({
			id: 'achieve_select_dialog',
			// 预设的Dialog的class名
			className: 'util-dialog role-select-dialog',
			title: '关联成果',
			width: 600,
			top: 50,
			content: content,
			destroy: false,
			btns: ['<input class="btn ${className}" type="button" value="${value}">', {
				value: '提交',
				className: 'normal-btn  btn-ok',
				callBack: function(h){
					var str = "",htm = "";
					$("input[name='achid']").each(function(){
						if($(this).attr("checked")){
							str += $(this).val() + ";";
							htm += $(this).next().val() + "、";
						}
					});
					if(str!=""){
						str = str.substring(0,str.length-1);
					}
					if(htm!=""){
						htm = htm.substring(0,htm.length-1);
					}
					$("#achstr").val(str);
					$("#showit").html("已关联的成果："+htm);
					return false;
				}
			}, {
				value: '取消',
				className: 'normal-btn  btn-cancel',
				callBack: function(){
					return false;
				}
			}],
		});
	}
	
})();

