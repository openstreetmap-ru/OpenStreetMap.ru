/* Did You Know */
osm.dyk={};

osm.dyk.loadval = function(){
  var val = {};
  var valcook = osm.p.cookie.dyk_val;
  if (valcook) {
    group = valcook.split(',');
    for (var i=0;i<group.length;i++){
      item=group[i].split('-');
      val[item[0]]=+item[1];
    }
  }
  return val;
};

osm.dyk.saveval = function(val, id){
  var d = new Date();
  d.setYear(d.getFullYear()+10);
  if (val[id]>=5) {
    var ex = osm.p.cookie.dyk_ex;
    if (ex)
      ex = ex + ',' + id;
    else
      ex = '' + id;
    osm.sManager.setP('dyk_ex', ex, 'cookie');
    delete val[id];
  }

  var valcook='';
  for (var key in val){
    valcook=valcook+key+'-'+val[key]+',';
  }
  valcook=valcook.substr(0,valcook.length-1);

  osm.sManager.setP('dyk_val', valcook, 'cookie');
};

osm.dyk.updateval = function(id, addnum) {
  var val = osm.dyk.loadval();
  val[id] = +val[id] || 0;
  val[id] += addnum;
  osm.dyk.saveval(val, id);
}

osm.dyk.load = function(){
  var ex = osm.p.cookie.dyk_ex || '';

  $.getJSON('/api/didyouknow', {ex:ex}, function(results){
    if (results.data) {
      $('#leftpantab #DidYouKnow .close').bind('click', function(){
        $('#leftpantab #DidYouKnow').hide();
        osm.leftpan.refsizetab();
        id=+$('#leftpantab #DidYouKnow p a')[0].hash.substr(3);
        osm.dyk.updateval(id,2);
      })
      $('#leftpantab #DidYouKnow p')[0].innerHTML=results.data.head+' <a href="/about/dyk#id'+results.data.id+'">Подробнее...</a>';
      $('#leftpantab #DidYouKnow p a').bind('click', function(){
        osm.dyk.updateval(+this.hash.substr(3),7);
      })
      $('#leftpantab #DidYouKnow').show('normal').delay(800, osm.leftpan.refsizetab);
      osm.dyk.updateval(results.data.id,1);
    }
  });
};