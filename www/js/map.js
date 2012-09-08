var osm = {cpan: {}, leftpan: {on: false}, mappan: {}, ui: {fs: false}, layers:{}, markers:{}};
var search = {};
var wpc = {
  layers: null,
  rq: null,
  bbox: null,
  zoom: null
};

function $_(id) { return document.getElementById(id); }

function reloadKML() {
  var algo = 1;
  if (!wpc.layers.visible) return;
  if(osm.map.getZoom()<8) algo = 2;
  var zoom = osm.map.getZoom();
  var bounds = osm.map.getBounds();
  var minll = bounds.getSouthWest();
  var maxll = bounds.getNorthEast();
  if(wpc.zoom && wpc.bbox)
    if(wpc.zoom == zoom && minll.lng >= wpc.bbox[0] && minll.lat >= wpc.bbox[1] && maxll.lng <= wpc.bbox[2] && maxll.lat <= wpc.bbox[3])
      return;
  var w = maxll.lng - minll.lng;
  var h = maxll.lat - minll.lat;
  wpc.bbox = []
  wpc.bbox[0] = minll.lng - w/2;
  wpc.bbox[1] = minll.lat - h/2;
  wpc.bbox[2] = maxll.lng + w/2;
  wpc.bbox[3] = maxll.lat + h/2;
  wpc.zoom = zoom;
  wpc.layers.clearLayers();
  var url = 'wpc.php?bbox=' + wpc.bbox[0] + ',' + wpc.bbox[1] + ',' + wpc.bbox[2] + ',' + wpc.bbox[3] + '&algo=' + algo;
  wpc.layers.addKML(url);
}

osm.saveLocation = function() {
  var ll = osm.map.getCenter();
  var z = osm.map.getZoom();
  var currentBaseLayer = osm.map.control_layers.currentBaseLayer();
  var l = currentBaseLayer ? (osm.layerHashes[currentBaseLayer.name]) : '';

  var ol = '';
  var curOverlays = osm.map.control_layers.listCurrentOverlays();
  for(var i in curOverlays){
    var hash = osm.layerHashes[curOverlays[i].name] || '';
    //don't save OSB layer
    if(hash != 'U'){
        ol += hash;
    }
  }

  var d = new Date();
  d.setYear(d.getFullYear()+10);

  document.cookie = "_osm_location=" + ll.lng + "|" + ll.lat + "|" + z + "|" + l + "|" + ol + "; expires=" + d.toGMTString();
}

osm.getCookie = function(name) {
  var cookie = " " + document.cookie;
  var search = " " + name + "=";
  var setStr = null;
  var offset = 0;
  var end = 0;
  if (cookie.length > 0) {
    offset = cookie.indexOf(search);
    if (offset != -1) {
      offset += search.length;
      end = cookie.indexOf(";", offset)
  if (end == -1) {
    end = cookie.length;
  }
      setStr = unescape(cookie.substring(offset, end));
    }
  }
  return(setStr);
}

