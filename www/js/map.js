var osm = {cpan: {}, leftpan: {on: false}, mappan: {}, ui: {fs: false}, layers:{}};
var search = {};

function $(id) { return document.getElementById(id); }

function setView(position) {
  osm.map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 10);
}

function init() {
  parseGET();
  var w;
  if (self.innerHeight) w = self.innerWidth;
  else if (document.documentElement && document.documentElement.clientHeight) w = document.documentElement.clientWidth;
  else if (document.body) w = document.body.clientWidth;

  osm.layers.layerMapnik = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map data &copy; OpenStreetMap contributors'});
  osm.layers.layerTAH = new L.TileLayer('http://{s}.tah.openstreetmap.org/Tiles/tile/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map data &copy; OpenStreetMap contributors'});
  osm.layers.layerCycle = new L.TileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map data &copy; OpenStreetMap contributors'});
  osm.layers.layerTransport = new L.TileLayer('http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map data &copy; OpenStreetMap contributors'});
  osm.map = new L.Map('map', {zoomControl: true, center: new L.LatLng(62.0, 88.0), zoom: (w > 1200 ? 3 : 2), layers: [osm.layers.layerMapnik]});

  osm.layers.search_marker = new L.LayerGroup();
  osm.layers.osb = new L.OpenStreetBugs();
  osm.map.addLayer(osm.layers.search_marker);
  osm.map.control_layers = new L.Control.Layers(
    {
      'Mapnik':osm.layers.layerMapnik,
      'Osmarender':osm.layers.layerTAH,
      'Карта для велосипедистов':osm.layers.layerCycle,
      'Transport map':osm.layers.layerTransport
    },
    {
      'отметки поиска':osm.layers.search_marker,
      'Bugs':osm.layers.osb
    }
  );
  osm.map.addControl(osm.map.control_layers);

  osm.leftpan.panel = $('leftpan');
  osm.leftpan.content = $('content_pan');
  osm.mappan.panel = $('mappan');
  osm.input = $('qsearch');
  osm.search_marker = new L.LayerGroup();
  osm.map.addLayer(osm.search_marker);
  
  osm.map.addControl(new L.Control.Permalink());
  
  search.inLoad();
  osm.setLinkOSB();
};

osm.setLinkOSB = function() {
  if (parseInt(get['bugid'])) {
    osm.map.addLayer(osm.layers.osb);
    osm.map.control_layers._update();
  }
};

osm.leftpan.toggle = function(on) {
  if (typeof on == "undefined") on = !this.on;
  var center = osm.map.getCenter();
  if (on != this.on) {
    if (on) {
      this.on = true;
      $('downpan').className = '';
    }
    else {
      this.on = false;
      $('downpan').className = 'left-on';
    }
    osm.map.invalidateSize();
  }
};

search.processResults = function() {
  try {
    if (this.request.readyState == 4) {
      if (this.request.status == 200) {
        var results = eval('(' + this.request.responseText + ')');
        if (results.find==0) {
          osm.leftpan.content.innerHTML='Ничего не найдено по запросу "' + (results.search)  + '"';
        }
        else if (results.find==1 && results.accuracy_find==0) {
          osm.leftpan.content.innerHTML='Пожалуйста, уточните запрос "' + (results.search) + '"';
        }
        else {
          //var results = eval('(' + this.request.responseText + ')');
          var content = '<ul id="ol-search_result">';
          osm.layers.search_marker.clearLayers();
          var MyIcon = L.Icon.extend({
            iconUrl: '../img/marker.png',
            shadowUrl: '../img/marker-shadow.png',
            iconSize: new L.Point(18, 29),
            shadowSize: new L.Point(29, 29),
            iconAnchor: new L.Point(8, 29),
            popupAnchor: new L.Point(-8, -50)
          });
          var icon = new MyIcon();
          var matches=results.matches;
          for (var i in matches) {
            content += ('<li><a href="" onClick="osm.map.setView(new L.LatLng(' + matches[i].lat + ',' + matches[i].lon + '), 16); return false;" info="id='+matches[i].id+'  weight='+matches[i].weight+'">' + matches[i].display_name + '</a></li>');
            marker = new L.Marker(new L.LatLng(matches[i].lat, matches[i].lon),{icon: icon});
            marker.bindPopup("<b>Адрес:</b><br /> " + matches[i].display_name);
            osm.layers.search_marker.addLayer(marker);
          }
          osm.map.setView(new L.LatLng(matches[0].lat, matches[0].lon), 11);
          content += '</ul>';
          osm.leftpan.content.innerHTML = content;
        }
      }
    }
  }
  catch(e) {
      osm.leftpan.content.innerHTML = 'Ошибка: ' + e.description + '<br /> Ответ поиск.серв.: '+this.request.responseText;
  }
};

search.search = function(inQuery) {
  inQuery = inQuery || osm.input.value;
  osm.input.value = inQuery;
  if (inQuery.length < 1)
    return false;
  mapCenter=osm.map.getCenter();
  osm.leftpan.toggle(true);
  this.request = new XMLHttpRequest();
  //this.request.open('GET', 'http://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(osm.input.value) + '&format=json');
  this.request.open('GET', '/api/search?q=' + encodeURIComponent(inQuery) + '&accuracy=1' + '&lat=' + mapCenter.lat + '&lon=' + mapCenter.lng);
  this.request.onreadystatechange = function(){search.processResults(this)};
  this.request.send(null);
  return false;
};

search.inLoad = function() {
  var query = get['q'] || '';
  if (query != '')
    search.search(query);
};

function parseGET() {
  var tmp = new Array();
  var tmp2 = new Array();
  get = new Array();
  var url = location.search;
  if(url != '') {
    tmp = (url.substr(1)).split('&');
    for(var i=0; i < tmp.length; i++) {
      tmp2 = tmp[i].split('=');
      get[tmp2[0]] = decodeURIComponent(tmp2[1].replace(/\+/g, " ")).split(",");
    }
  }
};

osm.onPermalink = function () {
  mapCenter=osm.map.getCenter();
  osm.permalink.href = 'http://' + location.host + '?lat=' + mapCenter.lat + '&lon=' + mapCenter.lng + '&zoom=' + osm.map._zoom;
};

osm.ui.whereima = function() {
  navigator.geolocation.getCurrentPosition(setView);
};

osm.ui.togglefs = function() {
  if (osm.ui.fs) {
    document.body.className = '';
    $('fsbutton').innerHTML = '&uarr;';
  }
  else {
    document.body.className = 'fs';
    $('fsbutton').innerHTML = '&darr;';
  }
  osm.ui.fs = !osm.ui.fs;
};

osm.ui.searchsubmit = function() {
  return search.search($('qsearch').value);
}
