osm.markers = {
  _drawingMode: 0,// 0 - nothing, 1 - marker (single, permalink), 2 - multimarker, 3 - line
  _layerGroup: 0,
  _newPath: 0, 
  _data: {
    points: [],
    lines: []
  },
  _icons: [
    new L.Icon('/img/marker.png'),
    new L.Icon('/img/marker-red.png'),
    new L.Icon('/img/marker-green.png'),
    new L.Icon('/img/marker-yellow.png'),
    new L.Icon('/img/marker-violet.png'),
    new L.Icon('/img/marker-orange.png')
  ],
  _line_color: [
    '#0033FF',
    '#F21D53',
    '#22dd44',
    '#F1E415',
    '#9B5BA0',
    '#E48530'
  ],
  _admin: {
    hash: '',
    id: -1,
    editable: false
  }
}
osm.markers.initialize = function() {
  osm.markers._layerGroup = new L.LayerGroup();
  osm.map.addLayer(osm.markers._layerGroup);
}
osm.markers.decodehtml = function(s) {
  if(s) return $("<div/>").html(s).text(); else return s;
}
osm.markers.addPoint = function () {
  if (osm.markers._removeHandlers() === 1)
    return;

  osm.map.on('click', osm.markers.createPoint);
  $_('map').style.cursor = 'crosshair';
  osm.markers._drawingMode = 1;
}
osm.markers.createPoint = function(e) {
	osm.map.permalink._popup_marker(e.latlng);
	osm.map.off('click', osm.markers.createPoint);
	$_('map').style.cursor='';
}
osm.markers.personalMap = function() {
  osm.leftpan.toggle(2);
  osm.markers._admin.editable = true;
}

osm.markers._removeHandlers = function() {
  var oldDrawingMode = osm.markers._drawingMode;
  var func, elementId;
  switch(osm.markers._drawingMode){
  case 1:
      func = osm.markers.createPoint;
      elementId = '';
      break;
  case 2:
      func = osm.markers.createPoints;
      elementId = 'multimarkerbutton';
      break;
  case 3:
      func = osm.markers.createPath;
      elementId = 'pathbutton';
      // remove mousemove event if any
      $("#map").unbind("mousemove", osm.markers.mouseMovePath);
//      osm.map.doubleClickZoom.enable();
      osm.markers._newPath.finishEditing(true);
      break;
  default:
    return 0;
  }
  osm.map.off('click', func);
  if (elementId)
    $_(elementId).className = '';
  $_('map').style.cursor='';
  osm.markers._drawingMode = 0;
  return oldDrawingMode;
}

osm.markers.addMultiMarker = function() {
  if (osm.markers._removeHandlers() === 2)
    return;

  osm.map.on('click', osm.markers.createPoints);
  $_('multimarkerbutton').className = 'pm-pressed';
  $_('map').style.cursor = 'crosshair';
  osm.markers._drawingMode = 2;
}
osm.markers.createPoints = function(e) {
  var count = 0;
  var mlen = osm.markers._data.points.length;
  for(var i=0; i < mlen; i++) {
    if (osm.markers._data.points[i])
      count++;
  }
  if (count >= osm.markers._max_markers) {
    alert("Маркеров не может быть больше " + osm.markers._max_markers);
    return;
  }

  var p = new PersonalMarkerEditable(e.latlng);
  p.openPopup();
}

osm.markers.addPath = function() {
  if (osm.markers._removeHandlers() === 3)
    return;

  osm.map.on('click', osm.markers.createPath);
  $_('pathbutton').className = 'pm-pressed';
  $_('map').style.cursor = 'crosshair';
  osm.markers._drawingMode = 3;
  osm.markers._newPath = new PersonalLineEditable([]);
}
osm.markers.createPath = function(e) { // todo: move it to PersonalLine?
  var count = 0;
  var mlen = osm.markers._data.lines.length;
  for(var i=0; i < mlen; i++) {
    if (osm.markers._data.lines[i])
      count+=osm.markers._data.lines[i].getLatLngs().length;
  }
  if (osm.markers._newPath)
  count+=osm.markers._newPath.getLatLngs().length-1;
  if (count >= osm.markers._max_line_points) {
    alert("Суммарно точек в линиях не может быть больше "+
      osm.markers._max_line_points);
    return;
  }
  osm.markers._newPath.addLatLng(e.latlng);
  if (osm.markers._newPath.getLatLngs().length === 1) {
    osm.markers._newPath.addLatLng(e.latlng);
//    osm.map.doubleClickZoom.disable();
    $('#map').mousemove(osm.markers.mouseMovePath);
    // TODO: add enable editing after moving to Leaflet 0.4
  }
  if (osm.markers._newPath.getLatLngs().length > 2) {
    var points = osm.markers._newPath.getLatLngs();
    var p1 = osm.map.latLngToLayerPoint(points[points.length-3]);
    var p2 = osm.map.latLngToLayerPoint(points[points.length-2]);
    if (p1.distanceTo(p2)<3) {
      points.pop();
      osm.markers._removeHandlers();
    }
  }
}
osm.markers.mouseMovePath = function(event){
  var points = osm.markers._newPath.getLatLngs();
  var coord = osm.map.mouseEventToLatLng(event);
  points[points.length-1] = coord;
  osm.markers._newPath._redraw(); //TODO: change _redraw to redraw after moving to Leaflet 0.4
}

