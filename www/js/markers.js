osm.markers = {
  _drawingMode: 0,// 0 - nothing, 1 - marker (single, permalink), 2 - multimarker, 3 - line
  _layerGroup: 0,
  _newPath: 0, 
  _data: {
    points: [],
    lines: []
  },
  _icons: [
    new L.Icon('/img/marker.png'),
    new L.Icon('/img/marker-red.png'),
    new L.Icon('/img/marker-green.png'),
    new L.Icon('/img/marker-yellow.png'),
    new L.Icon('/img/marker-violet.png'),
    new L.Icon('/img/marker-orange.png')
  ],
  _admin: {
    hash: '',
    id: -1,
    editable: false
  }
}
osm.markers.initialize = function() {
  osm.markers._layerGroup = new L.LayerGroup();
  osm.map.addLayer(osm.markers._layerGroup);
}
osm.markers.addPoint = function () {
  if (osm.markers._removeHandlers() === 1)
    return;

  osm.map.on('click', osm.markers.createPoint);
  $_('map').style.cursor = 'crosshair';
  osm.markers._drawingMode = 1;
}
osm.markers.createPoint = function(e) {
	osm.map.permalink._popup_marker(e.latlng);
	osm.map.off('click', osm.markers.createPoint);
	$_('map').style.cursor='';
}
osm.markers.personalMap = function() {
  osm.leftpan.toggle(2);
  osm.markers._admin.editable = true;
}

osm.markers._removeHandlers = function() {
  var oldDrawingMode = osm.markers._drawingMode;
  var func, elementId;
  switch(osm.markers._drawingMode){
  case 1:
      func = osm.markers.createPoint;
      elementId = '';
      break;
  case 2:
      func = osm.markers.createPoints;
      elementId = 'multimarkerbutton';
      break;
  case 3:
      func = osm.markers.createPath;
      elementId = 'pathbutton';
      break;
  default:
    return 0;
  }
  osm.map.off('click', func);
  if (elementId)
    $_(elementId).className = 'pseudolink';
  $_('map').style.cursor='';
  osm.markers._drawingMode = 0;
  return oldDrawingMode;
}

osm.markers.addMultiMarker = function() {
  if (osm.markers._removeHandlers() === 2)
    return;

  osm.map.on('click', osm.markers.createPoints);
  $_('multimarkerbutton').className += ' persmappressed';
  $_('map').style.cursor = 'crosshair';
  osm.markers._drawingMode = 2;
}
osm.markers.createPoints = function(e) {
  var p = new PersonalMarker(e.latlng);
  p.openPopup();
}

osm.markers.addPath = function() {
  if (osm.markers._removeHandlers() === 3)
    return;

  osm.map.on('click', osm.markers.createPath);
  $_('pathbutton').className += ' persmappressed';
  $_('map').style.cursor = 'crosshair';
  osm.markers._drawingMode = 3;
  osm.markers._newPath = new L.Polyline([]);
  osm.map.addLayer(osm.markers._newPath);
}
osm.markers.createPath = function(e) {
  /*if (osm.markers._newPath.getLatLngs().length === 0) {
    var marker = new L.Marker(e.latlng);
    osm.map.addLayer(marker);
    marker.bindPopup('Начальная точка');
    marker.openPopup();
    
  }*/
  osm.markers._newPath.addLatLng(e.latlng);
  osm.markers._newPath.addLatLng(e.latlng);
}

// TODO: when IE whould support placeholder attribute for input elements - remove that
osm.markers.focusDefaultInput = function(el) {
  if(el.value==el.defaultValue) {
    el.value='';
  }
  el.className = 'default-input-focused';
}
osm.markers.blurDefaultInput = function(el) {
  if(el.value=='') {
    el.value=el.defaultValue;
    el.className = 'default-input';
  }
}

osm.markers.saveMap = function() {
  var postData = {};
  var mapName = "default map name";
  var mapDescription = "default map description";
  postData.points = [];
  postData.lines = [];
  var mlen = osm.markers._data.points.length;
  for(var i = 0; i < mlen; i++) {
    var point = osm.markers._data.points[i];
    if (!point) continue;
    var coords = point.getLatLng();
    postData.points.push({
      lat:          coords.lat,
      lon:          coords.lng,
      name:         point._pm_name,
      description:  point._pm_description,
      color:        point._pm_icon_color
    });
  }
  $_("pm_status").innerHTML = "Сохранение...";
  $.getJSON("mymap.php", {
      action:       "save",
      name:         mapName, 
      description:  mapDescription, 
      data:         postData, 
      hash:         osm.markers._admin.hash,
      id:           osm.markers._admin.id
    }, function(json){
      //alert(json.result);
      if (json.id) {
        osm.markers._admin.id = json.id;
        osm.markers._admin.hash = json.hash;
      }
      $_("pm_status").innerHTML = "Сохранено<br>"+
        "<a href='/?mapid="+osm.markers._admin.id+"'>Ссылка на просмотр</a><br>"+
        "<a href='/?mapid="+osm.markers._admin.id+"&hash="+osm.markers._admin.hash+"'>Ссылка на редактирование</a>";
    }
  );
}

