
$(function(){
  (function(){
    var $wrap = $('#foundation-table');
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
      $.get(BASEURL+'/other/getIndexOpenFunList', {
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
          key: 'title',
          name: lang["title"],
          tdTmpl: '<a href="'+BASEURL+'/foundation_details?id=${id}" title="' + lang.M_Click_for_Details + '">${title}</a>'
        }, {
          key: 'name',
          name: lang["username"],
          style: {
            width: 70
          }
        }, {
          key: 'unit',
          name: lang["unit"],
          klass: '',
          style: {
            width: 250
          }
        }, {
          key: 'year',
          name: lang["year"],
          klass: '',
          style: {
            width: 60
          }
        }];
        renderTable($wrap, headers, data.tbody);
        
        var $tabs
          , $count;
        if(!($tabs = $('.tabs', $wrap)).length){
          $tabs = $('<div>').addClass('tabs clearfix').prependTo($wrap);
        }
        if(!($count = $('.count', $tabs)).length){
          $count = $('<p>').addClass('count').appendTo($tabs);
        }
        
//        $count.html(lang.M_A_Total_of_$Num_Results.replace('$num', data.pageArgument.total));
        
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
  
  function _getCurPage(){
    // no wonder
//    return $.history.query('page') || 1;
    return 1;
  }
});