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

  osm.setCookie("_osm_location=" + ll.lng + "|" + ll.lat + "|" + z + "|" + l + "|" + ol);
}

osm.editUpdate = function() {
  var pos = osm.map.getBounds();
  var url="http://127.0.0.1:8111/load_and_zoom?left=" + pos._southWest.lng + "&top=" + pos._northEast.lat + "&right=" + pos._northEast.lng + "&bottom=" + pos._southWest.lat;
  var edit = $_('EditJOSM');
  edit.target = 'hiddenIframe';
  edit.href = url;
}

osm.setLinkOSB = function() {
  if (parseInt(get['bugid'])) {
    osm.map.addLayer(osm.layers.osb);
    osm.map.control_layers._update();
  }
};

osm.leftpan.refsizetab = function() {
  var mi=$("#leftpantab .leftgroup");
  var dykH=$("#leftpantab #DidYouKnow")[0].offsetHeight;
  var count = mi.length - ($("#leftpantab #leftsearch")[0].offsetHeight?0:1)
  if (dykH)
    dykH += 34;
  var miHeight = +$("#leftpantab .leftgroup h1")[0].offsetHeight + parseFloat(mi.css('margin-bottom'))
  height=$("#leftpantab")[0].offsetHeight-(miHeight*count+dykH);
  if (height < 100)
    height = 100;
  $('#leftpan .leftgroup .leftcontent').css('height', height-12+'px');
}

osm.leftpan.item = function(item, on) {
  if (item === 'leftpersmap') {
    if (on) {
      osm.markers.personalMap();
    } else {
    }
  } else if (item === 'leftvalidator') {
    if (on) {
      $('#lefterrorspan').addClass('on');
      $('#mainmenu .current li.errors').addClass('active');
      osm.validators.enable();
    } else {
      osm.validators.disable();
    }
  } else if (item === 'leftpoi') {
    if (on) {
      osm.poi.enable();
    } else {
      osm.poi.disable();
    }
  } else if (item === 'leftsearch') {
    if (on) {
      search.enable();
      $('#leftsearch').show();
    } else {
      search.disable();
    }
  } else if (item === 'leftosb') {
    if (on) {
      osm.map.addLayer(osm.layers.osb);
    } else {
      osm.map.removeLayer(osm.layers.osb);
    }
  }
};

osm.leftpan.toggleItem = function(item, on) {
  el = $('#leftpantab #'+item+' .leftcontent');
  delay = 0;
  if (typeof on == "undefined") on = !el.is(':visible');
  if (this.toggleItem_open) {
    osm.leftpan.item(this.toggleItem_open, false);
    $('#leftpantab #'+this.toggleItem_open+' .leftcontent').hide("normal");
    delay = 300;
  }
  if (on) {
    osm.leftpan.toggle(true);
    osm.leftpan.item(item, true);
    el.stop().delay(delay).show("normal");
    osm.leftpan.refsizetab();
  } else if (this.toggleItem_open != item) {
    osm.leftpan.item(item, false);
    el.hide("normal");
  }
  
  this.toggleItem_open = item;
};

osm.leftpan.toggle = function(on) {
  if (typeof on == "undefined") on = !this.toggle_open;
  if (on != this.toggle_open) {
    if (on) {
      $('article[role=main]').removeClass('hlp');
    }
    else {
      $('article[role=main]').addClass('hlp');
    }
  }
  this.toggle_open = on;
  osm.setCookie("_osm_leftpan=" + (on?"true":"false"));
};

osm.toppan_toggle = function(on) {
  if (on === undefined) on = !this.on;
  if (on != this.on) {
    if (on) {
      $('body').removeClass('htp');
    }
    else {
      $('body').addClass('htp');
    }
    on ? $('#ttoggle').html("&uarr;") : $('#ttoggle').html("&darr;");
    osm.setCookie("_osm_htp=" + (on?"true":"false"));
  }
  this.on = on;
};

osm.onPermalink = function () {
  mapCenter=osm.map.getCenter();
  osm.permalink.href = 'http://' + location.host + '?lat=' + mapCenter.lat + '&lon=' + mapCenter.lng + '&zoom=' + osm.map._zoom;
};

osm.ui.whereima = function() {
	osm.map.on('locationerror', function(e) {
		console.log("Browser based geo-location failed");
	});

	osm.map.locate({setView: true, maxZoom: 16});
};

osm.ui.togglehtp = function() {
  $('body').hasClass('htp') ? $('#htpbutton').html("&uarr;") : $('#htpbutton').html("&darr;");
  $('body').toggleClass('htp');
  var on = !$('body').hasClass('htp');
  osm.setCookie("_osm_htp=" + on);
  setTimeout("osm.leftpan.refsizetab()", 100);
};

osm.ui.searchsubmit = function() {
  return search.search($_('qsearch').value);
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
  $('#opento-wikimapia')[0].href = 'http://wikimapia.org/#' + 'lat=' + center.lat + '&lon=' + center.lng + '&z=' + zoom;
  $('#opento-bing')[0].href = 'http://www.bing.com/maps/?' + 'cp=' + center.lat + '~' + center.lng + '&lvl=' + zoom;
  $('#opento-panoramio')[0].href = 'http://www.panoramio.com/map/#' + 'lt=' + center.lat + '&ln=' + center.lng + '&z=' + (17 - zoom);
}

