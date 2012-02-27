L.Control.GoToOSM = L.Class.extend({

	OSM_HOST : 'http://openstreetmap.org',
	HREF_TEXT: 'Открыть на osm.org',

	_map: null,
	_container: null,
	_href: null,

	initialize : function(toolsDiv){
		this._container = $(toolsDiv).find('div.p')[0];
	},
	
	//Был удивлен что контрол обязан возвращать position
	//видимо в теминологии лефлета -- это не контрол.
	connectToMap: function(map) {
		this._map = map;

		this._map.on('moveend', this._mapMoveEndHandler, this)

		this._createHref();
		this.updateHref();
	},
	
	_createHref : function(){
		this._href = L.DomUtil.create('a');
		this._href.innerHTML = this.HREF_TEXT;
		var p = L.DomUtil.create('p');
		p.appendChild(this._href);
		this._container.appendChild(p);
	},
	
	_mapMoveEndHandler : function(evnt){
		
		if (!this._href) return;
		
		this.updateHref();
	},
	
	updateHref : function(){
		var center = this.getCenter();
		var zoom = this.getZoom();
		
		var url = this.OSM_HOST + '?' + 'lat=' + center.lat + '&lon=' + center.lng + '&zoom=' + zoom;
		this._href.setAttribute('href', url);
	},
	
	getCenter: function(){
		return this._map.getCenter();
	},
	
	getZoom : function(){
		return this._map.getZoom();
	}
	
});
