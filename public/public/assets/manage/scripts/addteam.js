(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");

	var membernum = 0;
	var num =0;
	var html = "";	//作者列表
	$(function(){
		initSidebar(21,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#name").val("");
			$("#ename").val("");
			$("#intro").val("");
			$("#eintro").val("");
			var foo= $("select[class='authors']");
			$(foo).each(function() {
				if($(this).parent().attr("id")!="authorss"){
					$(this).parent().remove();
				}else{
					$(".authors").val("");
					$("#duty").val("");
				}
			});
			
		});
		author_list();
		//填充数据
		if(id!=""){
			getdetail();
		}
	
	
		//添加成员
		$("#add_author").live('click',function(){
			membernum++;
			var str = '<div id="authors'+membernum+'"><select class="authors">'+html+'</select><input type="text" class="input-normal duty" value="" placeholder="填写队员职务"/>';
			str += '<input type="button" class="btn normal-btn" id="'+membernum+'" value="移除" onclick="del(this.id)"/></div>';
			$("#author_label").append(str);
		});
			
	});
		//移除作者/老师
		del = function (id){
			var i = id.match(/\d+/);
			$("div").remove("#authors"+i);
		};
	function getdetail(){
		$.post("/detailed/getTeamInfo","id="+id,function(data){
			if(data){
				$("#name").val(data.name);
				$("#ename").val(data.ename);
				$("#intro").val(data.intro);
				$("#eintro").val(data.eintro);
				//全部作者
				var author = data.userlist;
				if(author.length>1){
					var str = "";
					for(var i=1; i<author.length; i++){
						num++;
						str += '<div id="authors'+num+'"><select class="authors" >'+html+'</select><input type="text" class="input-normal duty" value="" placeholder="填写队员职务"/>';
						str += '<input type="button" class="btn normal-btn" id="'+num+'" value="移除" onclick="del(this.id)"/></div>';
					}
					$("#author_label").append(str);
					var foo= $("select[class='authors']");
					var j = 0, k = 0;
					$(foo).each(function() {
						$(this).val(author[j].id);
						j++;
					});
					var fo= $("input.duty");
					$(fo).each(function() {
						$(this).val(author[k].duty);
						k++;
					});
				}else{
					$("#authors").val(author[0].id);
					$("#duty").val(author[0].duty);					
				}
			}
		},"json");
	}
	//人员列表
	function author_list(){
			$.post("/list/getAllResUser",function(data){
				if(data){
					for(var i=0; i<data.length; i++){
						html += '<option id="'+data[i].id+'" value="'+data[i].id+'">'+data[i].name+'</option>';
					};
				}else{
					html += '<option id="">暂无人员</option>';
				}
				$("#authors").html(html);
				$("#cauthors").html(html);
				return html;
			},'json');
		}
	//将人员id和职务合并起来
	function getNamelist(author){
		var st = "";
		var str = [];
		var foo= $("select[class='"+author+"']");
		$(foo).each(function() {
			str.push(this.value);
		});
		var str1 = [];
		var fo= $("input.duty");
		$(fo).each(function() {
			str1.push(this.value);
		});
		for(var i=0; i<str.length; i++){
			st += str[i] +"|,|"+str1[i]+"|;|";
		}
		return st;
	}
	//检查成员是否重复
	function checkrepeat(){
		var em = [];
		var foo = $("select[class='authors']");
		
		$(foo).each(function() {
			em.push(this.value);
		});
		for(var i=0; i<em.length-1; i++){
			for(var j=i+1; j<em.length; j++){
				if(em[i]==em[j]){
					$.alert("成员不能重复",$("#authors"));
					return false;
				}
			}
		}
		return true;
	}
	//检查职务是否空
	function checknull(){
		var em = [];
		var fo= $("input.duty");
		$(fo).each(function() {
			em.push(this.value);
		});
		for(var i=0; i<em.length; i++){
			if(em[i]==""){
				return false;
			}
		}
			
		return true;
	}
	
	function save(){
		var name = $("#name").val();
		var ename = $("#ename").val();
		var intro = $("#intro").val();
		var eintro = $("#eintro").val();
		
		
		if(name==""||ename==""){
			$.alert("名称不能为空",$("#name"));
			return false;
		}
		if(intro==""||eintro==""){
			$.alert("简介不能为空",$("#intro"));
			return false;
		}
		
		//检测成员是否重复
		if(!checkrepeat()){
			return false;
		};
		if(!checknull()){
			$.alert("职务不能为空",$("#authors"));
			return false;
		}
		var authors = getNamelist("authors");
		authors=authors.substring(0,authors.length-3);
		//序列化表单元素
		var formdata=$('form').serialize()+'&achstr='+authors+"&model.id="+id;
		$.post("/add/saveOrUpdateTeam",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/addteam?id="+data.id;
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}
})();

