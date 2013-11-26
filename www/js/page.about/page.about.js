about={};

$(function(){  //init
  if (srv.url[1])
    about.toggle('osm-'+srv.url[1]);
  else
    about.toggle('osm-ru');
  
  $('#page-about .content .head-link a').bind('click', function(){
    if ($('.text:visible',this.parentNode.parentNode).length==0) {
      $('#page-about .content .section-link .text').hide('fast');
      $(this.parentNode.nextSibling).show('normal');
      osm.dyk.updateval(+this.name.substr(2),7);
    }
  })

  $('#dyk-tools #dyk-know').bind('click', function(){
    link = $('#osm-dyk .section-link .head-link a');
    ex = [];
    for (var i=0;i<link.length;i++){
      ex.push(link[i].name.substr(2));
    }
    d = new Date();
    d.setYear(d.getFullYear()+10);
    osm.sManager.setP('dyk_ex', ex.join(','), 'cookie');
    osm.sManager.setP('dyk_val', '', 'cookie');
  });

  $('#dyk-tools #dyk-forget').bind('click', function(){
    osm.sManager.setP('dyk_ex', '', 'cookie');
    osm.sManager.setP('dyk_val', '', 'cookie');
  });

  if (document.location.hash.substr(1,2)=='id') {
    about.toggle('osm-dyk');
    $('html, body').stop().animate({scrollLeft: 0, scrollTop:$(document.location.hash).offset().top}, 1000);
    $(document.location.hash+' .head-link a').click();
  }
});

about.toggle = function(id){
  $('#page-about #center .content').removeClass('on');
  $('#page-about .menu-img').removeClass('on');
  $('#page-about #menu ul li').removeClass('active');

  $('#page-about #'+id).addClass('on');
  $('#page-about #img-'+id).addClass('on');
  $('#page-about #menu-'+id).addClass('active');
};