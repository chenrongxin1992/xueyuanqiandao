(function() {
  var zIndex = 9999;
  if (typeof jQuery != 'undefined') {
    // 为.ajax设置全局变量，超时15s或者发生其他错误时候，及时关闭loading
    $.ajaxSetup({
      timeout : 15000,
      error : function(XMLHttpRequest, textStatus, errorThrown) {
        loading.close();
        // alert("连接出错，请刷新页面或者等待修复！");
        window.location.href;
      }

    });
  }

  // 输入框水印提示
  $(function(){
	  $('input[placeholder], textarea[placeholder]').each(function(){$(this).is('input')?$(this).iePlaceholder():$(this).iePlaceholder({onInput: false});});
  });

  // 绑定注销事件
  $('#status_logout')
      .live(
          'click',
          function() {
            var titalHtml = "注意！你确定要退出吗？";
            var contentHtml = "<div style='margin-top:10px;'>"
                + "<input type='botton' class='submit ui-newbutton ' id= 'submits' title='确认退出' value='确&nbsp;定' style='width:35px;height:13px;display:inline;margin-right:20px'/>"
                + "<input type='botton' class='submit ui-newbutton ' id= 'cancel'  title='取消退出' value='取&nbsp;消' style='width:35px;height:13px;display:inline;'/></div>";
            box.show(titalHtml, contentHtml, {
              width : 273
            });
            $("#submits").bind("click", function() {
              $.post("/other/loginOut", function(data) {
                if (data.success)
                  window.location.href = data.url;
              }, "json");
              // window.location.href="/loginOut";
              box.hide();
              $("#submits").unbind();
            });
            $("#cancel").bind("click", function() {
              box.hide();
              $("#cancel").unbind();
              return null;
            });
          });

  // 侧边栏菜单展开、收缩、导航栏按钮样式切换
  $('.group_header').live('click', function() {
    $(this).next().slideToggle();
    $(this).find('div').toggleClass('group_header_down');
  });

})();

/**
 * 侧栏高亮
 * 
 * @param no
 *          侧栏itemno
 * @param code
 *          导航栏code
 */