function init() {
  parseGET();
  var w;
  if (self.innerHeight) w = self.innerWidth;
  else if (document.documentElement && document.documentElement.clientHeight) w = document.documentElement.clientWidth;
  else if (document.body) w = document.body.clientWidth;

  var loc = osm.getCookie('_osm_location');
  var center;
  var zoom;
  var layer = 'M';
  var overlaysAsString = '';
  if(loc) {
    var locs = loc.split('|');
    center = new L.LatLng(locs[1], locs[0]);
    zoom = locs[2];
    layer = locs[3] || 'M';
    overlaysAsString = locs[4] || '';
  } else {
    center = new L.LatLng(62.0, 88.0);
    zoom = w > 1200 ? 3 : 2;
    layer = "M";
  }

  osm.initLayers();

  //some pice of paranoia
  baseLayer = osm.layers[osm.layerHash2name[layer]] || osm.layers.layerMapnik;

  osm.map = new L.Map('map', {zoomControl: false, center: center, zoom: zoom, layers: [baseLayer]});

  osm.map.addLayer(osm.layers.search_marker);
  for(var i = 0; i < overlaysAsString.length; i++){
        //don't save OSB layer
        var hash = overlaysAsString.charAt(i);
        if(hash != 'U'){
            var over = osm.layers[osm.layerHash2name[hash]];
            if(over){
                osm.map.addLayer(over);
            }
        }
  }

  osm.map.control_layers = new L.Control.Layers(
    osm.baseLayers,
    osm.overlays,
    {
      layerHashes: osm.layerHashes
    }
  );
  osm.map.addControl(osm.map.control_layers);

  osm.leftpan.panel = $_('leftpan');
  osm.leftpan.content = $_('content_pan');
  osm.mappan.panel = $_('mappan');
  osm.input = $_('qsearch');
  L.Icon.Default.imagePath='/img';
  osm.input.focus();
  osm.search_marker = new L.LayerGroup();
  osm.map.addLayer(osm.search_marker);

  osm.map.addControl(new L.Control.Scale({width: 100, position: 'bottomleft'}));

  osm.map.permalink = new L.Control.Permalink(osm.map.control_layers);
  osm.map.addControl(osm.map.permalink);
  osm.map.addControl(new L.Control.Zoom({shiftClick: true}));
  osm.map.addControl(new L.Control.Distance());
  osm.markers.initialize();
  osm.markers.readMap();
  osm.validators.initialize();

  osm.createTools();
  search.inLoad();

  osm.goToOSM = new L.Control.GoToOSM(osm.obTools);
  osm.goToOSM.connectToMap(osm.map);

  osm.editUpdate();
  osm.map.on('moveend', osm.saveLocation);
  osm.map.on('layeradd', osm.saveLocation);
  osm.map.on('layerremove', osm.saveLocation);
  osm.map.on('moveend', osm.editUpdate);

  osm.layers.osb.on('add', function(){osm.osbclick($_('mainmenupage-osb').children[0],true,this);});
  osm.layers.osb.on('remove', function(){osm.osbclick($_('mainmenupage-osb').children[0],false,this);});
  osm.setLinkOSB();

  $('#mainmenu .current li').removeClass('active');
  $('#mainmenu .current li.search').addClass('active');

  $('#mainmenu .current li.search').click(osm.mode.search);
  $('#mainmenu .current li.persmap').click(osm.mode.persmap);
  $('#mainmenu .current li.errors').click(osm.mode.errors);

  if (get.hidetoppan) osm.ui.togglefs();

};

osm.mode = {
  persmap: function() {
    osm.validators.disable();
    osm.markers.personalMap();
    return false;
  },

  search: function() {
    osm.validators.disable();
    osm.leftpan.toggle(1);
    return false;
  },

  errors: function() {
    osm.validators.enable();
    return false;
  }
}



