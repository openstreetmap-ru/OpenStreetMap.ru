$(function() {
  search.content=$('#leftpantab #leftsearch .leftcontent')[0];
});

search.enable = function(){
  osm.map.addLayer(osm.layers.search_marker);
};
search.disable = function(){
  osm.map.removeLayer(osm.layers.search_marker);
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
  inQuery = inQuery || osm.input.value;
  osm.input.value = inQuery;
  if (inQuery.length < 1)
    return false;
    
  if (search.parserUrlIn(inQuery)) {
    osm.input.value = '';
    return false;
  }
    
  $("#leftsearch .loader").addClass('on');
  mapCenter=osm.map.getCenter();
  osm.leftpan.toggleItem('leftsearch', true);
  $.getJSON('/api/search', {q: inQuery, accuracy: 1, lat: mapCenter.lat, lon: mapCenter.lng}, search.processResults)
  .error(search.errorHandler);
  return false;
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
  var query = get['q'] || '';
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

