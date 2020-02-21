(function(){
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	var editor =null,eeditor=null;

	$(function(){
		initSidebar(26,1);
		//保存数据
		$("#addvalue").click(function(){
			save();
		});
		//重置
		$("#resetvalue").click(function(){
			$("#name").val("");
			$("#ename").val("");
			$("#type").val("");
			$("#etype").val("");
			$("#time").val("");
			$("#address").val("");
			$("#eaddress").val("");
//			$("#intro").val("");
//			$("#eintro").val("");
			var fo= $("input.joinman");
			$(fo).each(function() {
				$(this).parent().remove();
				
			});
			
		});
	});
	var num =0;
	$(function(){
		if(id!=""){
			getdetail();
		}
		
		//参加人员
		$("#add_tutor").live('click',function(){
			num++;
			var str = '<div id="authors'+num+'"><input class="joinman input-normal" /><input class="ejoinman input-normal" placeholder="fill in his/her english name" />';
			str += '<input type="button" class="btn normal-btn" id="'+num+'" value="移除" onclick="del(this.id)"/></div>';
			$("#tutors_label").append(str);
		});
		
	});
	//移除参加人员
	del = function (id){
		var i = id.match(/\d+/);
		$("div").remove("#authors"+i);
	};
	
	function getdetail(){
		$.post("/detailed/getCommunicationById","id="+id,function(data){
			if(data){
				$("#name").val(data.name);
				$("#ename").val(data.ename);
				
				//参加人员
				if(data.joinman){
					var joinman = data.joinman.split(';');
					var ejoinman = data.ejoinman.split(';');
					if(joinman.length>0&&ejoinman){
						var str = "";
						for(var i=0; i<joinman.length; i++){
							num++;
							str += '<div id="authors'+num+'"><input class="joinman input-normal" value="'+joinman[i]+'" />'
							    +  '<input class="ejoinman input-normal" value="'+ejoinman[i]+'" />';
							str += '<input type="button" class="btn normal-btn" id="'+num+'" value="移除" onclick="del(this.id)"/></div>';
						}
						$("#tutors_label").append(str);
					}
				}
				
				
				
				$("#type").val(data.type);
				$("#etype").val(data.etype);
				$("#time").val(data.time);
				$("#address").val(data.address);
				$("#eaddress").val(data.eaddress);
				$("#eshow").val(data.eshow);
				
				editor.html(data.intro);
				eeditor.html(data.eintro);
			}
		},"json");
	}
	//将参加人员合并起来（以;为分隔符）
	function getTutorlist(join){
		var str = "";
		var foo= $("input."+join);
		$(foo).each(function() {
			str += this.value + ";";
		});
		
		return str;
	}
	function checkrepeat(){
		var em = [];
		var foo = $("input.joinman");
		
		$(foo).each(function() {
			em.push(this.value);
		});
		if(em.length<=0){
			$.alert("参加人员不能为空",$("#tutors_label"));
			return false;
		}else{
			for(var a=0; a<em.length; a++){
				if(em[a]==""){
					$.alert("参加人员不能为空",$("#tutors_label"));
					return false;
				}
			}
		}
		for(var i=0; i<em.length-1; i++){
			for(var j=i+1; j<em.length; j++){
				if(em[i]==em[j]){
					$.alert("参加人员名字不能重复",$("#add_tutor"));
					return false;
				}
			}
		}
		return true;
	}
	function save(){
		var name = $("#name").val();
		var type = $("#type").val();
		var time = $("#time").val();
		var address = $("#address").val();
		var intro = $("#intro").val();
	
		if(name==""){
			$.alert("名称不能为空",$("#name"));
			return false;
		}
		if(type==""){
			$.alert("类型不能为空",$("#type"));
			return false;
		}
		if(time==""||time==null){
			$.alert("时间不能为空",$("#time"));
			return false;
		}
		if(address==""){
			$.alert("地点不能为空",$("#address"));
			return false;
		}
		if(intro==""){
			$.alert("简介不能为空",$("#intro"));
			return false;
		}
//		if((Number(1000)-Number(intro.length))<0||(Number(1000)-Number(eintro.length))<0){
//			box.show("简介不能超过1000字","",{width:300});
//			return false;
//		}
		//检测参加人员是否重复
		if(!checkrepeat()){
			return false;
		};
		var joinman = getTutorlist("joinman");
		var ejoinman = getTutorlist("ejoinman");
		joinman=joinman.substring(0,joinman.length-1);
		ejoinman=ejoinman.substring(0,ejoinman.length-1);
		//序列化表单元素
		var formdata=$('form').serialize()+'&model.joinman='+joinman+'&model.ejoinman='+ejoinman+'&model.id='+id;
		$.post("/add/saveOrUpdateCommunication",formdata,function(data){
			if(data.success){
				$.openSuccess('保存成功', 3000);
				window.location.href = "/manage/addacademic?id="+data.id;
			}else{
				$.openError('保存失败', 3000);
			}
		},"json");
	}
	//配置文本框
	KindEditor.ready(function(K) {
		editor = K.create('textarea[name="model.intro"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: true,
	        uploadJson: '/add/uploadImgFile?type=academic',
			afterCreate : function() {
				this.sync();
			},
			afterChange : function() {
				this.sync();
			},
			afterBlur:function(){
				this.sync();  
			},
			items : ['undo', 'redo' , 'bold', 'italic', 'underline', 'strikethrough', 'removeformat','|','lineheight','insertorderedlist', 'insertunorderedlist', 
					 'forecolor', 'hilitecolor', 'fontname', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright',
					 'justifyfull', 'link', 'unlink', '|', 'source','|','image'],
			
		});
	});

	KindEditor.ready(function(K) {
		eeditor = K.create('textarea[name="model.eintro"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: true,
	        uploadJson: '/add/uploadImgFile?type=academic',
			afterCreate : function() {
				this.sync();
			},
			afterChange : function() {
				this.sync();
			},
			afterBlur:function(){
				this.sync();  
			},
			items : ['undo', 'redo' , 'bold', 'italic', 'underline', 'strikethrough', 'removeformat','|','lineheight','insertorderedlist', 'insertunorderedlist', 
					 'forecolor', 'hilitecolor', 'fontname', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright',
					 'justifyfull', 'link', 'unlink', '|', 'source','|','image'],
			
		});
	});
})();

