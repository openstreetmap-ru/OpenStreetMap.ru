osm.initLayers = function(){

  osm.layerHashes = {};
  osm.layerHash2name = {};
  osm.layerHash2title = {};
  osm.baseLayers = {};
  osm.overlays = {};

  osm.registerLayer(
    'layerMS',
    new L.TileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
      maxZoom: 19,
      attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, rendering <a href=\"http://giscience.uni-hd.de/\" target=\"_blank\">GIScience Research Group @ Heidelberg University</a>"}),
    'MapSurfer.net',
    'S',
    true
  );

  osm.registerLayer(
    'layerMapnik',
    new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors"}),
    'Mapnik',
    'M',
    true
  );
/* 
  osm.registerLayer(
    'layerChepetsk',
    new L.TileLayer('http://ingreelab.net/C04AF0B62BEC112E8D7242FB848631D12D252728/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, tiles &copy; " +
         "<a href=\"http://чепецк.net\" target=\"_blank\">ST-GIS</a>, <a href=\"http://www.openstreetmap.org/user/Max%20Vasilev\" target=\"_blank\">Maks Vasilev</a>"}),
    'Чепецк.net',
    'K',
    true
  );
*/
  osm.registerLayer(
    'layerVeloroad',
    new L.TileLayer('http://tile.osmz.ru/veloroad/{z}/{x}/{y}.png', {
      maxZoom: 15,
      attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, tiles &copy; " +
         "<a href=\"http://www.openstreetmap.org/user/Zverik\" target=\"_blank\">Ilya Zverev</a>"}),
    'Veloroad',
    'V',
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
    'layerKosmo',
    new L.TileLayer('http://{s}.tile.osm.kosmosnimki.ru/kosmo/{z}/{x}/{y}.png', {maxZoom: 18, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, tiles &copy; <a href='http://osm.kosmosnimki.ru/' target='_blank'>Kosmosnimki</a>", subdomains: 'abcd'}),
    'Kosmosnimki OSM',
    'k',
    true
  );

  osm.registerLayer(
    'layerKosmoNight',
    new L.TileLayer('http://{s}.tile.osm.kosmosnimki.ru/night/{z}/{x}/{y}.png', {maxZoom: 18, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, tiles &copy; <a href='http://osm.kosmosnimki.ru/' target='_blank'>Kosmosnimki</a>", subdomains: 'abcd'}),
    'Kosmosnimki OSM Night',
    'N',
    true
  );

  osm.registerLayer(
    'layerSputnik',
    new L.TileLayer('http://{s}.tiles.maps.sputnik.ru/{z}/{x}/{y}.png', {maxZoom: 19, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, tiles &copy; <a href='http://corp.sputnik.ru/maps' target='_blank'>Спутник</a>", subdomains: 'abcd'}),
    "Спутник",
    'p',
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
    'layerMapBox',
    new L.TileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoicm9tYW5zaHV2YWxvdiIsImEiOiJjaWpsMDhmODkwMDAydmhtMzBmNGk4aDBxIn0.zpQhbwZ9YRsOmNGSNAz-lw', {maxZoom: 17, attribution: "&copy; <a href='https://www.mapbox.com/about/maps/' target='_blank'>MapBox</a>"}),
    "Снимки MapBox",
    'X',
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
  if (!frame_map)
  osm.registerLayer(
    'osb',
    new L.OpenStreetBugs({dblClick: false, iconOpen:"img/osb/open_bug_marker.png", iconClosed:"img/osb/closed_bug_marker.png", iconActive:"img/osb/active_bug_marker.png", editArea:0.001, bugid: osm.p.get.bugid}),
    'Ошибки на карте',
    'U',
    false
  );
*/
  osm.registerLayer(
    'layerPt',
    new L.TileLayer('http://pt.openmap.lt/{z}/{x}/{y}.png', {maxZoom: 18, attribution: "Маршруты &copy; <a href='http://openmap.lt'>openmap.lt</a>"}),
    'Общественный транспорт',
    'T',
    false
  );

  osm.registerLayer(
    'layerMSHyb',
    new L.TileLayer('http://korona.geog.uni-heidelberg.de/tiles/hybrid/x={x}&y={y}&z={z}', {
      maxZoom: 18,
      attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, rendering " +
                   "<a href=\"http://giscience.uni-hd.de/\" target=\"_blank\">GIScience Research Group @ Heidelberg University</a>"}),
    'MapSurfer.net (гибрид)',
    'Y',
    false
  );

	// START Layer only for openstreetmap.ru, not for embeded map
	
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
    'layerFlickr',
    new L.Flickr('dfa25833234018ef8f19fb04c6935b77'),
    'Фото (Flickr)',
    'F',
    false
  );

  // osm.registerLayer(
    // 'layerWeatherCities',
     // new OsmJs.Weather.LeafletLayer({type: 'city', lang: 'ru', temperatureDigits: 0}),
    // 'Погода (OpenWeatherMap) - города',
    // 'w',
    // false
  // );

/*
  osm.registerLayer(
    'layerWeatherStations',
     new OsmJs.Weather.LeafletLayer({type: 'station', lang: 'ru'}),
    'Погода (OpenWeatherMap) - станции',
    's',
    false
  );
*/
  }
	
	// END Layer only for openstreetmap.ru, not for embeded map

/*
  osm.registerLayer(
    'layerHillshading',
    new L.TileLayer('http://toolserver.org/~cmarqu/hill/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: "Hillshading &copy; <a href='http://toolserver.org/~cmarqu/'>toolserver.org</a>"}),
    'Рельеф',
    'h',
    false
  );
*/
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

