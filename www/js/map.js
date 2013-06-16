$(function() {
  parseGET();
  if (typeof frame_map === "undefined") frame_map = false; // in frame_map mode we have limited controls and map abilities

  var overlaysAsString = '';
  if (frame_map) {
    center = new L.LatLng(62.0, 88.0);
    zoom = $(window).width() > 1200 ? 3 : 2;
    layer = "M";
  } else {
    var loc = osm.getCookie('_osm_location');
    var center;
    var zoom;
    var layer = 'M';
    if(loc) {
      var locs = loc.split('|');
      center = new L.LatLng(locs[1], locs[0]);
      zoom = locs[2];
      layer = locs[3] || 'M';
      overlaysAsString = locs[4] || '';
    } else if(clientLat || clientLon) {
      center = new L.LatLng(clientLat, clientLon);
      zoom = 12;
    } else {
      center = new L.LatLng(62.0, 88.0);
      zoom = $(window).width() > 1200 ? 3 : 2;
    }
  }

  osm.initLayers();

  //some piece of paranoia
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
    $("#leftpan div h1").bind('click',function(){
      osm.leftpan.toggleItem(this.parentNode.id);
    });
    osm.leftpan.on=true;
    osm.leftpan.refsizetab();
  }

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

  if (osm.getCookie("_osm_htp") == "false")
    osm.toppan_toggle(false);
  if (osm.getCookie("_osm_leftpan") == "false")
    osm.leftpan.toggle(false);
    

  osm.map.addControl(new L.Control.Scale({width: 100, position: 'bottomleft'}));

  osm.map.permalink = new L.Control.Permalink(osm.map.control_layers);
  osm.map.addControl(osm.map.permalink);
  osm.map.addControl(new L.Control.Zoom({shiftClick: true}));
  osm.map.addControl(new L.Control.Distance());
  osm.map.addControl(new L.Control.inJOSM({target:'hiddenIframe', linktitle: 'Редактировать в JOSM'}));
  osm.validators.initialize();
  osm.poi.initialize();

  search.inLoad();

  osm.editUpdate();
  osm.map.on('moveend', osm.saveLocation);
  osm.map.on('layeradd', osm.saveLocation);
  osm.map.on('layerremove', osm.saveLocation);
  osm.map.on('moveend', osm.editUpdate);

  osm.setLinkOSB();
  // osm.initModes();

  $("#mappan #htpbutton").bind("click", function(){osm.ui.togglehtp()});
  if (get.hidetoppan) osm.ui.togglehtp();

  if ($('#leftpantab').height()>300)
    osm.dyk.load();
  $(window).resize(osm.leftpan.refsizetab);

  osm.map.on('moveend', osm.opento);
  osm.opento();

 }
});

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
    'layerChepetsk',
    new L.TileLayer('http://ingreelab.net/C04AF0B62BEC112E8D7242FB848631D12D252728/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, rendering <a href=\"http://чепецк.net\" target=\"_blank\">ST-GIS</a>, <a href=\"http://www.openstreetmap.org/user/Max%20Vasilev\" target=\"_blank\">Maks Vasilev</a>"}),
    'Чепецк.net',
    'H',
    true
  );

  osm.registerLayer(
    'layerBing',
    new L.BingLayer('ApaoUzCK5_6HzEgOsPL_HFxYj-RVA2FAvcvQHX4XKeR6tjzl9lquWXiZSwBFe8h-', {maxZoom: 18}),
    'Снимки Bing',
    'B',
    true
  );

  osm.registerLayer(
    'layerEmpty',
    new L.TileLayer('img/blank.png', {maxZoom: 18}),
    'Пустой фоновый слой',
    'E',
    true
  );

/*
  osm.registerLayer(
    'layerLatlonBuildings',
    new L.TileLayer('http://{s}.tile.osmosnimki.ru/buildings/{z}/{x}/{y}.png', {maxZoom: 18, attribution: "Трёхмерные здания &copy; <a href='http://latlon.org/pt'>LatLon.org</a>", subdomains: 'abcdef'}),
    'Трёхмерные здания',
    'Z',
    false
  );
*/
  if (!frame_map)
  osm.registerLayer(
    'osb',
    new L.OpenStreetBugs({dblClick: false, iconOpen:"img/osb/open_bug_marker.png", iconClosed:"img/osb/closed_bug_marker.png", iconActive:"img/osb/active_bug_marker.png", editArea:0.001, bugid: get.bugid}),
    'Ошибки на карте',
    'U',
    false
  );

  osm.registerLayer(
    'layerPt',
    new L.TileLayer('http://pt.openmap.lt/{z}/{x}/{y}.png', {maxZoom: 18, attribution: "Маршруты &copy; <a href='http://openmap.lt'>openmap.lt</a>"}),
    //new L.TileLayer('http://{s}.tile.osmosnimki.ru/pt/{z}/{x}/{y}.png', {maxZoom: 18, attribution: "Маршруты &copy; <a href='http://latlon.org/pt'>LatLon.org</a>", subdomains: 'abcdef'}),
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
    'h',
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

    osm.registerLayer(
    'layerOpenSeaMap',
    new L.TileLayer('http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: "<a href='http://openseamap.org'>OpenSeaMap</a>"}),
    'Открытая морская карта',
    'O',
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
