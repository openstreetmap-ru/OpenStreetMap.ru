//var _this = this;

osm.poi = {
  i18n: {},
  // layers:{},
  opt:{

  },

  initialize: function() {
    osm.poi.layer = new L.LayerGroup();
    //osm.map.addLayer(osm.poi.layer);
    osm.poi.tree=$('#leftpoi div.leftcontent')
      .jstree({
        "plugins" : ["json_data", "checkbox","ui"],
        "json_data" : {
          "ajax" : {
            "type": 'GET',
            "url": "data/poidatatree.json"
          }
        },
        "checkbox": {
          "override_ui": true
        }
      })
      .bind("change_state.check_box.jstree", function (event, data) {
        osm.poi.updateMarkerTree(event, data);
      });
    $.getJSON('data/poimarker.json',
      function(results){
        osm.poi._markers=results;
      }
    )
  },

  enable: function() {
    osm.map.addLayer(osm.poi.layer);
    this.opt.on=true;
    osm.map.on('moveend', osm.poi.updateMarkerTree);
    // osm.map.on('popupopen', osm.poi.bindOpenPopup);
    // osm.map.on('popupclose', osm.poi.bindClosePopup);
  },

  disable: function() {
    this.opt.on=false;
    osm.map.removeLayer(osm.poi.layer);
    osm.map.off('moveend',this.updateMarkerTree);
    // osm.map.off('popupopen', osm.poi.bindOpenPopup);
    // osm.map.off('popupclose', osm.poi.bindClosePopup);
  },

  choiceMarker: function(nclass){
    if (osm.poi._markers.indexOf(nclass) == -1)
      icon_url = 'img/marker-poi.png';
    else
      icon_url = 'img/poi_marker/'+nclass+'.png';
    return icon_url;
  },

  updateMarkerTree: function(){
    if (osm.poi.ajax && osm.poi.ajax.state() == "pending")
      osm.poi.ajax.abort();
    $("#leftpoi .loader").addClass('on');
    var checked=$('.jstree-checked.jstree-leaf', osm.poi.tree );
    if (checked.length) {
      var nclass=[];
      for (i=0;i<checked.length;i++) {
        nclass.push(checked[i].attributes['nclass'].nodeValue);
      }
      nclass=nclass.join(',');
      var bounds = osm.map.getBounds();
      var sw = bounds.getSouthWest(), ne = bounds.getNorthEast();
      osm.poi.ajax=$.getJSON('/api/poi', {action:"getpoibbox", nclass:nclass, t:ne.lat, r:ne.lng, b:sw.lat, l:sw.lng},
        function(results){
          markers={};
          for (item1 in osm.poi.layer._layers){
            markers[$(osm.poi.layer._layers[item1]._popup._content,'div.poi_popup').attr('id')]=osm.poi.layer._layers[item1]
          }
          for (item2 in results.data){
            if (markers[results.data[item2].id]){
              delete markers[results.data[item2].id];
            }
            else {
              icon_url = osm.poi.choiceMarker(results.data[item2].nclass);
              _marker = new L.Marker(new L.LatLng(results.data[item2].lat, results.data[item2].lon), {icon:new osm.poi.poiIcon({iconUrl: icon_url})});
              _marker.bindPopup(osm.poi.createPopupText(results.data[item2]));
              osm.poi.layer.addLayer(_marker);
            }
          }
          for (item3 in markers){
            osm.map.removeLayer(markers[item3]);
            delete osm.poi.layer._layers[markers[item3]._leaflet_id];
          }
          $("#leftpoi .loader").removeClass('on');
        })
      .error(
        function(jqXHR, textStatus, errorThrown){
          $("#leftpoi .loader").removeClass('on');
          if (textStatus!="abort") {
            console.log('Ошибка: ' + textStatus + '<br />' + errorThrown.message);
          }
        });
    }
    else {
      $("#leftpoi .loader").removeClass('on');
      osm.poi.layer.clearLayers();
    }
  },
  poiIcon :  L.Icon.extend({
		options: {
			//iconUrl: 'img/marker-icon.png',
			iconSize: new L.Point(31, 31),
			shadowSize: new L.Point(0, 0),
			iconAnchor: new L.Point(16, 30),
			popupAnchor: new L.Point(0, -11)
		}
	}),

  createPopupText: function(getdata) {
    if (!(getdata == null)) {
      var operator;
      if (!(getdata.operator==null)) {
        operator=$('<tr>').addClass('poi_operator')
          .append($('<td>').text('Владелец: '))
          .append($('<td>').text(getdata.operator).addClass('poi_value'))
      }
      var brand;
      if (!(getdata.brand==null)) {
        brand=$('<tr>').addClass('poi_brand')
          .append($('<td>').text('Бренд: '))
          .append($('<td>').text(getdata.brand).addClass('poi_value'))
      }
      var phone;
      if (!(getdata.phone==null)) {
        phone=$('<tr>').addClass('poi_phone')
          .append($('<td>').text('Телефон: '))
          .append($('<td>').addClass('poi_value')
            .append($('<a>').attr('href', 'tel:'+getdata.phone).text(getdata.phone))
          )
      }
      var fax;
      if (!(getdata.fax==null)) {
        fax=$('<tr>').addClass('poi_fax')
          .append($('<td>').text('Факс: '))
          .append($('<td>').text(getdata.fax).addClass('poi_value'))
      }

      var website;
      if (!(getdata.website==null)) {
        // assume http:// for protocol-less links
        var properLink = getdata.website;
        if (properLink.indexOf(':') < 0) {
          properLink = 'http://' + properLink;
        }

        website=$('<tr>').addClass('poi_website')
          .append($('<td>').text('Web-сайт: '))
          .append($('<td>').addClass('poi_value')
            .append($('<a>').attr('href', properLink).attr('target', '_blank').text(getdata.website))
          );
      }

      var moretags=$('');
      for (xName in getdata.tags_ru) {
        if (getdata.tags_ru[xName]!="неизвестно") {
          moretags.after($('<tr>').addClass('poi_moretags')
            .append($('<td>').text(xName+': '))
            .append($('<td>').text(getdata.tags_ru[xName])))
        }
      }

      var opening_hours;
      if (!(getdata.opening_hours==null)) {
        getdata.opening_hours = getdata.opening_hours.toLowerCase()
          .replace(/([a-z].) /g, '$1: ')
          .replace(/mo-fr/g, 'по будням')
          .replace(/sa-su/g, 'по выходным')
          .replace(/mo-su/g, 'ежедневно')
          .replace(/mo/g, 'Пн')
          .replace(/tu/g, 'Вт')
          .replace(/we/g, 'Ср')
          .replace(/th/g, 'Чт')
          .replace(/fr/g, 'Пт')
          .replace(/sa/g, 'Сб')
          .replace(/su/g, 'Вс')
          .replace('24/7', 'круглосуточно')
          .replace(/off/g, 'не работает')
          .replace(/,(?!\s)/g, ', ')
          .replace(/-(?=\d)/g, '—')
          .replace(/\s*;\s*/g, ' | ');
        getdata.opening_hours = getdata.opening_hours.charAt(0).toUpperCase() + getdata.opening_hours.substr(1);
        opening_hours=$('<tr>').addClass('poi_opening_hours')
          .append($('<td>').text('Время работы: '))
          .append($('<td>').text(getdata.opening_hours||osm.poi.opt.nulldisplay).addClass('poi_value'))
      }
      ret = $('<div>').addClass('poi_popup').attr('id',getdata.id)
        .append($('<p>').addClass('poi_header')
          .append($('<span>').text(getdata.class_ru).addClass('poi_name'))
          .append($('<span>').text(getdata.name_ru||'').addClass('poi_value'))
        )
        .append($('<table>')
          .append(opening_hours)
          .append($('<tr>').addClass('poi_addr')
            .append($('<td>').text('Адрес: '))
            .append($('<td>').text(getdata.addr_full_name||"").addClass('poi_value'))
          )
          .append(operator)
          .append(brand)
          .append(phone)
          .append(fax)
          .append(website)
          .append(moretags)
        )

      return $('<div>').append(ret.clone()).remove().html();
    }
  },

  createPopup: function(id, marker) {
    var textPopup = $('<img src="/img/loader.gif">')
    textPopup = $('<div>').append(textPopup.clone()).remove().html();
    marker.bindPopup(textPopup);
    $.getJSON("/api/poi", {action: 'getpoiinfo', id: id}, function(json){
      if (!(json.data == null)) {

        textP = osm.poi.createPopupText(json.data);

        isopen=osm.map.hasLayer(marker._popup);
        if (isopen) {marker.closePopup();}
        marker.bindPopup(textP,{maxWidth:400});
        icon_url = osm.poi.choiceMarker(json.data.nclass);
        marker.setIcon(new osm.poi.poiIcon({iconUrl: icon_url}));
        if (isopen) {marker.openPopup();}
      }
    })
  },

  bindOpenPopup: function(){
    osm.poi.openpopup=arguments[0].popup;
  },
  bindClosePopup: function(){
    delete osm.poi.openpopup;
  }

}

osm.poi.opt={
  on: false,
  nulldisplay: "Неизвестно"
}
