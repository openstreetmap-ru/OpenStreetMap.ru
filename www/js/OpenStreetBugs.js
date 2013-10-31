L.OpenStreetBugs = L.FeatureGroup.extend({
	options : {
		serverURL: "http://openstreetbugs.schokokeks.org/api/0.1/",
		readonly:  false,
		setCookie: true,
		username: "NoName",
		cookieLifetime : 1000,
		cookiePath:   null,
		permalinkUrl: null,
		permalinkZoom : 14,
		opacity: 0.7,
		showOpen:   true,
		showClosed: true,
		iconOpen:  "http://openstreetbugs.schokokeks.org/client/open_bug_marker.png",
		iconClosed:"http://openstreetbugs.schokokeks.org/client/closed_bug_marker.png",
		iconActive: undefined,
		editArea: 0.01,
		popupOptions: {autoPan: false, minWidth: 410, maxWidth: 410},
		dblClick: true
	},

	initialize : function(options)
	{
		var tmp = L.Util.extend({}, this.options.popupOptions, (options || {}).popupOptions)
		L.Util.setOptions(this, options)
		this.options.popupOptions = tmp;

		putAJAXMarker.layers.push(this);

		this.bugs = {};
		this._layers = {};

		var username = this.get_cookie("osbUsername");
		if (username)
			this.options.username = username;

		L.OpenStreetBugs.setCSS();
	},

	onAdd : function(map)
	{
		this._map = map;
		this._map.on("moveend", this.loadBugs, this);
		this.eachLayer(map.addLayer, map);
		this.loadBugs();
		// if (!this.options.readonly) {
		  // if (this.options.dblClick) {
			  // map.doubleClickZoom.disable();
			  // map.on('dblclick', this.addBug, this);
		  // }
		  // else {
			  // map.on('click', this.addBug, this);
			// }
		// }
		this.fire('add');
	},

	onRemove : function(map)
	{
		this._map.off("moveend", this.loadBugs, this);
		this.eachLayer(map.removeLayer, map);
		delete this._map;
		// if (!this.options.readonly) {
		  // if (this.options.dblClick) {
			  // map.doubleClickZoom.enable();
			  // map.off('dblclick', this.addBug, this);
		  // }
		  // else {
		    // map.off('click', this.addBug, this);
			// }
		// }
		this.fire('remove');
	},

	set_cookie : function(name, value)
	{
		var expires = (new Date((new Date()).getTime() + 604800000)).toGMTString(); // one week from now
		document.cookie = name+"="+escape(value)+";";
	},

	get_cookie : function(name)
	{
		var cookies = (document.cookie || '').split(/;\s*/);
		for(var i=0; i<cookies.length; i++)
		{
			var cookie = cookies[i].split("=");
			if(cookie[0] == name)
				return unescape(cookie[1]);
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

		function round(number, digits) {
			var factor = Math.pow(10, digits);
			return Math.round(number*factor)/factor;
		}

		this.apiRequest("getBugs"
			+ "?t="+round(ne.lat, 5)
			+ "&r="+round(ne.lng, 5)
			+ "&b="+round(sw.lat, 5)
			+ "&l="+round(sw.lng, 5));
	},

	apiRequest : function(url, reload)
	{
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = this.options.serverURL + url + "&nocache="+(new Date()).getTime();
		var _this = this;
		script.onload = function(e) {
			document.body.removeChild(this);
			if (reload) _this.loadBugs();
		};
		document.body.appendChild(script);
	},

	createMarker: function(id)
	{
		var bug = putAJAXMarker.bugs[id];

		var closed = bug[2];

		if ( closed && !this.options.showClosed) return;
		if (!closed && !this.options.showOpen)   return;

		var icon_url = null;
		var class_popup = ' osb';
		if (bug[2]) {
			icon_url = this.options.iconClosed;
			class_popup += ' osbClosed';
		}
		else if (bug[1].length == 1) {
			icon_url = this.options.iconOpen;
			class_popup += ' osbOpen';
		}
		else {
			if (this.options.iconActive) {
				icon_url = this.options.iconActive;
				class_popup += ' osbActive';
			}
			else {
				icon_url = this.options.iconOpen;
				class_popup += ' osbOpen';
			}
		}
		
		if (this.bugs[id])
		{
			// remove old bug from map
			this.removeLayer(this.bugs[id]);
		}
		// add new bug
		var feature = new L.Marker(bug[0], {icon:new this.osbIcon({iconUrl: icon_url})});
		feature.osb = {id: id, closed: closed};
		this.addLayer(feature);
		this.bugs[id] = feature;
		this.setPopupContent(id);

    	if (feature._popup)
      		feature._popup.options.className += class_popup;

		if (this.options.bugid && (parseInt(this.options.bugid) == id))
		{
			this.bugs[id].alwaysOpen = true;
			this.bugs[id].openPopup();
		}

		//this.events.triggerEvent("markerAdded");
	},

	osbIcon :  L.Icon.extend({
		options: {
			iconUrl: 'http://openstreetbugs.schokokeks.org/client/open_bug_marker.png',
			iconSize:    new L.Point(22, 22),
			shadowSize:  new L.Point(0,   0),
			iconAnchor:  new L.Point(11, 11),
			popupAnchor: new L.Point(0, -11)
		}
	}),

	setPopupContent: function(id)
	{
		var el1,el2,el3;
		var layer = this;

		var rawbug = putAJAXMarker.bugs[id];
		var isclosed = rawbug[2];

		var newContent = L.DomUtil.create('div', 'osb-popup');
		var h1 = L.DomUtil.create('h1', null, newContent);
		if (rawbug[2])
			h1.textContent = L.i18n("Fixed Error");
		else if (rawbug[1].length == 1)
			h1.textContent = L.i18n("Unresolved Error");
		else
			h1.textContent = L.i18n("Active Error");

		var divinfo = L.DomUtil.create('div', 'osb-info', newContent);
		var table   = L.DomUtil.create('table', 'osb-table', divinfo);
		var text    = '', i, tr, td;
		for (i=0; i<rawbug[1].length; i++)
		{
			tr = L.DomUtil.create('tr', "osb-tr-info", table);
			tr.setAttribute("valign","top")
			td = L.DomUtil.create('td', "osb-td-nickname", tr);
			td.textContent = rawbug[5][i] + ':';
			td = L.DomUtil.create('td', "osb-td-datetime", tr);
			td.textContent = rawbug[6][i];
			td = L.DomUtil.create('td', "osb-td-comment", L.DomUtil.create('tr', "osb-tr-comment", table));
			td.setAttribute("colspan","2");
			td.setAttribute("charoff","2");

			text = rawbug[4][i];

			// выделяем ссылки в тексте
			text = text.replace(/(http[:\/a-z#A-Z\.а-яё?А-ЯЁ_0-9=&%-]+)/g, function(_, url){
				var st = url.replace(new RegExp('(//.+?)/.+'), '$1'); // убираем путь после домена
				return '<a href="'+url+'" target="_blank">'+st+'</a>';
			});

			// добавляем ссылки на описание тегов в OSM
			text = text.replace(/(^|\W)([a-z_]+[:=][a-z_]+)(\W|$)/g, function(_, a, st, b){
				var key = st;
				if (key.indexOf('highway') != -1)
					key = 'Tag:'+key.replace('=', '%3D'); // ссылка на тег со значением
				else
					key = 'Key:'+key.replace(/=.+/, ''); // ссылка на тег
				return a+'<a href="http://wiki.openstreetmap.org/wiki/RU:'+
					key+'" target="_blank">'+st+'</a>'+b;
			});

			td.innerHTML = text;
		}

		function create_link(ul, text) {
			var a = L.DomUtil.create('a', null,
					L.DomUtil.create('li', null, ul));
			a.href = '#';
			a.textContent = L.i18n(text);
			return a;
		};

		var ul = L.DomUtil.create('ul', null, newContent);
		var _this = this;
		var bug = this.bugs[id];

		function showComment(title, add_comment) {
			h1.textContent_old = h1.textContent;
			h1.textContent = L.i18n(title);
			var form = _this.createCommentForm();
			form.osbid.value = id;
			form.cancel.onclick = function (e) {
				h1.textContent = h1.textContent_old;
				newContent.removeChild(form);
				newContent.appendChild(ul);
			}
			form.ok.onclick = function(e) {
				bug.closePopup();
				if (!add_comment)
					_this.closeBug(form);
				else
					_this.submitComment(form);
				return false;
			};
			newContent.appendChild(form);
			newContent.removeChild(ul);
			return false;
		};

		if (!isclosed && !this.options.readonly) {
			var a;
			a = create_link(ul, "Add comment");
			a.onclick = function(e) { return showComment("Add comment", true); }

			a = create_link(ul, "Mark as Fixed");
			a.onclick = function(e) { return showComment("Close bug", false); }
		}
		var a = create_link(ul, "JOSM");
		a.onclick = function() { _this.remoteEdit(rawbug[0]); };

		var a = create_link(ul, "Link");
		var offset = 0.005; // смещение карты немного вниз, чтобы окошко бага было открыто примерно по центру
		var vars = {lat:rawbug[0].lat+offset, lon:rawbug[0].lng, zoom:this.options.permalinkZoom, bugid:id}
		if (this.options.permalinkUrl)
			a.href = L.Util.template(this.options.permalinkUrl, vars)
		else
			a.href = location.protocol + '//' + location.host + location.pathname +
				L.Util.getParamString(vars)

		bug.bindPopup(newContent, this.options.popupOptions);

		bug.alwaysOpen = false;

		// события балуна
		bug.on('mouseover', function() // наведение мыши
		{
			if (!osm.map._popup) // открываем, только если на карте ничего не открыто
				bug.openPopup();
		});
		bug.on("mouseout", function(){ if (!bug.alwaysOpen) bug.closePopup(); });
		bug.off("click"); // снимаем стандартный обработчик, чтобы не моргал при клике
		bug.on("click", function(){
			bug.alwaysOpen ^= true;
			if (!bug.alwaysOpen) bug.closePopup();
			else
			if (!osm.map._popup) bug.openPopup();
		});
	},

	submitComment: function(form) {
		if (!form.osbcomment.value) return;
		var nickname = form.osbnickname.value || this.options.username;
		this.apiRequest("editPOIexec"
			+ "?id="+encodeURIComponent(form.osbid.value)
			+ "&text="+encodeURIComponent(form.osbcomment.value + " [" + nickname + "]")
			+ "&format=js", true
		);
		this.set_cookie("osbUsername",nickname);
		this.options.username = nickname;
	},

	closeBug: function(form) {
		var id = form.osbid.value;
		this.submitComment(form);
		this.apiRequest("closePOIexec"
			+ "?id="+encodeURIComponent(id)
			+ "&format=js", true
		);
	},

	createCommentForm: function(elt) {
		var form = L.DomUtil.create("form", 'osb-add-comment', elt);
		var content = '';
		content += '<input name="osbid" type="hidden"/>';
		content += '<input name="osblat" type="hidden"/>';
		content += '<input name="osblon" type="hidden"/>';
		content += '<div><span class="osb-inputlabel">'+L.i18n('Nickname')+':</span><input type="text" name="osbnickname"></div>';
		content += '<div><span class="osb-inputlabel">'+L.i18n('Comment')+':</span><input type="text" name="osbcomment"></div>';
		content += '<div class="osb-formfooter"><input type="submit" name="ok"/><input type="button" name="cancel"/></div>';
		form.innerHTML = content;
		form.ok.value = L.i18n('OK');
		form.cancel.value = L.i18n('Cancel');
		form.osbnickname.value = this.options.username;
		return form;
	},

	addBug: function(e) {
		var newContent = L.DomUtil.create('div', 'osb-popup');

		newContent.innerHTML += '<h1>'+L.i18n("New bug")+'</h1>';
		newContent.innerHTML += '<div class="osbCreateInfo">'+L.i18n("Find your bug?")+'<br />'+L.i18n("Contact details and someone will fix it.")+'</div>';

		var popup = new L.Popup();
		var _this = this;
		var form = this.createCommentForm(newContent);
		form.osblat.value = e.latlng.lat;
		form.osblon.value = e.latlng.lng;
		form.ok.value = L.i18n("Create");
		form.onsubmit = function(e) {
			_this._map.closePopup(popup);
			_this.createBug(form);
			return false;
		};
		form.cancel.onclick = function(e) { _this._map.closePopup(popup); }

		popup.setLatLng(e.latlng);
		popup.setContent(newContent);
		popup.options.maxWidth=410;
		popup.options.minWidth=410;
		popup.options.className += ' osb osbCreate'

		this._map.openPopup(popup);
	},

	createBug: function(form) {
		if (!form.osbcomment.value) return;
		var nickname = form.osbnickname.value || this.options.username;
		this.apiRequest("addPOIexec"
			+ "?lat="+encodeURIComponent(form.osblat.value)
			+ "&lon="+encodeURIComponent(form.osblon.value)
			+ "&text="+encodeURIComponent(form.osbcomment.value + " [" + nickname + "]")
			+ "&format=js", true
		);
		this.set_cookie("osbUsername",nickname);
		this.options.username=nickname;
	},

	remoteEdit: function(x) {
		var ydelta = this.options.editArea || 0.01;
		var xdelta = ydelta * 2;
		var p = [ 'left='  + (x.lng - xdelta), 'bottom=' + (x.lat - ydelta)
			, 'right=' + (x.lng + xdelta), 'top='    + (x.lat + ydelta)];
		var url = 'http://localhost:8111/load_and_zoom?' + p.join('&');
		var frame = L.DomUtil.create('iframe', null);
		frame.style.display = 'none';
		frame.src = url;
		document.body.appendChild(frame);
		frame.onload = function(e) { document.body.removeChild(frame); };
		return false;
	}
})

L.OpenStreetBugs.setCSS = function() {
	if(L.OpenStreetBugs.setCSS.done)
		return;
	else
		L.OpenStreetBugs.setCSS.done = true;

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

	addRule(".osb-popup dl", 'margin:0; padding:0;');
	addRule(".osb-popup dt", 'margin:0; padding:0; font-weight:bold; float:left; clear:left;');
	addRule(".osb-popup dt:after", 'content: ": ";');
	addRule("* html .osb-popup dt", 'margin-right:1ex;');
	addRule(".osb-popup dd", 'margin:0; padding:0;');
	addRule(".osb-popup ul.buttons", 'list-style-type:none; padding:0; margin:0;');
	addRule(".osb-popup ul.buttons li", 'display:inline; margin:0; padding:0;');
	addRule(".osb-popup h3", 'font-size:1.2em; margin:.2em 0 .7em 0;');
};

// функция вызывается в ответе от OSB API
function putAJAXMarker(id, lon, lat, text, closed)
{
	var old = putAJAXMarker.bugs[id];
	if (old)    // маркер уже есть
	if (old[3] == text && old[2] == closed) // обновляем только в случае изменения текста или статуса
		return; // не перерисоздаем существующие

	var comments = text.split(/<hr \/>/);
	var comments_only = []
	var nickname = [];
	var datetime = [];
	var info = null;
	var i, isplit = 0;

	for (i=0; i<comments.length; i++)
	{
		info = null;
		isplit = 0;
		comments[i] = comments[i].replace(/&quot;/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
		isplit = comments[i].lastIndexOf("[");
		if (isplit > 0)
		{
			comments_only[i] = comments[i].substr(0,isplit-1);
			info = comments[i].substr(isplit+1);
			nickname[i] = info.substr(0,info.lastIndexOf(","));
			datetime[i] = info.substr(info.lastIndexOf(",")+2);
			datetime[i] = datetime[i].substr(0,datetime[i].lastIndexOf("]"));
		}
		else
			comments_only[i] = comments[i];
	}

	putAJAXMarker.bugs[id] = [
		new L.LatLng(lat, lon),
		comments,
		closed,
		text,
		comments_only,
		nickname,
		datetime
	];

	for (i=0; i<putAJAXMarker.layers.length; i++)
		putAJAXMarker.layers[i].createMarker(id);
}

function osbResponse(error)
{
	if (error)
		alert("Error: "+error);
}

putAJAXMarker.layers = [ ];
putAJAXMarker.bugs = { };

L.i18n = function(s) { return (L.i18n.lang[L.i18n.current] || {})[s] || s; }
L.i18n.current = 'ru';
L.i18n.lang = {};
L.i18n.extend = function(lang, args) {
	L.i18n.lang[lang] = L.Util.extend(L.i18n.lang[lang] || {}, args)
};

L.i18n.extend('ru', {
	"Create":"Добавить",
	"Fixed Error":"Ошибка исправлена",
	"Unresolved Error":"Неисправленная ошибка",
	"Active Error":"Ошибка уточняется",
	"Description":"Описание",
	"Comment":"Описание",
	"Add comment":"Дополнить",
	"Mark as Fixed":"Исправлено",
	"Link":"Ссылка",
	"Cancel":"Отмена",
	"New bug":"Я нашел ошибку",
	"Close bug":"Исправлено",
	"Find your bug?":"Нашли ошибку?",
	"Contact details and someone will fix it.":"Напишите подробнее и кто-нибудь её исправит."
});