// TODO: when IE whould support placeholder attribute for input elements - remove that
osm.markers.focusDefaultInput = function(el) {
  if(el.value==el.defaultValue) {
    el.value='';
  }
  el.className = 'default-input-focused';
}
osm.markers.blurDefaultInput = function(el) {
  if(el.value=='') {
    el.value=el.defaultValue;
    el.className = 'default-input';
  }
}

osm.markers.saveMap = function() {
  osm.markers._removeHandlers();
  var postData = {};
  var mapName = "";
  var mapDescription = "";
  postData.points = [];
  postData.lines = [];
  var mlen = osm.markers._data.points.length;
  for(var i = 0; i < mlen; i++) {
    var point = osm.markers._data.points[i];
    if (!point) continue;
    var coords = point.getLatLng();
    postData.points.push({
      lat:          coords.lat,
      lon:          coords.lng,
      name:         point._pm_name,
      description:  point._pm_description,
      color:        point._pm_icon_color
    });
  }
  var llen = osm.markers._data.lines.length;
  for(var i = 0; i < llen; i++) {
    var line = osm.markers._data.lines[i];
    if (!line) continue;
    var lineData = {
      name:       line._pl_name,
      description:line._pl_description,
      color:      line._pl_color_index,
      points:     []
    };
    var lPoints = line.getLatLngs();
    var lplen = lPoints.length;
    for(var j = 0; j < lplen; j++)
      lineData.points.push([lPoints[j].lat, lPoints[j].lng]);

    postData.lines.push(lineData);
  }
  if (postData.points.length == 0 && postData.lines.length == 0) {
    $_("pm_status").innerHTML = "Нет данных для сохранения!"
  } else {
    $_("pm_status").innerHTML = "Сохранение...";
    $.ajax({
      url: "mymap.php",
      type: "POST",
      data: {
        action:       "save",
        name:         mapName,
        description:  mapDescription,
        data:         postData,
        hash:         osm.markers._admin.hash,
        id:           osm.markers._admin.id
      },
      dataType: 'json',
      success: function(json, text, jqXHR){
        if (json.id) {
          osm.markers._admin.id = json.id;
          osm.markers._admin.hash = json.hash;
        }
        $_("pm_status").innerHTML = "Сохранено<br>"+
          "<a href='/?mapid="+osm.markers._admin.id+"'>Ссылка на просмотр</a><br>"+
          "<a href='/?mapid="+osm.markers._admin.id+"&hash="+osm.markers._admin.hash+"'>Ссылка на редактирование</a><br>"+
          "<a href='/mymap.php?id="+osm.markers._admin.id+"&format=gpx'>Скачать GPX</a>";
      }
    }).fail(function (jqXHR,textStatus) {
      $_("pm_status").innerHTML = "Ошибка при сохранении!";
    });
  }
}

