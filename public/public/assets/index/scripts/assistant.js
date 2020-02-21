$(function(){
	(function(){
		var $wrap = $('#footer');
		if(!$wrap.length){
			return false;
		}
		      
		
		var curpage = _getCurPage()
		, pagesize=14
		,$pagination;
		
		if(!($pagination = $('.pagination', $wrap)).length){
		      $pagination = $('<div>').addClass('pagination').pagination({
		      items: 1,
		      itemsOnPage: pagesize,
		      cssStyle: 'sky-theme',
		      prevText: lang['pagination-prev'],
		      nextText: lang['pagination-next'],
		      selectOnClick: true,
		      onPageClick: function(page){
		        return getList(page);
		      }
		    }).appendTo($wrap);
	    }
	    
	    $pagination.pagination('selectPage', curpage);
	    
		//组装列表内容
		function getList(_page){
			$.post(BASEURL+"/other/getIndexUserList",{"curpage":curpage,"pagesize":14,"type":"行政助理"},function(data){
				makeList(data.tbody);
	
				$pagination.pagination('updateItems', data.pageArgument.total);
			},'json');	
		};
		
		function makeList(data){
			var html="";
			if(data.length){
				html = '<ul>';
					for(var i=0; i<data.length; i++){
						html += '<li class="oli">'
							 +'<div class="inline"><img src="'+BASEURL+data[i].photo+'"></div>'
							 +'<div class="inline mli"><h5>'+data[i].name+'</h5><p>' + lang["research-direction"] +data[i].researcharea+'</p>'
							 +'<p title="'+data[i].introduce+'">' + lang["remarks"]+data[i].introduce+'</p></div>'
							 +'</li>';
					}
					html += '</ul>';
				$("#tmain").html(html);
			}else{
				html = '<h3 style="text-align: center;color: #878787;">'+ lang["no-record"] +'</h3>';
				$("#tmain").html(html);
				$pagination.pagination('disable').hide();
			}
			return html;
		}
		function _getCurPage(){
		      return /^page-(\d+)/.test(_getHashValue()) ? 
		          RegExp.$1 : 1;
		    }
		    
	    function _getHashValue(){
	      return location.hash.replace(/^#/, '');
	    }
	})();	
});