function initSidebar(no, code) {
  $(".sub_menuitem").removeClass("selected");
  $('#item' + no).parent().addClass("selected");
  $(".menu2").removeClass("kgmmenu");
  if (code == 1) {// 实验室管理
    $("#nav1").addClass("kgmmenu");
  }
  if (code == 2) {// 科研管理
    $("#nav2").addClass("kgmmenu a");
  }
  if (code == 3) {// 个人中心
    $("#nav3").addClass("kgmmenu");
  }
}
loading = {
  open : function(options) {
    var defaults = {
      back : true,
      content : "数据加载中，请稍候...",
      model : "gtl_ico_clear"
    }, backWidth = $(document).width(), backHeight = $(document).height(), htmlStr = '', opts;
    if (typeof options === 'string') {
      opts = $.extend(defaults, {
        content : options
      });
    } else {
      opts = $.extend(defaults, options);
    }
    if (opts.back) {
      htmlStr += '<div id="loading_back" style="position:absolute;width:'
          + backWidth
          + 'px;height:'
          + backHeight
          + 'px;'
          + 'opacity: .5;filter: alpha(opacity=50);background: #90928A;top: 0px;left: 0px;z-index:'
          + (zIndex++) + ';"' + '></div>';
    }
    htmlStr += '<div class="loading-wrap" style="top:'
        + ($(document).scrollTop() + ($(window).height() - 200) / 2)
        + 'px;z-index:'
        + (zIndex++)
        + ';">'
        + '<span class="loading-outspan" style="'
        + 'z-index:'
        + (zIndex++)
        + ';'
        + '">'
        + '<span class="'
        + opts.model
        + '"></span>'
        + (opts.model == 'gtl_ico_clear'
            ? '<img src="/public/images/loading_2.gif" style="width:16px;height:16px;">'
            : '') + opts.content + '<span class="gtl_end"></span>'
        + '</span></div>';
    $("body").append(htmlStr);
  },

  close : function() {
    $("#loading_back, .loading-wrap").remove();
  },

  /**
   * 打开加载中提示
   */
  openLoading : function(options) {
    var defaults = {
      back : false,
      content : "正在获取数据",
      model : "gtl_ico_clear"
    }, backWidth = $(document).width(), backHeight = $(document).height(), htmlStr = '', opts;
    if (typeof options === 'string') {
      opts = $.extend(defaults, {
        content : options
      });
    } else {
      opts = $.extend(defaults, options);
    }
    if (opts.back) {
      htmlStr += '<div id="loading_back" style="position:absolute;width:'
          + backWidth
          + 'px;height:'
          + backHeight
          + 'px;'
          + 'opacity: .5;filter: alpha(opacity=50);background: #90928A;top: 0px;left: 0px;z-index:'
          + (zIndex++) + ';"' + '></div>';
    }
    htmlStr += '<div class="loading-wrap" style="top:'
        + ($(document).scrollTop() + ($(window).height() - 60) / 2)
        + 'px;z-index:'
        + (zIndex++)
        + ';">'
        + '<span class="loading-outspan" style="'
        + 'z-index:'
        + (zIndex++)
        + ';'
        + '">'
        + '<span class="'
        + opts.model
        + '"></span>'
        + (opts.model == 'gtl_ico_clear'
            ? '<img src="/public/images/loading_2.gif">'
            : '') + opts.content + '<span class="gtl_end"></span>'
        + '</span></div>';
    $("body").append(htmlStr);
  },

  /**
   * 关闭加载中提示
   */
  closeLoading : function() {
    $("#loading_back, .loading-wrap").remove();
  },

  /**
   * 打开成功提示
   */
  openSuccess : function(tip) {
    var options = {
      content : tip || "操作成功",
      model : "gtl_ico_succ"
    };
    this.openLoading(options);
  },

  /**
   * 关闭成功提示
   */
  closeSuccess : function() {
    $("#loading_back, .loading-wrap").remove();
  },

  /**
   * 打开失败提示
   */
  openError : function(tip) {
    var options = {
      content : tip || "操作失败",
      model : "gtl_ico_error"
    };
    this.openLoading(options);
  },

  /**
   * 关闭成功提示
   */
  closeError : function() {
    $("#loading_back, .loading-wrap").remove();
  }
};
/**
 * 弹窗提示
 */
