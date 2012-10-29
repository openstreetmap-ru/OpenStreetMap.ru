search.processResults = function(results) {
  try {
    $("#leftsearchpan .loader").removeClass('on');
    if (results.error) {
      osm.leftpan.content.innerHTML='Произошла ошибка: ' + (results.error);
    } else if (results.find==0) {
      search.q=results.search;
      osm.leftpan.content.innerHTML='<p>Ничего не найдено по запросу "' + (results.search)  + '"</p><br /><br />\
          <p>Оставьте заявку об отсутствующем у нас адресе или неправильной работе поиска<br><br>\
          Комментарий (запрос указывать не надо):\
          </p>\
          <form onsubmit="return search.reportError();">\
          <p><textarea id="rsearch" style="width: 100%;"></textarea></p>\
          <p style="text-align: center;"><input type="submit" style=""></p>\
          </form>';
    }
    else if (results.find==1 && results.accuracy_find==0) {
      osm.leftpan.content.innerHTML='Пожалуйста, уточните запрос "' + (results.search) + '"';
    }
    else {
      var content = '<ul id="ol-search_result">';
      osm.layers.search_marker.clearLayers();
      var matches=results.matches;
      for (var i in matches) {
        zoom = matches[i].this_poi?16:matches[i].addr_type_id*2+4;
        content += ('<li><a href="" onClick="osm.map.setView(new L.LatLng(' + matches[i].lat + ',' + matches[i].lon + '), '+zoom+'); return false;" info="id='+matches[i].id+'  weight='+matches[i].weight+'">' + matches[i].display_name + '</a></li>');
        marker = new L.Marker(new L.LatLng(matches[i].lat, matches[i].lon));
        if (matches[i].this_poi) {
          osm.poi.createPopup(matches[i].id, marker);
        }
        else {
          marker.bindPopup("<b>Адрес:</b><br /> " + matches[i].display_name);
        }
        osm.layers.search_marker.addLayer(marker);
      }
      zoom = matches[0].this_poi?14:matches[0].addr_type_id*2+4
      osm.map.setView(new L.LatLng(matches[0].lat, matches[0].lon), zoom);
      content += '</ul>';
      osm.leftpan.content.innerHTML = content;
    }
  } catch(e) {
    osm.leftpan.content.innerHTML = 'Ошибка: ' + e.description + '<br /> Ответ поиск.серв.: '+results.error;
  }
};

search.reportError = function() {
  comment=$_('rsearch').value;
  $.get("/api/search_report_add", {search: search.q, comment: comment.replace("\n", " ")} );
  osm.leftpan.content.innerHTML='Спасибо за помощь в улучшении OpenStreetMap';
  return false;
}

search.errorHandler = function(jqXHR, textStatus, errorThrown) {
  $("#leftsearchpan .loader").removeClass('on');
  osm.leftpan.content.innerHTML = 'Ошибка: ' + textStatus + '<br />' + errorThrown.message;
};

search.search = function(inQuery) {
  inQuery = inQuery || osm.input.value;
  osm.input.value = inQuery;
  if (inQuery.length < 1)
    return false;
  $("#leftsearchpan .loader").addClass('on');
  mapCenter=osm.map.getCenter();
  osm.leftpan.toggle(1);
  $.getJSON('/api/search', {q: inQuery, accuracy: 1, lat: mapCenter.lat, lon: mapCenter.lng}, search.processResults)
  .error(search.errorHandler);
/*  this.request = new XMLHttpRequest();
  //this.request.open('GET', 'http://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(osm.input.value) + '&format=json');
  this.request.open('GET', '/api/search?q=' + encodeURIComponent(inQuery) + '&accuracy=1' + '&lat=' + mapCenter.lat + '&lon=' + mapCenter.lng);
  this.request.onreadystatechange = function(){search.processResults(this)};
  this.request.send(null);*/
  return false;
};

search.inLoad = function() {
  var query = get['q'] || '';
  if (query != '')
    search.search(query);
};

