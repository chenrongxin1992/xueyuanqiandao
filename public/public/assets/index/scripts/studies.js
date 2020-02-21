

$(function(){
  (function(){
    var $wrap = $('#studies-table');
    if(!$wrap.length)
      return false;
    
    var hrefTextPrefix = 'page-'
      , curpage = _getCurPage(hrefTextPrefix)
      , pagesize = 15
      , $pagination
      , numArr = lang.S_Sequence_String.split(' ');
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
      $.get(BASEURL+'/other/getIndexResDirList', {
        curpage: _page,
        pagesize: pagesize,
        plt: PLATFORM
      }, function(data){
//        var headers = [{
//          key: 'num',
//          name: lang["number"],
//          klass: 'center',
//          style: {
//            width: 50
//          }
//        }, {
//          key: 'name',
//          name: lang["name"],
//          klass: '',
//          style: {
//            width: 230
//          }
//        }, {
//          key: 'content',
//          name: lang["study-content"],
//          klass: '',
//          style: {
//            
//          }
//        }];
        renderList($wrap, data.tbody);
        
//        var $tabs
//          , $count;
//        if(!($tabs = $('.tabs', $wrap)).length){
//          $tabs = $('<div>').addClass('tabs clearfix').prependTo($wrap);
//        }
//        if(!($count = $('.count', $tabs)).length){
//          $count = $('<p>').addClass('count').appendTo($tabs);
//        }
//        
//        $count.html(lang.M_A_Total_of_$Num_Results.replace('$num', data.pageArgument.total));
        
        $pagination.pagination('updateItems', data.pageArgument.total);
        
      }, 'json');
    };
    
    function renderList($wrapper, list){
      var $list
        , created;
      created = ($list = $('.article-list', $wrapper)).length;
      if(!created){
        $list = $('<ul>').addClass('article-list');
      }
      $list.html(function(){
        var output = '';
        $.each(list, function(i, item){
          // <p class=details>' + lang.M_Direction_Sequence.replace('$Sequence', numArr[i]) + item.name + '
          output += '<li><p class=details>'
                  + item.researcharea;
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
  
  function _getCurPage(){
    // no wonder
//    return $.history.query('page') || 1;
    return 1;
  }
});