osm.markers.readMap = function() {
  var url = document.URL;
  var results = url.match(/\Wmapid=(\d+)/);
  if (!results)
    return;
  var mapid = results[1];
  results = url.match(/\Whash=([0-9a-fA-F]{32})/);
  var adminhash = "";
  if (results)
    adminhash = results[1];
  $.getJSON("mymap.php", {
      action: "load",
      id:     mapid,
      hash:   adminhash
    }, function(json){
      if (!json.service.existing) { alert("Карта не существует"); return; }
      osm.markers._admin.editable = json.service.editing;
      osm.markers._admin.hash = adminhash;
      osm.markers._admin.id = mapid;
      if (osm.markers._admin.editable)
        osm.leftpan.toggle(2);
      //process map name and description
      var latlngs = new Array();
      if (json.data.points)
        for(var i=0;i<json.data.points.length;i++) {
          var point = json.data.points[i];
          var coords = new L.LatLng(point.lat, point.lon);
          latlngs.push(coords);
          var p = new PersonalMarker(coords, point.name, point.description, point.color);
        }
      if (latlngs.length>1)
        osm.map.fitBounds(new L.LatLngBounds(latlngs));
      else if (latlngs.length==1)
        osm.map.panTo(latlngs[0]);
    }
  );
}

PersonalMarker.prototype = new L.Marker();
PersonalMarker.prototype.constructor = PersonalMarker;
function PersonalMarker(coords, name, description, colorIndex) {
  this.remove = function() {
    osm.markers._layerGroup.removeLayer(this);
    delete osm.markers._data.points[this.index];
  }

  this.loadEditableMarker = function(event) {
    if (this._pm_name) {
      $_('marker_name_'+this.index).value = this._pm_name;
      $_('marker_name_'+this.index).className = 'default-input-focused';
    }
    if (this._pm_description) {
      $_('marker_description_'+this.index).value = this._pm_description;
      $_('marker_description_'+this.index).className = 'default-input-focused';
    }
    if (this._pm_icon_color) {
      this.toggleCheck(this._pm_icon_color);
    }
  }

  this.toggleCheck = function(colorIndex) {
    var colorBoxes = $_('marker_popup_'+this.index).getElementsByClassName('colour-picker-button');
    for (var i=0; i < colorBoxes.length; i++) {
      colorBoxes[i].innerHTML = '';
    }
    colorBoxes[colorIndex].innerHTML = '&#x2713;';

    this._set_pm_icon_color(colorIndex);
  }

  this._set_pm_icon_color = function(colorIndex) {
    if (isNaN(parseFloat(colorIndex)) || !isFinite(colorIndex) ||
      colorIndex < 0 || colorIndex >= osm.markers._icons.length )
      return;
    this.setIcon(osm.markers._icons[colorIndex]);
    this._pm_icon_color = colorIndex;
  }

  this.saveData = function() {
    var nameElement = $_('marker_name_'+this.index);
    this._pm_name = (nameElement.value==nameElement.defaultValue? '': nameElement.value);

    var nameElement = $_('marker_description_'+this.index);
    this._pm_description = (nameElement.value==nameElement.defaultValue? '': nameElement.value);
  }
    // Constructor code here
    this.setLatLng(coords);
    this.setIcon(osm.markers._icons[0]); // FIXME: why color is remembered to prototype?
    osm.markers._data.points.push(this);
    this.index = osm.markers._data.points.length - 1;
    osm.markers._layerGroup.addLayer(this);
    this._pm_name = name;
    this._pm_description = description;
    this._set_pm_icon_color(colorIndex);
    if (osm.markers._admin.editable) {
      var popupHTML = $_('pm_edit_popup').innerHTML;
      popupHTML = popupHTML.replace(/\$\$\$/g, 'osm.markers._data.points['+this.index+']');
      popupHTML = popupHTML.replace(/\#\#\#/g, this.index);
      this.bindPopup(popupHTML);
      this.on('click', function(e){e.target.loadEditableMarker(e)});
    } else if (this._pm_name || this._pm_description) {
      var popupHTML = $_('pm_show_popup').innerHTML;
      popupHTML = popupHTML.replace(/\#name/g, this._pm_name);
      popupHTML = popupHTML.replace(/\#description/g, this._pm_description);
      this.bindPopup(popupHTML);
    }
};
