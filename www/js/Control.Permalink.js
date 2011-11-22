L.Control.Permalink = L.Class.extend({
	options: {
		position: L.Control.Position.BOTTOM_LEFT,
	},

	initialize: function(options) {
		L.Util.setOptions(this, options);
		this._set_urlvars();
		this._centered = false;
	},

	onAdd: function(map) {
		this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
		L.DomEvent.disableClickPropagation(this._container);
		map.on('moveend', this._update, this);
		this._map = map;
		this._href = L.DomUtil.create('a', null, this._container);
		this._href.innerHTML = "Permalink";
		this._set_center(this._params);
		this._update();
	},

	getPosition: function() {
		return this.options.position;
	},

	getContainer: function() {
		return this._container;
	},

	_update: function() {
		if (!this._map) return;

		var center = this._map.getCenter();
		center = this._round_point(center);
		this._params['zoom'] = this._map.getZoom();
		this._params['lat'] = center.lat;
		this._params['lon'] = center.lng;

		var url = [];
		for (var i in this._params) {
			if (this._params.hasOwnProperty(i))
				url.push(i + "=" + this._params[i]);
		}

		this._href.setAttribute('href', this._url_base + "?" + url.join('&'));
	},

	_round_point : function(point) {
		var bounds = this._map.getBounds(), size = this._map.getSize();
		var ne = bounds.getNorthEast(), sw = bounds.getSouthWest();

		var round = function (x, p) {
			if (p == 0) return x;
			shift = 1;
			while (p < 1 && p > -1) {
				x *= 10;
				p *= 10;
				shift *= 10;
			}
			return Math.floor(x)/shift;
		}
		point.lat = round(point.lat, (ne.lat - sw.lat) / size.y);
		point.lng = round(point.lng, (ne.lng - sw.lng) / size.x);
		return point;
	},

	_set_urlvars: function()
	{
		this._params = {};
		var idx = window.location.href.indexOf('?');
		if (idx < 0) {
			this._url_base = window.location.href;
			return;
		}
		var params = window.location.href.slice(idx + 1).split('&');
		for(var i = 0; i < params.length; i++) {
			var tmp = params[i].split('=');
			this._params[tmp[0]] = tmp[1];
		}
		this._url_base = window.location.href.substring(0, idx);
	}, 

	_set_center: function(params)
	{
		if (this._centered) return;
		if (params.zoom == undefined ||
		    params.lat == undefined ||
		    params.lon == undefined) return;
		this._centered = true;
		this._map.setView(new L.LatLng(params.lat, params.lon), params.zoom);
	}
});