var box = (function() {
  var box_html_tmpl = '<div><div class="box show"><!--显示/隐藏：show/hide--><div class="opacity-bg"><!--半透明背景--></div><a class="btn-close show js-btn-close" href="javascript:;">关闭</a><!--显示/隐藏：show/hide,小版按钮:btn-close,大版按钮:btn-close-b--><!--普通弹出层[[--><div class="box-title show"><h2>温馨提示</h2></div><div class="box-main"><!--操作提示(默认)[[--><div class="tips">${icon}<div class="tips-content"><div id="js_tips_title" class="tips-title"> </div><div id="js_tips_line" class="tips-line"></div></div></div></div><!--普通弹出层]]--></div></div>', box_html = box_html_tmpl;
  var js_mask_layer = null, js_box_container = null, listened = false;
  var _config = {
    width : 500,
    icon : '<span class="tips-ico"><span class="ico-info"><!--图标--></span></span>',
    klass : '',
    erase : false
  };
  var _hide = function(erase) {
    if (erase
        || Object.prototype.toString.call(_config.erase) === '[object Boolean]'
        && _config.erase) {
      // 重写box模版
      box_html = box_html_tmpl;
      // 重写_config配置
      _config = {
        width : 500,
        icon : '<span class="tips-ico"><span class="ico-info"><!--图标--></span></span>',
        klass : '',
        erase : false
      };

      if (js_box_container) {
        // 移除onclick事件
        js_box_container.onclick = null;
        listened = false;
        // 删除js_box_container节点
        js_box_container.parentNode.removeChild(js_box_container);
        // 重置js_box_container引用
        js_box_container = null;
      }
      if (js_mask_layer) {
        // 删除js_mask_layer节点
        js_mask_layer.parentNode.removeChild(js_mask_layer);
        // 重置js_mask_layer引用
        js_mask_layer = null;
      }
    } else {
      js_mask_layer && (js_mask_layer.style.display = 'none');
      js_box_container && (js_box_container.style.display = 'none');
    }
  };
  var bind = function() {
    if (listened) {
      return;
    }
    listened = true;
    js_box_container.onclick = function(e) {
      e = e || window.event;
      var target = e.target || e.srcElement;
      if (target.className.indexOf('js-btn-close') > -1) {
        _hide();
      };
      return true;
    };
  };
  var getRegion = function() {
    var docElement = document.compatMode == 'CSS1Compat'
        ? document.documentElement
        : document.body, _clientWidth = docElement.clientWidth, _clientHeight = docElement.clientHeight, _scrollLeft = window.pageXOffset
        ? window.pageXOffset
        : docElement.scrollLeft, _scrollTop = window.pageYOffset
        ? window.pageYOffset
        : docElement.scrollTop, _scrollWidth = docElement.scrollWidth, _scrollHeight = docElement.scrollHeight;
    return {
      clientWidth : _clientWidth, // 浏览器可视宽度
      clientHeight : _clientHeight,
      scrollWidth : _scrollWidth, // 当前网页实际宽度（包括未显示部分）
      scrollHeight : _scrollHeight,
      scrollLeft : _scrollLeft, // 浏览器滚动距离
      scrollTop : _scrollTop,
      left : _clientWidth / 2 + _scrollLeft,
      top : _clientHeight / 2 + _scrollTop
    };
  };
  var _show = function(title, content, config) {
    if (typeof config == 'object') {
      for ( var name in _config) {
        config[name] && (_config[name] = config[name]);
        if (config[name] === 'none') {
          _config[name] = '';
        }
      }
    }
    js_box_container = js_box_container
        || document.getElementById('js_box_container');
    if (!js_box_container) {
      js_box_container = document.createElement('div');
      js_box_container.id = 'js_box_container';
      js_box_container.className = _config.klass;
      js_box_container.innerHTML = (function() {
        for ( var prop in _config) {
          box_html = box_html.replace(new RegExp("\\$\\{" + prop + "\\}"),
              _config[prop]);
        }
        return box_html;
      })();
      document.body.appendChild(js_box_container);
    }
    js_mask_layer = js_mask_layer || document.getElementById('js_mask_layer');
    if (!js_mask_layer) {
      js_mask_layer = document.createElement('div');
      js_mask_layer.id = 'js_mask_layer';
      document.body.appendChild(js_mask_layer);
    }
    if (!title) {
      title = '';
    }
    if (!content) {
      content = '';
    }
    bind();
    document.getElementById('js_tips_title').innerHTML = title;
    document.getElementById('js_tips_line').innerHTML = content;
    js_box_container.style.display = 'block';
    js_mask_layer.style.display = 'block';
    js_box_container.style.width = _config.width + 'px';
    var region = getRegion();
    var boxWidth = js_box_container.offsetWidth, // box元素宽度
    boxHeight = js_box_container.offsetHeight; // box元素高度
    js_box_container.style.position = 'absolute';
    js_box_container.style.left = (region.left - boxWidth / 2) + 'px';
    js_box_container.style.top = (region.top - boxHeight / 2) + 'px';

  };

  return {
    'show' : _show,
    'hide' : _hide
  };
})();
/**
 * 获取url参数
 * 
 * @param name :
 *          url参数名
 * @returns url参数值 or null
 */
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
}

