osm.markers.addPoint = function () {
	osm.map.on('click', osm.markers.createPoint);
	$_('map').style.cursor = 'crosshair';
}
osm.markers.createPoint = function(e) {
	osm.map.permalink._popup_marker(e.latlng);
	osm.map.off('click', osm.markers.createPoint);
	$_('map').style.cursor='';
}
