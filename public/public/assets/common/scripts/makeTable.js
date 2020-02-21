/**
* 生成Table（基于jQuery） 2013-01-15
*/
(function(window){
	var document = window.document,
		$ = window.jQuery,
		defaults = {
			//需要传给服务器的参数
			data : {
				defaultColumn : '',				//number
				sortType : 'asc',				//or 'desc'
				sortableColumns : '',			//numberList, 例如：'2,5,6,7,8'
				pagesize : 15,					//number
				curpage : 1,					//number
				pagehref : '',					//url
				tmp : new Date().getTime(),		//timestamp
				sortColumn : ''					//number
			},
			//字段的全局配置
			rowDefault : {
				value : function(){return '';},
				name : '',
				thClass : '',
				tdClass : '',
				fn : null,
				width : null,
				maxLen : null,
				noBreak : true,
				suffix : '...',
				title : true,
				align : 'left'
			},
			//字段的显示方式
			//示例：
			// [{
			// 		type : 'num'														//自定义类型
			//		value : 'id' || function(record, option, data){return ''}			//对应的字段，当为string类型时直接匹配对应的字段，当为function时传入当前一行的数据、全局配置参数与当前请求后台的数据
			//		name : '序号' || function(option, data){return ''}					//th显示的名称，当为string类型时直接输出，当为function时传入当前参数与当前请求后台的数据
			//		thClass : ''														//自定义的样式类名，作用于TH，多个用空格隔开，默认为空
			//		tdClass : ''														//自定义的样式类名，作用于TD，多个用空格隔开，默认为空
			//		fn : function(td){return '';} 										//绘制单元格后触发，传入参数td为当前，可用于生成预览框事件
			//		width : NULL														//宽度，数字类型，默认自适应
			//		maxLen : NULL														//最大长度，超过后自动截取并用后缀填充
			//		noBreak : true														//是否强制不换行（默认是）	
			//		suffix : '...'														//超过最大长度时的用于填充的后缀
			//		title : true														//超出长度时是否显示title属性，必须value为字符串类型时
			//		align : 'left'														//对齐方式
			// },{}...]
			rowList : [],
			//请求成功后执行的回调函数，若返回false则不执行after函数
			//@param content : 生成的表格主体HTML
			//@param footer ：生成的翻页HTML
			//@param data ：请求所得的原始数据
			success : function(content, footer, data){},
			//请求错误时触发，若返回false则不执行after函数
			error : function(){},
			//页脚参数，用于控制翻页
			footer : {
				size : 5,												//显示的翻页按钮数
				className : 'T-footer',									//翻页样式
				autoPage : true,										//是否允许自定义每页显示条数及快速翻页
				autoText : '确定',										//快速翻页的显示值
				preText : '上一页',										//上一页按钮的显示值
				nextText : '下一页'
			},
			className : '',												//自定义Table样式，多个用空格隔开
			id : '',													//Table ID，为空时不设置Table ID
			oddTr : function(element){element.className = 'T-odd-tr';},	//tbody下奇数行执行的函数，element为当前tr节点
			evenTr : function(element){element.className = 'T-even-tr';},//tbody下偶数行执行的函数，element为当前tr节点
			//请求开始时执行的函数，默认为打开Loading弹出层，若返回false，停止翻页动作
			before : function(){
				$.openLoading("正在加载中...");
			},
			//请求完成后（包括执行完success或error函数）执行的函数，默认为关闭Loading弹出层
			after : function(){
				$.closeLoading();
			},
			//当记录为空的时候
			empty : function(table, data, option){
				var tbody = document.createElement('tbody'),
					//TODO 用原生方法替代jQuery方法
					len = $(table).find('thead tr th').length,
					tr = document.createElement('tr'),
					td = document.createElement('td');
				//无数据的样式
				table.className = 'T-table T-nodata';
				td.setAttribute('colspan', len);
				td.innerHTML = '暂时还没有数据';
				tr.appendChild(td);
				tbody.appendChild(tr);
				table.appendChild(tbody);
			}
		},
		//类型映射表
		typeMap = {
			'num' : {
				width : 35,
				value : 'num',
				name : '序号'
			},
			'state' : {
				width : 50,
				value : 'state',
				name : '状态'
			},
			'money' : {
				thClass : 'T-th-money',
				align : 'right',
				width : 60
			}
		};
	
	/**
	* 外部接口（挂于window下）
	*/
	function table(option){
		//生成function并执行
		return init(concatParam(option))();
	}
	
	/**
	* 生成翻页FUNCTION
	*/
	function init(option){
		return function(){
			//判断是否存在before函数
			if (option.before && typeof option.before === 'function'){
				if (option.before() === false) return ;
			}
			//提交请求
			$.ajax({
				type : 'post',
				data : option.data,
				url : option.data.pagehref,
				dataType : 'json',
				error : function(){
					if (option.error && typeof option.error === 'function')
						if (option.error() === false) return ;
					//执行after函数
					if (option.after && typeof option.after === 'function')
						option.after();
				},
				success : function(data){
					success(data, option);
					//执行after函数
					if (option.after && typeof option.after === 'function')
						option.after();
				}
			});
		};
	}
	
	/**
	* 合并默认参数
	*/
	function concatParam(option){
		//合并参数
		return extend(defaults, option);
	}
	
	/**
	* 合并参数
	*/
	function extend(defaults, option){
		if (option === undefined) 
			return arguments.callee(defaults, defaults);
		var result = {};	
		for(var name in defaults){
			if (option[name] !== undefined){
				//TODO 补全数组的深度复制
				if (typeof defaults[name] === "object" && !(defaults[name] instanceof Array) && defaults[name] !== null)
					result[name] = arguments.callee(defaults[name], option[name]);
				else
					result[name] = option[name];
			}
			else result[name] = defaults[name];
		}
		return result;
	}
	
	/**
	* 请求成功时触发
	* @param data 请求返回的数据
	* @param option 设置的参数
	*/
	function success(data, option){
		var content, footer;
		content = makeContent(data, option);
		footer = makeFooter(data, option);
		if (option.success && typeof option.success === 'function')
			option.success(content, footer, data);
	}

	/**
	* 生成正文节点
	*/
	function makeContent(data, option){
		var table, thead, theadTr, tbody, opt = [];
		table = document.createElement('table');
		//自定义ID
		
		//加载样式
		$(table).addClass('T-table').addClass(option.className);
		//thead
		thead = document.createElement('thead');
		table.appendChild(thead);
		theadTr = document.createElement('tr');
		thead.appendChild(theadTr);
		//循环创建参数与th
		for (var i = 0 ; i < option.rowList.length; i++){
			var th = document.createElement('th'), 
				oneOpt, 
				divWrap = document.createElement('div'),
				sortHtml = '';		
			//存在适配类型,合并默认参数
			if (option.rowList[i].type && typeMap[option.rowList[i].type]){
				oneOpt = extend(option.rowDefault, typeMap[option.rowList[i].type]);
				oneOpt = extend(oneOpt, option.rowList[i]);
			}else
				oneOpt = extend(option.rowDefault, option.rowList[i]);
			//把参数压入opt数组，用作下文里生成TD
			opt.push(oneOpt);
			//自定义样式
			$(th).addClass(oneOpt.thClass || '');
			//自定义宽度
			if (oneOpt.width){
				if( oneOpt.width == 'auto' ){
					th.style.width = 'auto';
				}else{
					th.style.width = (oneOpt.width + '').replace('px', '') + 'px';
				}
			} 
			divWrap.className = 'T-th-wrap';
			//判断是否存在排序
			if (new RegExp('(?:,|^)' + ( i + 1 ) + '(?:,|$)').test(option.data.sortableColumns)){
				//存在
				sortHtml = '<div class="T-sort'
						 + (option.data.sortColumn == i + 1 ? ' T-' + option.data.sortType : '')
						 + '">'
						 + (typeof oneOpt.name === 'string' && oneOpt.name || typeof oneOpt.name === 'function' && oneOpt.name(option, data) || '请输入标题')
						 + '</div>';
				$(th).addClass('T-th-sort');
				//先创建一个配置object,再进行绑定事件，采用jquery绑定
				$(th).click(init(extend(option, {
					data : {
						sortColumn : ( i + 1 ) + '',
						sortType : (option.data.sortColumn == ( i + 1 ) && option.data.sortType == 'asc') ? 'desc' : 'asc'
					}
				})));
				divWrap.innerHTML = sortHtml;
			}
			else{
				//生成标题
				divWrap.innerHTML = typeof oneOpt.name === 'string' && oneOpt.name || typeof oneOpt.name === 'function' && oneOpt.name(option, data) || '请输入标题';
			}
			//插入DIV
			th.appendChild(divWrap);
			theadTr.appendChild(th);
		}
		//记录为空时
		if (data.tbody.length == 0){
			option.empty(table, data, option);
		}
		else{
			//tbody
			tbody = document.createElement('tbody');
			table.appendChild(tbody);
			//循环创建tr
			for (var j = 0, len = data.tbody.length; j < len; j++){
				var tr = document.createElement('tr');
				//遍历生成TD
				for (var k = 0; k < opt.length; k++){
					tr.appendChild(makeTD(data.tbody[j], data, opt[k], option));
				}
				//判断奇偶，并执行对应的函数
				if (j % 2) typeof option.oddTr === 'function' && option.oddTr(tr);
				else typeof option.evenTr === 'function' && option.evenTr(tr);
				tbody.appendChild(tr);
			}
		}
		
		//返回table
		return table;
		
		//生成td
		//@param record 一行数据
		//@param data	请求后台所得的全部数据
		//@param oneOpt 对应的列参数
		//@param option 全局参数
		function makeTD(record, data, oneOpt, option){
			var td = document.createElement('td'),
				div = document.createElement('div'),
				text;
			if (typeof oneOpt.value === 'string'){
				div.innerHTML = record[oneOpt.value] == null ? '' : record[oneOpt.value];
			}else if (typeof oneOpt.value === 'function'){
				div.innerHTML = oneOpt.value(record, option, data);
			}
			else{
				div.innerHTML = '';
			}
			//判断是否强制不换行
			if (oneOpt.noBreak) div.className = 'T-td-wrap T-no-break';
			else div.className = 'T-td-wrap';
			//加载对齐样式
			$(td).addClass(oneOpt.align == 'left' ? '' : (oneOpt.align == 'right' ? 'T-td-right' : 'T-td-center'));
			//加载TD样式
			$(td).addClass(oneOpt.tdClass);
			//判断是否需要切割TEXT
			text = $(div).text();
			if (typeof oneOpt.maxLen === 'number' && len(text) > oneOpt.maxLen){
				//TODO（待改进）
				if ($(div).html() == text){
					//设置title
					if (oneOpt.title){
						div.setAttribute('title', text);
					}
					$(div).html(cut(text, oneOpt.maxLen) + oneOpt.suffix);
				}else{
					$(div).contents().each(function(){
						if (this.nodeType == 3 && $(this).text() == text)
							$(this).text(cut(text, oneOpt.maxLen) + oneOpt.suffix);
						else if ($(this).html() == text) {
							$(this).html(cut(text, oneOpt.maxLen) + oneOpt.suffix);
						}
					});
				}
			}
			td.appendChild(div);
			//执行完成后的td事件
			if (typeof oneOpt.fn === 'function') oneOpt.fn(td);
			return td;
			
			//计算字符串长度（汉字当两个长度）
			function len(str){
				var intLen = 0;
				for (var i = 0; i < str.length; i++){
					if (str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255)
						intLen += 2;
					else
						intLen += 1;
				}
				return intLen;
			}
			//根据长度截取字符串（汉字当两个长度）
			function cut(str, len){
				var strTemp = '';
				for (var i = 0; len > 0 && i < str.length; i++){
					if (str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255)
						len -= 2;
					else
						len -= 1;
					strTemp += str.charAt(i);
				}
				return strTemp;
			}
		}
	}
	
	/**
	* 生成页脚节点
	*/
	function makeFooter(data, option){
		//构建翻页数组
		var arr = makeArr(data.pageArgument.curpage, data.pageArgument.pagecount, data.pageArgument.pagenum, option.footer.size),
			arrText = makeArrText(arr),
			div = document.createElement('div'),
			divWrap = document.createElement('div'),
			pre, next;
		
		divWrap.className = option.footer.className;
		div.className = 'T-footer-main';
		
		//上一页
		pre = document.createElement('a');
		pre.href = 'javascript:';
		if (data.pageArgument.curpage == 1){
			pre.className = 'T-page T-page-dis';
		}
		else{
			pre.className = 'T-page';
			//TODO 绑定事件，jQuery绑定
			$(pre).click(init(extend(option, {
				data : {
					curpage : data.pageArgument.curpage - 1
				}
			})));
		}
		pre.innerHTML = option.footer.preText;
		div.appendChild(pre);
		//遍历数组，创建节点
		for (var i = 0; len = arr.length, i < len; i++){
			var a = document.createElement('a');
			a.href = 'javascript:';
			a.innerHTML = arrText[i];
			//判断是否当前页
			if (arr[i] == data.pageArgument.curpage){
				a.className = 'T-page T-page-dis';
			}
			else{
				a.className = 'T-page';
				//TODO 绑定事件，jQuery绑定
				$(a).click(init(extend(option, {
					data : {
						curpage : arr[i]
					}
				})));
			}
			div.appendChild(a);
		}
		//下一页
		next = document.createElement('a');
		next.href = 'javascript:';
		if (data.pageArgument.curpage == data.pageArgument.pagecount){
			next.className = 'T-page T-page-dis';
		}
		else{
			next.className = 'T-page';
			//TODO 绑定事件，jQuery绑定
			$(next).click(init(extend(option, {
				data : {
					curpage : parseInt(data.pageArgument.curpage) + 1
				}
			})));
		}
		next.innerHTML = option.footer.nextText;
		div.appendChild(next);
		
		//判断是否允许自定义每页显示条数及快速翻页
		if (option.footer.autoPage){
			var labelSize = document.createElement('label'),
				inputSize = document.createElement('input'),
				spanSize = document.createElement('span'),
				labelPage = document.createElement('label'),
				inputPage = document.createElement('input'),
				spanPage = document.createElement('span'),
				go = document.createElement('a');
				
			labelSize.className = 'T-page';	
			labelPage.className = 'T-page';	
			
			inputSize.type = 'text';
			inputPage.type = 'text'; 
			inputSize.className = 'px'; 
			inputPage.className = 'px'; 
			inputSize.id = 'T_size';
			inputPage.id = 'T_page';
			inputSize.value = option.data.pagesize;
			inputSize.setAttribute('title', '输入每页显示的条数，按回车快速跳转');
			inputPage.setAttribute('title', '输入页码，按回车快速跳转');
			spanSize.setAttribute('title', '当前每页显示 ' + option.data.pagesize + '条');
			spanSize.innerHTML = ' 条/页';
			spanPage.setAttribute('title', '共 ' + data.pageArgument.pagecount + ' 页');
			spanPage.innerHTML = ' / ' + data.pageArgument.pagecount + ' 页';
			go.className = 'T-page';
			go.href = 'javascript:';
			go.innerHTML = option.footer.autoText;
			//TODO 绑定翻页事件 jquery
			$(inputSize).keydown(function(e){
				if (e.keyCode == 13)
					goPage();
			});
			$(inputPage).keydown(function(e){
				if (e.keyCode == 13)
					goPage();
			});
			$(go).click(goPage);
			
			labelSize.appendChild(inputSize);
			labelSize.appendChild(spanSize);
			labelPage.appendChild(inputPage);
			labelPage.appendChild(spanPage);
			
			div.appendChild(labelSize);
			div.appendChild(labelPage);
			div.appendChild(go);
		}
		
		divWrap.appendChild(div);
		return divWrap;
		
		//用于构建翻页数组
		function makeArr(curpage, pagecount, pagenum, size){
			var pageForeach = (pagecount > size) ? size : pagecount;
			//构建翻页数组
			var arr = new Array(pageForeach);
			//第一页与最后一页
			arr[0] = 1;
			arr[pageForeach-1] = pagecount;
			//leftFloat为当前页所在位置与第一页间距
			var leftFloat = Math.floor((pageForeach-2)/2),
				rightFloat = (pageForeach-2) - leftFloat - 1;
			if(curpage - leftFloat > 1 && curpage + rightFloat < pagecount){
				var startPage = curpage - leftFloat;
				for(var i=1;i<pageForeach-1;i++){
					arr[i] = startPage;
					startPage++;
				}
			}
			else if (curpage - leftFloat <= 1) {
				for(var i=1;i<pageForeach-1;i++){
					arr[i] = i + 1;
				}
			}
			else if (curpage + rightFloat >= pagecount) {
				var startPage = pagecount - pageForeach + 2;
				for(var i=1;i<pageForeach-1;i++){
					arr[i] = startPage;
					startPage++;
				}
			}
			return arr;
		}
		//用于构建翻页数组显示文本
		function makeArrText(arr){
			var arrText = [];
			for (var i = 0;i<arr.length;i++){
				if(i == 0 && arr[1] != undefined && arr[1] > 2){
					arrText[0] = arr[i]+"...";
				}
				else if (i == arr.length - 1 && arr.length - 2 > 0 && arr[i-1] != undefined && arr[i-1] + 1 < arr[i]) {
					arrText[i] = "..."+arr[i];
				}
				else{
					arrText[i] = arr[i];
				}
			}
			return arrText;
		}
		
		//用于自定义翻页
		function goPage(){
			var size = parseInt(document.getElementById('T_size').value) > 0 ? parseInt(document.getElementById('T_size').value) : option.data.pagesize,
				page = parseInt(document.getElementById('T_page').value) > 0 ? parseInt(document.getElementById('T_page').value) : option.data.curpage;
			//判断是否越界
			if ((page - 1) * size >= ((parseInt(data.pageArgument.pagecount) - 1) * parseInt(data.pageArgument.pagenum) + 1))
				page = 1;
			init(extend(option, {
				data : {
					curpage : page,
					pagesize : size
				}
			}))();
		}
	}
	
	/**
	* 设置默认全局参数
	*/
	function set(opt){
		defaults = extend(defaults, opt);
	}
	
	/**
	* 生成预览函数
	*/
	function preview(url){
		//缓存请求数据
		var data;
		return function(td){
			$(td).hover(function(){
				$(td).addClass('T-preview');
				if (data !== undefined){
					
				}
			}, function(){
				$(td).removeClass('T-preview');
			});
		};
	}
	
	//挂载函数
	table.set = set;
	table.preview = preview;
	//挂载于WINDOW下
	if (window.T === undefined)
		window.T = table;
	window.makeTable = table;
	
	//加载样式
	document.write('<link type="text/css" rel="stylesheet" href="/public/assets/common/style/makeTable.css" />');
}(window));