(function(exports) {
  
  String.prototype.equal = function(exp, argv1, argv2){
    return this == exp ? argv1 : argv2;
  };
  
  function List() {
  }

  List.prototype.load = function(url, params, cb) {
    var _self = this;
    if ($.isType(url, 'function')) {
      return _self.o = [], cb.apply(_self, [[], 'success']);
    }
    if ($.isType(url, 'array') && $.isType(params, 'function')) {
      return _self.o = url, params.apply(_self, [url, 'success']);
    }
    if ($.isType(params, 'function')) {
      cb = params;
      params = {};
    }
    $.get(url, params).then(function(data, status, xhr) {
      if (data.length) {
        _self.o = data;
      }
      cb.apply(_self, [data, status]);
    });
  };

  List.prototype.updateRowIndex = function() {
    var _self = this;
    _self.table.find('tbody tr').each(function() {
      var _index = $(this).index() + 1;
      $(this).children('.row-index').html(_index).attr('index', _index);
    });
  };

  List.prototype.getRows = function(fn) {
    var _self = this, $rows = _self.table.find('tbody tr'), ret = [], flag;

    $rows.each(function(i) {
      var _ret;
      _ret = fn($(this));
      if (_ret === false)
        return flag = false;
      if (_ret === true)
        return true;
      _ret && ret.push(_ret);
    });

    return flag === false ? false : ret;
  };

  List.prototype.addRow = function(data) {
    // console.trace();
    var _self = this, output = '', row_index = _self.table.find('tbody tr').length + 1;
    _self.table.append(function() {
      output += _self._rowTmpl.replace(/\$\{([^\W\}]+)\}/g, function(key) {
        key = key.slice(2, -1);
        // i == 0 && console.log(key);
        return key === 'row_select'
            ? '<input type=radio name=row>'
            : key === 'row_index' ? row_index : key === 'td_klass' ? ['even',
                'odd'][(row_index) % 2] : data && data[key] || '';
      });
      return output;
    });
  };

  List.prototype.upRow = function(index) {
    var _self = this;
    var $row = _self.table.find('tbody tr').eq(index);
    if (!$row.prev().length)
      return false;
    $row.prev().before($row.detach());
    _self.updateRowIndex();
  };

  List.prototype.downRow = function(index) {
    var _self = this;
    var $row = _self.table.find('tbody tr').eq(index);
    if (!$row.next().length)
      return false;
    $row.next().after($row.detach());
    _self.updateRowIndex();
  };

  List.prototype.delRow = function(index) {
    var _self = this;
    var $tr = _self.table.find('tbody tr');
    if ($tr.length <= 1)
      return false;
    $tr.eq(index).remove();
    _self.updateRowIndex();
  };

  List.prototype._setRowTmpl = function(rowTmpl) {
    this._rowTmpl = rowTmpl;
  };

  List.prototype._setHeader = function(header) {
    this._header = header;
  };

  List.prototype.redraw = function() {
    var _self = this;
    _self.table.html(_self._header).append(
        function() {
          var output = '';
          $.each(_self.o, function(index, item) {
            output += _self._rowTmpl.replace(/\$\{([^\}]+)\}/g, function(key){
              key = key.slice(2, -1);
              var _ret;
              switch(key){
                case 'row_select':
                  _ret = '<input type=radio name=row>';
                  break;
                case 'row_index':
                  _ret = index + 1;
                  break;
                case 'td_klass':
                  _ret = ['even', 'odd'][(index + 1) % 2];
                  break;
                default:
                  var keyArr = key.split('?');
                  if(keyArr.length > 1){
                    key = keyArr.shift();
                    var evelStr = '(function(){ return this'
                      , i
                      , len;
                    for(i = 0, len = keyArr.length; i < len; i += 1){
                      evelStr += '.' + keyArr[i];
                    }
                    evelStr += ';}).call("' + (item[key] || "") + '");';
                    _ret = (0, eval)(evelStr);
                  }else{
                    _ret = item[key] || '';
                  }
              }
  // i == 0 && console.log(key);
              return !!_ret ? _ret : "";
            });
          });
          if (!_self.o.length) {
            _self.addRow();
          }
          return output;
        });
  };

  List.prototype.render = function(renderTo, fields) {
    var _self = this, $table, $head, rowTmpl, created;
    created = ($table = $('.table', renderTo)).length;
    if (!created) {
      $table = $('<table>').addClass('table');
    }
    _self.table = $table;
    $head = $('<tr>');
    rowTmpl = '<tr class="${td_klass}">';
    tdLen = fields.length;
    $.each(fields, function(i, item) {
      $('<th>').addClass(item.klass || '').css(item.style || {})
          .text(item.name).appendTo($head);
      rowTmpl += '<td class="' + (item.klass || '')
          + (item.key === 'row_index' ? ' row-index" index=${row_index}' : '"')
          + '>' + (item.tdTmpl ? item.tdTmpl : '${' + item.key + '}');
    });
    _self._setRowTmpl(rowTmpl);
    _self._setHeader($head.wrap('<thead></thead>').parent());
    $table.html($head.parent()).append(
        function() {
          var output = '';
          $.each(_self.o, function(index, item) {
            output += _self._rowTmpl.replace(/\$\{([^\}]+)\}/g, function(key){
              key = key.slice(2, -1);
              var _ret;
              switch(key){
                case 'row_select':
                  _ret = '<input type=radio name=row>';
                  break;
                case 'row_index':
                  _ret = index + 1;
                  break;
                case 'td_klass':
                  _ret = ['even', 'odd'][(index + 1) % 2];
                  break;
                default:
                  var keyArr = key.split('?');
                  if(keyArr.length > 1){
                    key = keyArr.shift();
                    var evelStr = '(function(){ return this'
                      , i
                      , len;
                    for(i = 0, len = keyArr.length; i < len; i += 1){
                      evelStr += '.' + keyArr[i];
                    }
                    evelStr += ';}).call("' + (item[key] || "") + '");';
                    _ret = (0, eval)(evelStr);
                  }else{
                    _ret = item[key] || '';
                  }
              }
  // i == 0 && console.log(key);
              return !!_ret ? _ret : "";
            });
          });
          if (!_self.o.length) {
            _self.addRow();
          }
          return output;
        });
    if (!created) {
      var $btns = $('<div>').addClass('btns clearfix').append(
          '<a method="add">添加</a><a method="up">上移</a>').append(
          '<a method="down">下移</a>').append('<a method="del">删除</a>');
      renderTo.append($table).append($btns);

      $btns.on('click', 'a', function() {
        // console.log(_self);
        var $row = _self.table.find('input[name="row"]:checked').parents(
            '.table tr');
        var index = $row.index();
        switch ($(this).attr('method')) {
          case 'add' :
            // 添加
            _self.addRow();
            break;
          case 'up' :
            // 上移
            if ($row.length !== 1)
              return false;
            _self.upRow(index);
            break;
          case 'down' :
            // 下移
            if ($row.length !== 1)
              return false;
            _self.downRow(index);
            break;
          case 'del' :
            // 删除
            if ($row.length !== 1)
              return false;
            _self.delRow(index);

            break;
          default :
            return;
        }
      });
    }
    return $table;
  };

  exports.List = List;
})(window);

