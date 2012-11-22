function reloadKML() {
  var algo = 1;
  if (!wpc.layers.visible) return;
  if(osm.map.getZoom()<8) algo = 2;
  var zoom = osm.map.getZoom();
  var bounds = osm.map.getBounds();
  var minll = bounds.getSouthWest();
  var maxll = bounds.getNorthEast();
  if(wpc.zoom && wpc.bbox)
    if(wpc.zoom == zoom && minll.lng >= wpc.bbox[0] && minll.lat >= wpc.bbox[1] && maxll.lng <= wpc.bbox[2] && maxll.lat <= wpc.bbox[3])
      return;
  var w = maxll.lng - minll.lng;
  var h = maxll.lat - minll.lat;
  wpc.bbox = []
  wpc.bbox[0] = minll.lng - w/2;
  wpc.bbox[1] = minll.lat - h/2;
  wpc.bbox[2] = maxll.lng + w/2;
  wpc.bbox[3] = maxll.lat + h/2;
  wpc.zoom = zoom;
  wpc.layers.clearLayers();
  var url = 'wpc.php?bbox=' + wpc.bbox[0] + ',' + wpc.bbox[1] + ',' + wpc.bbox[2] + ',' + wpc.bbox[3] + '&algo=' + algo;
  wpc.layers.addKML(url);
}

osm.saveLocation = function() {
  var ll = osm.map.getCenter();
  var z = osm.map.getZoom();
  var currentBaseLayer = osm.map.control_layers.currentBaseLayer();
  var l = currentBaseLayer ? (osm.layerHashes[currentBaseLayer.name]) : '';

  var ol = '';
  var curOverlays = osm.map.control_layers.listCurrentOverlays();
  for(var i in curOverlays){
    var hash = osm.layerHashes[curOverlays[i].name] || '';
    //don't save OSB layer
    if(hash != 'U'){
        ol += hash;
    }
  }

  var d = new Date();
  d.setYear(d.getFullYear()+10);

  document.cookie = "_osm_location=" + ll.lng + "|" + ll.lat + "|" + z + "|" + l + "|" + ol + "; expires=" + d.toGMTString();
}

osm.editUpdate = function() {
  var pos = osm.map.getBounds();
  var url="http://127.0.0.1:8111/load_and_zoom?left=" + pos._southWest.lng + "&top=" + pos._northEast.lat + "&right=" + pos._northEast.lng + "&bottom=" + pos._southWest.lat;
  var edit = $_('EditJOSM');
  edit.target = 'hiddenIframe';
  edit.href = url;
}

osm.createTools = function() {
	var timeoutId = null;
	var noOff = 0;
	var obMap = $_('mappan');
	var obTools = L.DomUtil.create('div', null, obMap);
	obTools.id = 'tools';

	osm.obTools = obTools;

	function ClosePan() { obTools.className=''; }
	obTools.onmouseover = function()
	{
		clearTimeout(timeoutId);
		obTools.className='on';
	}
	obTools.onmouseout = function()
	{
		if (!noOff)
			timeoutId = setTimeout(ClosePan, 300);
	}

	var obButDiv = L.DomUtil.create('div', 'a', obTools);
	var obButDivA = L.DomUtil.create('a', null, obButDiv);
	obButDivA.href = '#';
	obButDivA.title = 'Инструменты';
	obButDivA.onclick = function(){ noOff ^= 1; };

	var obListDivA, obListDiv  = L.DomUtil.create('div', 'p', obTools);

	obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
	obListDivA.href='#addMarker';
	obListDivA.title='Маркер';
	obListDivA.onclick = function(){ osm.markers.addPoint(); ClosePan(); return false; };
	obListDivA.innerHTML='Маркер';

	obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
	obListDivA.id='EditJOSM_'
	obListDivA.href='#';
	obListDivA.title='Редактировать (в JOSM)';
	obListDivA.innerHTML='Редактировать (в JOSM)';

	obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
	obListDivA.href='#poi';
	obListDivA.title='Точки интереса';
	obListDivA.innerHTML='Точки интереса';
	obListDivA.onclick = function(){ osm.leftpan.toggle(4); ClosePan(); return false; };

	obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
	obListDivA.href='#personalMap';
	obListDivA.title='Персональная карта';
	obListDivA.innerHTML='Персональная карта';
	obListDivA.onclick = function(){ osm.leftpan.toggle(2); ClosePan(); return false; };

	obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
	obListDivA.href='#validators';
	obListDivA.title='Данные валидаторов';
	obListDivA.innerHTML='Данные валидаторов';
	obListDivA.onclick = function(){ osm.leftpan.toggle(3); ClosePan(); return false; };
};

