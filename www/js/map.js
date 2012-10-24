function init() {
  parseGET();
  if (typeof frame_map === "undefined") frame_map = false; // in frame_map mode we have limited controls and map abilities

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
  } else if(clientLat || clientLon) {
    center = new L.LatLng(clientLat, clientLon);
    zoom = 12;
    layer = "M";
  }
  else {
    center = new L.LatLng(62.0, 88.0);
    zoom = $(window).width() > 1200 ? 3 : 2;
    layer = "M";
  }

  osm.initLayers();

  //some pice of paranoia
  baseLayer = osm.layers[osm.layerHash2name[layer]] || osm.layers.layerMapnik;

  osm.map = new L.Map('map', {zoomControl: false, center: center, zoom: zoom, layers: [baseLayer]});

  if (!frame_map)
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

  L.Icon.Default.imagePath='/img';
  osm.markers.initialize();
  osm.markers.readMap();

 if (!frame_map) {
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
  osm.input.focus();
  osm.search_marker = new L.LayerGroup();
  osm.map.addLayer(osm.search_marker);

  osm.map.addControl(new L.Control.Scale({width: 100, position: 'bottomleft'}));

  osm.map.permalink = new L.Control.Permalink(osm.map.control_layers);
  osm.map.addControl(osm.map.permalink);
  osm.map.addControl(new L.Control.Zoom({shiftClick: true}));
  osm.map.addControl(new L.Control.Distance());
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
  
  osm.initModes();

  $("#mappan #htpbutton").bind("click", function(){osm.ui.togglehtp()});
  if (get.hidetoppan) osm.ui.togglehtp();
 }
};

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

  if (!frame_map)
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

  if (!frame_map) {
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
  }
  
  osm.registerLayer(
    'layerHillshading',
    new L.TileLayer('http://toolserver.org/~cmarqu/hill/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: "Hillshading &copy; <a href='http://toolserver.org/~cmarqu/'>toolserver.org</a>"}),
    'Рельеф',
    'h',
    false
  );

  osm.registerLayer(
    'layerGPSPoint',
    new L.TileLayer('http://zverik.osm.rambler.ru/gps/tiles/{z}/{x}/{y}.png', {
      maxZoom: 14}),
    'GPS точки',
    'g',
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
