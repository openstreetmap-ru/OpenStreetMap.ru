search = {last:{}};

$(function() {
  search.content=$('#leftpantab #leftsearch .leftcontent')[0];
  osm.sManager.on(['q','qmap'], search.startSearch);
});

search.enable = function(){
  console.debug(new Date().getTime() + ' search.enable');
  osm.map.addLayer(osm.layers.search_marker);
  if (!osm.p.anchor.q && search.last.q) {
    osm.sManager.setP([
      {type:'anchor', k:'q', v:search.last.q},
      {type:'anchor', k:'qmap', v:search.last.map}
    ]);
  }
};
search.disable = function(){
  console.debug(new Date().getTime() + ' search.disable');
  osm.map.removeLayer(osm.layers.search_marker);
  osm.sManager.setP([
    {type:'anchor', k:'q', del:1},
    {type:'anchor', k:'qmap', del:1}
  ]);
};


search.processResults = function(results) {
  try {
    $("#leftsearch .loader").removeClass('on');
    if (results.error) {
      search.content.innerHTML='Произошла ошибка: ' + (results.error);
    } else if (results.find==0) {
      search.q=results.search;
      search.content.innerHTML='<p>Ничего не найдено по запросу "' + (results.search)  + '"</p><br /><br />\
          <p>Оставьте заявку об отсутствующем у нас адресе или неправильной работе поиска<br><br>\
          Комментарий (запрос указывать не надо):\
          </p>\
          <form onsubmit="return search.reportError();">\
          <p><textarea id="rsearch" style="width: 95%;"></textarea></p>\
          <p style="text-align: center;"><input type="submit" style=""></p>\
          </form>';
    }
    else if (results.find==1 && results.accuracy_find==0) {
      search.content.innerHTML='Пожалуйста, уточните запрос "' + (results.search) + '"';
    }
    else {
      var content = $('<ul id="ol-search_result">')
      osm.layers.search_marker.clearLayers();
      var matches=results.matches;
      for (var i in matches) {
        var zoom = (matches[i].this_poi?16:matches[i].addr_type_id/5*2+4).toFixed(0);
        var marker = new L.Marker(new L.LatLng(matches[i].lat, matches[i].lon), {icon: new search.Icon()});
        if (matches[i].this_poi) {
          osm.poi.createPopup(matches[i].id, marker);
        }
        else {
          marker.bindPopup("<b>Адрес:</b><br /> " + matches[i].display_name);
        }
        var a = $('<a href="">');
        a.attr('search_id',matches[i].id);
        a.text(matches[i].display_name);
        a.bind("click", {
            center: new L.LatLng(matches[i].lat, matches[i].lon),
            zoom: zoom,
            marker: marker
            }, function (e){
          osm.map.setView(e.data.center, e.data.zoom);
          e.data.marker.openPopup();
          return false;
        });
        content.append(
          $('<li>').append(a)
        );
        osm.layers.search_marker.addLayer(marker);
      }
      $(search.content).empty().append(content);
      $('#ol-search_result a', search.content).eq(0).click();
    }
  } catch(e) {
    search.content.innerHTML = 'Ошибка: ' + e.description + '<br /> Ответ поиск.серв.: '+results.error;
  }
};

search.reportError = function() {
  comment=$_('rsearch').value;
  $.get("/api/search_report_add", {search: search.q, comment: comment.replace("\n", " ")} );
  search.content.innerHTML='Спасибо за помощь в улучшении OpenStreetMap';
  return false;
}

search.errorHandler = function(jqXHR, textStatus, errorThrown) {
  $("#leftsearch .loader").removeClass('on');
  search.content.innerHTML = 'Ошибка: ' + textStatus + '<br />' + errorThrown.message;
};

search.search = function(inQuery) {
  console.debug(new Date().getTime() + ' search.search');
  inQuery = inQuery || $('#qsearch').val();
  $('#qsearch').val(inQuery);
  if (inQuery.length < 1)
    return false;
    
  if (search.parserUrlIn(inQuery)) {
    $('#qsearch').val('');
    return false;
  }
    
  search.last = {
    q: inQuery,
    pos: osm.permalink.p.center,
    zoom: osm.permalink.p.zoom,
    map: osm.permalink.p.map
  };
  osm.sManager.setP([
    {type:'anchor', k:'q', v:search.last.q},
    {type:'anchor', k:'qmap', v:search.last.map}
  ]);
  
  // search.startSearch();
  return false;
};

search.startSearch = function() {
  console.debug(new Date().getTime() + ' search.startSearch');
  var q = osm.sManager.decodeURI(osm.p.anchor.q || osm.p.get.q);
  $('#qsearch').val(q);
  if (osm.p.anchor.qmap)
    var center = osm.permalink.parseHash(osm.p.anchor.qmap).center;
  else if (osm.p.get.qmap)
    var center = osm.permalink.parseHash(osm.p.get.qmap).center;
  else
    var center = osm.map.getCenter();
  
  $("#leftsearch .loader").addClass('on');
  osm.leftpan.toggleItem('leftsearch', true);
  $.getJSON('/api/search', {q:q, lat:center.lat, lon:center.lng, accuracy:1}, search.processResults)
    .error(search.errorHandler);
};

search.parserUrlIn = function(inQuery) {
  inQuery = $.trim(inQuery);
  var res;
  if (res = inQuery.match(/map=(\d+)[/]([\d.]+)[/]([\d.]+)/i)) { //openstreetmap.org
    osm.map.setView(new L.LatLng(res[2], res[3]), res[1]);
    return true;
  }
  else if (res = inQuery.match(/yandex.+ll=([\d.]+)(%2C|,)+([\d.]+).+z=(\d+)/i)) { //yandex
    osm.map.setView(new L.LatLng(res[3], res[1]), res[4]);
    return true;
  }
  else if (res = inQuery.match(/google.+ll=([\d.]+)(%2C|,)+([\d.]+).+z=(\d+)/i)) { //google
    osm.map.setView(new L.LatLng(res[1], res[3]), res[4]);
    return true;
  }
}

search.inLoad = function() {
  var query = osm.p.get.q || '';
  if (query != '')
    search.search(query);
};

search.Icon =  L.Icon.extend({
  options: {
    iconUrl: 'img/marker-addr.png',
    iconSize: new L.Point(32, 37),
    shadowSize: new L.Point(0, 0),
    iconAnchor: new L.Point(16, 35),
    popupAnchor: new L.Point(0, -11)
  }
});