osm.initLayers = function(){

  osm.layerHashes = {};
  osm.layerHash2name = {};
  osm.layerHash2title = {};
  osm.baseLayers = {};
  osm.overlays = {};

  osm.registerLayer(
    'layerMapnik',
    new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors"}),
    'Mapnik',
    'M',
    true
  );

  osm.registerLayer(
    'layerKosmo',
    new L.TileLayer('http://{s}.tile.osmosnimki.ru/kosmo/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: "Map data &copy <a href='http://osm.org'>OpenStreetMap</a> contributors, CC-BY-SA; rendering by <a href='http://kosmosnimki.ru'>kosmosnimki.ru</a>"}
    ),
    'Космоснимки',
    'K',
    true
  );

  osm.registerLayer(
    'layerMQ',
    new L.TileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, tiles &copy; " +
         "<a href=\"http://www.mapquest.com/\" target=\"_blank\">MapQuest</a> <img src=\"http://developer.mapquest.com/content/osm/mq_logo.png\">",
      subdomains: '1234'}),
    'MapQuest',
    'Q',
    true
  );

  osm.registerLayer(
    'layerCycle',
    new L.TileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {maxZoom: 18, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors (Cycle)"}),
    'Велокарта',
    'C',
    true
  );

  osm.registerLayer(
    'layerMS',
    new L.TileLayer('http://129.206.74.245:8001/tms_r.ashx?x={x}&y={y}&z={z}', {
      maxZoom: 18,
      attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, rendering <a href=\"http://giscience.uni-hd.de/\" target=\"_blank\">GIScience Research Group @ University of Heidelberg</a>"}),
    'MapSurfer.net',
    'S',
    true
  );

  osm.registerLayer(
    'layerBing',
    new L.BingLayer('AjNsLhRbwTu3T2lUw5AuzE7oCERzotoAdzGXnK8-lWKKlc2Ax3d9kzbxbdi3IdKt', {maxZoom: 18}),
    'Снимки Bing',
    'B',
    true
  );

  osm.registerLayer(
    'layerLatlonBuildings',
    new L.TileLayer('http://{s}.tile.osmosnimki.ru/buildings/{z}/{x}/{y}.png', {maxZoom: 18, attribution: "Трёхмерные здания &copy; <a href='http://latlon.org/pt'>LatLon.org</a>", subdomains: 'abcdef'}),
    'Трёхмерные здания',
    'Z',
    false
  );

  osm.registerLayer(
    'osb',
    new L.OpenStreetBugs({dblClick: false, iconOpen:"img/osb/open_bug_marker.png", iconClosed:"img/osb/closed_bug_marker.png", iconActive:"img/osb/active_bug_marker.png", editArea:0.001}),
    'Ошибки на карте',
    'U',
    false
  );

  osm.registerLayer(
    'layerLatlonPt',
    new L.TileLayer('http://{s}.tile.osmosnimki.ru/pt/{z}/{x}/{y}.png', {maxZoom: 18, attribution: "Маршруты &copy; <a href='http://latlon.org/pt'>LatLon.org</a>", subdomains: 'abcdef'}),
    'Общественный транспорт',
    'T',
    false
  );

  osm.registerLayer(
    'layerKosmoHyb',
    new L.TileLayer('http://{s}.tile.osmosnimki.ru/hyb/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: "Map data &copy <a href='http://osm.org'>OpenStreetMap</a> contributors, CC-BY-SA; rendering by <a href='http://kosmosnimki.ru'>kosmosnimki.ru</a>"}),
    'Космоснимки (гибрид)',
    'H',
    false
  );

  osm.registerLayer(
    'layerMSHyb',
    new L.TileLayer('http://129.206.74.245:8003/tms_h.ashx?x={x}&y={y}&z={z}', {
      maxZoom: 18,
      attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, rendering " +
                   "<a href=\"http://giscience.uni-hd.de/\" target=\"_blank\">GIScience Research Group @ University of Heidelberg</a>"}),
    'MapSurfer.net (гибрид)',
    'Y',
    false
  );

  osm.registerLayer(
    'search_marker',
    new L.LayerGroup()
  );

  WPCLayer = L.KML.extend({
    visible: false,
    onAdd: function(map) {
      L.KML.prototype.onAdd.apply(this, [map]);
      this._map.on('moveend',reloadKML,this);
      this.visible = true;
      reloadKML();
    },
    onRemove: function(map) {
      this._map.off('moveend',reloadKML,this);
      this.visible = false;
      L.KML.prototype.onRemove.apply(this, [map]);
    }
  });

  wpc.layers = new WPCLayer();

  osm.registerLayer(
    'layerWikiFoto',
    wpc.layers,
    'Фото (ВикиСклад) beta',
    'W',
    false
  );

  osm.registerLayer(
    'layerWeatherCities',
     new OsmJs.Weather.LeafletLayer({type: 'city', lang: 'ru', temperatureDigits: 0}),
    'Погода (OpenWeatherMap) - города',
    'w',
    false
  );

  osm.registerLayer(
    'layerWeatherStations',
     new OsmJs.Weather.LeafletLayer({type: 'station', lang: 'ru'}),
    'Погода (OpenWeatherMap) - станции',
    's',
    false
  );
  
  osm.registerLayer(
    'layerHillshading',
    new L.TileLayer('http://toolserver.org/~cmarqu/hill/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: "Hillshading &copy; <a href='http://toolserver.org/~cmarqu/'>toolserver.org</a>"}),
    'Рельеф',
    'h',
    false
  );

}

osm.registerLayer = function (name, layer, title, hash, isBase){
    osm.layers[name] = layer;

    if(title){
        osm.layerHashes[title] = hash;
    }

    if(hash){
        osm.layerHash2name[hash] = name;
        if(title){
            osm.layerHash2title[hash] = title;
        }
    }

    if(undefined !== isBase){
        if(isBase){
          osm.baseLayers[title] = osm.layers[name];
        }
        else {
          osm.overlays[title] = osm.layers[name];
        }
    }
}

osm.editUpdate = function() {
  var pos = osm.map.getBounds();
  var url="http://127.0.0.1:8111/load_and_zoom?left=" + pos._southWest.lng + "&top=" + pos._northEast.lat + "&right=" + pos._northEast.lng + "&bottom=" + pos._southWest.lat;
  var edit = $_('EditJOSM');
  edit.target = 'hiddenIframe';
  edit.href = url;
}

osm.createTools = function() {
  var timeoutId = null;
  var noOff = false;
  var obMap = $_('mappan');
  var obTools = L.DomUtil.create('div', null, obMap);
  obTools.id = 'tools';

  osm.obTools = obTools;

  function ClosePan() {
    obTools.className='';
  }
  obTools.onmouseover = function() {
    clearTimeout(timeoutId);
    obTools.className='on';
  }
  obTools.onmouseout = function() {
    if (!noOff)
      timeoutId = setTimeout(ClosePan, 300);
  }
  var obButDiv = L.DomUtil.create('div', 'a', obTools);
  var obButDivA = L.DomUtil.create('a', null, obButDiv);
  obButDivA.href = '#';
  obButDivA.title = 'Инструменты';
  obButDivA.onclick = function(){
    noOff=!noOff
  };

  var obListDiv = L.DomUtil.create('div', 'p', obTools);
  var obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
  obListDivA.href='#';
  obListDivA.title='Маркер';
  obListDivA.onclick = function(){
    osm.markers.addPoint();
  };
  obListDivA.innerHTML='Маркер';
  var obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
  obListDivA.id='EditJOSM'
  obListDivA.href='#';
  obListDivA.title='Редактировать (в JOSM)';
  obListDivA.innerHTML='Редактировать (в JOSM)';

  var obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
  obListDivA.href='#';
  obListDivA.title='Персональная карта';
  obListDivA.innerHTML='Персональная карта';
  obListDivA.onclick = osm.mode.persmap;

  var obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
  obListDivA.href='#';
  obListDivA.title='Данные валидаторов';
  obListDivA.innerHTML='Данные валидаторов';
  obListDivA.onclick = osm.mode.errors;
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
    if (on === 2) {
      this.on = 2;
      $_('downpan').className = '';
      $_('leftpan').className = 'leftPersmap';
      $('#mainmenu .current li').removeClass('active');
      $('#mainmenu .current li.persmap').addClass('active');
    } else if (on === 3) {
      this.on = 3;
      $_('downpan').className = '';
      $_('leftpan').className = 'leftErrors';
      $('#mainmenu .current li').removeClass('active');
      $('#mainmenu .current li.errors').addClass('active');
    } else if (on) {
      this.on = 1;
      $_('downpan').className = '';
      $_('leftpan').className = 'leftSearch';
      $('#mainmenu .current li').removeClass('active');
      $('#mainmenu .current li.search').addClass('active');
      osm.map.addLayer(osm.layers.search_marker);
    } else {
      this.on = false;
      $_('downpan').className = 'left-on';
      osm.map.removeLayer(osm.layers.search_marker);
    }
    osm.map.invalidateSize();
  }
};

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
        zoom=matches[i].addr_type_id*2+4;
        content += ('<li><a href="" onClick="osm.map.setView(new L.LatLng(' + matches[i].lat + ',' + matches[i].lon + '), '+zoom+'); return false;" info="id='+matches[i].id+'  weight='+matches[i].weight+'">' + matches[i].display_name + '</a></li>');
        marker = new L.Marker(new L.LatLng(matches[i].lat, matches[i].lon));
        marker.bindPopup("<b>Адрес:</b><br /> " + matches[i].display_name);
        osm.layers.search_marker.addLayer(marker);
      }
      osm.map.setView(new L.LatLng(matches[0].lat, matches[0].lon), matches[0].addr_type_id*2+4);
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
  osm.mode.search();
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

