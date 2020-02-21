$(function(){
    $.get('http://116.13.96.53:81/lab', {
      }, function(data){
        
        renderList($wrap, data.tbody);
        
        $pagination.pagination('updateItems', data.pageArgument.total);
        
      }, 'json');
});