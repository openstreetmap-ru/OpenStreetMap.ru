L.Control.Permalink = L.Control.extend({
	options: {
		position: "bottomleft",
		useAnchor: true,
		useMarker: true,
		markerOptions: {}
	},

	initialize: function(layers, options) {
		L.Util.setOptions(this, options);
		this._set_urlvars();
		this._centered = false;
		this._layers = layers;
		this._marker = null;
	},

	onAdd: function(map) {
		this._container = L.DomUtil.create('div', 'leaflet-control-attribution permalink');
		L.DomEvent.disableClickPropagation(this._container);
		map.on('moveend', this._update_center, this);
		map.on('layeradd', this._update_layers, this);
		map.on('layerremove', this._update_layers, this);
		this._map = map;
		this._href = L.DomUtil.create('a', null, this._container);
		this._href.innerHTML = "Permalink";
		this._set_center(this._params);
		this._set_marker(this._params, true);
		this._update_layers();
		this._update_center();

		if (this.options.useAnchor && 'onhashchange' in window) {
			var _this = this, fn = window.onhashchange;
			window.onhashchange = function() {
				_this._set_urlvars();
				_this._set_center(_this._params, true);
				_this._set_marker(_this._params, true);
				if (fn) return fn();
			}
		}

		return this._container;
	},

	_update_center: function() {
		if (!this._map) return;
		this._update_href();
	},

	_generate_url: function(params) {
		var link = L.Util.getParamString(params);
		var sep = '?';
		if (this.options.useAnchor) sep = '#';
		return this._url_base + sep + link.slice(1);
	},

	_update_href: function() {
		this.get_params();
		this._href.setAttribute('href', this._generate_url(this._params));
	},

	_update_layers: function() {
		if (!this._layers) return;

		var layer = this._layers.currentBaseLayer();
		if (layer) this._params['layer'] = (this._layers.options.layerHashes == null) ? layer.name : this._layers.options.layerHashes[layer.name];
		for(x in osm.map.control_layers._layers) {
			if (osm.map.control_layers._layers[x].overlay) {
				if (this._map.hasLayer(osm.map.control_layers._layers[x].layer)) {
					if (this._layers.options.layerHashes == null)
						this._params['layer'] += ',' + osm.map.control_layers._layers[x].name;
					else
						this._params['layer'] += this._layers.options.layerHashes[osm.map.control_layers._layers[x].name];
				}
			}
		}
		this._update_href();
	},

	get_params: function () {
		var center = this._map.getCenter();
		center = this._round_point(center);
		this._params['zoom'] = this._map.getZoom();
		this._params['lat'] = center.lat;
		this._params['lon'] = center.lng;
	},

	_round_point: function(point) {
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
		function alter(p) {
			if (!p.mlat || !p.mlon) return p;
			p.lat = p.mlat;
			p.lon = p.mlon;
			p.marker = '1';
			delete p['mlat'];
			delete p['mlon'];
			return p;
		}

		this._url_base = window.location.href.split('#')[0];
		var ph = {};
		if (this.options.useAnchor)
			ph = alter(L.UrlUtil.queryParse(window.location.hash.slice(1)));

		var q = L.UrlUtil.query();
		if (!q) {
			this._params = ph;
			return;
		}

		var pq = alter(L.UrlUtil.queryParse(q));

		if (!this.options.useAnchor) {
			this._url_base = this._url_base.split('?')[0]
			this._params = pq;
			return;
		}

		this._params = ph;
		if (pq.lat && pq.lon && pq.zoom)
			this._params = L.Util.extend({lat: pq.lat, lon: pq.lon, zoom: pq.zoom}, this._params);
		if (pq.layer)
			this._params = L.Util.extend({layer: pq.layer}, this._params);
	},

	_set_center: function(params, force)
	{
		if (!force && this._centered) return;
		if (params.zoom == undefined ||
				params.lat == undefined ||
				params.lon == undefined) return;
		this._centered = true;
		this._map.setView(new L.LatLng(params.lat, params.lon), params.zoom);
		if (params.layer && this._layers)
			this._layers.chooseBaseLayer(params.layer);
	},

	_set_marker: function(params, center)
	{
		if (this._marker)
			this._map.removeLayer(this._marker);
		this._marker = null;
		if ((params.marker != '1' || !this._centered || !this.options.useMarker) && center) return;
		this._marker = new L.Marker(new L.LatLng(params.lat, params.lon), this.options.markerOptions);
		this._map.addLayer(this._marker);
		var popup = this._marker.bindPopup('<a href="'+this._generate_url(params)+'">Ссылка на маркер</a>');
		if (!center)
			popup.openPopup();
	},

	_popup_marker: function(latlng) {
		latlng = this._round_point(latlng);
		//copy simple obj
		this.get_params();
		var params = {};
		for (i in this._params)
			params[i] = this._params[i];

		params.lat = latlng.lat;
		params.lon = latlng.lng;
		params.marker = 1;

		this._set_marker(params, false);
	}
});

L.Control.Layers.include({
	chooseBaseLayer: function(name) {
		var obj;
		var layers = new Array();
		var names = [];

		if (this.options.layerHashes == null || name.indexOf(',') != -1)
			names = name.split(',');
		else {
			var layerName;
			for(var i = 0; i < name.length; i++)
				if (layerName = this._get_layername_by_hash(name.charAt(i)))
					names.push(layerName);
		}

		for (var n in names) {
			for (var i in this._layers) {
				if (!this._layers.hasOwnProperty(i))
					continue;
				obj = this._layers[i];
				if (obj.name == names[n])
					layers.push(obj.layer);
			}
		}
		if (!layers || !layers.length)
			return;

		for (var i in this._layers) {
			if (!this._layers.hasOwnProperty(i))
				continue;
			obj = this._layers[i];
			if (layers.indexOf(obj.layer) === -1 ) //remove only unneeded layers
				this._map.removeLayer(obj.layer);
		}
		for (l in layers) {
			this._map.addLayer(layers[l]); // map control does not add existing layers itself
		}
		this._update();
	},

	currentBaseLayer: function() {
		for (var i in this._layers) {
			if (!this._layers.hasOwnProperty(i))
				continue;
			var obj = this._layers[i];
			if (obj.overlay) continue;
			if (!obj.overlay && this._map.hasLayer(obj.layer))
				return obj;
		}
	},

	listCurrentOverlays: function() {
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
    },

	_get_layername_by_hash: function(hash) {
		if (this.options.layerHashes != null)
			for (h in this.options.layerHashes)
				if (this.options.layerHashes[h] == hash)
					return h;
		return false;
	}
});

L.UrlUtil = {
	queryParse: function(s) {
		var p = {};
    var sep = "&";
    if (s.search("&amp;") != -1)
        sep = "&amp;";
    var params = s.split(sep);
    for(var i = 0; i < params.length; i++) {
			var tmp = params[i].split('=');
			if (tmp.length != 2) continue;
			p[tmp[0]] = tmp[1];
		}
		return p;
	},

	query: function() {
		var href = window.location.href.split('#')[0], idx = href.indexOf('?');
		if (idx < 0)
			return '';
		return href.slice(idx+1);
	}
};

