var map;

function setView(position) {
  map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 10);
}

function start() {
  map = new L.Map('map');
  var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map data &copy; 2011 OpenStreetMap contributors'});
  map.setView(new L.LatLng(0.0, 0.0), 2).addLayer(layer);
  navigator.geolocation.getCurrentPosition(setView);
}