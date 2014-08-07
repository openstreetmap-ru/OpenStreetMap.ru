// Flickr plugin for Leaflet
// https://github.com/shurshur/Leaflet.Flickr

L.Flickr = L.FeatureGroup.extend({
	options: {
		maxLoad: 100, // max photos loaded in one request (should be less or equal 100)
		maxTotal: 300 // max total photos
	},

	initialize: function(api_key, options) {
		L.FeatureGroup.prototype.initialize.call(this);
		L.Util.setOptions(this, options);
		this._api_key = api_key;
		this._load_licenses();
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
		for (var i = 0; i < data.photos.photo.length; i++) {
			var p = data.photos.photo[i];
			var ico = new L.Icon({
				iconUrl: 'http://l.yimg.com/g/images/goodies/white-small-circle.png',
				shadowUrl: null,
				iconAnchor: [12,12],
				popupAnchor: [0,-12]
			});
			var m = new L.Marker([p.latitude,p.longitude], {icon: ico});
			var pdate = new Date(p.dateupload*1000);
			var months = ['January','February','March','April','May','June','July','August','Septepmber','October','November','December'];
			pdate = pdate.getDate()+'&nbsp;'+months[pdate.getMonth()]+'&nbsp;'+pdate.getFullYear();
			var plicense = this._licenses[p.license];
			if (plicense.url)
				plicense = '<a href=\"'+plicense.url+'\" target=\"_new\">'+plicense.name+'</a>';
			else
				plicense = plicense.name;
			var ptext = '<img src="http://l.yimg.com/g/images/goodies/white-flickr.png"><br/>'+
				p.title+'<br/><a id="'+p.id+'" title="'+p.title+'" href="http://www.flickr.com/photos/'+p.owner+'/'+
				p.id+'/" target="_new"><img src="'+p.url_t +'" alt="'+p.title+'" width="167"/></a><br/>'+
				'&copy;&nbsp;<a href="http://www.flickr.com/people/'+p.owner+'/" target="_new">'+p.ownername+'</a>, '+
				plicense+', '+pdate;
				m.bindPopup(ptext);
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

	_load_licenses: function() {
		var cbid = '_leaflet_flickr_lic';
		var _this = this;
		window[cbid] = function (json) {
			window[cbid] = undefined;
			var e = document.getElementById(cbid);
			e.parentNode.removeChild(e);
			if (json.stat != 'ok') {
				alert('Flick API error:\n'+json.message);
				return;
			}
				_this._licenses = [];
			for (var i=0; i<json.licenses.license.length; i++) {
				var l = json.licenses.license[i];
				_this._licenses[l.id] = {};
				_this._licenses[l.id].name = l.name;
				_this._licenses[l.id].url = l.url;
			}
		};
		var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.licenses.getInfo&api_key='+this._api_key+'&format=json&jsoncallback='+cbid;
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		script.id = cbid;
		document.getElementsByTagName("head")[0].appendChild(script);
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
		var cbid = '_leaflet_flickr';
		window[cbid] = function (json) {
			_this.json = json;
			window[cbid] = undefined;
			var e = document.getElementById(cbid);
			e.parentNode.removeChild(e);
			if(json.stat == 'ok')
				_this._load(json);
			else
				alert('Flick API error:\n'+json.message);
		};
		var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&bbox='+
			minll.lng+','+minll.lat+','+maxll.lng+','+maxll.lat+'&has_geo=1&format=json&extras=geo,url_t,owner_name,date_upload,license'+
			'&per_page='+this.options.maxLoad+'&callback='+cbid+'&api_key='+this._api_key+'&jsoncallback='+cbid;
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		script.id = cbid;
		document.getElementsByTagName("head")[0].appendChild(script);
	}

});
