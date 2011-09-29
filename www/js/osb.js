var osb = {};

L.osb = L.FeatureGroup.extend({
	options : {
		serverURL : "http://openstreetbugs.schokokeks.org/api/0.1/",
		readonly : false,
		setCookie : true,
		username : "NoName",
		cookieLifetime : 1000,
		cookiePath : null,
		permalinkURL : "http://www.openstreetmap.org/",
		opacity : 0.7,
		iconOpen: "img/open_bug_marker.png",
		iconClosed:"img/closed_bug_marker.png",
	},

	bugs : { },

	initialize : function(options)
	{
		L.Util.setOptions(this, options);
		putAJAXMarker.layers.push(this);

		this._layers = {};
		var cookies = document.cookie.split(/;\s*/);
		for(var i=0; i<cookies.length; i++)
		{
			var cookie = cookies[i].split("=");
			if(cookie[0] == "osbUsername")
			{
				this.options.username = decodeURIComponent(cookie[1]);
				break;
			}
		}

		L.osb.setCSS();
	},

	onAdd : function(map)
	{
		this._map = map;
		this._map.on("moveend", this.loadBugs, this);
		this._iterateLayers(map.addLayer, map);
		this.loadBugs();
	},

	onRemove : function(map)
	{
		this._map.off("moveend", this.loadBugs, this);
		this._iterateLayers(map.removeLayer, map);
		delete this._map;
	},
	
	set_cookie : function(name, value)
	{
		var expires = (new Date((new Date()).getTime() + 604800000)).toGMTString(); // one week from now
		document.cookie = name+"="+escape(value)+";expires="+expires+";";
	},

	get_cookie : function(name)
	{
		if (document.cookie)
		{
			var cookies = document.cookie.split(";");
			for (var i in cookies)
			{
				c = cookies[i].split("=");
				if (strip(c[0]) == name) return unescape(strip(c[1]));
			}
		}
		return null;
	},
	
	loadBugs : function()
	{
		//if(!this.getVisibility())
		//	return true;

		var bounds = this._map.getBounds();
		if(!bounds) return false;
		var sw = bounds.getSouthWest(), ne = bounds.getNorthEast();

		this.apiRequest("getBugs"
			+ "?t="+this.round(ne.lat, 5)
			+ "&r="+this.round(ne.lng, 5)
			+ "&b="+this.round(sw.lat, 5)
			+ "&l="+this.round(sw.lng, 5));
	},
	
	round : function(number, digits)
	{
		var factor = Math.pow(10, digits);
		return Math.round(number*factor)/factor;
	},

	apiRequest : function(url)
	{
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = this.options.serverURL + url + "&nocache="+(new Date()).getTime();
		document.body.appendChild(script);
	},

	createMarker: function(id)
	{
		var bug = putAJAXMarker.bugs[id];
		if(this.bugs[id])
		{
			if(this.bugs[id]._popup && this.bugs[id]._popup._opened)
				this.removeLayer(this.bugs[id]);
				//this.setPopupContent(id);
			else if(this.bugs[id].osb.closed != bug[2])
				//this.bugs[id].destroy();
				this.removeLayer(this.bugs[id]);
			else
				return;
		}

		var icon_url = bug[2] ? this.options.iconClosed : this.options.iconOpen;
		var feature = new L.Marker(bug[0], {icon:new this.osbIcon(icon_url)});
		feature.osb = {id: id, closed: bug[2]};
		this.addLayer(feature);
		this.bugs[id] = feature;
		this.setPopupContent(id);

		//this.events.triggerEvent("markerAdded");
	},

	osbIcon :  L.Icon.extend({
			iconUrl: 'http://openstreetbugs.schokokeks.org/client/open_bug_marker.png',
			iconSize: new L.Point(22, 22),
			shadowSize: new L.Point(0, 0),
			iconAnchor: new L.Point(11, 11),
			popupAnchor: new L.Point(0, 0)
	}),

	setPopupContent: function(id) {
		if(this.bugs[id]._popup_content)
			return;

		var el1,el2,el3;
		var layer = this;
		
		var isclosed = putAJAXMarker.bugs[id][2];
		
		var newContent = document.createElement('div');
		
		var content = '<div class="osb-popup">';

		//var newContent = document.createElement("div");
		
		content += '<h3 style="text-align: center; margin-bottom: 0pt;">'+(isclosed ? L.i18n("Fixed Error") : L.i18n("Unresolved Error"))+'</h3>';

		//var containerDescription = document.createElement("div");
		//newContent.appendChild(containerDescription);

		//var containerChange = document.createElement("div");
		//newContent.appendChild(containerChange);

		content += '<dl style="margin-top: 0px;">'
		el1 = document.createElement("dl");
		for(var i=0; i<putAJAXMarker.bugs[id][1].length; i++)
		{
			content += '<dt class="'+(i == 0 ? "osb-description" : "osb-comment")+'">'+(i == 0 ? L.i18n("Description") : L.i18n("Comment"))+'</dt>'
			content += '<dd class="'+(i == 0 ? "osb-description" : "osb-comment")+'"></dd>'
		}
		content += '</dl>'

		if (!isclosed)
		{
			content += '<form onsubmit="osm.layers.osb.submitComment(this); return false;"><table width="100%">';
			content += '<input name="osbid" type="hidden" value="'+id+'">';
			content += '<tr><td>'+L.i18n("Nickname:")+'</td><td><input name="osbnickname" type="text" value=""></td></tr>';
//			content += '<tr><td>'+L.i18n("Nickname:")+'</td><td><input name="osbnickname" type="text" value="'+this.options.username+'"></td></tr>';
			content += '<tr><td>'+L.i18n("Comment:")+'</td><td><input name="osbcomment" type="text"></td></tr>';
			content += '<tr><td colspan="2" align="center"><input type="submit" value="'+L.i18n("Add comment")+'"></td></tr>';
			content += '<tr><td colspan="2" align="center"><input type="button" value="'+L.i18n("Mark as fixed")+'" onClick="osm.layers.osb.closeBug(this); return false;">&nbsp;';
			content += '<input type="button" value="'+L.i18n("in JOSM")+'"></td></tr></table></form>';
		}
		else
		{
			content += '<div><input type="button" value="'+L.i18n("in JOSM")+'"></div>';
		}
		
		var bug = this.bugs[id];
		
		content += '</div>';
		
		newContent.innerHTML = content;
		//var rr1=document.getElementById('osbnickname1');
	//	if (document.getElementById('osbnickname1')) {document.getElementById('osbnickname1').setAttribute('value', this.options.username);
	//	var rr1=document.getElementById('osbnickname1');}
		for(var i=0; i<putAJAXMarker.bugs[id][1].length; i++)
		{
			//content += '<dd class="'+(i == 0 ? "osb-description" : "osb-comment")+'">'+(putAJAXMarker.bugs[id][1][i])+'</dd>'
			if (newContent.children[0].children[1].children[((i+1)*2)-1]) {newContent.children[0].children[1].children[((i+1)*2)-1].textContent = (putAJAXMarker.bugs[id][1][i]);}
		}
		if (newContent.children[0].children[2].osbnickname) {newContent.children[0].children[2].osbnickname.value = this.options.username;}
		
		bug._popup_content = newContent;
		bug.bindPopup(newContent);
		bug.on('mouseover', bug.openPopup, bug);
	},

	submitComment: function(form) {
		var nickname = form.osbnickname.value;
		if (nickname=="") {nickname = this.options.username;}
		this.apiRequest("editPOIexec"
			+ "?id="+encodeURIComponent(form.osbid.value)
			+ "&text="+encodeURIComponent(form.osbcomment.value + " [" + nickname + "]")
			+ "&format=js"
		);
		this.set_cookie("osbUsername",nickname);
		this.options.username=nickname;
	},

	OSBonMapDbClick: function(e) {
		var content = '<div class="osb-popup">';
		var newContent = document.createElement('div');
		
		content += '<h3 style="text-align: center; margin-bottom: 0pt;">'+L.i18n("New bug")+'</h3>';
		
		content += '<form onsubmit="osm.layers.osb.createBug(this); return false;"><table width="100%">';
		content += '<input name="osblat" type="hidden" value="'+e.latlng.lat+'">';
		content += '<input name="osblon" type="hidden" value="'+e.latlng.lng+'">';
		content += '<tr><td>'+L.i18n("Nickname:")+'</td><td><input name="osbnickname" type="text" value=""></td></tr>';
//		content += '<tr><td>'+L.i18n("Nickname:")+'</td><td><input name="osbnickname" type="text" value="'+osb.options.username+'"></td></tr>';
		content += '<tr><td>'+L.i18n("Comment:")+'</td><td><input name="osbcomment" type="text"></td></tr>';
		content += '<tr><td colspan="2" align="center"><input type="submit" value="'+L.i18n("Add comment")+'"></td></tr></table></form>';
		content += '</div>';

		newContent.innerHTML = content;
		if (newContent.children[0].children[1].osbnickname) {newContent.children[0].children[1].osbnickname.value = osm.layers.osb.options.username;}

		osm.osbpopup.setLatLng(e.latlng);
		osm.osbpopup.setContent(newContent);
		
		osm.map.openPopup(osm.osbpopup);
	},
	
	createBug: function(form) {
		var nickname = form.osbnickname.value;
		if (nickname=="") {nickname = this.options.username;}
		this.apiRequest("addPOIexec"
			+ "?lat="+encodeURIComponent(form.osblat.value)
			+ "&lon="+encodeURIComponent(form.osblon.value)
			+ "&text="+encodeURIComponent(form.osbcomment.value + " [" + nickname + "]")
			+ "&format=js"
		);
		this.set_cookie("osbUsername",nickname);
		this.options.username=nickname;
		osm.osbpopup._close();		
	},
	
	closeBug: function(data) {
		osm.layers.osb.submitComment(data.form)
		this.apiRequest("closePOIexec"
			+ "?id="+encodeURIComponent(data.form.osbid.value)
			+ "&format=js"
		);
	},
	
})