/**
 * 输入框水印提示 jQuery EnPlaceholder plug version 1.0 2014.07.01 by Frans.Lee
 * <dmon@foxmail.com> http://www.ifrans.cn
 */
(function ($) {
    $.fn.extend({
        "iePlaceholder":function (options) {
            options = $.extend({
                placeholderColor:'#999',
                isUseSpan:true,
                onInput:true
            }, options);
			
            $(this).each(function () {
                var _this = this;
                var supportPlaceholder = 'placeholder' in document.createElement('input');
                if (!supportPlaceholder) {
                    var defaultValue = $(_this).attr('placeholder');
                    var defaultColor = $(_this).css('color');
                    if (options.isUseSpan == false) {
                        $(_this).focus(function () {
                            var pattern = new RegExp("^" + defaultValue + "$|^$");
                            pattern.test($(_this).val()) && $(_this).val('').css('color', defaultColor);
                        }).blur(function () {
                                if ($(_this).val() == defaultValue) {
                                    $(_this).css('color', defaultColor);
                                } else if ($(_this).val().length == 0) {
                                    $(_this).val(defaultValue).css('color', options.placeholderColor)
                                }
                            }).trigger('blur');
                    } else {
                        var $imitate = $('<span class="wrap-placeholder" style="position:absolute; display:inline-block; overflow:hidden; color:'+options.placeholderColor+'; width:'+$(_this).width()+'px; height:'+$(_this).height()+'px;">' + (defaultValue==undefined?"":defaultValue) + '</span>');

                        $imitate.css({
                            'margin-left':$(_this).css('margin-left'),
                            'margin-top':$(_this).css('margin-top'),
							'text-align':'left',
                            'font-size':$(_this).css('font-size'),
                            'font-family':$(_this).css('font-family'),
                            'font-weight':$(_this).css('font-weight'),
                            'padding-left':parseInt($(_this).css('padding-left')) + 2 + 'px',
                            'line-height':_this.nodeName.toLowerCase() == 'textarea' ? $(_this).css('line-weight') : $(_this).outerHeight() + 'px',
                            'padding-top':_this.nodeName.toLowerCase() == 'textarea' ? parseInt($(_this).css('padding-top')) + 2 : 0
                        });
                        $(_this).before($imitate.click(function () {
                            $(_this).trigger('focus');
                        }));

                        $(_this).val().length != 0 && $imitate.hide();

                        if (options.onInput) {
                            var inputChangeEvent = typeof(_this.oninput) == 'object' ? 'input' : 'propertychange';
                            $(_this).bind(inputChangeEvent, function () {
                                $imitate[0].style.display = $(_this).val().length != 0 ? 'none' : 'inline-block';
                            });
                        } else {
                            $(_this).focus(function () {
                                $imitate.hide();
                            }).blur(function () {
                                    /^$/.test($(_this).val()) && $imitate.show();
                                });
                        }
                    }
                }
            });
            return this;
        }
    });
})(jQuery);

