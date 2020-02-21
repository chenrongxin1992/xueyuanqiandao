$(function(){

	  (function(){
	    var $wrap = $('#platform');
	    if(!$wrap.length)
	      return false;
	    getList();
	    // 列表数据加载函数
	    function getList(){
	      $.get(BASEURL + '/other/getPlatformList', function(data){
	    	var ddTmpl = '';
	    	var avatar = 'avatar';
	    	
	        for(var i=0; i<data.tbody.length; i++){
	        	if(i%3==1){
	        		avatar="avatar";
	        	}else{
	        		avatar="avatal";
	        	}
	        	ddTmpl += '<a class="'+ avatar +'" target="_blank" href="'+BASEURL+data.tbody[i].url+'">'
                        +'<img src="'+BASEURL+data.tbody[i].pic+'" title="'+data.tbody[i].name+'">'
//                        +'<h3>'+data.tbody[i].name+'</h3>'
                        +'<p title="'+data.tbody[i].name+'">'+data.tbody[i].name+'</p>'
                        +'</a>';
	        
	        }
	        $wrap.append(ddTmpl);
	      }, 'json');
	    };
	    
	  })();
});