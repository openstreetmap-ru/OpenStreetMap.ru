$(function() {
  parseGET();
  osm.sManager.initialize();
  if (typeof frame_map === "undefined") frame_map = false; // in frame_map mode we have limited controls and map abilities

  osm.initLayers();

  var mapOptions = osm.permalink.startLoadPos();
  mapOptions['zoomControl'] = false;
  mapOptions['layers'] = [mapOptions['baseLayer']];
  osm.map = new L.Map('map', mapOptions);
  
  osm.permalink.start();
  
  for (var i in mapOptions['overlays'])
    osm.map.addLayer(mapOptions['overlays'][i]);
  
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
  osm.permalink.include(osm.map.control_layers);
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

  osm.map.addControl(new L.Control.Zoom({shiftClick: true}));
  osm.map.addControl(new L.Control.Distance());
  osm.map.addControl(new L.Control.inJOSM({target:'hiddenIframe', linktitle: 'Редактировать в JOSM'}));
  osm.validators.initialize();
  osm.poi.initialize();

  search.inLoad();

  osm.editUpdate();
  osm.map.on('moveend', osm.editUpdate);

  osm.setLinkOSB();

  $("#mappan #htpbutton").bind("click", function(){osm.ui.togglehtp()});
  if (get.hidetoppan) osm.ui.togglehtp();

  if ($('#leftpantab').height()>300)
    osm.dyk.load();
  $(window).resize(osm.leftpan.refsizetab);

  osm.map.on('moveend', osm.opento);
  osm.opento();

 }
 
 if (frame_map)
  FramePos();
 
});

