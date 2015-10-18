
L.Wikivoyage= L.FeatureGroup.extend({
	options: {
		maxTotal: 300, // max total POIs
        baseUrl: 'http://wvpoi.batalex.ru/'
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
        for (var i = 0; i < data.length; i++) {
            poi = data[i];
			var ico = new L.Icon({
				iconUrl: this.options.baseUrl + 'poi-icons/' + poi['type'] + '.svg',
				shadowUrl: null,
				iconAnchor: [9,9],
                iconSize: [24, 24],
				popupAnchor: [0,-10]
			});
            var m = new L.Marker([poi['latitude'], poi['longitude']], {icon: ico});
            m.bindPopup(
                '<div style="font-weight: bold;">' + poi['title'] + '</div>' + 
                '<div>' + poi['description'] + '</div>' + 
                '<div>' + 
                    '<a href="https://ru.wikivoyage.org/wiki/' + poi['article'] + '" target="_blank">' + 
                        'Читать статью "' + poi['article'] + '"' + 
                    '</a>' +
                '</div>'
            );
            this.addLayer(m);
        }

		var ks = [];
		for(var key in this._layers)
			ks.push(key);
		for(var i = 0; i < ks.length-this.options.maxTotal; i++)
			this.removeLayer(this._layers[ks[i]]);
	},

	_update: function() {
		var bounds = this._map.getBounds();
		var minll = bounds.getSouthWest();
		var maxll = bounds.getNorthEast();
        _this = this
		var url = (
            this.options.baseUrl + 
            'pois.php' + 
            '?min_latitude=' + minll.lat+ 
            '&max_latitude=' + maxll.lat + 
            '&min_longitude=' + minll.lng+ 
            '&max_longitude='+ maxll.lng
        );
        $.ajax({
            url: url,
            dataType: 'json',
            crossDomain: true,
              success: function(data) {
                  _this._load(data);
              }
        });
	}
});

