(function(){
	var editor =null,eeditor=null,wditor =null,wwditor=null;
	$(function(){
		initSidebar(24,1);
	});
	var techInfo ="";
	var id = getQueryString("id")==null ? "" : getQueryString("id");
	getInfo();
	listinfo(techInfo);
	$("#b_change").live('click',function(){
		var changehtml = '<a style="float:right;margin-right:40px;" id="b_back"><img width="16px" height="16px" style="border:0;margin:0 5px 0 0;vertical-align: -12%;" src="/public/images/back_new.png">返回</a>'
						+'<a style="float:right;margin-right:40px;" id="b_save"><img width="16px" height="16px" style="border:0;margin:0 5px 0 0;vertical-align: -12%;" src="/public/images/save_new.png">保存</a>';
		$("#b_change").replaceWith(changehtml);
		$("#rowss").attr("rowspan",8);
		$("#col").attr("colspan", 1);
		$("#photostyle").append('<input id="changePhotoBtn" class="upload" type="button" value="更换头像"/><p class="tip">* 格式为.jpg .gif .png<br/> 最佳尺寸：一寸照片</p></span>');
		changeEdit();
		filldata(techInfo);
	});
	$("#b_back").live('click',function(){
		back();
	});
	function back(){
		var changehtml = '<a style="float:right;margin-right:40px;" id="b_change"><img width="16px" height="16px" style="border:0;margin:0 5px 0 0;vertical-align: -12%;" src="/public/images/edit.png">编辑个人信息</a>';
		$("#b_back").parent().html(changehtml);
		$("#rowss").attr("rowspan",7);
		$("#col").attr("colspan", 2);
		$("#photostyle").html('<img id="body_photo" src=""></span>');
		changeinfo();
		listinfo(techInfo);
	}
	function getInfo(){
		$.post("/detailed/getUserRoleInfo","id="+id,function(data){
			techInfo = data;
		},'json');
	}
	//填充数据
	function filldata(data){
			
			if(data!=""){
				$("#teacherName").val(data.name);
				$("#eteacherName").val(data.ename);

				$("#gender").val(data.gender);
				$("#body_photo").attr("src",data.photo);
				$("#Degree").val(data.degree);
				$("#title").val(data.title);
				$("#grade").val(data.grade);
				$("#idCard").val(data.idcard);
				$("#phone").val(data.phone);
				$("#Email").val(data.email);
				$("#Connect").val(data.othercontact);
				$("#Website").val(data.ownurl);
				$("#Address").val(data.address);
				$("#eAddress").val(data.eaddress);
				$("#ConnectMan").val(data.urgencynam);
				$("#eConnectMan").val(data.eurgencynam);
				$("#Profession").val(data.profession);
				$("#eProfession").val(data.eprofession);
				$("#Research").val(data.researcharea);
				$("#eResearch").val(data.eresearcharea);
				$("#Tutor").val(data.tutor);
				$("#eTutor").val(data.etutor);
				$("#Thesis").val(data.thesis);
				$("#eThesis").val(data.ethesis);
				$("#Graduation").val(data.graduationdate);
				$("#Direction").val(data.whereabouts);
				$("#eDirection").val(data.ewhereabouts);
//				$("#pesnIntro").val(data.introduce);
//				$("#epesnIntro").val(data.eintroduce);
//				$("#workresume").val(data.workresume);
//				$("#eworkresume").val(data.eworkresume);
				
				editor.html(data.introduce);
				eeditor.html(data.eintroduce);
				wditor.html(data.workresume);
				wwditor.html(data.eworkresume);
				
				$("#mphone").val(data.mphone);
				$("#fax").val(data.fax);
				$("#etitle").val(data.etitle);
			}
	};
	//显示个人信息
	function listinfo(){
		$.post("/detailed/getUserRoleInfo","id="+id,function(data){
			techInfo = data;
			if(data!=""){
				$("#teacherName").html(data.name);
				$("#eteacherName").html(data.ename);
				if(data.gender==1){
					$("#gender").html("男");
				}else{
					$("#gender").html("女");
				}
				$("#photo").val(data.photo);
				$("#body_photo").attr("src",data.photo);
				$("#Degree").html(data.degree);
				$("#title").html(data.title);
				$("#grade").html(data.grade);
				$("#idCard").html(data.idcard);
				$("#phone").html(data.phone);
				$("#Email").html(data.email);
				$("#Connect").html(data.othercontact);
				$("#Website").html(data.ownurl);
				$("#Address").html(data.address);
				$("#eAddress").html(data.eaddress);
				$("#ConnectMan").html(data.urgencynam);
				$("#eConnectMan").html(data.eurgencynam);
				$("#Profession").html(data.profession);
				$("#eProfession").html(data.eprofession);
				$("#Research").html(data.researcharea);
				$("#eResearch").html(data.eresearcharea);
				$("#Tutor").html(data.tutor);
				$("#eTutor").html(data.etutor);
				$("#Thesis").html(data.thesis);
				$("#eThesis").html(data.ethesis);
				$("#Graduation").html(data.graduationdate);
				$("#Direction").html(data.whereabouts);
				$("#eDirection").html(data.ewhereabouts);
//				$("#pesnIntro").html(data.introduce);
//				$("#epesnIntro").html(data.eintroduce);
//				$("#workresume").html(data.workresume);
//				$("#eworkresume").html(data.eworkresume);
				
				$("#mphone").html(data.mphone);
				$("#fax").html(data.fax);
				$("#etitle").html(data.etitle);
				editor.html(data.introduce);
				eeditor.html(data.eintroduce);
				wditor.html(data.workresume);
				wwditor.html(data.eworkresume);
			}
		},'json');
	}
	/********************     保存        ************************/
	$("#b_save").live('click',function(){
		var formdata = $('form').serialize();
		console.log(formdata);
		$.post("/add/updateUserInforById?id="+id, formdata, function(data){
			if(data.success){
				box.show("保存成功","",{width:170});
				back();
			}else{
				box.show("保存失败","",{width:170});
			}
		});	
	});
	
	
	
	/********************   将显示换成编辑   ************************/
	function changeEdit(){
		$("#teacherName").replaceWith('<input id="teacherName" class="inputtext-new" type="text"  name="info.name" />');
		$("#eteacherName").replaceWith('<input id="eteacherName" class="inputtext-new" type="text"  name="info.ename" />');
		var gender = '<select id="gender" class="select-new"  name="info.gender" >'
			+'<option value="1">男</option>'
			+'<option value="0">女</option>';
		
		$("#gender").replaceWith(gender);
		var degree = '<select id="Degree" class="select-new"  name="info.degree" >'
					+'<option value="教师">教师</option>'
					+'<option value="博士后">博士后</option>'
					+'<option value="博士生">博士生</option>'
					+'<option value="硕士生">硕士生</option>'
					+'<option value="行政助理">行政助理</option>'
					+'<option value="校友">校友</option>'
					+'<option value="特约/访问学者">特约/访问学者</option>';
		$("#Degree").replaceWith(degree);

		$("#mphone").replaceWith('<input id="mphone" class="inputtext-new" type="text"  name="info.mphone" />');
		$("#fax").replaceWith('<input id="fax" class="inputtext-new" type="text"  name="info.fax" />');
		
		$("#title").replaceWith('<input id="title" class="inputtext-new" type="text"  name="info.title" />');
		$("#etitle").replaceWith('<input id="etitle" class="inputtext-new" type="text"  name="info.etitle" />');
		
		$("#grade").replaceWith('<input id="grade" class="inputtext-new" type="text"  name="info.grade" />');
		$("#idCard").replaceWith('<input id="idCard" class="inputtext-new" type="text"  name="info.idcard" />');
		$("#phone").replaceWith('<input id="phone" class="inputtext-new" type="text"  name="info.phone" />');
		$("#Email").replaceWith('<input id="Email" class="inputtext-new" type="text"  name="info.email" />');;
		$("#Website").replaceWith('<input id="Website" class="inputtext-new" type="text"  name="info.ownurl" />');
		$("#Connect").replaceWith('<input id="Connect" class="inputtext-new" type="text"  name="info.othercontact" />');
		$("#Address").replaceWith('<input id="Address"	class="inputtext-new" type="text"  name="info.address" />');;
		$("#eAddress").replaceWith('<input id="eAddress"	class="inputtext-new" type="text"  name="info.eaddress" />');;
		$("#ConnectMan").replaceWith('<input id="ConnectMan" class="inputtext-new" type="text"  name="info.urgencynam" />');
		$("#eConnectMan").replaceWith('<input id="eConnectMan" class="inputtext-new" type="text"  name="info.eurgencynam" />');
		$("#Profession").replaceWith('<input id="Profession" class="inputtext-new" type="text"  name="info.profession" />');
		$("#eProfession").replaceWith('<input id="eProfession" class="inputtext-new" type="text"  name="info.eprofession" />');
		$("#Research").replaceWith('<input id="Research" class="inputtext-new" type="text"  name="info.researcharea" />');
		$("#eResearch").replaceWith('<input id="eResearch" class="inputtext-new" type="text"  name="info.eresearcharea" />');
		$("#Tutor").replaceWith('<input id="Tutor" class="inputtext-new" type="text"  name="info.tutor" />');
		$("#eTutor").replaceWith('<input id="eTutor" class="inputtext-new" type="text"  name="info.etutor" />');
		$("#Thesis").replaceWith('<input id="Thesis" class="inputtext-new" type="text"  name="info.thesis" />');
		$("#eThesis").replaceWith('<input id="eThesis" class="inputtext-new" type="text"  name="info.ethesis" />');
		$("#Graduation").replaceWith('<input id="Graduation" class="inputtext-new" type="text"  name="info.graduationdate" />');
		$("#Direction").replaceWith('<input id="Direction" class="inputtext-new" type="text"  name="info.whereabouts" />');
		$("#eDirection").replaceWith('<input id="eDirection" class="inputtext-new" type="text"  name="info.ewhereabouts" />');
//		$("#pesnIntro").replaceWith('<textarea id="pesnIntro" maxlength="800" name="info.introduce" style="margin: 0px; width: 779px; height: 200px; max-width:779px;"></textarea>');
//		$("#epesnIntro").replaceWith('<textarea id="epesnIntro" maxlength="800" name="info.eintroduce" style="margin: 0px; width: 779px; height: 200px; max-width:779px;"></textarea>');
//		$("#workresume").replaceWith('<textarea id="workresume" maxlength="800" name="info.workresume" style="margin: 0px; width: 779px; height: 200px; max-width:779px;"></textarea>');
//		$("#eworkresume").replaceWith('<textarea id="eworkresume" maxlength="800" name="info.eworkresume" style="margin: 0px; width: 779px; height: 200px; max-width:779px;"></textarea>');
//		$("#pesnIntro").before('<span class="tip">请不要超过800字</span>');
//		$("#epesnIntro").before('<span class="tip">请不要超过800字</span>');
//		$("#workresume").before('<span class="tip">请不要超过800字</span>');
//		$("#eworkresume").before('<span class="tip">请不要超过800字</span>');
		
		
	}
	/********************   将编辑换成显示   ************************/
	function changeinfo(){
		$("#teacherName").replaceWith('<span id="teacherName" ></span>');
		$("#eteacherName").replaceWith('<span id="eteacherName" ></span>');
		$("#gender").replaceWith('<span id="gender" ></span>');
		$("#Degree").replaceWith('<span id="Degree" ></span>');
		$("#title").replaceWith('<span id="title" ></span>');
		$("#grade").replaceWith('<span id="grade" ></span>');
		$("#idCard").replaceWith('<span id="idCard" ></span>');
		$("#phone").replaceWith('<span id="phone" ></span>');
		$("#Email").replaceWith('<span id="Email" ></span>');
		$("#Website").replaceWith('<span id="Website" ></span>');
		$("#Connect").replaceWith('<span id="Connect" ></span>');
		$("#Address").replaceWith('<span id="Address" ></span>');
		$("#eAddress").replaceWith('<span id="eAddress" ></span>');
		$("#ConnectMan").replaceWith('<span id="ConnectMan" ></span>');
		$("#eConnectMan").replaceWith('<span id="eConnectMan" ></span>');
		$("#Profession").replaceWith('<span id="Profession"  ></span>');
		$("#eProfession").replaceWith('<span id="eProfession"  ></span>');
		$("#Research").replaceWith('<span id="Research" ></span>');
		$("#eResearch").replaceWith('<span id="eResearch" ></span>');
		$("#Tutor").replaceWith('<span id="Tutor" ></span>');
		$("#eTutor").replaceWith('<span id="eTutor" ></span>');
		$("#Thesis").replaceWith('<span id="Thesis" ></span>');
		$("#eThesis").replaceWith('<span id="eThesis" ></span>');
		$("#Graduation").replaceWith('<span id="Graduation" ></span>');
		$("#Direction").replaceWith('<span id="Direction" ></span>');
		$("#eDirection").replaceWith('<span id="eDirection" ></span>');
//		$("#pesnIntro").replaceWith('<div id="pesnIntro" ></div>');
//		$("#epesnIntro").replaceWith('<div id="epesnIntro" ></div>');
//		$("#workresume").replaceWith('<div id="workresume" ></div>');
//		$("#eworkresume").replaceWith('<div id="eworkresume" ></div>');
		
		$("#mphone").replaceWith('<div id="mphone" ></div>');
		$("#fax").replaceWith('<div id="fax" ></div>');
		$("#etitle").replaceWith('<span id="etitle" ></span>');
//		$(".tip").remove();
	}

	//初始化编辑器
	KindEditor.ready(function(K) {
		editor = K.create('textarea[name="info.introduce"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: false,
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
					 'justifyfull', 'link', 'unlink', '|', 'source'],
			
		});
	});
	KindEditor.ready(function(K) {
		eeditor = K.create('textarea[name="info.eintroduce"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: false,
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
					 'justifyfull', 'link', 'unlink', '|', 'source'],
			
		});
	});
	KindEditor.ready(function(K) {
		wditor = K.create('textarea[name="info.workresume"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: false,
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
					 'justifyfull', 'link', 'unlink', '|', 'source'],
			
		});
	});
	KindEditor.ready(function(K) {
		wwditor = K.create('textarea[name="info.eworkresume"]', {
			cssPath : '/public/assets/common/scripts/kindeditor-4.1.10/plugins/code/prettify.css',
			allowFileManager : false,
			resizeType : 1,
			allowImageUpload: false,
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
					 'justifyfull', 'link', 'unlink', '|', 'source'],
			
		});
	});		
	
})();