osm.initLayers = function(){

  osm.layerHashes = {};
  osm.layerHash2name = {};
  osm.layerHash2title = {};
  osm.baseLayers = {};
  osm.overlays = {};

  osm.registerLayer(
    'layerMapnik',
    new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors"}),
    'Mapnik',
    'M',
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
    'layerHOT',
    new L.TileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {maxZoom: 20, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, tiles &copy; <a href='http://hot.openstreetmap.org/' target='_blank'>Humanitarian OpenStreetMap Team</a>", subdomains: 'abc'}),
    'Humanitarian',
    'H',
    true
  );

  osm.registerLayer(
    'layerMS',
    new L.TileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', {
      maxZoom: 19,
      attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, rendering <a href=\"http://giscience.uni-hd.de/\" target=\"_blank\">GIScience Research Group @ University of Heidelberg</a>"}),
    'MapSurfer.net',
    'S',
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
    'k',
    false
  );

  osm.registerLayer(
    'layerMSHyb',
    new L.TileLayer('http://openmapsurfer.uni-hd.de/tiles/hybrid/x={x}&y={y}&z={z}', {
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
    'layerPanoramio',
    new L.Panoramio(),
    'Фото (Panoramio)',
    'P',
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
    'layerGPSTracks',
    new L.TileLayer('http://{s}.gps-tile.openstreetmap.org/lines/{z}/{x}/{y}.png', {
      maxZoom: 20,
      subdomains: 'abc',
      attribution: "Tracks &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors"
    }),
    'GPS треки',
    'G',
    false
  );

  osm.registerLayer(
    'layerOpenSeaMap',
    new L.TileLayer('http://t1.openseamap.org/seamark/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: "<a href='http://openseamap.org'>OpenSeaMap</a>"}),
    'Открытая морская карта',
    'O',
    false
  );

}

osm.registerLayer = function (name, layer, title, hash, isBase){
    if (isUnd(layer.options)) layer.options = {};
    layer.options['osmName'] = name;
    osm.layers[name] = layer;

    if(title){
        layer.options['osmTitle'] = title;
        osm.layerHashes[title] = hash;
    }

    if(hash){
        layer.options['osmHash'] = hash;
        osm.layerHash2name[hash] = name;
        if(title){
            osm.layerHash2title[hash] = title;
        }
    }

    if(undefined !== isBase){
        layer.options['osmIsBase'] = isBase;
        if(isBase){
          osm.baseLayers[title] = osm.layers[name];
        }
        else {
          osm.overlays[title] = osm.layers[name];
        }
    }
}



osm.sManager = {}
osm.p = {}

osm.sManager.initialize = function() {
  osm.sManager.loadCookie();
  osm.sManager.loadGet();
  osm.sManager.loadAnchor();
  document.body.onhashchange = function(){osm.sManager.loadAnchor();}
}

osm.sManager.loadCookie = function() {
  var i, a, params;
  osm.p.cookie = {};
  if (params = document.cookie) {
    a = params.split(';');
    for (i in a) {
      a[i] = a[i].trim().split('=');
      if (a[i][0].substr(0,4) == 'osm_')
        a[i][0] = a[i][0].substr(4)
      if (a[i].length == 2)
        osm.p.cookie[a[i][0]] = a[i][1];
    }
  }
}

osm.sManager.loadGet = function() {
  var i, a, params;
  osm.p.get = {};
  if (params = location.search.substr(1)) {
    a = params.split('&');
    for (i in a) {
      a[i] = a[i].split('=');
      if (a[i].length == 2)
        osm.p.get[a[i][0]] = a[i][1];
    }
  }
}

osm.sManager.loadAnchor = function() {
  console.debug(new Date().getTime() + ' start fn osm.sManager.loadAnchor');
  function clone(obj){
    var newObj = {}, i;
    for(i in obj)
      newObj[i] = obj[i];
    return newObj;
  }
  if (isUnd(osm.p.anchor)) {oldAnchor = {};} else {var oldAnchor = clone(osm.p.anchor);}
  var i, params, newP, a, ex = [];
  osm.p.anchor = {};
  
  if((i = location.href.indexOf('#')) + 1) {
    if (params = location.href.substr(i + 1).split('&')) {
      for (i in params) {
        params[i] = params[i].split('=');
        if (params[i].length == 2)
          newP = {k:params[i][0], v:params[i][1]};
        else if (params[i].length == 1)
          newP = {k:params[i][0], v:''};
        else
          continue;
        
        if ((!isUnd(oldAnchor[newP['k']]) && oldAnchor[newP['k']] != newP['v'])
                || (isUnd(oldAnchor[newP['k']]) && !isUnd(this._on))
              && newP['k'] in this._on.p
              && !(ex.indexOf(this._on.p[newP['k']]) + 1) ) {
          ex.push(this._on.p[newP['k']]);
        }
        
        osm.p.anchor[newP['k']] = newP['v'];
      }
    }
  }
  for (i in ex)
    this._on.fn[ex[i]]({'type':'anchor'});
}

osm.sManager.decodeURI = function(str) {
  if (isUnd(str)) return undefined;
  return decodeURIComponent(str.replace(/\+/g, " "));
}

osm.sManager.Param2Line = function(obj, sep){
  var a, url = [];
  for (a in obj)
    url.push(a + '=' + obj[a]);
  return url.join(sep)
}

osm.sManager.setP = function(k, v, type){
  console.debug(new Date().getTime() + ' start fn osm.sManager.setP'+' - k=' + k + ' - type=' + type);
  if (isUnd(v)) v = '';
  if (type == 'cookie'){
    osm.p.cookie[k] = v;
    var d = new Date();
    d.setYear(d.getFullYear() + 10);
    document.cookie = 'osm_' + k + '=' + v + "; " + "expires=" + d.toGMTString();
  }
  else if (type == 'get'){
  }
  else if (type == 'anchor'){
    if (!isUnd(osm.p.anchor[k]) && osm.p.anchor[k] == v) return;
    osm.p.anchor[k] = v;
    var newLine = osm.sManager.Param2Line(osm.p.anchor, '&');
    location.hash = newLine ? '#' + newLine : '';
  }
}

osm.sManager.updGet = function() {
  var newLine = osm.sManager.Param2Line(osm.p.get, '&');
  location.search = newLine ? '?' + newLine : '';
}

osm.sManager.on = function(p, fn) {
  var i, a, ex=false, type;
  if (isUnd(this._on)) this._on = {};
  if (isUnd(this._on.p)) this._on.p = {};
  if (isUnd(this._on.fn)) this._on.fn = [];
  a = this._on.fn.length;
  this._on.fn[a] = fn;
  for (i in p) {
    this._on.p[p[i]] = a;
    if (!ex) { 
      if (p[i] in osm.p.anchor) {
        type = 'anchor';
        ex = true;
      }
      else if (p[i] in osm.p.get) {
        type = 'get';
        ex = true;
      }
    }
  }
  if (ex)
    fn({'type':type});
}



osm.permalink = {
  p:{},
  defaults:{
    baseLayer:'layerMS',
    center: new L.LatLng(62.0, 88.0),
    zoom: ($(window).width() > 1200 ? 3 : 2)
  }
};

$(function() {
  osm.sManager.on(['zoom','lat','lon'], osm.permalink.setPos);
  osm.sManager.on(['layer'], osm.permalink.setLayer);
  
  osm.map.on('baselayerchange', osm.permalink.updLayer);
  osm.map.on('overlayadd', osm.permalink.updLayer);
  osm.map.on('overlayremove', osm.permalink.updLayer);
})

osm.permalink.startLoadPos = function() {
  var loc = '', overlays = '', strLayer;
  var baseLayer = osm.layers[this.defaults.baseLayer].options.osmHash;
  var ret = {
    center: this.defaults.center,
    zoom: this.defaults.zoom
  };
  
  if ((osm.p.anchor['lat'] || osm.p.anchor['lon'])
        && osm.p.anchor['zoom']) {
    ret['center'] = new L.LatLng(osm.p.anchor['lat'], osm.p.anchor['lon']);
    ret['zoom'] = osm.p.anchor['zoom'];
    if (strLayer = osm.sManager.decodeURI(osm.p.anchor['layer'])) {
      baseLayer = strLayer[0];
      if (strLayer.length > 1)
        overlays = strLayer.substring(1);
    }
  }
  else if ((osm.p.get['lat'] || osm.p.get['lon'])
        && osm.p.get['zoom']) {
    ret['center'] = new L.LatLng(osm.p.get['lat'], osm.p.get['lon']);
    ret['zoom'] = osm.p.get['zoom'];
    if (strLayer = osm.sManager.decodeURI(osm.p.get['layer'])) {
      baseLayer = strLayer[0];
      if (strLayer.length > 1)
        overlays = strLayer.substring(1);
      osm.sManager.setP('layer', osm.p.get.layer, 'anchor'), delete osm.p.get['layer'];
    }
    osm.sManager.setP('lat', osm.p.get.lat, 'anchor'), delete osm.p.get['lat'];
    osm.sManager.setP('lon', osm.p.get.lon, 'anchor'), delete osm.p.get['lon'];
    osm.sManager.setP('zoom', osm.p.get.zoom, 'anchor'), delete osm.p.get['zoom'];
    osm.sManager.updGet();
  }
  else if (!frame_map && (osm.p.cookie['lat'] || osm.p.cookie['lon'])
        && osm.p.cookie['zoom']) {
    ret['center'] = new L.LatLng(osm.p.cookie['lat'], osm.p.cookie['lon']);
    ret['zoom'] = osm.p.cookie['zoom'];
    if (osm.p.cookie['layer']) {
      baseLayer = osm.p.cookie['layer'][0];
      if (osm.p.cookie['layer'].length > 1)
        overlays = osm.p.cookie['layer'].substring(1);
    }
  }
  
  ret['baseLayer'] = osm.layers[osm.layerHash2name[baseLayer]];
  
  ret['overlays'] = {}
  for (var i in overlays) {
    var over = osm.layers[osm.layerHash2name[overlays[i]]];
    if (over)
      ret.overlays[over.options.osmName] = over;
  }
  
  this.p['center'] = ret.center;
  this.p['zoom'] = ret.zoom;
  this.p['baseLayer'] = ret.baseLayer;
  this.p['overlays'] = ret.overlays;
  
  return ret;
}

osm.permalink.start = function() {
  this.updPos();
  osm.map.on('moveend', osm.permalink.updPos);
  
  if (osm.layers[this.defaults.baseLayer] != this.p.baseLayer || !$.isEmptyObject(this.p.overlays))
    this.updLayerP();
};

osm.permalink.setPos = function() {
  console.debug(new Date().getTime() + ' start fn osm.permalink.setPos');
  if (isUnd(osm.permalink.p.center))
    osm.permalink.p.center = osm.permalink.defaults.center;

  if (isUnd(osm.permalink.p.zoom))
    osm.permalink.p.zoom = osm.permalink.defaults.zoom;
  
  if (!isUnd(osm.p.anchor['lat']) && !isUnd(osm.p.anchor['lon']) && osm.p.anchor['zoom']) {
    osm.permalink.p.center = new L.LatLng(osm.p.anchor['lat'], osm.p.anchor['lon']);
    osm.permalink.p.zoom = osm.p.anchor['zoom'];
  }
  
  if (osm.permalink.p.center != osm.map.getCenter() || osm.permalink.p.zoom != osm.map.getZoom())
    osm.map.setView(osm.permalink.p.center, osm.permalink.p.zoom);
};

osm.permalink.setLayer = function() {
  console.debug(new Date().getTime() + ' start fn osm.permalink.setLayer');
  var baseLayer = '';
  var strLayer = osm.sManager.decodeURI(osm.p.anchor['layer']);
  if (strLayer && strLayer.length > 0) {
    // разбор строки
    baseLayer = osm.layers[osm.layerHash2name[strLayer[0]]];
    osm.permalink.p.overlays = {};
    var overlays = [];
    if (strLayer.length > 1) {
      for (var i = 1; i < strLayer.length; i++) {
        var over = osm.layers[osm.layerHash2name[strLayer[i]]];
        if (over)
          overlays.push(over);
          osm.permalink.p.overlays[over.options.osmName] = over;
      }
    }
    // базовый слой
    if (!isUnd(baseLayer) && baseLayer != osm.permalink.p.baseLayer){
      osm.map.removeLayer(osm.permalink.p.baseLayer);
      osm.map.addLayer(baseLayer);
      osm.permalink.p.baseLayer = baseLayer;
    }
    // прозрачные слои
    if (!isUnd(overlays)) {
      var listCurOv = osm.map.control_layers.listCurrentOverlays();
      for (var n in listCurOv) {
        var i = overlays.indexOf(listCurOv[n].layer);
        if (i == -1)
          osm.map.removeLayer(listCurOv[n].layer);
        else
          overlays.splice(i, 1);
      }
      for (n in overlays)
        osm.map.addLayer(overlays[n]);
    }
  }
}

osm.permalink.updPos = function() {
  console.debug(new Date().getTime() + ' start fn osm.permalink.updPos');
  var center = osm.map.getCenter();
  var zoom = osm.map.getZoom();
  var precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2));
  
  osm.sManager.setP('zoom', zoom, 'anchor');
  osm.sManager.setP('lat', center.lat.toFixed(precision), 'anchor');
  osm.sManager.setP('lon', center.lng.toFixed(precision), 'anchor');
  osm.sManager.setP('zoom', zoom, 'cookie');
  osm.sManager.setP('lat', center.lat.toFixed(precision), 'cookie');
  osm.sManager.setP('lon', center.lng.toFixed(precision), 'cookie');
}

