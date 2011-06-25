var osm = {cpan: {}, leftpan: {on: true}, mappan: {}};

function setView(position) {
  osm.map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 10);
}

function init() {
  var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map data &copy; 2011 OpenStreetMap contributors'});
  osm.map = new L.Map('map', {zoomControl: false, center: new L.LatLng(0.0, 0.0), zoom: 2, layers: [layer]});
  osm.cpan.joy = document.getElementById('cpanjoy');
  osm.cpan.arrows = document.getElementById('cpanarr');
  osm.leftpan.panel = document.getElementById('leftpan');
  osm.mappan.panel = document.getElementById('mappan');
  navigator.geolocation.getCurrentPosition(setView);
}

osm.cpan.startPan = function(e) {
  this.dragging = true;
  var dist = Math.sqrt(Math.pow(e.layerX - 43, 2) + Math.pow(e.layerY - 43, 2));
  if (dist < 25) {
    this.panX = e.layerX - 43;
    this.panY = e.layerY - 43;
  }
  else {
    var c = 20 / dist;
    this.panX = ((e.layerX - 43) * c);
    this.panY = ((e.layerY - 43) * c);
  }
  this.joy.style.left = (this.panX + 37) + 'px';
  this.joy.style.top = (this.panY + 37) + 'px';
  osm.map.fire('movestart');
  this.timer = setInterval(function(){osm.cpan.pan(this)}, 33);
  this.arrows.className = 'opanull';
};

osm.cpan.dragPan = function(e) {
  if (this.dragging) {
    var dist = Math.sqrt(Math.pow(e.layerX - 43, 2) + Math.pow(e.layerY - 43, 2));
    if (dist < 25) {
      this.panX = e.layerX - 43;
      this.panY = e.layerY - 43;
    }
    else {
      var c = 20 / dist;
      this.panX = ((e.layerX - 43) * c);
      this.panY = ((e.layerY - 43) * c);
    }
    this.joy.style.left = (this.panX + 37) + 'px';
    this.joy.style.top = (this.panY + 37) + 'px';
  }
};

osm.cpan.pan = function() {
  osm.map._rawPanBy(new L.Point(this.panX, this.panY));
  osm.map.fire('move');
};

osm.cpan.endPan = function(e) {
  clearInterval(this.timer);
  osm.map.fire('moveend');
  this.dragging = false;
  this.joy.style.left = '37px';
  this.joy.style.top = '37px';
  this.arrows.className = '';
};

osm.leftpan.toggle = function() {
  var center = osm.map.getCenter();
  if (this.on) {
    this.on = false;
    document.body.className = 'left-on';
  }
  else {
    this.on = true;
    document.body.className = '';
  }
  osm.map.invalidateSize();
};
