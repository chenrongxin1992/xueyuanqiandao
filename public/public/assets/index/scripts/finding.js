


$(function(){
  (function(){
    var $root = $('#findings-table');
    if(!$root.length)
      return false;
    
    var typeMap = {
        "journal": "0",
        "conference": "1",
        "thesis": "2",
        "award": "3",
        "patent": "4",
        "monographs": "5"
    };
    
    var $tabs
      , $tab_main
      , $main
      , eventAttached = false;
    
    $.history.listen('tab', function(_tab){
      if(!_tab in typeMap || !{}.hasOwnProperty.call(typeMap, _tab)){
        _tab = "journal";
      }
      $.history.setParam('tab', _tab);
      tabs(_tab);
    });
    
    function tabs(index){
      $tabs = $('#tabs', $root);
      $tab_main = $('.tab-main', $root);
      $main = $tab_main.children('li[index="' + index + '"]').eq(0);
      
      if(!eventAttached){
        eventAttached = true;
        $tabs.on('click', '.tabs-list a', function(){
          if($(this).hasClass('on'))
            return false;
          var _index = $(this).attr('index');
           var $pagination = $tab_main.children('li[index="' + _index + '"]')
                .children('.pagination')
            , _curpage = $pagination.length && $pagination.pagination('getCurrentPage') || 1;
          $.history.setParam('tab', _index);
          $.history.setParam('page', _curpage);
        });
      }
      
      var $count;
      if(!($count = $('.count', $tabs)).length){
        $count = $('<p>').addClass('count').appendTo($tabs);
      }
      
      $tabs.find('a[index="' + index + '"]').addClass('on')
      .parent().siblings().children('a.on').removeClass('on');
      
      if(!$main.length){
        $main = $('<li>').attr('index', index).appendTo($tab_main);
        initTablePage($main, function(){
          $tab_main.children('li.on').removeClass('on');
          $main.addClass('on');
          
//          var $pagination = $tab_main.children('li[index="' + index + '"]')
//                .children('.pagination')
//            , total = $pagination.length && $pagination.pagination('getItems') || 0;
//          
//          $count.html(lang.M_A_Total_of_$Num_Results.replace('$num', total));
        });
      }else{
        $main.addClass('on').siblings('.on').removeClass('on');
        
//         var $pagination = $tab_main.children('li[index="' + index + '"]')
//               .children('.pagination')
//           , total = $pagination.length && $pagination.pagination('getItems') || 0;
//        
//        $count.html(lang.M_A_Total_of_$Num_Results.replace('$num', total));
      }
      
    };
    
    function initTablePage($wrap, callback){
      var hrefTextPrefix = 'page-'
        , curpage = _getCurPage()
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
      $("#finding_year").change(function() {
        getList(1, $("#finding_year").val());
      })
      
      // 加载默认页
      $pagination.pagination('selectPage', curpage);
      
      // 列表数据加载函数
      function getList(_page, year){
        var _type = typeMap[$.history.query('tab')];
        $.get(BASEURL+'/other/getIndexAchList', {
          curpage: _page,
          pagesize: pagesize,
          type: _type,
          year: year?year:0,
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
            key: 'compose',
            name: lang["study-content"],
            tdTmpl: '<a href="'+BASEURL+'/findings_details?id=${id}&type='
                      + _type + '" title="' + lang.M_Click_for_Details + '">${compose}</a>'
                      + '<a class="btn-pdf" target="_blank" href="'+BASEURL+'${pdfurl}"></a>'
          }];
          renderTable($wrap, headers, data.tbody);
          
          $pagination.pagination('updateItems', data.pageArgument.total);
          
          $.isType(callback, 'function') && callback();
          
        }, 'json').error(function(){
          $.openError(lang.E_Unknow_Error, 3000);
        });
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
    }
    
  })();
  
  function _getCurPage(){
    // no wonder
//    return $.history.query('page') || 1;
    return 1;
  }
});