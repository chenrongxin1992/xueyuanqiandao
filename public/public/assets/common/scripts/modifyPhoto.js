$(function(){
	$.extend({
	 loadImage: function(url) {
	    	// Define a "worker" function that should eventually resolve or reject the deferred object.
	    	var loadImage = function(deferred) {
	    		var image = new Image();
	    		// Set up event handlers to know when the image has loaded
	    		// or fails to load due to an error or abort.
	    		image.onload = loaded;
	    		image.onerror = errored; // URL returns 404, etc
	    		image.onabort = errored; // IE may call this if user clicks "Stop"
	    		// Setting the src property begins loading the image.
	    		image.src = url;
	    		function loaded() {
	    			unbindEvents();
	    			// Calling resolve means the image loaded sucessfully and is ready to use.
	    			deferred.resolve(image);
	    		}
	    		function errored() {
	    			unbindEvents();
	    			// Calling reject means we failed to load the image (e.g. 404, server offline, etc).
	    			deferred.reject(image);
	    		}
	    		function unbindEvents() {
	    			// Ensures the event callbacks only get called once.
	    			image.onload = null;
	    			image.onerror = null;
	    			image.onabort = null;
	    		}
	    	};
	    	return $.Deferred(loadImage).promise();
	    }
	});
});



$(function(){
	
	var filename = "", jcrop = null;

	// 全局配置（这样就不必每次初始化时都加上下面的设置）
	$.jUploader.setDefaults({
	    cancelable: false, // 可取消上传
	    allowedExtensions: ['jpg', 'png', 'gif', 'jpeg', 'bmp'], // 只允许上传图片
	    messages: {
	        upload: '浏览',
	        cancel: '取消',
	        emptyFile: "{file} 为空，请选择一个文件.",
	        invalidExtension: "{file} 后缀名不合法. 只有 {extensions} 是允许的.",
	        onLeave: "文件正在上传，如果你现在离开，上传将会被取消。"
	    },
	    showMessage: function (message) {
        	box.show("<div class='error-tip'>" + message + "</div>");
        },
	});
	
	$("#changePhotoBtn").live("click", function(){
		$.miniDialog({
			title: '添加或更改您的头像',
			id: 'imgUploadDialog',
			content: '<div class="avatar-upload-box"><div class="upload-field"><div class="upload-msg error">抱歉！未知错误，请重试</div><div class="clear"></div><div class="upload-tips">从电脑中选择一张您喜欢的照片上传，仅支持JPEG、GIF或PNG图片文件，且大小不超过2M。</div><a href="javascript:" class="btn-common" id="btn_upload_img">上传</a></div><div class="upload-img-preview clearfix"><p style="height: 30px; line-height: 30px;">框选出图像中您喜欢的部分来生成头像</p><div class="original-img"><img id="original_img" src=""></div><div class="preview-img"><div class="preview-img-holder"><div class="img-container"><img id="preview_img" src=""></div></div><p style="height: 30px; line-height: 30px; text-align: center;">生成头像（150x220）</p><a class="btn-save" href="javascript:" id="btn_save">保&nbsp;存</a><a class="btn-reset" href="javascript:" id="btn_cancel">取&nbsp;消</a></div></div></div>',
			width: 700,
			openBtn: false,
			top : 150
		});
		$.jUploader({
		    button: "btn_upload_img", // 这里设置按钮id
		    name: "upfile",
			action: '/add/uploadTempPhotoFile',
		    // 开始上传事件
		    onUpload: function (fileName) {
		    	$.openLoading('正在上传图片');
		    },
		    // 上传完成事件
		    onComplete: function (data) {
		    	$.closeLoading();
		    	if(data.success){
		    		//测试用
//		    		data.filename = "20140802153131.jpg";
//		    		data.url = "/public/attachment/temporary/20140802153131.jpg";
		    		
					filename = data.filename;			
					$.loadImage(data.url).done(function(){
						$('.upload-img-preview').hide();
						jcrop && jcrop.destroy();
						$('#original_img, #preview_img').attr({
							'src': data.url,
							'style': ''
						});
						$('#original_img').Jcrop({
							aspectRatio: 150/220,
							onSelect: showPreview,
							onChange: showPreview,
							setSelect: [0, 0, 150, 220],
							minSize: [30, 44],
							allowSelect: false
						}, function(){jcrop = this;});
						$('.upload-img-preview').show();
					});
					
				}else{
//					console.log("upload photo error");
				}
		    }
		});	
	});

	$('#btn_save').live("click", function(){
		var o = $('#preview_img').data("o");
		if(!o.w || !o.h){
			//TODO 未上传图片或未框选
			showMsg('请上传并框选图片', true, 5000);
			return false;
		}
		$.openLoading('正在保存头像');
		$.post('/add/changePicture', {
			filename: filename,
			needwidth: o.w,
			needheight: o.h,
			x: o.x,
			y: o.y
		}, function(data){
			$.closeLoading();
			if(data.success){
				$.openSuccess(data.error || '已成功保存头像', 3000);
				$('#imgUploadDialog .dialog-close').trigger("click");
				$("#photo").val(data.message);
				$('#body_photo').attr('src', data.message);
			}else{
				$.openError(data.error || '抱歉！未知错误，请重试', 3000);
			}
		}, "json");
	});
	
	$('#btn_cancel').live("click", function(){
		$('#imgUploadDialog .dialog-close').trigger("click");
	});
	
	function showPreview(o){
		var xr = 150 / o.w,
			yr = 220 / o.h;
		var h = $('#original_img').height(),
			w = $('#original_img').width();
		$('#preview_img').css({
			height: Math.round(yr * h) + 'px',
			width: Math.round(xr * w) + 'px',
			marginLeft: '-' + Math.round(xr * o.x) + 'px',
			marginTop: '-' + Math.round(yr * o.y) + 'px'
		}).data('o', o);
	}
});