osm.setLinkOSB = function() {
  if (parseInt(get['bugid'])) {
    osm.map.addLayer(osm.layers.osb);
    osm.map.control_layers._update();
  }
};

osm.leftpan.refsizetab = function() {
  var mi=$("#leftpantab .leftgroup");
  var dykH=$("#leftpantab #DidYouKnow")[0].offsetHeight;
  if (dykH)
    dykH += 34;
  var miHeight = +$("#leftpantab .leftgroup h1")[0].offsetHeight + parseFloat(mi.css('margin-bottom'))
  height=$("#leftpantab")[0].offsetHeight-(miHeight*mi.length+dykH);
  $('#leftpan .leftgroup .leftcontent').css('height', height+'px');
}

osm.leftpan.toggle = function(on, isClick) {
  fntoggle = function(id) {
    var el=$('#leftpantab #'+id+' .leftcontent');
    if (el.is(':visible'))
      $("#leftpan .leftcontent").hide("normal");
    else {
      $("#leftpan .leftcontent").hide("normal");
      // osm.leftpan.refsizetab();
      el.show("normal");
    }
  };
  if (typeof on == "undefined") on = !this.on;
  if (on != this.on) {
	this.on = on;
    if (on && on !== true) {
      $('#downpan').removeClass('left-off');
      search.disable();
      osm.validators.disable();
      osm.poi.disable();
      if (on === 'leftpersmap') {
        osm.markers.personalMap();
      } else if (on === 3) {
        $('#lefterrorspan').addClass('on');
        $('#mainmenu .current li.errors').addClass('active');
        osm.validators.enable();
      } else if (on === 'leftpoi') {
        osm.poi.enable();
      } else if (on === 'leftsearch') {
        search.enable();
      } else if (on) {
      }
      if (on != 1) fntoggle(on)
    } else {
      if (on)
        $('#downpan').removeClass('left-off');
      else
        $('#downpan').addClass('left-off');
    }
    osm.map.invalidateSize();
  }
  else if (isClick)
    fntoggle(on);
};

osm.onPermalink = function () {
  mapCenter=osm.map.getCenter();
  osm.permalink.href = 'http://' + location.host + '?lat=' + mapCenter.lat + '&lon=' + mapCenter.lng + '&zoom=' + osm.map._zoom;
};

osm.ui.whereima = function() {
  osm.map.setView(new L.LatLng(clientLat, clientLon), 12);
};

osm.ui.togglehtp = function() {
  $('body').hasClass('htp') ? $('#htpbutton').html("&uarr;") : $('#htpbutton').html("&darr;");
  $('body').toggleClass('htp');
  setTimeout("osm.leftpan.refsizetab()", 100);
};

osm.ui.searchsubmit = function() {
  return search.search($_('qsearch').value);
}

osm.osbclickon = function(e) {
  if (e.className!="on") {
    osm.map.addLayer(osm.layers.osb);
  }
  else {
    osm.map.removeLayer(osm.layers.osb);
  }
  osm.map.control_layers._update();
}

osm.osbclick = function(e,on) {
  if (on==null) on=e.className!="on"
  if (on) {
    e.className="on";
    osm.map._mapPane.style.cursor="crosshair"
  }
  else {
    e.className="";
    osm.map._mapPane.style.cursor=""
  }
};


osm.opento = function() {
  var center = osm.map.getCenter();
  var zoom = osm.map.getZoom();
  $('#opento-osmorg')[0].href = 'http://openstreetmap.org/?' + 'lat=' + center.lat + '&lon=' + center.lng + '&zoom=' + zoom;
  $('#opento-google')[0].href = 'https://maps.google.ru/?' + 'll=' + center.lat + ',' + center.lng + '&z=' + zoom;
  $('#opento-yandex')[0].href = 'http://maps.yandex.ru/?' + 'll=' + center.lng + ',' + center.lat + '&z=' + zoom;
  $('#opento-rambler')[0].href = 'http://maps.rambler.ru?' + 'll=' + center.lng + ',' + center.lat + '&z=' + zoom;
  $('#opento-wikimapia')[0].href = 'http://wikimapia.org/#' + 'lat=' + center.lat + '&lon=' + center.lng + '&z=' + zoom;
  $('#opento-bing')[0].href = 'http://www.bing.com/maps/?' + 'cp=' + center.lat + '~' + center.lng + '&lvl=' + zoom;
}

