$(function(){
	initSidebar(40,1);
	//获取附件列表
	getList();
	function getList (){
		$.post("/list/getFundfileList",{curpage:1,pagesize:100},function(data){
			var str = '';
			if(data.tbody.length){
				$(".no-data").remove();
				for(var i=0; i<data.tbody.length; i++){
					str += 	'<tr>'
						+	'<td class="T-td-center">'+data.tbody[i].type+'</td>'
						+	'<td><a href="'+data.tbody[i].url+'">'+data.tbody[i].name+'</a></td>'
						+	'<td class="T-td-center">'
						+	'<a data-id="'+data.tbody[i].id+'" class=" menu_upTop" href="javascript:" title="上移"></a>'
						+	'<a data-id="'+data.tbody[i].id+'" class=" menu_downTop" href="javascript:" title="下移"></a>'
						+	'<a data-id="'+data.tbody[i].id+'" class="menu_delete " href="javascript:;" title="删除"></a>'
						+	'</td>'
						+	'</tr>';
				}
			}else{
				str += '<tr class="no-data"><td colspan="5"><div style="text-align:center">暂无数据</div></td></tr>';
			}
			$(".files-list").html(str);
		},"json");
	};
	//上传附件
	$("#upload").live('click',function(){
		if($("#file").val()!=""){
			//提交表单	
			$("#addform").ajaxForm({
			    dataType: 'json',
			    success: function(data) {
					if(data.success){
						var type = $(".select-type").val();
						$.post("/add/saveOrUpdateFundfile",
							"model.type="+ type +
							"&model.url="+ data.url +
							"&model.name="+ data.oldname
							,function(tdata){
							if(data.success){
								if($(".no-data").length){$(".no-data").remove();}//删除”暂无数据“
								$.openSuccess('上传成功', 3000);
//								var str = 	'<tr>'
//										+	'<td class="T-td-center">'+type+'</td>'
//										+	'<td><a href="#">'+data.oldname+'</a></td>'
//										+	'<td class="T-td-center">'
//										+	'<a data-id="'+tdata.id+'" class=" menu_upTop" href="javascript:" title="上移"></a>'
//										+	'<a data-id="'+tdata.id+'" class=" menu_downTop" href="javascript:" title="下移"></a>'
//										+	'<a data-id="'+tdata.id+'" class="menu_delete" href="javascript:;" title="删除"></a>'
//										+ 	'</td>'
//										+	'</tr>';
//								$(".files-list").append(str);
								getList();
							}
						},'json');

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
	//修改
	$(".edit").live('click',function(){
		var $td = $(this).parent().prev();
		$td.html('<input type="text" value="'+$td.text()+'" class="normal-input"/>');
	});
	//删除
	$(".menu_delete").live('click',function(){
  		if(confirm("确定要删除该附件吗？")){
	  		$.post("/delete/deleteFundfile", "id="+$(this).data("id") , function(data){
				if (!data.success){
					$.openError(data.error, 1500);
					return ;
				}else{
					$.openSuccess('删除成功', 3000);
					getList();
				}
			}, "json");
  		}
	});
	//上移
	$(".menu_upTop").live('click',function(e){
		var id = $(this).data("id");
		if(id!=""&&id!=null){
			$.post("/add/upOrDownFundfile?id="+id+"&direction=up",function(data){
				if(data.success){
					getList();
				}else{
					$.openError(data.error,3000);
				}
			},'json');		
		}

	});
	//下移
	$(".menu_downTop").live('click',function(e){
		var id = $(this).data("id");
		$.post("/add/upOrDownFundfile?id="+id+"&direction=down",function(data){
			if(data.success){
				getList();
			}else{
				$.openError(data.error,3000);
			}
		},'json');
	});
});