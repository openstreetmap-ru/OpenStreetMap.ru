osm.markers = {
  _drawingMode: 0,// 0 - nothing, 1 - marker (single, permalink), 2 - multimarker, 3 - line
  _layerGroup: 0,
  _newPath: 0, 
  _data: {
    points: [],
    lines: []
  }
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
  var marker = new L.Marker(e.latlng);
  osm.markers._data.points.push(marker);
  var markerIndex = osm.markers._data.points.length - 1;
  osm.markers._layerGroup.addLayer(marker);
  marker._pm_id = markerIndex;
  var popupHTML = $_('personal_marker_popup').innerHTML;
  popupHTML = popupHTML.replace(/\$\$\$/g, markerIndex);
  marker.bindPopup(popupHTML).openPopup();
  marker.on('click', osm.markers.loadMarker);
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

osm.markers.saveMarker = function(elementIndex) {
  var marker = osm.markers._data.points[elementIndex];
  marker._pm_name = $_('marker_name_'+elementIndex).value;
  marker._pm_description = $_('marker_description_'+elementIndex).value;
}

osm.markers.loadMarker = function(event) {
  var marker = event.target;
  var elementIndex = marker._pm_id;
  if (marker._pm_name) {
    $_('marker_name_'+elementIndex).value = marker._pm_name;
    $_('marker_name_'+elementIndex).className = 'default-input-focused';
  }
  if (marker._pm_description) {
    $_('marker_description_'+elementIndex).value = marker._pm_description;
    $_('marker_description_'+elementIndex).className = 'default-input-focused';
  }
}
osm.markers.toggleCheck = function(el) {
  var colorBoxes = document.getElementsByClassName('colour-picker-button');
  for (var i=0; i < colorBoxes.length; i++) {
    colorBoxes[i].innerHTML = '';
  }
  el.innerHTML = '&#x2713;';
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
