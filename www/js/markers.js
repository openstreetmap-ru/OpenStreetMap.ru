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
  ]
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

  if (osm.markers._layerGroup === 0) {
    osm.markers._layerGroup = new L.LayerGroup();
    osm.map.addLayer(osm.markers._layerGroup);
  }
}
osm.markers.createPoints = function(e) {
  new PersonalMarker(e.latlng);
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
  if (osm.markers._newPath.getLatLngs().length === 0) {
    var marker = new L.Marker(e.latlng);
    osm.map.addLayer(marker);
    marker.bindPopup('Начальная точка');
    marker.openPopup();
    
  }
  osm.markers._newPath.addLatLng(e.latlng);
}

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

PersonalMarker.prototype = new L.Marker();
PersonalMarker.prototype.constructor = PersonalMarker;
function PersonalMarker(coords) {
    this.setLatLng(coords);
    this.setIcon(osm.markers._icons[0]); // FIXME: why color is remembered to prototype?
    osm.markers._data.points.push(this);
    this.index = osm.markers._data.points.length - 1;
    osm.markers._layerGroup.addLayer(this);
    var popupHTML = $_('personal_marker_popup').innerHTML;
    popupHTML = popupHTML.replace(/\$\$\$/g, 'osm.markers._data.points['+this.index+']');
    popupHTML = popupHTML.replace(/\#\#\#/g, this.index);
    this.bindPopup(popupHTML).openPopup();
    this.on('click', function(e){e.target.loadMarker(e)});
  
  this.loadMarker = function(event) {
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

    this.setIcon(osm.markers._icons[colorIndex]);
    this._pm_icon_color = colorIndex;
  }
  
  this.saveData = function() {
    var nameElement = $_('marker_name_'+this.index);
    this._pm_name = (nameElement.value==nameElement.defaultValue? '': nameElement.value);

    var nameElement = $_('marker_description_'+this.index);
    this._pm_description = (nameElement.value==nameElement.defaultValue? '': nameElement.value);
  }
};
