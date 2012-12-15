L.Control.inJOSM = L.Control.extend({
  options: {
    position: 'topleft',
    target: '',
    linktitle: 'Open in JOSM'
	},

	initialize: function (options) {
    L.Util.setOptions(this, options);
	},

	onAdd: function(map) {
    var className = 'leaflet-control-inJOSM',
    container = this._container = L.DomUtil.create('div', className);

    this._link = L.DomUtil.create('a', 'leaflet-control-inJOSM-link', container);
    this._link.title = this.options.linktitle;
    if (this.options.target)
      this._link.target = this.options.target;

    this._map.on('moveend', this._update_link, this);
    this._update_link();

    return container;
	},

	onRemove: function(map) {
    this._map.off('moveend', this._update_link, this);
	},
  
  _update_link: function() {
    var pos = this._map.getBounds();
    var url="http://127.0.0.1:8111/load_and_zoom?left=" + pos._southWest.lng + "&top=" + pos._northEast.lat + "&right=" + pos._northEast.lng + "&bottom=" + pos._southWest.lat;
    this._link.href = url;
  }
});