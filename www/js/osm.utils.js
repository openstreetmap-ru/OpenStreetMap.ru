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

osm.initModes = function(){
  curmenu = $("#mainmenu .current");
  curmenu.before('<img src="img/menu_arrow.png" id="menu_arrow_img">');
  submenu = $('<ul class="submenu" style="background: #88ad0b">');
  submenu.append('<li class="search">Поиск</li>');
  submenu.append('<li class="persmap">Персональная</li>');
  submenu.append('<li class="errors">Валидаторы</li>');
  curmenu.append(submenu);
  
  $('#mainmenu .current li.search').addClass('active');
  $('#mainmenu .current li.search').click(function(){osm.leftpan.toggle(1)});
  $('#mainmenu .current li.persmap').click(function(){osm.leftpan.toggle(2)});
  $('#mainmenu .current li.errors').click(function(){osm.leftpan.toggle(3)});
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
  var noOff = false;
  var obMap = $_('mappan');
  var obTools = L.DomUtil.create('div', null, obMap);
  obTools.id = 'tools';

  osm.obTools = obTools;

  function ClosePan() {
    obTools.className='';
  }
  obTools.onmouseover = function() {
    clearTimeout(timeoutId);
    obTools.className='on';
  }
  obTools.onmouseout = function() {
    if (!noOff)
      timeoutId = setTimeout(ClosePan, 300);
  }
  var obButDiv = L.DomUtil.create('div', 'a', obTools);
  var obButDivA = L.DomUtil.create('a', null, obButDiv);
  obButDivA.href = '#';
  obButDivA.title = 'Инструменты';
  obButDivA.onclick = function(){
    noOff=!noOff
  };

  var obListDiv = L.DomUtil.create('div', 'p', obTools);
  var obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
  obListDivA.href='#';
  obListDivA.title='Маркер';
  obListDivA.onclick = function(){
    osm.markers.addPoint();
  };
  obListDivA.innerHTML='Маркер';
  var obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
  obListDivA.id='EditJOSM'
  obListDivA.href='#';
  obListDivA.title='Редактировать (в JOSM)';
  obListDivA.innerHTML='Редактировать (в JOSM)';

  var obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
  obListDivA.href='#';
  obListDivA.title='Персональная карта';
  obListDivA.innerHTML='Персональная карта';
  obListDivA.onclick = function(){osm.leftpan.toggle(2)};

  var obListDivA = L.DomUtil.create('a', null, L.DomUtil.create('p', null, obListDiv));
  obListDivA.href='#';
  obListDivA.title='Данные валидаторов';
  obListDivA.innerHTML='Данные валидаторов';
  obListDivA.onclick = function(){osm.leftpan.toggle(3)};
};

osm.setLinkOSB = function() {
  if (parseInt(get['bugid'])) {
    osm.map.addLayer(osm.layers.osb);
    osm.map.control_layers._update();
  }
};

osm.leftpan.toggle = function(on) {
  if (typeof on == "undefined") on = !this.on;
  var center = osm.map.getCenter();
  if (on != this.on) {
	this.on = on;
    if (on) {
      $('#downpan').removeClass('left-on');
      $('#leftpan div.leftpantab').removeClass('on');
      $('#mainmenu .current li').removeClass('active');
      osm.validators.disable();
      if (on === 2) {
        $('#leftpersmappan').addClass('on');
        $('#mainmenu .current li.persmap').addClass('active');
        osm.markers.personalMap();
      } else if (on === 3) {
        $('#lefterrorspan').addClass('on');
        $('#mainmenu .current li.errors').addClass('active');
        osm.validators.enable();
      } else if (on) {
        $('#leftsearchpan').addClass('on');
        $('#mainmenu .current li.search').addClass('active');
        osm.map.addLayer(osm.layers.search_marker);
      }
    } else {
      $('#downpan').addClass('left-on');
      osm.map.removeLayer(osm.layers.search_marker);
    }
    osm.map.invalidateSize();
  }
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
}
