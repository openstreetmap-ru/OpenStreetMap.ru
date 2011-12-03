
L.Control.Zoom = L.Class.extend({
	options: {
		shiftClick: false,
		shiftLevels: 4
	},
	
	initialize: function(options) {
		L.Util.setOptions(this, options);
	},

	onAdd: function(map) {
		this._map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-zoom');
		
		this._zoomInButton = this._createButton(
				'Zoom in', 'leaflet-control-zoom-in', this._map.zoomIn, this._map);
		this._zoomOutButton = this._createButton(
				'Zoom out', 'leaflet-control-zoom-out', this._map.zoomOut, this._map);

		this._container.appendChild(this._zoomInButton);
		this._container.appendChild(this._zoomOutButton);
	},

	getContainer: function() { 
		return this._container; 
	},
	
	getPosition: function() {
		return L.Control.Position.TOP_LEFT;
	},
	
	_createButton: function(title, className, fn, context) {
		var link = document.createElement('a');
		link.href = '#';
		link.title = title;
		link.className = className;

		var cb = function (e) {
			if (this.options.shiftClick && e && e.shiftKey) {
				var i;
				for (i = 1; i < this.options.shiftLevels; i++)
					fn.call(context);
			}
			return fn.call(context);
		};

		L.DomEvent.disableClickPropagation(link);
		L.DomEvent.addListener(link, 'click', L.DomEvent.preventDefault);
		L.DomEvent.addListener(link, 'click', cb, this);
		
		return link;
	}
});