osm.markers.readMap = function() {
  var url = document.URL;
  var results = url.match(/\Wmapid=(\d+)/);
  if (!results)
    return;
  var mapid = results[1];
  results = url.match(/\Whash=([0-9a-fA-F]{32})/);
  var adminhash = "";
  if (results)
    adminhash = results[1];
  $.ajax({
    url: "mymap.php",
    type: "POST",
    data: {
      action: "load",
      id:     mapid,
      hash:   adminhash
    },
    dataType: 'json',
    success: function(json, text, jqXHR){
      if (!json.service.existing) { alert("Карта не существует"); return; }
      osm.markers._admin.editable = json.service.editing;
      osm.markers._admin.hash = adminhash;
      osm.markers._admin.id = mapid;
      if (osm.markers._admin.editable)
        osm.leftpan.toggle(2);
      //process map name and description
      var latlngs = new Array();
      var p;
      if (json.data.points)
        for(var i=0;i<json.data.points.length;i++) {
          var point = json.data.points[i];
          var coords = new L.LatLng(point.lat, point.lon);
          latlngs.push(coords);
          if (osm.markers._admin.editable)
            p = new PersonalMarkerEditable(coords, point);
          else
            p = new PersonalMarker(coords, point);
        }
      if (json.data.lines)
        for(var i=0;i<json.data.lines.length;i++) {
          var line = json.data.lines[i];
          var coords = [];
          for(var j=0;j<line.points.length; j++) {
            var point = new L.LatLng(line.points[j][0], line.points[j][1]);
            coords.push(point);
            latlngs.push(point);
          }
          if (osm.markers._admin.editable) {
            p = new PersonalLineEditable(coords, line);
            p.finishEditing(false);
          }
          else
            p = new PersonalLine(coords, line);
        }
      if (latlngs.length>1)
        osm.map.fitBounds(new L.LatLngBounds(latlngs));
      else if (latlngs.length==1) {
        osm.map.panTo(latlngs[0]);
        if (p._popup) {// TODO: remove for Leaflet 0.4
          p.openPopup();
          if (p instanceof PersonalMarkerEditable)
            p.loadEditableMarker();
        }
      }
    } // TODO: add failure handler
  }).fail(function (jqXHR, textStatus) {
    alert("Произошла ошибка при чтении карты");
  });
}

