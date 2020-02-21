(function() {
  var id = getQueryString("id") == null ? "" : getQueryString("id");
  var relevance = [];
  var relevancename = [];
  var AUTHORS = "";
  var membernum = 0, cernum = 0, relnum = 0;
  var num = 0;
  var html = ""; // 作者列表
  $(function() {
    initSidebar(10, 2);

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
                  item.isowner = tmp[4];
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
                                    	tdTmpl : '<input type=text class="text w150" name="field_dept" value="${dept}" title="${dept}" placeholder="单位名称">'+
								 		  '<input type=text class="text w150" name="field_edept" value="${edept}" title="${edept}" placeholder="fill in english">',
								 		name : '单位'
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
                $("#thesis_name").val("");
                $("#ethesis_name").val("");
                $("#type").val("");
//                $("#account").val("");
                $("#level").val("");
                $("#certigier").val("");
                $("#ecertigier").val("");
                $("#awardname").val("");
                $("#eawardname").val("");
                $("#year").val("");
                var foo = $("select[class='authors']");
                $(foo).each(function() {
                  if ($(this).parent().attr("id") != "authorss") {
                    $(this).parent().remove();
                  } else {
                    $(".authors").val("");
                  }
                });
                
                authorList.redraw();

                // 移除所有人员
                var fo = $("select[class='relevance']");
                $(fo).each(function() {
                  $(this).parent().remove();

                });
                // 移除所有单位
                var ce = $("input.certigier");
                $(ce).each(function() {
                  $(this).parent().remove();

                });
              });
            });
    // 完成人
    $("#add_author").live(
        'click',
        function() {
          membernum++;
          var str = '<div id="authors' + membernum
              + '"><select class="authors">' + html + '</select>';
          str += '<input type="button" class="btn normal-btn" id="' + membernum
              + '" value="移除" onclick="del(this.id)"/></div>';
          $("#author_label").append(str);
        });

    // 授予单位
    $("#add_certigier")
        .live(
            'click',
            function() {
              cernum++;
              var str = '<div id="certigier' + cernum + '">';
              str += '<input type="text" class="input-normal certigier" placeholder="授予单位" /><input type="text" class="input-normal ecertigier" placeholder="fill in english name"/>';
              str += '<input type="button" class="btn normal-btn " value="移除" onclick="cerdel('
                  + cernum + ')"/></div>';
              $("#certigier_label").append(str);
            });

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

    //关联项目
    $("#add_project").click(function(){
    	getList();
    });
	/***获取项目列表***/
	function getList(){
		var html = "";
		$.post("/list/getAllProjectList",'tkey=award&achid='+id,function(data){
			
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
					$.post("/list/getAllProjectList",'tkey=award&achid='+id+"&rename="+$("#ach_name").val(),function(data){
						
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
		$.post("/list/getAllProjectList",'tkey=award&achid='+id,function(data){
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
  author_list();

  // 移除完成人
  del = function(id) {
    // var i = id.match(/\d+/);
    $("div").remove("#authors" + id);
  };

  // 移除授予单位
  cerdel = function(id) {
    $("div").remove("#certigier" + id);
  };

  // 移除关联人员
  reldel = function(id) {
    $("div").remove("#relevance" + id);
  };
  // 判断是否本系统人员
  nosysrelshow = function(id) {
    if ($("#selrel" + id).find("option:selected").val() == "-1") {
      $(".selrel" + id).show();
    } else {
      $(".selrel" + id).hide();
    }
  };

  function getdetail() {
    if (id == "") {
      return false;
    }
    getPro();
    return $
        .post(
            "/detailed/getAwardById",
            "id=" + id,
            function(data) {
              if (data) {
                $("#thesis_name").val(data.name);
                $("#ethesis_name").val(data.ename);
                // 全部完成人
                AUTHORS = data.authors;
                var author = data.authors.split(';');
                if (author.length > 1) {
                  var str = "";
                  for ( var i = 1; i < author.length; i++) {
                    num++;
                    str += '<div id="authors' + num
                        + '"><select class="authors" >' + html + '</select>';
                    str += '<input type="button" class="btn normal-btn" id="'
                        + num + '" value="移除" onclick="del(this.id)"/></div>';
                  }
                  $("#author_label").append(str);
                  var foo = $("select[class='authors']");
                  var j = 0;
                  $(foo).each(function() {
                    $(this).val(author[j]);
                    j++;
                  });
                } else {
                  $("#authors").val(data.authors);
                }
                // 授予单位
                if (data.certigier != null && data.ecertigier != null) {
                  var certigier = data.certigier.split(';');
                  var ecertigier = data.ecertigier.split(';');
                  if (certigier.length >= 1) {
                    for ( var i = 0, len = certigier.length; i < len; i++) {
                      var str = '<div id="certigier' + i + '">';
                      str += '<input type="text" class="input-normal certigier" placeholder="授予单位" value='
                          + certigier[i] + ' />';
                      str += '<input type="text" class="input-normal ecertigier" placeholder="fill in english name" value='
                          + ecertigier[i] + ' />';
                      str += '<input type="button" class="btn normal-btn " value="移除" onclick="cerdel('
                          + i + ')"/></div>';
                      $("#certigier_label").append(str);
                    }
                  }
                }
                $("#type").val(data.type);
//                $("#account").val(data.account);
                changeAwardLevel();
                $("#level").val(data.level);
                $("#awardname").val(data.awardname);
                $("#eawardname").val(data.eawardname);
                $("#year").val(data.year);
//                $("#ranking").val(data.ranking);
                // 保存关联人员id
                if (data.relevance != "" && data.relevance != null) {
                  relevance = data.relevance.split(';');
                  relevancename = data.relevancename.split(';');
                  console.log(relevance + " " + relevancename);
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

  function author_list() {
    $.post("/list/getAllResUser", function(data) {
      if (data) {
        for ( var i = 0; i < data.length; i++) {
          html += '<option id="' + data[i].id + '" value="' + data[i].id + '">'
              + data[i].name + '</option>';
        };
      }

      html += '<option value="-1" >【非本系统科研人员】</option>';
      $("#authors").html(html);
      return html;
    }, 'json');
  }
  // 将作者id合并起来
  function getNamelist(author) {
    var str = "";
    var foo = $("select[class='" + author + "']");
    $(foo).each(function() {
      str += this.value + ";";
    });

    return str;
  }
  // 关联人员合并
  function getRelevance() {
    var str = "";
    var foo = $("select[class='relevance']");
    $(foo).each(function() {
      str += this.value + ";";
    });
    return str;
  }
  // 关联人员名称合并
  function relevanceName() {
    var str = "";
    $("select[class='relevance']").each(function() {
      if ($(this).val() != -1) {
        str += $(this).find("option:selected").text() + ";";
      } else {
        var name = $(this).attr("id");
        var value = $("." + name).val();
        if (value == "") {
          $.alert("人员名称不能为空", $("." + name));
        }
        str += value + ";";
      }

    });

    return str;
  }

  function checkrepeat(author) {
    var em = [];
    var foo = this;
    foo = $("select[class='authors']");

    $(foo).each(function() {
      em.push(this.value);
    });
    for ( var i = 0; i < em.length - 1; i++) {
      for ( var j = i + 1; j < em.length; j++) {
        if (em[i] == em[j]) {
          $.alert("完成人不能重复", $("#" + author));
          return false;
        }
      }
    }
    return true;
  }
  // 检查人员是否为空
  function checknull() {
    var n = 0;
    $("select[class='relevance']").each(function() {
      if ($(this).val() == -1) {
        var name = $(this).attr("id");
        var value = $("." + name).val();
        if (value == "") {
          $.alert("人员名称不能为空", $("." + name));
          n = 1;
        }
      }
    });
    if (n == 1) {
      return false;
    } else {
      return true;
    }
  }
  // 保存
  function save(authorList) {
    var thesis_name = $("#thesis_name").val();
    var ethesis_name = $("#ethesis_name").val();
    var type = $("#type").val();
//    var account = $("#account").val();
    var level = $("#level").val();
    var awardname = $("#awardname").val();
    var eawardname = $("#eawardname").val();
    var year = $("#year").val();

    if (thesis_name == "" || ethesis_name == "") {
      $.alert("名称不能为空", $("#thesis_name"));
      $("#thesis_name").focus();
      return false;
    }
//    if (account == "") {
//	  $.alert("总人数不能为空", $("#account"));
//	  $("#account").focus();
//	  return false;
//	}
    if (type == "") {
      $.alert("获奖类别不能为空", $("#type"));
      $("#type").focus();
      return false;
    }
    if (level == "" || level == null) {
      $.alert("获奖等级不能为空", $("#level"));
      $("#level").focus();
      return false;
    }
    if (awardname == "" || eawardname == "") {
      $.alert("奖励名称不能为空", $("#awardname"));
      $("#awardname").focus();
      return false;
    }
    if (year == "" || year == null) {
      $.alert("授予年份不能为空", $("#year"));
      $("#year").focus();
      return false;
    }
    // 检测作者是否重复
    if (!checkrepeat("authors")) {
      return false;
    };
    if (!checknull()) {
      return false;
    }
    var authors = getNamelist("authors");
    authors = authors.substring(0, authors.length - 1);
    var relevance = getRelevance();
    relevance = relevance.substring(0, relevance.length - 1);
    var relevancename = relevanceName();
    relevancename = relevancename.substring(0, relevancename.length - 1);

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
      $.each(['isowner'], function(i, n) {
        tmp.push($row.find('input[name="' + n + '"]:checked').length);
      });
      return tmp.join(',');
    });

    if (!authors) {
      return false;
    }

    authors = authors.join(';');

    var certigier = '', ecertigier = '';
    $(".certigier").each(function() {
      if ($(this).val() != "" && $(this).next().val() != "") {
        certigier += $(this).val() + ";";
        ecertigier += $(this).next().val() + ";";
      }
    });
    if (certigier != '') {
      certigier = certigier.substring(0, certigier.length - 1);
      ecertigier = ecertigier.substring(0, ecertigier.length - 1);
    } else {
      $.alert("授予单位不能为空", $("#add_certigier"));
      $("#add_certigier").focus();
      return false;
    }
    // 序列化表单元素
    var formdata = $('form').serialize() + '&model.authors=' + authors
        + '&model.id=' + id + '&model.certigier=' + certigier
        + '&model.ecertigier=' + ecertigier + '&model.relevance=' + relevance
        + '&model.relevancename=' + relevancename;
    $.post("/add/saveOrUpdateAward", formdata, function(data) {
      if (data.success) {
        $.openSuccess('保存成功', 2000, function(){window.location.href = "/research/addaward?id=" + data.id;});
        
      } else {
        $.openError('保存失败', 3000);
      }
    }, "json");
  }

  /** *********改变获奖类别********* */

  $("#type").live('change', function() {
    changeAwardLevel();
  });
  /**
   * 获奖类别与获奖等级的联动 获奖等级根据获奖类别的变动而变动
   */
  function changeAwardLevel() {
    var awardLevelSelectOptionHTML = "";
    if ($("#type").val() == "国家级") {
      awardLevelSelectOptionHTML += '<option value="" selected="selected">--请选择--</option>';
      awardLevelSelectOptionHTML += '<option value="自然科学奖">自然科学奖</option>';
      awardLevelSelectOptionHTML += '<option value="技术发明奖">技术发明奖</option>';
      awardLevelSelectOptionHTML += '<option value="科技进步奖">科技进步奖</option>';
    } else if ($("#type").val() == "省科学技术奖") {
      awardLevelSelectOptionHTML += '<option value="" selected="selected">--请选择--</option>';
      awardLevelSelectOptionHTML += '<option value="特等奖">特等奖</option>';
      awardLevelSelectOptionHTML += '<option value="一等奖">一等奖</option>';
      awardLevelSelectOptionHTML += '<option value="二等奖">二等奖</option>';
      awardLevelSelectOptionHTML += '<option value="三等奖">三等奖</option>';
    } else {
      awardLevelSelectOptionHTML += '<option value="" selected="selected">--请选择--</option>';
      awardLevelSelectOptionHTML += '<option value="市长奖">市长奖</option>';
      awardLevelSelectOptionHTML += '<option value="创新奖">创新奖</option>';
    }
    awardLevelSelectOptionHTML += '<option value="其他">其他</option>';
    $("#level").html(awardLevelSelectOptionHTML);
  }
  /** *获取已关联人员** */
  function getUser() {
    var html = "";
    $.post("/list/getAllResUser", function(data) {
      html += '已关联人员：';
      if (data.length) {
        for ( var i = 0; i < data.length; i++) {
          for ( var j = 0; j < relevance.length; j++) {
            if (data[i].id == relevance[j]) {
              html += data[i].name + '&nbsp;&nbsp;&nbsp;';
            }
          }

        }
      }
      $("#showit").html(html);

    }, 'json');
  }
  // /***获取人员列表***/
  // function getList(){
  // var html = "";
  // $.post("/list/getAllResUser",function(data){
  // html = '<table class="T-table">'
  // + '<thead><tr><th style="width: 80px;text-align: left;"><div
  // class="T-th-wrap"><input type="checkbox" class="th-check"
  // id="selectall">序号</div></th>'
  // + '<th style="width: 200px;"><div class="T-th-wrap">名称</div></th>'
  // + '</tr></thead><tbody>';
  //			
  // if(data.length){
  // var n = 1;
  // for(var i=0; i<data.length; i++){
  // html += '<tr class="T-even-tr">';
  // html +='<td class="T-td-center"><div class="T-td-wrap T-no-break"><input
  // type="checkbox" class="td-check" name="achid"
  // value="'+data[i].id+'"/>'+n+'</div></td>'
  // + '<td class="T-td-center"><div class="T-td-wrap
  // T-no-break">'+data[i].name+'</div></td>'
  // + '</tr>';
  // n++;
  // }
  // }else{
  // html += '<tr class="T-even-tr"><td class="T-td-center" colspan="3"><div
  // class="T-td-wrap T-no-break" style="text-align: center;">暂无人员</div></td>';
  // }
  // html += '</tbody></table>';
  // dialog(html);
  // //设置checkbox选中状态
  // for(var j=0; j<relevance.length; j++){
  // $("input[name='achid']").each(function(){
  // if($(this).val()==relevance[j]){
  // $(this).attr("checked","checked");
  // }
  // });
  // }
  // },'json');
  // }
  // /****dialog弹窗****/
  // function dialog(content){
  // $.miniDialog({
  // id: 'achieve_select_dialog',
  // // 预设的Dialog的class名
  // className: 'util-dialog role-select-dialog',
  // title: '关联人员',
  // width: 600,
  // top: 50,
  // content: content,
  // destroy: false,
  // btns: ['<input id="dialogbt" class="btn ${className}" type="button"
  // value="${value}">', {
  // value: '提交',
  // className: 'normal-btn btn-ok',
  // callBack: function(h){
  // var str = "";
  // $("input[name='achid']").each(function(){
  // if($(this).attr("checked")){
  // str += $(this).val() + ";";
  // }
  // });
  // if(str!=""){
  // str = str.substring(0,str.length-1);
  // }
  // $("#achstr").val(str);
  // return false;
  // }
  // }, {
  // value: '取消',
  // className: 'normal-btn btn-cancel',
  // callBack: function(){
  // return false;
  // }
  // }],
  // });
  // }
})();