/* 调用方式： textarea需要田间onInput=false属性 */
$('input[placeholder], textarea[placeholder]').each(function(){$(this).is('input')?$(this).iePlaceholder():$(this).iePlaceholder({onInput: false});});



/**
 * 
 */

$.fn.slider = function(){
  var self = this;
  var $list = this.children();
  var totalLength = $list.length;
  var offset = 0;
  var hovered = false;
  
  this.css({
    width: 10 * 91 + (10 - 1) * 10
  }).on('mouseenter', function(){
    hovered = true;
    // 停止动画，并且设置为末状态
    $list.stop(true, true);
    clearTimeout(loop);
  }).on('mouseleave', function(){
    hovered = false;
    loop = setTimeout(_animate, 3000);
  });
  
  $list.each(function(idx){
    $(this).css({
      position: 'absolute',
      left: offset
    });
    
    offset += 100;
  });
  
  var duration = 5000;
  var loop = setTimeout(_animate, duration);
  
  function _animate(){
    var remate = totalLength;
    $list.animate({
      left: '-=100'
    }, 250, function(){
      remate--;
      if(remate !== 0)
        return;
      
      var $first = self.children(':first');
      $first.detach();
      $first.css('left', (totalLength - 1) * 100);
      self.append($first);
      
      if(hovered)
        return;
      loop = setTimeout(_animate, duration);
    });
  }
  
  return this;
};


$(function(){
  var $links = $('footer .links');
  if($links.children().length > 10){
    $links.slider();
  }
  
  $links.on('click', '.link', function(){
    var link = $(this).data('link');
    if($(this).hasClass('website') || $(this).hasClass('weibo')){
      // 跳转类型的链接
      window.open(link);
      return;
    }
  }).on('mouseenter', '.link.weixin', function(){
    clearTimeout(timer);
    var winxinPopup = popup.bind(this);
    winxinPopup();
  }).on('mouseleave', '.link.weixin', function(e){
    if($.contains($('#popup-weixin')[0], e.relatedTarget)){
      clearTimeout(timer);
      return false;
    }
    closePopup();
  });
  
  function popup(){
    var tmpl = '' +
    '<div id="popup-weixin" class="popup">\n' +
    '  <span class="caret"></span>\n' +
    '  <div class="popup-container"></div>\n' +
    '</div>' +
    '';
    
    var $popup = $('#popup-weixin');
    
    if(!$popup.length){
      $popup = $(tmpl).appendTo($('body'));
      $popup.on('mouseleave', function(e){
        if($.contains(self, e.relatedTarget)){
          clearTimeout(timer);
          return false;
        }
        closePopup();
      }).on('mouseenter', function(){
        clearTimeout(timer);
      });
    }
    
    var self = this;
    var $img = $('<img>').attr('src', $(this).data('link'));
    
    $img.on('load', function(){
      setPopupPos();
      $popup.show();
    });
    
    $popup.children('.popup-container').html($img);
    
    function setPopupPos(){
      var left = $(self).offset().left - ($popup.outerWidth() - $(self).outerWidth()) / 2;
      var top = $(self).offset().top - $popup.outerHeight() - 10;
      $popup.css({
        left: left,
        top: top
      });
    }
  }
  
  var timer;
  function closePopup(){
    var $popup = $('#popup-weixin');
    
    if(!$popup.length){
      return;
    }
    
    timer = setTimeout(function(){
      $popup.hide();
    }, 100);
  }
  
});