PersonalMarker = L.Marker.extend({ // simple marker without editable functions
  initialize: function(coords, details) {
    this.setLatLng(coords);
    this.addToLayerGroup();
    this.fillDetails(details);
    if (this._pm_name || this._pm_description) {
      var popupHTML = $_('pm_show_popup').innerHTML;
      popupHTML = popupHTML.replace(/\#name/g, this._pm_name);
      popupHTML = popupHTML.replace(/\#description/g, this._pm_description);
      this.bindPopup(popupHTML);
    }
  },
  fillDetails: function(details) {
    if (!details) return;

    this._pm_name = details.name;
    this._pm_description = details.description;
    this._set_pm_icon_color(details.color);
  },
  addToLayerGroup: function() {
    if (!osm.markers._layerGroup) {
      osm.markers._layerGroup = new L.LayerGroup();
      osm.map.addLayer(osm.markers._layerGroup);
    }
    osm.markers._layerGroup.addLayer(this);
  },
  _set_pm_icon_color: function(colorIndex) {
    if (isNaN(parseFloat(colorIndex)) || !isFinite(colorIndex) ||
      colorIndex < 0 || colorIndex >= osm.markers._icons.length )
      colorIndex = 0;
    this.setIcon(osm.markers._icons[colorIndex]);
    this._pm_icon_color = colorIndex;
  }
});

PersonalMarkerEditable = PersonalMarker.extend({
  initialize: function(coords, details) {
    this.setLatLng(coords);
    this.setIcon(osm.markers._icons[0]);
    this.fillDetails(details);
    // fix html entities for editable markers
    this._pm_name = osm.markers.decodehtml(this._pm_name);
    this._pm_description = osm.markers.decodehtml(this._pm_description);
    osm.markers._data.points.push(this);
    this.index = osm.markers._data.points.length - 1;
    this.addToLayerGroup();
    var popupHTML = $_('pm_edit_popup').innerHTML;
    popupHTML = popupHTML.replace(/\$\$\$/g, 'osm.markers._data.points['+this.index+']');
    popupHTML = popupHTML.replace(/\#\#\#/g, this.index);
    this.bindPopup(popupHTML);
    this.on('click', function(e){e.target.loadEditableMarker(e)});
  },
  saveData: function() {
    var nameEl = $_('marker_name_'+this.index);
    this._pm_name = (nameEl.value==nameEl.defaultValue? '': nameEl.value);

    var nameEl = $_('marker_description_'+this.index);
    this._pm_description = (nameEl.value==nameEl.defaultValue? '': nameEl.value);
  },
  toggleCheck: function(colorIndex) {
    var colorBoxes = $_('marker_popup_'+this.index).getElementsByClassName('colour-picker-button');
    for (var i=0; i < colorBoxes.length; i++) {
      colorBoxes[i].innerHTML = '';
    }
    colorBoxes[colorIndex].innerHTML = '&#x2713;';

    this._set_pm_icon_color(colorIndex);
  },
  loadEditableMarker: function(event) {
    if (this._pm_name) {
      $_('marker_name_'+this.index).value = this._pm_name;
      $_('marker_name_'+this.index).className = 'default-input-focused';
    }
    if (this._pm_description) {
      $_('marker_description_'+this.index).value = this._pm_description;
      $_('marker_description_'+this.index).className = 'default-input-focused';
    }
    if (this._pm_icon_color) {
      this.toggleCheck(this._pm_icon_color);
    }
  },
  remove: function() {
    osm.markers._layerGroup.removeLayer(this);
    delete osm.markers._data.points[this.index];
  }
});

PersonalLine = L.Polyline.extend({
  initialize: function(points, details) {
    this.setLatLngs(points);
    this.addToLayerGroup();
    this.fillDetails(details);
    if (this._pl_name || this._pl_description) {
      var popupHTML = $_('pl_show_popup').innerHTML;
      popupHTML = popupHTML.replace(/\#name/g, this._pl_name);
      popupHTML = popupHTML.replace(/\#description/g, this._pl_description);
      this.bindPopup(popupHTML);
    }
  },
  fillDetails: function(details) {
    if (!details) return;

    this._pl_name = details.name;
    this._pl_description = details.description;
    this._pl_color_index = details.color;
    this._pl_weight = details.weight;
    this._updateLineStyle(); //uncomment after coloring lines - color is incorrect
  },
  _updateLineStyle: function() {
    var properties = {};
    if (this._pl_color_index !== undefined) properties.color = osm.markers._line_color[this._pl_color_index];
    this.setStyle(properties);
  },
  addToLayerGroup: function() {
    if (!osm.markers._layerGroup) {
      osm.markers._layerGroup = new L.LayerGroup();
      osm.map.addLayer(osm.markers._layerGroup);
    }
    osm.markers._layerGroup.addLayer(this);
  }
});
PersonalLineEditable = PersonalLine.extend({
  initialize: function(points, details) {
    this.setLatLngs(points);
    this.fillDetails(details);
    this.addToLayerGroup();
    this._pl_name = osm.markers.decodehtml(this._pl_name);
    this._pl_description = osm.markers.decodehtml(this._pl_description);
  },
  remove: function() {
    if (this._popup) this._popup._close();
    osm.markers._layerGroup.removeLayer(this);
    if (this.index !== undefined)
      delete osm.markers._data.lines[this.index];
  },
  finishEditing: function(truncate) {
    var points = this.getLatLngs();
    if (truncate) {
      points.pop();
      this._redraw();//->redraw in Leaflet 0.4
    }
    if (points.length < 2) {
      this.remove();
      return;
    }
    osm.markers._data.lines.push(this);
    this.index = osm.markers._data.lines.length - 1;
    var popupHTML = $_('pl_edit_popup').innerHTML;
    popupHTML = popupHTML.replace(/\$\$\$/g, 'osm.markers._data.lines['+this.index+']');
    popupHTML = popupHTML.replace(/\#\#\#/g, this.index);
    this.bindPopup(popupHTML);
    this.on('click', function(e){e.target.loadEditableLine(e)});
  },
  saveData: function(e) {
    var nameEl = $_('line_name_'+this.index);
    this._pl_name = (nameEl.value==nameEl.defaultValue? '': nameEl.value);

    var nameEl = $_('line_description_'+this.index);
    this._pl_description = (nameEl.value==nameEl.defaultValue? '': nameEl.value);
  },
  loadEditableLine: function(e) {
    if (this._pl_name) {
      $_('line_name_'+this.index).value = this._pl_name;
      $_('line_name_'+this.index).className = 'default-input-focused';
    }
    if (this._pl_description) {
      $_('line_description_'+this.index).value = this._pl_description;
      $_('line_description_'+this.index).className = 'default-input-focused';
    }
    if (this._pl_color_index) {
      this.toggleCheck(this._pl_color_index);
    }
  },
  toggleCheck: function(colorIndex) {
    var colorBoxes = $_('line_popup_'+this.index).getElementsByClassName('colour-picker-button');
    for (var i=0; i < colorBoxes.length; i++) {
      colorBoxes[i].innerHTML = '';
    }
    colorBoxes[colorIndex].innerHTML = '&#x2713;';

    this._pl_color_index = colorIndex;
    this._updateLineStyle();
  }
});
