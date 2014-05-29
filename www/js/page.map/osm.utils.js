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

osm.setLinkOSB = function() {
  if (parseInt(osm.p.get.bugid)) {
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
  var el = $('#leftpantab #'+item+' .leftcontent');
  var delay = 0;
  if (typeof on == "undefined") on = !el.is(':visible');
  if (on) {
    if (this.ltoggleItem_open && this.ltoggleItem_open !== item) {
      osm.leftpan.item(this.ltoggleItem_open, false);
      $('#leftpantab #'+this.ltoggleItem_open+' .leftcontent').hide("normal");
      delay = 300;
    }
    if (!(this.ltoggleItem_open && this.ltoggleItem_open === item)) {
      osm.leftpan.toggle(true);
      osm.leftpan.item(item, true);
      el.stop().delay(delay).show("normal");
      osm.leftpan.refsizetab();
    }
  } else {
    osm.leftpan.item(item, false);
    el.hide("normal");
  }
  if (on)
    this.ltoggleItem_open = item;
  else
    this.ltoggleItem_open = '';
};

osm.leftpan.toggle = function(on) {
  if (typeof this.ltoggle_open == "undefined") this.ltoggle_open = true;
  if (typeof on == "undefined") on = !this.ltoggle_open;
  if (on != this.ltoggle_open) {
    if (on) {
      $('article[role=main]').removeClass('hlp');
    }
    else {
      $('article[role=main]').addClass('hlp');
    }
    osm.map.invalidateSize();
  }
  this.ltoggle_open = on;
  osm.sManager.setP([{type:'cookie', k:'leftpan', v:(on?"true":"false")}]);
};

osm.toppan_toggle = function(on) {
  if (typeof this.ttoggle_open == "undefined") this.ttoggle_open = true;
  if (on === undefined) on = !this.ttoggle_open;
  if (on != this.ttoggle_open) {
    if (on) {
      $('body').removeClass('htp');
    }
    else {
      $('body').addClass('htp');
    }
    osm.map.invalidateSize();
    on ? $('#ttoggle').html("&uarr;") : $('#ttoggle').html("&darr;");
    osm.sManager.setP([{type:'cookie', k:'htp', v:(on?"true":"false")}]);
  }
  this.ttoggle_open = on;
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


// mapperMode
osm.mapperMode = {};

osm.mapperMode.start = function() {
  osm.mapperMode.on = Number(osm.p.cookie.mapperMode) || false;
  if (osm.mapperMode.on) {
    $('#leftpantab #mapperMode ins').addClass('on');
    osm.mapperMode.changeMode();
  }
}

// переключение чекбокса
osm.mapperMode.toggleChecked = function() {
  var e = $('#leftpantab #mapperMode ins');
  e.toggleClass('on');
  this.on = e.hasClass('on');
  osm.sManager.setP([{type:'cookie', k:'mapperMode', v:Number(this.on)}]);
  osm.mapperMode.changeMode();
  return false;
}

osm.mapperMode.changeMode = function() {
  if (osm.mapperMode.on) {
    $('body').addClass('mapperMode');
    // inJOSM
    osm.map.addControl(osm.inJOSM);
  }
  else {
    $('body').removeClass('mapperMode');
    // inJOSM
    osm.map.removeControl(osm.inJOSM);
  }
}