function parseGET() {
  var tmp = new Array();
  var tmp2 = new Array();
  get = new Array();
  var url = location.search;
  if(url != '') {
    tmp = (url.substr(1)).split('&');
    for(var i=0; i < tmp.length; i++) {
      tmp2 = tmp[i].split('=');
      if (tmp2.length == 2) get[tmp2[0]] = decodeURIComponent(tmp2[1].replace(/\+/g, " "));
    }
  }
};

osm.onPermalink = function () {
  mapCenter=osm.map.getCenter();
  osm.permalink.href = 'http://' + location.host + '?lat=' + mapCenter.lat + '&lon=' + mapCenter.lng + '&zoom=' + osm.map._zoom;
};

osm.ui.whereima = function() {
  osm.map.setView(new L.LatLng(clientLat, clientLon), 12);
//  navigator.geolocation.getCurrentPosition(osm.ui.whereima_r);
};
osm.ui.whereima_r = function (position) {
  osm.map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 10);
}

osm.ui.togglefs = function() {
  if (osm.ui.fs) {
    document.body.className = '';
    $_('fsbutton').innerHTML = '&uarr;';
  }
  else {
    document.body.className = 'fs';
    $_('fsbutton').innerHTML = '&darr;';
  }
  osm.ui.fs = !osm.ui.fs;
};

osm.ui.searchsubmit = function() {
  return search.search($_('qsearch').value);
}

osm.osbclickon = function(e) {
  if (e.className!="on") {
    osm.map.addLayer(osm.layers.osb);
  }
  else {
    osm.map.removeLayer(osm.layers.osb);
  }
  osm.map.control_layers._update();
}

osm.osbclick = function(e,on) {
  if (on==null) on=e.className!="on"
  if (on) {
    e.className="on";
    osm.map._mapPane.style.cursor="crosshair"
  }
  else {
    e.className="";
    osm.map._mapPane.style.cursor=""
  }
}
