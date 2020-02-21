(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	$(function(){
		initSidebar(33,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#name").val("");
			$("#tname").val("");
			$("#achid").val("");
			
		});
		//填充数据
		if(id!=""){
			getdetail();
		}
		$("#tname").live('change',function(){
			change("");
		});
		$("#link").live('change',function(){
			$(".tip").append($(this).val());
		});
	});
	function change(achid){
		var txt = $("#tname").val();
		var str = '<option value="">--请选择成果--</option>';
		if(txt!=""){
			$.post("/list/getAchByTkey","tkey="+txt,function(data){
				if(data){
					for(var i=0; i<data.length; i++){
						str += '<option id="'+data[i].id+'" value="'+data[i].id+'">'+data[i].name+'</option>';
					};
				}else{
					str += '<option id="">暂无该类别成果</option>';
				}
				$("#achid").html(str);
				$("#achid").val(achid);
			},'json');
		}else{
			$("#achid").html('<option value="">无</option>');
		}
		
	}
	
	function getdetail(){
		
		$.post("/detailed/getIndexAchByid","id="+id,function(data){
			if(data){
				$("#modelid").val(id);//主键
				$("#tname").val(data.tname);
				$("#pic").val(data.pic);
				$("#eshow").val(data.eshow);
				change(data.achid);
				if(data.pic!=""){
					var str = '<img src="'+data.pic+'" style="max-width: 200px;	max-height: 300px;margin: 8px 0 -8px 8px;"/><input type="button" style="margin-bottom:8px;" class="normal-btn" id="delete" value="删除"/>';
					$("#file").html(str);
				}
				$("#delete").bind('click',function(){
					//清空
					$("#file").html("");
					$("#link").val("");
				});
			}
		},"json");
	}
	
	function save(){
		var tname = $("#tname").val();
		var achid = $("#achid").val();
		var link = $("#link").val();
		var pic = $("#pic").val();
		
		
		
		if(tname==""||tname==null){
			$.alert("类别不能为空",$("#tname"));
			return false;
		}
		if(achid==""||achid==null){
			$.alert("成果不能为空",$("#achid"));
			return false;
		}
		if(pic==""){
			if(link==""||link==null){
				$.alert("图片不能为空",$("#link"));
				return false;
			}			
		}

		
		//提交表单	
		$("#addform").ajaxForm({
		    dataType: 'json',
		    success: function(data) {   
				if(data.success){
					$.openSuccess('保存成功', 3000);
					window.location.href = "/manage/addachieve?id="+data.id;
				}else{
					$.openError('保存失败', 3000);
				}
		    }
		});
		$("#addform").submit();
	}

})();

