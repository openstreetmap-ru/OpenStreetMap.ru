// Panoramio plugin for Leaflet
// https://github.com/shurshur/Leaflet.Panoramio

L.Panoramio = L.FeatureGroup.extend({
	options: {
		maxLoad: 100, // max photos loaded in one request (should be less or equal 100)
		maxTotal: 300 // max total photos
	},

	initialize: function(options) {
		L.FeatureGroup.prototype.initialize.call(this);
		L.Util.setOptions(this, options);
	},

	onAdd: function(map, insertAtTheBottom) {
		this._map = map;
		this._insertAtTheBottom = insertAtTheBottom;
		this._update('map');
		map.on('moveend', this._update, this);
		this.fire('add');
	},

	onRemove: function(map) {
		map.off('moveend', this._update, this);
		this.eachLayer(map.removeLayer, map);
		this.fire('remove');
	},

	_load: function(data) {
		for (var i = 0; i < data.photos.length; i++) {
			var p = data.photos[i];
			var ico = new L.Icon({
				iconUrl: 'http://www.panoramio.com/img/panoramio-marker.png',
				shadowUrl: null,
				iconAnchor: [9,9],
				popupAnchor: [0,-10]
			});
			var m = new L.Marker([p.latitude,p.longitude], {icon: ico});
			m.bindPopup('<img src="http://www.panoramio.com/img/glass/components/logo_bar/panoramio.png"><br/>'+p.photo_title+'<br/><a id="'+p.photo_id+'" title="'+p.photo_title+'" rel="pano" href="'+p.photo_url+'" target="_new"><img src="'+p.photo_file_url +'" alt="'+p.photo_title+'" width="167"/></a><br/>&copy;&nbsp;<a href="'+p.owner_url+'" target="_new">'+p.owner_name+'</a>, '+p.upload_date);
			this.fire('addlayer', {
				layer: m
			});
			this.addLayer(m);
		}
		var ks = [];
		for(var key in this._layers)
			ks.push(key);
		for(var i = 0; i < ks.length-this.options.maxTotal; i++)
			this.removeLayer(this._layers[ks[i]]);
		//this.fire("loaded");
	},

	_update: function() {
		var zoom = this._map.getZoom();
		var bounds = this._map.getBounds();
		var minll = bounds.getSouthWest();
		var maxll = bounds.getNorthEast();
  		if(this._zoom && this._bbox)
    			if(this._zoom == zoom && minll.lng >= this._bbox[0] && minll.lat >= this._bbox[1] && maxll.lng <= this._bbox[2] && maxll.lat <= this._bbox[3])
      				return;
  		var bbox = [];
  		bbox[0] = minll.lng;
  		bbox[1] = minll.lat;
  		bbox[2] = maxll.lng;
  		bbox[3] = maxll.lat;
		this._bbox = bbox;
		this._zoom = zoom;
		var _this = this;
		var cbid = '_leaflet_panoramio';
		window[cbid] = function (json) {
			_this.json = json;
			window[cbid] = undefined;
			var e = document.getElementById(cbid);
			e.parentNode.removeChild(e);
			_this._load(json);
		};
		var url = 'http://www.panoramio.com/map/get_panoramas.php?set=public&from=0&to='+this.options.maxLoad+'&minx='+
		  minll.lng+'&miny='+minll.lat+'&maxx='+maxll.lng+'&maxy='+maxll.lat+'&size=small&mapfilter=true&callback='+cbid;
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		script.id = cbid;
		document.getElementsByTagName("head")[0].appendChild(script);
	}

});
