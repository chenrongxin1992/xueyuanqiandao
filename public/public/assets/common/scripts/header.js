$(function(){
  $(document).on('hover', '#navigator .main .main-item', function(){
    //$('.hover').removeClass('hover').prev('.main-item.prev').removeClass('prev');
    $(this).addClass('hover').prev('.main-item').addClass('prev');
  }).on('mouseleave', '#navigator .main .main-item', function(){
    $(this).removeClass('hover').prev('.main-item.prev').removeClass('prev');
  }).on('click', '#search a', function(){
    return searchByWord($('#search input').val());
  }).on('keydown', '#search input', function(e){
    if(e.which === 13){
      // 回车搜索
      return searchByWord($(this).val());
    }
  });
  
  $("#navigator .extend a").click(function(e){
    console.log(e.target);
    e.stopPropagation();   //表示阻止向父元素冒泡
    e.preventDefault();     //阻止 方法阻止元素发生默认的行为（例如，当点击提交按钮时阻止对表单的提交或者a标签）。
    if($("#navigator .main").hasClass("folded")) {
      $("#navigator .main").removeClass("folded").addClass("unfolded");
    }else {
      $("#navigator .main").removeClass("unfolded").addClass("folded");
    }
  });

  function searchByWord(keyword){
    window.location.href = '/search?q=' + keyword;
  }
  
  $('#language input').each(function(){
    this.onclick = function(){
      setLocaleLanguage(this.value);
    };
  });
  
  function setLocaleLanguage(lang){
    $.get(BASEURL + '/setLanguage', {
      language: $.inArray(lang, ['zh', 'en'])
    }, function(data){
      if(data.success){
        return window.location.reload();
      }
    }, 'json');
  }
});