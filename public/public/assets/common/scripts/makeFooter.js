
(function(window){
	var grid = {
		/*
		 * 产生表格分页栏
		 * para = {pagecount : 3, curpage : 1}
		 */
		gridfoot : function(para){
			var i;
		    var pageBarStr = '<div>';
		    if(para.pagecount < 8){
		        for(i = 1; i <= para.pagecount; i++){
		        	if(i == para.curpage){
		        		pageBarStr += '<strong>' + i + '</strong>';
		        	}else{
		        		pageBarStr += '<a href="javascript:;" onclick="getPage(this.innerHTML)">'
				            + i
				            +'</a>';
		        	}
		        }
		    }else if(para.pagecount == 8){
		        if(para.curpage < 5){
		            for(i = 1; i < 7; i++){
		            	if(i == para.curpage){
			        		pageBarStr += '<strong>' + i + '</strong>';
		            	}else{
		            		pageBarStr += '<a href="javascript:;" onclick="getPage(this.innerHTML)">'
			                    + i
			                    +'</a>';
		            	}
		            }
		            pageBarStr += '...<a href="javascript:;" onclick="getPage(this.innerHTML)">8</a>';
		        }else{
		            pageBarStr += '<a href="javascript:;" onclick="getPage(this.innerHTML)">1</a>...';
		            for(i = 3; i <= 8; i++){
		            	if(i == para.curpage){
			        		pageBarStr += '<strong>' + i + '</strong>';
			        	}else{
			                pageBarStr += '<a href="javascript:;" onclick="getPage(this.innerHTML)">'
			                    + i
			                    +'</a>';
			        	}
		            }
		        }
		    }else{ //pagecount > 8
		        if(para.curpage < 5){
		            for(i = 1; i < 7; i++){
		            	if(i == para.curpage){
			        		pageBarStr += '<strong>' + i + '</strong>';
			        	}else{
			                pageBarStr += '<a href="javascript:;" onclick="getPage(this.innerHTML)">'
			                    + i
			                    +'</a>';
			        	}
		            }
		            pageBarStr += '...<a href="javascript:;" onclick="getPage(this.innerHTML)">'
		                + para.pagecount
		                +'</a>';
		        }else if(para.curpage > para.pagecount - 4){
		            pageBarStr += '<a href="javascript:;" onclick="getPage(this.innerHTML)">1</a>...';
		            for(i = para.pagecount - 5; i <= para.pagecount; i++){
		            	if(i == para.curpage){
			        		pageBarStr += '<strong>' + i + '</strong>';
			        	}else{
			                pageBarStr += '<a href="javascript:;" onclick="getPage(this.innerHTML)">'
				                + i
				                +'</a>';
			        	}
		            }
		        }else{
		            pageBarStr += '<a href="javascript:;" onclick="getPage(this.innerHTML)">1</a>...';
		            for(i = para.curpage - 2; i < para.curpage + 3; i++){
		            	if(i == para.curpage){
			        		pageBarStr += '<strong>' + i + '</strong>';
			        	}else{
			                pageBarStr += '<a href="javascript:;" onclick="getPage(this.innerHTML)">'
				                + i
				                +'</a>';
			        	}
		            }
		            pageBarStr += '...<a href="javascript:;" onclick="getPage(this.innerHTML)">'
			            + para.pagecount
			            +'</a>';
		        }
		    }
		    pageBarStr += '</div>';
		    return pageBarStr;
		},
		/*
		 * 产生表格分页栏2， 可传递点击分页时触发的函数名，参数仍是当前页的id
		 * para = {pagecount : 3, curpage : 1, clickAction : "myfunction"}
		 */
		gridfoot2 : function(para){
			var i;
		    var pageBarStr = '<div>';
		    if(para.pagecount < 8){
		        for(i = 1; i <= para.pagecount; i++){
		        	if(i == para.curpage){
//		        		pageBarStr += '<strong>' + lang["prev-page"] + '</strong>';
		        		pageBarStr += '<strong>' + i + '</strong>';
//		        		pageBarStr += '<strong>' + lang["next-page"] + '</strong>';
		        	}else{
//		        		pageBarStr += '<a href="javascript:;" onclick="'
//		        			+ para.clickAction
//		        			+'('+i-1+')">'
//				            + lang["prev-page"]
//				            +'</a>';
		        		pageBarStr += '<a href="javascript:;" onclick="'
		        			+ para.clickAction
		        			+'(this.innerHTML)">'
				            + i
				            +'</a>';
//		        		pageBarStr += '<a href="javascript:;" onclick="'
//		        			+ para.clickAction
//		        			+'('+i+1+')">'
//				            + lang["next-page"]
//				            +'</a>';
		        	}
		        }
		    }else if(para.pagecount == 8){
		        if(para.curpage < 5){
		            for(i = 1; i < 7; i++){
		            	if(i == para.curpage){
			        		pageBarStr += '<strong>' + i + '</strong>';
		            	}else{
		            		pageBarStr += '<a href="javascript:;" onclick="'
		            			+ para.clickAction
		            			+'(this.innerHTML)">'
			                    + i
			                    +'</a>';
		            	}
		            }
		            pageBarStr += '...<a href="javascript:;" onclick="'
		            	+ para.clickAction
		            	+'(this.innerHTML)">8</a>';
		        }else{
		            pageBarStr += '<a href="javascript:;" onclick="'
		            	+ para.clickAction
		            	+'(this.innerHTML)">1</a>...';
		            for(i = 3; i <= 8; i++){
		            	if(i == para.curpage){
			        		pageBarStr += '<strong>' + i + '</strong>';
			        	}else{
			                pageBarStr += '<a href="javascript:;" onclick="'
			                	+ para.clickAction
			                	+'(this.innerHTML)">'
			                    + i
			                    +'</a>';
			        	}
		            }
		        }
		    }else{ //pagecount > 8
		        if(para.curpage < 5){
		            for(i = 1; i < 7; i++){
		            	if(i == para.curpage){
			        		pageBarStr += '<strong>' + i + '</strong>';
			        	}else{
			                pageBarStr += '<a href="javascript:;" onclick="'
			                	+ para.clickAction
			                	+'(this.innerHTML)">'
			                    + i
			                    +'</a>';
			        	}
		            }
		            pageBarStr += '...<a href="javascript:;" onclick="'
		            	+ para.clickAction
		            	+'(this.innerHTML)">'
		                + para.pagecount
		                +'</a>';
		        }else if(para.curpage > para.pagecount - 4){
		            pageBarStr += '<a href="javascript:;" onclick="'
		            	+ para.clickAction
		            	+'(this.innerHTML)">1</a>...';
		            for(i = para.pagecount - 5; i <= para.pagecount; i++){
		            	if(i == para.curpage){
			        		pageBarStr += '<strong>' + i + '</strong>';
			        	}else{
			                pageBarStr += '<a href="javascript:;" onclick="'
			                	+ para.clickAction
			                	+'(this.innerHTML)">'
				                + i
				                +'</a>';
			        	}
		            }
		        }else{
		            pageBarStr += '<a href="javascript:;" onclick="'
		            	+ para.clickAction
		            	+'(this.innerHTML)">1</a>...';
		            for(i = para.curpage - 2; i < para.curpage + 3; i++){
		            	if(i == para.curpage){
			        		pageBarStr += '<strong>' + i + '</strong>';
			        	}else{
			                pageBarStr += '<a href="javascript:;" onclick="'
			                	+ para.clickAction
			                	+'(this.innerHTML)">'
				                + i
				                +'</a>';
			        	}
		            }
		            pageBarStr += '...<a href="javascript:;" onclick="'
		            	+ para.clickAction
		            	+'(this.innerHTML)">'
			            + para.pagecount
			            +'</a>';
		        }
		    }
		    pageBarStr += '</div>';
		    return pageBarStr;
		},
		trim : function(src){
			var pattern = /^\s+|\s+$/g; 
			var res = src.replace(pattern, "");
			return res;
		}
	};
	window.grid = grid;
})(window);
