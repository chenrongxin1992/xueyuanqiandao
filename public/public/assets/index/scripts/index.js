$(function() {
  console.log(BASEURL);
  (function() {
    if (!$('#lab_map').length || !BMap)
      return false;
    // 百度地图API功能
    var map = new BMap.Map('lab_map');
    var poi = new BMap.Point(113.943044, 22.541309);
    map.centerAndZoom(poi, 16);
    map.enableScrollWheelZoom();

    var marker = new BMap.Marker(poi); // 创建marker对象
    map.addOverlay(marker); // 在地图中添加marker
  })();

  (function() {
    var $banner = $('#banner_slides');
    $banner.children().length > 1 && $banner.slidesjs({
      width : 1100,
      height : 375,
      effect : {
        fade : {
          speed : 400
        }
      },
      play: {
        active: false,
        effect: "slide",
        interval: 5000,
        auto: true,
        swap: true,
        pauseOnHover: false,
        restartDelay: 100
      },
      callback: {
        complete: function(number){
          this.play();
        }
      }
    });
    
    var $cover = $('#cover_slides');
    $cover.children().length > 1 && $('#cover_slides').slidesjs({
      width : 795,
      height : 305,
      navigation: {
        active: false
      },
      effect : {
        fade : {
          speed : 400
        }
      },
      play: {
        active: false,
        effect: "slide",
        interval: 5000,
        auto: true,
        swap: true,
        pauseOnHover: false,
        restartDelay: 100
      },
      callback: {
        complete: function(number){
          this.play();
        }
      }
    });
    
    var achievelist = $('.achievements');
    achievelist.children().length > 1 && achievelist.slidesjs({
      width : 792,
      height : 180,
      navigation: {
        wrapper: $('.achievements-list .h .o')
      },
      pagination: {
        wrapper: $('.achievements-list .h .o')
      },
      effect : {
        fade : {
          speed : 400
        }
      },
      play: {
        active: false,
        effect: "slide",
        interval: 5000,
        auto: true,
        swap: true,
        pauseOnHover: true,
        restartDelay: 5000
      },
      callback: {
        complete: function(number){
          this.play();
        }
      }
    });
  })();
  
  (function(){
    var $wrap = $('#exchanges_list');
    if(!$wrap.length)
      return false;
    
    var hrefTextPrefix = 'page-'
      , typeMap = {
          exchanges: '学术会议',
          come_to_visit: '学者来访',
          visiting: '学者出访',
          cooperation: '国际合作'
        }
      , type = typeMap[$('#left_nav .nav-list li.on').attr('nav_name')]
      , curpage = _getCurPage(hrefTextPrefix)
      , pagesize = 15
      , $pagination;
    if(!($pagination = $('.pagination', $wrap)).length){
      $pagination = $('<div>').addClass('pagination').pagination({
        items: 1,
        itemsOnPage: pagesize,
        hrefTextPrefix: '#' + hrefTextPrefix,
        cssStyle: 'sky-theme',
        prevText: lang['pagination-prev'],
        nextText: lang['pagination-next'],
        selectOnClick: true,
        onPageClick: function(page){
          return getList(page);
        }
      });
    }
    
    // 加载默认页
    $pagination.pagination('selectPage', curpage);
    
    // 列表数据加载函数
    function getList(_page){
      $.get(BASEURL+'/other/getIndexComList', {
        curpage: _page,
        pagesize: pagesize,
        type: type,
        plt: PLATFORM
      }, function(data){
        
        renderList($wrap, data.tbody);
        
        $pagination.pagination('updateItems', data.pageArgument.total);
        
      }, 'json');
    };
    
    function renderList($wrapper, list){
      var $list
        , created;
      created = ($list = $('.data-list', $wrapper)).length;
      if(!created){
        $list = $('<ul>').addClass('data-list');
      }
      $list.html(function(){
        var output = '';
        $.each(list, function(i, item){
          output += '<li><i></i><a href="'+BASEURL+'/exchange_details?id=' + item.id + '" title="'
                  + item.name + '">' + item.name + '</a><span>'
                  + item.time + '</span>';
        });
        if(!list.length){
          output = '<li class=empty>' + lang['no-record'];
        }
        return output;
        
      });
      if(!created){
        $pagination.pagination('disable').hide();
        $wrapper.append($list).append($pagination);
      }
      return $list;
    }
  })();
  
  (function(){
    var $wrap = $('#news_list');
    if(!$wrap.length)
      return false;
    
    var hrefTextPrefix = 'page-'
      , curpage = _getCurPage(hrefTextPrefix)
      , pagesize = 15
      , $pagination;
    if(!($pagination = $('.pagination', $wrap)).length){
      $pagination = $('<div>').addClass('pagination').pagination({
        items: 1,
        itemsOnPage: pagesize,
        hrefTextPrefix: '#' + hrefTextPrefix,
        cssStyle: 'sky-theme',
        prevText: lang['pagination-prev'],
        nextText: lang['pagination-next'],
        selectOnClick: true,
        onPageClick: function(page){
          return getList(page);
        }
      });
    }
    
    // 加载默认页
    $pagination.pagination('selectPage', curpage);
    
    // 列表数据加载函数
    function getList(_page){
      $.get(BASEURL+'/other/getIndexNewsList', {
        curpage: _page,
        pagesize: pagesize,
        plt: PLATFORM
      }, function(data){
        
        renderList($wrap, data.tbody);
        
        $pagination.pagination('updateItems', data.pageArgument.total);
        
      }, 'json');
    };
    
    function renderList($wrapper, list){
      var $list
        , created;
      created = ($list = $('.data-list', $wrapper)).length;
      if(!created){
        $list = $('<ul>').addClass('data-list');
      }
      $list.html(function(){
        var output = '';
        $.each(list, function(i, item){
          output += '<li><i></i><a href="'+BASEURL+'/news_details?id=' + item.id + '" title="'
                  + item.title + '">' + item.title + '</a><span>'
                  + item.time + '</span>';
        });
        if(!list.length){
          output = '<li class=empty>' + lang['no-record'];
        }
        return output;
        
      });
      if(!created){
        $pagination.pagination('disable').hide();
        $wrapper.append($list).append($pagination);
      }
      return $list;
    }
  })();
  
  (function(){
    var $wrap = $('#notice_list');
    if(!$wrap.length)
      return false;
    
    var hrefTextPrefix = 'page-'
      , curpage = _getCurPage(hrefTextPrefix)
      , pagesize = 15
      , $pagination;
    if(!($pagination = $('.pagination', $wrap)).length){
      $pagination = $('<div>').addClass('pagination').pagination({
        items: 1,
        itemsOnPage: pagesize,
        hrefTextPrefix: '#' + hrefTextPrefix,
        cssStyle: 'sky-theme',
        prevText: lang['pagination-prev'],
        nextText: lang['pagination-next'],
        selectOnClick: true,
        onPageClick: function(page){
          return getList(page);
        }
      });
    }
    
    // 加载默认页
    $pagination.pagination('selectPage', curpage);
    
    // 列表数据加载函数
    function getList(_page){
      $.get(BASEURL+'/other/getIndexNoticeList', {
        curpage: _page,
        pagesize: pagesize,
        plt: PLATFORM
      }, function(data){
        
        renderList($wrap, data.tbody);
        
        $pagination.pagination('updateItems', data.pageArgument.total);
        
      }, 'json');
    };
    
    function renderList($wrapper, list){
      var $list
        , created;
      created = ($list = $('.data-list', $wrapper)).length;
      if(!created){
        $list = $('<ul>').addClass('data-list');
      }
      $list.html(function(){
        var output = '';
        $.each(list, function(i, item){
          output += '<li><i></i><a href="'+BASEURL+'/notice_details?id=' + item.id + '" title="'
                  + item.title + '">' + item.title + '</a><span>'
                  + item.time + '</span>';
        });
        if(!list.length){
          output = '<li class=empty>' + lang['no-record'];
        }
        return output;
        
      });
      if(!created){
        $pagination.pagination('disable').hide();
        $wrapper.append($list).append($pagination);
      }
      return $list;
    }
  })();
  
  (function(){
    // TODO
    var $wrap = $('#job_list');
    if(!$wrap.length)
      return false;
    
    var hrefTextPrefix = 'page-'
      , curpage = _getCurPage(hrefTextPrefix)
      , pagesize = 15
      , $pagination
      , typeMapping = {
          job: '教师系列',
          job_researchers: '研究系列',
          job_postdoctoral: '博士后',
          job_graduates: '研究生',
          job_assistant: '行政助理',
        }
      , type = typeMapping[$('#left_nav .nav-list li.on').attr('nav_name')];
    if(!($pagination = $('.pagination', $wrap)).length){
      $pagination = $('<div>').addClass('pagination').pagination({
        items: 1,
        itemsOnPage: pagesize,
        hrefTextPrefix: '#' + hrefTextPrefix,
        cssStyle: 'sky-theme',
        prevText: lang['pagination-prev'],
        nextText: lang['pagination-next'],
        selectOnClick: true,
        onPageClick: function(page){
          return getList(page);
        }
      });
    }
    
    // 加载默认页
    $pagination.pagination('selectPage', curpage);
    
    // 列表数据加载函数
    function getList(_page){
      $.get(BASEURL+'/other/getRecruit', {
        curpage: _page,
        pagesize: pagesize,
        type: type,
        plt: PLATFORM
      }, function(data){
        
        renderList($wrap, data.tbody);
        
        $pagination.pagination('updateItems', data.pageArgument.total);
        
      }, 'json');
    };
    
    function renderList($wrapper, list){
      var $list
        , created;
      created = ($list = $('.data-list', $wrapper)).length;
      if(!created){
        $list = $('<ul>').addClass('data-list');
      }
      $list.html(function(){
        var output = '';
        $.each(list, function(i, item){
          output += '<li class="'+ (Date.parse(new Date(item.time))>Date.parse(new Date(item.youxiaoqi))?"":"out-of-date") + '"><i></i><a href="'+BASEURL+'/job_details?id=' + item.id + '" title="'
                  + item.title + '">' + item.title + '</a><span>'
                  + item.time + '</span></li>';
        });
        if(!list.length){
          output = '<li class=empty>' + lang['no-record'];
        }
        return output;
        
      });
      if(!created){
        $pagination.pagination('disable').hide();
        $wrapper.append($list).append($pagination);
      }
      return $list;
    }
  })();
  
  (function(){
    var $wrap = $('#regulation_list');
    if(!$wrap.length)
      return false;
    
    var hrefTextPrefix = 'page-'
      , curpage = _getCurPage(hrefTextPrefix)
      , pagesize = 15
      , $pagination;
    if(!($pagination = $('.pagination', $wrap)).length){
      $pagination = $('<div>').addClass('pagination').pagination({
        items: 1,
        itemsOnPage: pagesize,
        hrefTextPrefix: '#' + hrefTextPrefix,
        cssStyle: 'sky-theme',
        prevText: lang['pagination-prev'],
        nextText: lang['pagination-next'],
        selectOnClick: true,
        onPageClick: function(page){
          return getList(page);
        }
      });
    }
    
    // 加载默认页
    $pagination.pagination('selectPage', curpage);
    
    // 列表数据加载函数
    function getList(_page){
      $.get(BASEURL+'/other/getIndexRegulationList', {
        curpage: _page,
        pagesize: pagesize,
        plt: PLATFORM
      }, function(data){
        
        renderList($wrap, data.tbody);
        
        $pagination.pagination('updateItems', data.pageArgument.total);
        
      }, 'json');
    };
    
    function renderList($wrapper, list){
      var $list
        , created;
      created = ($list = $('.data-list', $wrapper)).length;
      if(!created){
        $list = $('<ul>').addClass('data-list');
      }
      $list.html(function(){
        var output = '';
        $.each(list, function(i, item){
          output += '<li><i></i><a href="'+BASEURL+'/regulation_details?id=' + item.id + '" title="'
                  + item.title + '">' + item.title + '</a><span>'
                  + item.time + '</span>';
        });
        if(!list.length){
          output = '<li class=empty>' + lang['no-record'];
        }
        return output;
        
      });
      if(!created){
        $pagination.pagination('disable').hide();
        $wrapper.append($list).append($pagination);
      }
      return $list;
    }
  })();
  
  (function(){
    var $wrap = $('#team_list');
    if(!$wrap.length)
      return false;
    
    var hrefTextPrefix = 'page-'
      , curpage = _getCurPage(hrefTextPrefix)
      , pagesize = 14
      , $pagination
      , typeMap = {
          team: "教师系列",
          team_researchers: "研究系列",
          postdoctoral: "博士后",
          phd: "博士生",
          masters: "硕士生",
          scholars: "合作学者",
          assistant: "行政助理",
          graduate: "毕业生"
        };
    if(!($pagination = $('.pagination', $wrap)).length){
      $pagination = $('<div>').addClass('pagination').pagination({
        items: 1,
        itemsOnPage: pagesize,
        hrefTextPrefix: '#' + hrefTextPrefix,
        cssStyle: 'sky-theme',
        prevText: lang['pagination-prev'],
        nextText: lang['pagination-next'],
        selectOnClick: true,
        onPageClick: function(page){
          return getList(page);
        }
      });
    }
    
    // 加载默认页
    $pagination.pagination('selectPage', curpage);
    
    // 列表数据加载函数
    function getList(_page){
      var type = typeMap[$('#left_nav li.on').attr('nav_name')];
      $.get(BASEURL+'/other/getIndexUserList', {
        curpage: _page,
        pagesize: pagesize,
        type: type,
        plt: PLATFORM
      }, function(data){
        
        var ddTmpl = [function(src,alt,title,type){
        					var str = '';
        					if(type === "校友"){
        						return str;
        					}else{
        						str = '<div class=avatar>'+
        							'<img src='+src+' alt='+alt+' title='+title+'>'+
        							'</div>';
        						return str;
        					}
        				}("${photo}","${name}","${name}",type), // 判断是否是校友（校友是没有照片的）
                      '<div class=profile>',
                        '<p class=name><a href="', ("硕士生" === type || "校友" === type) ? 'javascript:;' : BASEURL+'/user_details?id=${id}&type=' + type,
                        '" title="${name}">${name}</a>',
                        '行政助理' === type ? '<p>' + lang["F_Tel"] + '${phone}' :
                        '<p>' + lang["research-direction"] + '${researcharea}',
                        (type === '校友')?(''):('<p>' + lang["F_Email"] + '${email}'),
                        (type === '博士后' || type === '博士生' || type === '硕士生')?"<p>" + lang["Tutor"] + ": ${tutor}</p>":"",
                        (type === '博士后' || type === '博士生' || type === '硕士生')?"<p>" + lang["Entrance"] + ": ${schooltimebegin}</p>":"",
                        (type === '博士后' || type === '博士生' || type === '硕士生')?"<p>" + lang["T_Major"] + ": ${profession}</p>":"",
                        ("校友" === type ? '<p>' + lang["graduation_time"] + '${schooltimebegin}~${schooltimeend}'
                        		+ '<p>' + lang["whereabouts"] + '<a href="${danweilink}">${whereabouts}</a></p>': '')].join('');
        
        renderList($wrap, ddTmpl, data.tbody);
        
        _setGoodLookingImgs($('.avatar img'), [80, 111.3]);
        
        $pagination.pagination('updateItems', data.pageArgument.total);
        
      }, 'json');
    };
    
    /**
     * @param $wrapper
     * @param ddTmpl
     * @param list
     */
    function renderList($wrapper, ddTmpl, list){
      var $list
        , created;
      created = ($list = $('.dlist', $wrapper)).length;
      if(!created){
        $list = $('<dl>').addClass('dlist');
      }
      ddTmpl = '<dd>' + ddTmpl;
      $list.html(function(){
        var output = '';
        $.each(list, function(i, item){
          output += ddTmpl.replace(/\$\{([^\W\}]+)\}/g, function(key){
            key = key.slice(2, -1);
//            i == 0 && console.log(key);
            return key === 'row_index' ? i + 1 : 
              key === 'dd_klass' ? ['even', 'odd'][(i + 1) % 2] :
                item[key] || '';
          });
        });
        if(!list.length){
          output = '<dd class=empty>' + lang['no-record'];
        }
        return output;
        
      });
      if(!created){
        $pagination.pagination('disable').hide();
        $wrapper.append($list).append($pagination);
      }
      return $list;
    }
  })();
  
  /**
   * @deprecated
   */
  (function(){
    return false;
    var $wrap = $('#director_table');
    if(!$wrap.length)
      return false;
    
    var hrefTextPrefix = 'page-'
      , curpage = _getCurPage(hrefTextPrefix)
      , pagesize = 14
      , $pagination;
    if(!($pagination = $('.pagination', $wrap)).length){
      $pagination = $('<div>').addClass('pagination').pagination({
        items: 1,
        itemsOnPage: pagesize,
        hrefTextPrefix: '#' + hrefTextPrefix,
        cssStyle: 'sky-theme',
        prevText: lang['pagination-prev'],
        nextText: lang['pagination-next'],
        selectOnClick: true,
        onPageClick: function(page){
          return getList(page);
        }
      });
    }
    
    // 加载默认页
    $pagination.pagination('selectPage', curpage);
    
    // 列表数据加载函数 --已经废弃
    function getList(_page){
      $.get(BASEURL+'/other/getIndexChiList', {
        curpage: _page,
        pagesize: pagesize,
        plt: PLATFORM
      }, function(data){
        
        var ddTmpl = ['<div class=avatar>',
                        '<img src="'+BASEURL+'${photo}" alt="${name}" title="${name}">',
                      '</div>',
                      '<div class=profile>',
                        '<p class=name><a href="'+BASEURL+'/user_details?id=${id}" title="${name}">${name}</a>',
                        '<p>' + lang['F_Term'] + '${tenure}',
                        '<p>' + lang['F_Intro'] + '${introduction?slice(0, 30)}'].join('');
        
        renderList($wrap, ddTmpl, data.tbody);
        
        _setGoodLookingImgs($('.avatar img'), [80, 80]);
        
        $pagination.pagination('updateItems', data.pageArgument.total);
        
      }, 'json');
    };
    
    /**
     * @param $wrapper
     * @param ddTmpl
     * @param list
     */
    function renderList($wrapper, ddTmpl, list){
      var $list
        , created;
      created = ($list = $('.dlist', $wrapper)).length;
      if(!created){
        $list = $('<dl>').addClass('dlist');
      }
      ddTmpl = '<dd>' + ddTmpl;
      $list.html(function(){
        var output = '';
        $.each(list, function(i, item){
          output += ddTmpl.replace(/\$\{([^\}]+)\}/g, function(key){
            key = key.slice(2, -1);
            var _ret;
            switch(key){
              case 'row_index':
                _ret = i + 1;
                break;
              case 'dd_klass':
                _ret = ['even', 'odd'][(i + 1) % 2];
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
                  console.log(evelStr);
                  _ret = (0, eval)(evelStr);
                }else{
                  _ret = item[key] || '';
                }
            }
//            i == 0 && console.log(key);
            return _ret;
          });
        });
        if(!list.length){
          output = '<dd class=empty>' + lang['no-record'];
        }
        return output;
        
      });
      if(!created){
        $pagination.pagination('disable').hide();
        $wrapper.append($list).append($pagination);
      }
      return $list;
    }
  })();
  
  (function(){
    var $wrap = $('#equipment_table');
    if(!$wrap.length)
      return false;
    
    var hrefTextPrefix = 'page-'
      , curpage = _getCurPage(hrefTextPrefix)
      , pagesize = 15
      , $pagination;
    if(!($pagination = $('.pagination', $wrap)).length){
      $pagination = $('<div>').addClass('pagination').pagination({
        items: 1,
        itemsOnPage: pagesize,
        hrefTextPrefix: '#' + hrefTextPrefix,
        cssStyle: 'sky-theme',
        prevText: lang['pagination-prev'],
        nextText: lang['pagination-next'],
        selectOnClick: true,
        onPageClick: function(page){
          return getList(page);
        }
      });
    }
    
    // 加载默认页
    $pagination.pagination('selectPage', curpage);
    
    // 列表数据加载函数 -- 已经废弃
    function getList(_page){
      $.get(BASEURL+'/other/getIndexEquList', {
        curpage: _page,
        pagesize: pagesize,
        plt: PLATFORM
      }, function(data){
        var headers = [{
          key: 'num',
          name: lang["number"],
          klass: 'center',
          style: {
            width: 50
          }
        }, {
          key: 'name',
          name: lang["name"],
          tdTmpl: '<a href="javascript:;" title="" data-pic="${pic}">${name}</a>',
          style: {
            width: 230
          }
        }, {
          key: 'brand',
          name: lang["T_Brand"]
        }, {
          key: 'number',
          name: lang["T_Serial_NO"]
        }, {
          key: 'model',
          name: lang["T_Model"]
        }, {
          key: 'dutyman',
          name: lang["T_Leader"]
        }, {
          key: 'unit',
          name: lang["T_Department"]
        }];
        renderTable($wrap, headers, data.tbody);
        
        $wrap.find('.table a').tooltip({
          theme: 'sky',
          container: {
            content: function(){
              var pic = $(this).data('pic');
              
              return pic ? '<img src="'+BASEURL + pic + '">' : lang.M_No_Picture;
            }
          }
        });
        
        $pagination.pagination('updateItems', data.pageArgument.total);
        
      }, 'json');
    };
    
    /**
     * @param $wrapper
     * @param fields
     * @param list
     */
    function renderTable($wrapper, fields, list){
      var $table
        , $head
        , rowTmpl
        , tdLen
        , created;
      created = ($table = $('.table', $wrapper)).length;
      if(!created){
        $table = $('<table>').addClass('table');
      }
      $head = $('<tr>');
      rowTmpl = '<tr class="${td_klass}">';
      tdLen = fields.length;
      $.each(fields, function(i, item){
        $('<th>').addClass(item.klass || '').css(item.style || {})
        .text(item.name).appendTo($head);
        rowTmpl += '<td class="' + (item.klass || '') + '">'
                 + (item.tdTmpl ? item.tdTmpl : '${' + item.key
                 + '}');
      });
      $table.html($head.wrap('<thead></thead>').parent()).append(function(){
        var output = '';
        $.each(list, function(i, item){
          output += rowTmpl.replace(/\$\{([^\W\}]+)\}/g, function(key){
            key = key.slice(2, -1);
//            i == 0 && console.log(key);
            return key === 'row_index' ? i + 1 : 
              key === 'td_klass' ? ['even', 'odd'][(i + 1) % 2] :
                item[key] || '';
          });
        });
        if(!list.length){
          output = '<tr><td class=empty colspan=' + tdLen + '>' + lang['no-record'];
        }
        return output;
        
      });
      if(!created){
        $pagination.pagination('disable').hide();
        $wrapper.append($table).append($pagination);
      }
      return $table;
    }
  })();
  
  (function(){
    var $wrap = $('#committee_table');
    if(!$wrap.length)
      return false;
    
    var hrefTextPrefix = 'page-'
      , curpage = _getCurPage(hrefTextPrefix)
      , pagesize = 15
      , $pagination;
    if(!($pagination = $('.pagination', $wrap)).length){
      $pagination = $('<div>').addClass('pagination').pagination({
        items: 1,
        itemsOnPage: pagesize,
        hrefTextPrefix: '#' + hrefTextPrefix,
        cssStyle: 'sky-theme',
        prevText: lang['pagination-prev'],
        nextText: lang['pagination-next'],
        selectOnClick: true,
        onPageClick: function(page){
          return getList(page);
        }
      });
    }
    
    // 加载默认页
    $pagination.pagination('selectPage', curpage);
    
    // 列表数据加载函数
    function getList(_page){
      $.get(BASEURL+'/other/getAcaComList', {
        curpage: _page,
        pagesize: pagesize,
        plt: PLATFORM
      }, function(data){
        var headers = [{
          key: 'num',
          name: lang.number,
          klass: 'center',
          style: {
            width: 50
          }
        }, {
          key: 'name',
          name: lang.T_Name
//          tdTmpl: '<a href="javascript:;" title="" data-pic="${pic}">${name}</a>',
        }, {
          key: 'tenure',
          name: lang.T_Office,
          style: {
            width: 80
          }
        }, {
          key: 'titles',
          name: lang.T_Title,
          style: {
            width: 180
          }
        }, {
          key: 'profession',
          name: lang.T_Major
        }, {
          key: 'workplace',
          name: lang.T_Dept,
          style: {
            width: 200
          }
        }];
        renderTable($wrap, headers, data.tbody);
        
        $pagination.pagination('updateItems', data.pageArgument.total);
        
      }, 'json');
    };
    
    /**
     * @param $wrapper
     * @param fields
     * @param list
     */
    function renderTable($wrapper, fields, list){
      var $table
        , $head
        , rowTmpl
        , tdLen
        , created;
      created = ($table = $('.table', $wrapper)).length;
      if(!created){
        $table = $('<table>').addClass('table');
      }
      $head = $('<tr>');
      rowTmpl = '<tr class="${td_klass}">';
      tdLen = fields.length;
      $.each(fields, function(i, item){
        $('<th>').addClass(item.klass || '').css(item.style || {})
        .text(item.name).appendTo($head);
        rowTmpl += '<td class="' + (item.klass || '') + '">'
                 + (item.tdTmpl ? item.tdTmpl : '${' + item.key
                 + '}');
      });
      $table.html($head.wrap('<thead></thead>').parent()).append(function(){
        var output = '';
        $.each(list, function(i, item){
          output += rowTmpl.replace(/\$\{([^\W\}]+)\}/g, function(key){
            key = key.slice(2, -1);
//            i == 0 && console.log(key);
            return key === 'row_index' ? i + 1 : 
              key === 'td_klass' ? ['even', 'odd'][(i + 1) % 2] :
                item[key] || '';
          });
        });
        if(!list.length){
          output = '<tr><td class=empty colspan=' + tdLen + '>' + lang['no-record'];
        }
        return output;
        
      });
      if(!created){
        $pagination.pagination('disable').hide();
        $wrapper.append($table).append($pagination);
      }
      return $table;
    }
  })();
  
  (function(){
    var $wrap = $('#search_list');
    if(!$wrap.length)
      return false;
    
    var hrefTextPrefix = 'page-'
      , curpage = _getCurPage(hrefTextPrefix)
      , pagesize = 15
      , $pagination
      , q = KEYWORD;
    if(!($pagination = $('.pagination', $wrap)).length){
      $pagination = $('<div>').addClass('pagination').pagination({
        items: 1,
        itemsOnPage: pagesize,
        hrefTextPrefix: '#' + hrefTextPrefix,
        cssStyle: 'sky-theme',
        prevText: lang['pagination-prev'],
        nextText: lang['pagination-next'],
        selectOnClick: true,
        onPageClick: function(page){
          return getList(page);
        }
      });
    }
    
    // 加载默认页
    $pagination.pagination('selectPage', curpage);
    
    // 列表数据加载函数 --废弃
    function getList(_page){
      $.get(BASEURL+'/other/getSearchList', {
        curpage: _page,
        pagesize: pagesize,
        content: q,
        plt: PLATFORM
      }, function(data){
        var headers = [{
          key: 'num',
          name: lang["number"],
          klass: 'center',
          style: {
            width: 50
          }
        }, {
          key: 'title',
          name: lang["title"],
          tdTmpl: '<a href="'+BASEURL+'${url}" title="">${title}</a>'
        }, {
          key: 'time',
          name: lang["T_Time"],
          style: {
            width: 120
          }
        }];
        renderTable($wrap, headers, data.tbody);
        
        $pagination.pagination('updateItems', data.pageArgument.total);
        
      }, 'json');
    };
    
    /**
     * @param $wrapper
     * @param fields
     * @param list
     */
    function renderTable($wrapper, fields, list){
      var $table
        , $head
        , rowTmpl
        , tdLen
        , created;
      created = ($table = $('.table', $wrapper)).length;
      if(!created){
        $table = $('<table>').addClass('table');
      }
      $head = $('<tr>');
      rowTmpl = '<tr class="${td_klass}">';
      tdLen = fields.length;
      $.each(fields, function(i, item){
        $('<th>').addClass(item.klass || '').css(item.style || {})
        .text(item.name).appendTo($head);
        rowTmpl += '<td class="' + (item.klass || '') + '">'
                 + (item.tdTmpl ? item.tdTmpl : '${' + item.key
                 + '}');
      });
      $table.html($head.wrap('<thead></thead>').parent()).append(function(){
        var output = '';
        $.each(list, function(i, item){
          output += rowTmpl.replace(/\$\{([^\W\}]+)\}/g, function(key){
            key = key.slice(2, -1);
//            i == 0 && console.log(key);
            return key === 'row_index' ? i + 1 : 
              key === 'td_klass' ? ['even', 'odd'][(i + 1) % 2] :
                item[key] || '';
          });
        });
        if(!list.length){
          output = '<tr><td class=empty colspan=' + tdLen + '>' + lang['no-record'];
        }
        return output;
        
      });
      if(!created){
        $pagination.pagination('disable').hide();
        $wrapper.append($table).append($pagination);
      }
      return $table;
    }
  })();
  
  _setGoodLookingImgs($('.content-main article .avatar img'), [115, 160]);
  _setGoodLookingImgs($('.achievements img, article .profile .cover img'), [245, 118]);
  
  function _getCurPage(){
    // no wonder
//    return $.history.query('page') || 1;
    return 1;
  }
  
  function _setGoodLookingImgs(jQueryObj, size){
    jQueryObj.on('error', function(){
      console.log($(this).attr('src').split('/').pop());
      $(this).remove();
    }).on('load', _beauti);
    
    _beauti.call(jQueryObj);
    
    function _beauti(){
      
      var img = new Image();
      if ($(this).attr("src") == "undefined"){
        img.src = $(this).attr("src");
      }else {
        img.src = ""
      }
      
      var fixedIndex = img.width / img.height > size[0] / size[1] ? 1 : 0
        , sizeType = ['width', 'height'];
      
      $(this).css(sizeType[fixedIndex], size[fixedIndex]);
      $(this).css(sizeType[fixedIndex^1], 'auto');
    }
  }
  
});
