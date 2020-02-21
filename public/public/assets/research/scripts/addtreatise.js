(function(){
	 var id = getQueryString("id") == null ? "" : getQueryString("id");
	 var AUTHORS = "";
	 
	 $(function() {
		    initSidebar(12, 2);

		    // 关联人员
		    $("#add_relevance")
		        .live(
		            'click',
		            function() {
		              relnum++;
		              var str = '<div id="relevance' + relnum
		                  + '"><select class="relevance" id="selrel' + relnum
		                  + '" onchange="nosysrelshow(' + relnum + ')">' + html
		                  + '</select>';
		              str += '<input type="text" class="input-normal selrel' + relnum
		                  + '"  style="display:none" />';
		              str += '<input type="button" class="btn normal-btn" value="移除" onclick="reldel('
		                  + relnum + ')"/></div>';
		              $("#relevance_label").append(str);
		            });

		    $
		        .when(getdetail())
		        .then(
		            function() {
		              var authorList = new List;

		              if (!!AUTHORS) {
		                var tmp, item, arr = [];
		                AUTHORS = AUTHORS.split(';');
		                $.each(AUTHORS, function(i, v) {
		                  item = {};
		                  tmp = v.split(',');
		                  item.name = tmp[0];
		                  item.ename = tmp[1];
		                  item.dept = tmp[2];
		                  item.edept = tmp[3];
		                  item.iscorrespondor = tmp[4];
		                  item.isowner = tmp[5];
		                  arr.push(item);
		                });

		                AUTHORS = arr;
		              }

		              authorList
		                  .load(
		                      AUTHORS.length ? AUTHORS : '/list/getResUser',
		                      function(data) {

		                        var $wrapper = $('<div>');

		                        this
		                            .render(
		                                $wrapper,
		                                [
		                                    {
		                                      key : 'row_select',
		                                      name : ''
		                                    },
		                                    {
		                                      key : 'row_index',
		                                      name : '序号'
		                                    },
		                                    {
		                                    	tdTmpl : '<input type=text class="text w60" name="field_name" value="${name}" title="${name}"  placeholder="中文名">'+
											      '<input type=text class="text w60" name="field_ename" value="${ename}" title="${ename}" placeholder="in english">',
											    name : '姓名'
		                                    },
		                                    {
		                                    	tdTmpl : '<input type=text class="text w120" name="field_dept" value="${dept}" title="${dept}" placeholder="单位名称">'+
										 		  '<input type=text class="text w120" name="field_edept" value="${edept}" title="${edept}" placeholder="fill in english">',
										 		name : '单位'
		                                    },
		                                    {
		                                      tdTmpl : '<input type=checkbox name=iscorrespondor ${iscorrespondor?equal("1", "checked=checked", "")}>',
		                                      name : '通讯作者'
		                                    },
		                                    {
		                                      tdTmpl : '<input type=checkbox name=isowner ${isowner?equal("1", "checked=checked", "")}>',
		                                      name : '本人'
		                                    }]);

		                        $wrapper.prependTo($('#author_list'));

		                      });
		              // 保存数据
		              $("#addvalue").click(function() {
		                save(authorList);
		              });
		              // 重置
		              $("#resetvalue").click(function() {
		                $("#periodical").val("");
		                $("#eperiodical").val("");
		                $("#name").val("");
		                $("#ename").val("");
		                $("#publishyear").val("");
		                $("#issue").val("");
		                $("#issn").val("");
		                $("#pagination").val("");
		                $("#digest").val("");
		                $("#edigest").val("");

		                $("#mstatus").val("已发表");
		                $("#include").val("SCI");
		                $("#pdfurl").val("");
		                $("#reelnumber").val("");
		                authorList.redraw();
		              });
		        });

		    //关联项目
		    $("#add_project").click(function(){
		    	getList();
		    });
			/***获取项目列表***/
			function getList(){
				var html = "";
				$.post("/list/getAllProjectList",'tkey=treatise&achid='+id,function(data){
					
					if(data.tbody.length){
						for(var i=0; i<data.tbody.length; i++){
							html += '<tr class="T-even-tr">';
							if(data.tbody[i].isown=="1"){
								console.log(i);
								html +='<td class="T-td-center"><div class="T-td-wrap T-no-break">'
									 +'<input type="checkbox" class="td-check" checked="checked" name="achid" value="'+data.tbody[i].id+'"/>'
									 +'<input type="hidden" value="'+data.tbody[i].name+'"/>'+(i+1)+'</div></td>';
							}else{
								html +='<td class="T-td-center"><div class="T-td-wrap T-no-break">'
									 +'<input type="checkbox" class="td-check" name="achid" value="'+data.tbody[i].id+'"/>'
									 +'<input type="hidden" value="'+data.tbody[i].name+'"/>'+(i+1)+'</div></td>';
							}
								   
								html +='<td class="T-td-center"><div class="T-td-wrap T-no-break mw400" title="'+data.tbody[i].name+'">'+data.tbody[i].name+'</div></td>'
								     + '</tr>';
						}
					}else{
						html += '<tr class="T-even-tr"><td class="T-td-center" colspan="3"><div class="T-td-wrap T-no-break" style="text-align: center;">暂无项目</div></td>';
					}
					dialog( html );
					
				},'json');
			}
			/****dialog弹窗****/
			function dialog(content){
				var tableStr = '<div style="margin:5px 0px;"><input type="text" placeholder="项目名称" class="normal-input" id="ach_name"/>'
					 + '<input type="button" class="btn normal-btn" id="search_btn" value="搜索"></div>'
					 + '<table class="T-table">'
					 + '<thead><tr><th style="width: 80px;text-align: left;"><div class="T-th-wrap"><input type="checkbox" class="th-check" id="selectall">序号</div></th>'
					 + '<th><div class="T-th-wrap">项目名称</div></th>'
					 + '</tr></thead><tbody class="show-tbody">';

				tableStr += content;
				tableStr += '</tbody></table>';

				$.miniDialog({
					id: 'achieve_select_dialog',
					// 预设的Dialog的class名
					className: 'util-dialog role-select-dialog',
					title: '关联项目',
					width: 550,
					top: 50,
					content: tableStr,
					destroy: false,
					btns: ['<input id="dialogbt" class="btn ${className}" type="button" value="${value}">', {
						value: '提交',
						className: 'normal-btn btn-ok',
						callBack: function(h){
							var str = "", ii=1, htm="";
							htm += '<table><thead>'
								 +	'<tr><th style="width:50px;">序号</th><th>项目名称</th>'
								 +	'</thead><tbody>';
							$("input[name='achid']").each(function(){
								if($(this).attr("checked")){							
									htm += '<tr><td class="T-td-center">' + ii + '</td>'
									 	+	'<td>' + $(this).next().val() + '</td>';
									str  += $(this).val()+";";
									
									ii++;
								}
							});
							if(str!=""){
								str = str.substring(0,str.length-1);
							}
							htm += '</tbody></table>';
							$("#prostr").val(str);
							$("#project_label").html(htm);

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
							$.post("/list/getAllProjectList",'tkey=treatise&achid='+id+"&rename="+$("#ach_name").val(),function(data){
								
								if(data.tbody.length){
									for(var i=0; i<data.tbody.length; i++){
										html += '<tr class="T-even-tr">';
										if(data.tbody[i].isown=="1"){
											html +='<td class="T-td-center"><div class="T-td-wrap T-no-break">'
												 +'<input type="checkbox" class="td-check" checked="checked" name="achid" value="'+data.tbody[i].id+'"/>'
												 +'<input type="hidden" value="'+data.tbody[i].name+'"/>'+(i+1)+'</div></td>';
										}else{
											html +='<td class="T-td-center"><div class="T-td-wrap T-no-break">'
												 +'<input type="checkbox" class="td-check" name="achid" value="'+data.tbody[i].id+'"/>'
												 +'<input type="hidden" value="'+data.tbody[i].name+'"/>'+(i+1)+'</div></td>';
										}
											   
											html +='<td class="T-td-center"><div class="T-td-wrap T-no-break mw400" title="'+data.tbody[i].name+'">'+data.tbody[i].name+'</div></td>'
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

		/***获取已关联项目***/
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
							str  += data.tbody[i].id+";";
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
				$("#prostr").val(str);
				$("#project_label").html(html);
				
			},'json');
		}
	 //编辑时填充数据
	 function getdetail() {
		    if (id === "") {
		      return false;
		    }
		    getPro();
		    return $
		        .post(
		            "/detailed/getTreatiseById",
		            "id=" + id,
		            function(data) {
		              if (data) {
		                AUTHORS = data.authors;
		                
		                $("#name").val(data.name);
		                $("#ename").val(data.ename);

		                $("#publish").val(data.publish);
		                $("#epublish").val(data.epublish);
		                $("#publishyear").val(data.publishyear);
		                $("#versions").val(data.versions);

		                $("#publishaddr").val(data.publishaddr);
		                $("#epublishaddr").val(data.epublishaddr);
		                $("#isbn").val(data.isbn);
		                $("#pagination").val(data.pagination);
		                $("#digest").val(data.digest);
		                $("#edigest").val(data.edigest);
						var str = '<div><img style="max-height: 500px;max-width: 600px;" src="'+data.url+'"/><input type="hidden" name="pic" value="'+data.url+'"/></div>';
						$(".img").append(str);
		                
		                // 保存关联人员id
		                if (data.relevance != "" && data.relevance != null) {
		                  relevance = data.relevance.split(';');
		                  relevancename = data.relevancename.split(';');
		                  if (relevance.length >= 1) {
		                    for ( var i = 0, len = relevance.length; i < len; i++) {
		                      relnum++;
		                      var str = '<div id="relevance' + relnum
		                          + '"><select class="relevance" id="selrel' + relnum
		                          + '" onchange="nosysrelshow(' + relnum + ')" value="'
		                          + relevance[i] + '">' + html + '</select>';
		                      if (relevance[i] != -1) {
		                        str += '<input type="text" class="input-normal selrel'
		                            + relnum + '"  style="display:none" />';
		                      } else {
		                        str += '<input type="text" class="input-normal selrel'
		                            + relnum + '" value="' + relevancename[i] + '" />';
		                      }

		                      str += '<input type="button" class="btn normal-btn" value="移除" onclick="reldel('
		                          + relnum + ')"/></div>';
		                      $("#relevance_label").append(str);
		                      $("#selrel" + relnum).val(relevance[i]);
		                    };
		                  };
		                };
		              }
		            }, "json");
		  } 
	 

		function save(authorList){
			var name = $("#name").val();
			var publish = $("#publish").val();
			var publishyear = $("#publishyear").val();
			var publishaddr = $("#publishaddr").val();
			var isbn = $("#isbn").val();
			var pagination = $("#pagination").val();
			
			if(name==""){
				$.alert("专著名称不能为空",$("#name"));
				$("#name").focus();
				return false;
			}
			if(publish==""){
				$.alert("出版社不能为空",$("#publish"));
				$("#publish").focus();
				return false;
			}
			if(publishyear==""||publishyear==null){
				$.alert("出版年不能为空",$("#publishyear"));
				$("#publishyear").focus();
				return false;
			}
			if(publishaddr==""){
				$.alert("出版地不能为空",$("#publishaddr"));
				$("#publishaddr").focus();
				return false;
			}
			if(isbn==""||isbn==null){
				$.alert("ISBN号不能为空",$("#isbn"));
				$("#isbn").focus();
				return false;
			}
			if(pagination==""||pagination==null){
				$.alert("页码不能为空",$("#pagination"));
				$("#pagination").focus();
				return false;
			}
			
			var picstr = '';
			$("input[name='pic']").each(function(){
				picstr += $(this).val()+';';
			});
			if(picstr==''){
				$.openError("请上传设备照片",2000);
				return false;
			}
			picstr = picstr.substring(0, picstr.length-1);

		    var authors = authorList.getRows(function($row) {
		      var tmp = [], $name = $row.find('input[name="field_name"]'), $dept = $row
		          .find('input[name="field_dept"]'), $ename = $row
		          .find('input[name="field_ename"]'), name = $name.val(), dept = $dept
		          .val(), ename = $ename.val(), $edept = $row.find('input[name="field_edept"]'),
		          edept = $edept.val();
		      if (!name && !dept && !ename && !edept) {
		        return true;
		      }
		      if (!name && ename) {
		        $name.val(name = ename);
		      }
		      if (!dept && edept) {
		        $edept.val(dept = edept);
		      }
		      tmp.push(name, ename, dept, edept);
		      $.each(['iscorrespondor', 'isowner'], function(i, n) {
		        tmp.push($row.find('input[name="' + n + '"]:checked').length);
		      });
		      return tmp.join(',');
		    });

		    if (!authors) {
		      return false;
		    }

		    authors = authors.join(';');
			//序列化表单元素
			var formdata=$('form').serialize()+"&model.id="+id + '&model.authors=' + authors + "&model.pic="+picstr;
			
			$.post("/add/saveOrUpdateTreatise",formdata,function(data){
				if(data.success){
					$.openSuccess('保存成功', 2000, function(){window.location.href = "/research/addtreatise?id="+data.id;});
					
				}else{
					$.openError('保存失败', 3000);
				}
			},"json");
		}
	 //上传图片
		$("#upload").live('click',function(){
			if($("#file").val()!=""){
				console.log($("#file").val());
				//提交表单	
				$("#addform").ajaxForm({
				    dataType: 'json',
				    success: function(data) {
						if(data.success){
							$.openSuccess('上传成功', 3000);
							var str = '<div><img src="'+data.url+'"/><input type="hidden" name="pic" value="'+data.url+'"/></div>';
							$(".img").append(str);
							$("#file").val("");
						}else{
							$.openError('上传失败', 3000);
						}					
				    }
				});
				$("#addform").submit();
			}else{
				$.alert("请选择文件",$("#file"));
			}
			
		});
})();