L.osb.setCSS = function() {
	if(L.osb.setCSS.done)
		return;
	else
		L.osb.setCSS.done = true;

	// See http://www.hunlock.com/blogs/Totally_Pwn_CSS_with_Javascript
	var idx = 0;
	var addRule = function(selector, rules) {
		var s = document.styleSheets[0];
		var rule;
		if(s.addRule) // M$IE
			rule = s.addRule(selector, rules, idx);
		else
			rule = s.insertRule(selector + " { " + rules + " }", idx);
		s.style = L.Util.extend(s.style || {}, rules);
		idx++;
	};

	addRule(".olPopupFramedCloudOpenStreetBugs dl", 'margin:0; padding:0;');
	addRule(".olPopupFramedCloudOpenStreetBugs dt", 'margin:0; padding:0; font-weight:bold; float:left; clear:left;');
	addRule(".olPopupFramedCloudOpenStreetBugs dt:after", 'content: ": ";');
	addRule("* html .olPopupFramedCloudOpenStreetBugs dt", 'margin-right:1ex;');
	addRule(".olPopupFramedCloudOpenStreetBugs dd", 'margin:0; padding:0;');
	addRule(".olPopupFramedCloudOpenStreetBugs ul.buttons", 'list-style-type:none; padding:0; margin:0;');
	addRule(".olPopupFramedCloudOpenStreetBugs ul.buttons li", 'display:inline; margin:0; padding:0;');
	addRule(".olPopupFramedCloudOpenStreetBugs h3", 'font-size:1.2em; margin:.2em 0 .7em 0;');
};

function putAJAXMarker(id, lon, lat, text, closed)
{
	var comments = text.split(/<hr \/>/);
	for(var i=0; i<comments.length; i++)
		comments[i] = comments[i].replace(/&quot;/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
	putAJAXMarker.bugs[id] = [
		new L.LatLng(lat, lon),
		comments,
		closed
	];
	for(var i=0; i<putAJAXMarker.layers.length; i++)
		putAJAXMarker.layers[i].createMarker(id);
}

L.i18n = function(s) { return s; }

function osbResponse(error)
{
	if(error)
		alert("Error: "+error);

	for(var i=0; i<putAJAXMarker.layers.length; i++)
		putAJAXMarker.layers[i].loadBugs();
}

putAJAXMarker.layers = [ ];
putAJAXMarker.bugs = { };