osm.permalink.updLayer = function(obj) {
  console.debug(new Date().getTime() + ' start fn osm.permalink.updLayer');
  if (obj.type == 'baselayerchange') {
    osm.permalink.p.baseLayer = obj.layer;
  }
  else if (obj.type == 'overlayadd') {
    osm.permalink.p.overlays[obj.layer.options.osmName] = obj.layer;
  }
  else if (obj.type == 'overlayremove') {
    delete osm.permalink.p.overlays[obj.layer.options.osmName];
  }
  
  osm.permalink.updLayerP ();
}

osm.permalink.updLayerP = function () {
  var hash = '';
  hash += this.p.baseLayer.options.osmHash;
  for(var i in this.p.overlays)
    hash += this.p.overlays[i].options.osmHash;
  
  osm.sManager.setP('layer', hash, 'anchor');
  console.debug('updLayerP - ' + hash);
  osm.sManager.setP('layer', hash, 'cookie');
}

osm.permalink.include = function(obj){
  obj.currentBaseLayer = function() {
    for (var i in this._layers) {
      if (!this._layers.hasOwnProperty(i))
        continue;
      var obj = this._layers[i];
      if (obj.overlay) continue;
      if (!obj.overlay && this._map.hasLayer(obj.layer))
        return obj;
    }
  };
  obj.listCurrentOverlays = function() {
    var result = [];
    for (var i in this._layers) {
      if (!this._layers.hasOwnProperty(i))
        continue;
      var obj = this._layers[i];
      if (!obj.overlay) continue;
      if (this._map.hasLayer(obj.layer))
        result.push(obj);
    }
    return result;
  }
}
