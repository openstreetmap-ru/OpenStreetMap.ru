//var _this = this;
(function() {

osm.poi = {
  i18n: {},
  // layers:{},
  opt:{
    on: false,
    nulldisplay: "Неизвестно",
    alphabet: '0123456789_~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    loaded: false,
    runLoaded: false
  },

  initialize: function() {
    osm.poi.layer = new L.LayerGroup();
    //osm.map.addLayer(osm.poi.layer);
    osm.poi.tree=$('#leftpoi #leftpoiTree')
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
        if (poi.opt.decodeWork)
          return;
        osm.poi.updateMarkerTree(event, data);
        poi.codePerm();
      })
      .bind("uncheck_node.check_box.jstree", function (event, data) {
        if (poi.opt.decodeWork)
          return;
        poi.checkClone(data);
      })
      .bind('loaded.jstree', function(event, data){
        poi.opt.loaded = true;
        if (poi.opt.runLoaded)
          poi.decodePerm();
      });
    $.getJSON('data/poimarker.json',
      function(results){
        osm.poi._markers=results;
      }
    );
    $.getJSON('data/poidatalistperm.json',
      function(results){
        poi.opt.listPerm = results;
      }
    );
    osm.sManager.on(['poi'], function(){poi.decodePerm();});
  },

  enable: function() {
    osm.map.addLayer(osm.poi.layer);
    this.opt.on=true;
    osm.map.on('moveend', osm.poi.updateMarkerTree);
    if (poi.opt.code)
      osm.sManager.setP([{type:'anchor', k:'poi', v:poi.opt.code}]);
  },

  disable: function() {
    this.opt.on=false;
    osm.map.removeLayer(osm.poi.layer);
    osm.map.off('moveend',this.updateMarkerTree);
    osm.sManager.setP([{type:'anchor', k:'poi', del:1}]);
  },

  choiceMarker: function(nclass){
    if (osm.poi._markers.indexOf(nclass) == -1)
      icon_url = 'img/marker-poi.png';
    else
      icon_url = 'img/poi_marker/'+nclass+'.png';
    return icon_url;
  },
  
  checkClone: function(e){
    var nclassArr = []
    if (e.rslt.obj[0].classList.contains("jstree-unchecked")) {
      var nclassArr = [e.rslt.obj[0].attributes['nclass'].nodeValue];
      var checked = $('li.jstree-unchecked',e.rslt.obj[0]);
      if (checked.length) {
        for (var i = 0; i < checked.length; i++)
          nclassArr.push(checked[i].attributes['nclass'].nodeValue);
      }
      for (var i = 0; i < nclassArr.length; i++) {
        var el = $('[nclass=' + nclassArr[i] + ']', poi.tree);
        poi.tree.jstree('uncheck_node', el);
      }
    }
  },
  
  codePerm: function(){
    var checked=$('.jstree-checked', poi.tree);
    if (checked.length) {
      var idArr = []
      for (var i = 0; i < checked.length; i++) {
        var nclass = checked[i].attributes['nclass'].nodeValue;
        var id = poi.opt.listPerm.indexOf(nclass);
        if (id != -1)
          idArr.push(id);
      }
      var code = poi.numset_pack(idArr);
      poi.opt.code = code;
      osm.sManager.setP([{type:'anchor', k:'poi', v:code}]);
    }
    else {
      osm.sManager.setP([{type:'anchor', k:'poi', del:1}]);
      poi.opt.code = '';
    }
  },

  decodePerm:function(){
    if (poi.opt.code === osm.p.anchor.poi)
      return;
    if (!poi.opt.loaded) {
      poi.opt.runLoaded = true;
      osm.leftpan.toggleItem('leftpoi', true);
      return;
    }
    console.debug(new Date().getTime() + ' osm.poi.decodePerm');
    var code = osm.p.anchor.poi || '';
    var uncode = poi.numset_unpack(code);
    
    poi.opt.decodeWork = true;
    poi.tree.jstree('uncheck_all');
    for (var i in uncode){
      var name = poi.opt.listPerm[uncode[i]] || '';
      if (name) {
        var el = $('[nclass=' + name + ']', poi.tree);
        poi.tree.jstree('check_node', el);
      }
    }
    
    poi.opt.decodeWork = false;
    osm.leftpan.toggleItem('leftpoi', true);
    poi.updateMarkerTree();
  },

  numset_pack: function(numbers) {
    // Sort input
    var sorted_numbers = numbers.slice(0);
    sorted_numbers.sort(function(a,b){return a-b;});
 
    // RLE
    var lengths = [];
    var empty_range_start = 0;
    for (var pos = 0; pos < sorted_numbers.length; ++pos) {
      // starting number of current range
      var full_range_start = sorted_numbers[pos];

      // trace continuous range of numbers (allows duplicates)
      while (pos + 1 < sorted_numbers.length && sorted_numbers[pos + 1] <= sorted_numbers[pos] + 1)
        pos++;

      // ending number of current range
      var full_range_end = sorted_numbers[pos];

      // save next empty range
      lengths.push(full_range_start - empty_range_start);

      // save next full range
      lengths.push(full_range_end - full_range_start + 1);

      empty_range_start = full_range_end + 1;
    }
 
    // Prefix encoding
    var output = '';
    for (var pos = 0; pos < lengths.length; ++pos) {
      while (lengths[pos] >= 32) {
        // Store high-order parts of a number in 1XXXXX form
        var lowpart = lengths[pos] & 0x1f;
        lengths[pos] = lengths[pos] >> 5;
        lowpart |= 0x20;
        output += '' + poi.opt.alphabet.substr(lowpart, 1);
      }
      // Store low-order part of a number in 0XXXXX form
      output += '' + poi.opt.alphabet.substr(lengths[pos], 1);
    }
 
    return output;
  },
   
  numset_unpack: function(str) {
    var output = [];
    var full_range = 0;  // wether we currently decode full range
    var range_start = 0; // start of current range
    var number = 0; // currently decoded number
    var shift = 0;  // shift for high-order parts
    for (var pos = 0; pos < str.length; ++pos) {
      var decoded = poi.opt.alphabet.indexOf(str[pos]);;
      if (decoded & 0x20) {
        // handle high-order parts
        decoded = decoded & 0x1f;
        number = number | (decoded << shift);
        shift += 5;
      } else {
        // number is fully decoded
        number = number | (decoded << shift);
        if (full_range) {
          // if it denotes full range, output it
          for (var i = range_start; i < range_start + number; i++)
            output.push(i);
        }
        full_range = !full_range;
        range_start += number;
        number = 0;
        shift = 0;
      }
    }
    return output;
  },

  updateMarkerTree: function(){
    console.debug(new Date().getTime() + ' osm.poi.updateMarkerTree');
    if (osm.poi.ajax && osm.poi.ajax.state() == "pending")
      osm.poi.ajax.abort();
    $("#leftpoi .loader").addClass('on');
    var checked=$('.jstree-checked', osm.poi.tree);
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
			iconSize: new L.Point(32, 37),
			shadowSize: new L.Point(0, 0),
			iconAnchor: new L.Point(16, 35),
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
        
        getdata.website = getdata.website.toLowerCase()
          .replace(/(http:\/\/)?(www.)?(.+)/g, '$3')
          .replace(/(.+)(\/$)/gm, '$1')
        if (getdata.website.length > 18)
          getdata.website = getdata.website.substr(0,16) + '...';
        
        website=$('<tr>').addClass('poi_website')
          .append($('<td>').text('Web-сайт: '))
          .append($('<td>').addClass('poi_value')
            .append($('<a>').attr('href', properLink).attr('target', '_blank').text(getdata.website))
          );
      }

      var email;
      if (!(getdata.email==null)) {
        email=$('<tr>').addClass('poi_email')
          .append($('<td>').text('E-mail: '))
          .append($('<td>').addClass('poi_value')
            .append($('<a>').attr('href', 'mailto:' + getdata.email).text(getdata.email))
          );
      }

      var moretags=$('');
      for (xName in getdata.tags_ru) {
        if (getdata.tags_ru[xName]!="неизвестно" && getdata.tags_ru[xName]!='' && getdata.tags_ru[xName]!==null) {
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

      var description;
      if (!(getdata.description==null)) {
        description=$('<tr>').addClass('poi_description')
          .append($('<td>').text('Описание: '))
          .append($('<td>').text(getdata.description).addClass('poi_value'))
      }
      
      // addr
      if (getdata.addr_street) {
        getdata.addr = getdata.addr_street;
        getdata.addr += (getdata.addr_house ? ', '+getdata.addr_house : '');
      }
      else if (getdata.addr_city)
        getdata.addr = getdata.addr_city;
      else if (getdata.addr_village)
        getdata.addr = getdata.addr_village;
      else
        getdata.addr = getdata.addr_full_name;
      
      getdata.addr = getdata.addr
        .replace(/улица/g, 'ул.')
        .replace(/проспект/g, 'пр-т.')
        .replace(/дом /g, '');
      

      ret = $('<div>').addClass('poi_popup').attr('id',getdata.id)
        .append($('<p>').addClass('poi_header')
          .append($('<span>').text(getdata.class_ru).addClass('poi_name'))
          .append($('<span>').text(getdata.name_ru||'').addClass('poi_value'))
        )
        .append($('<table>')
          .append(opening_hours)
          .append($('<tr>').addClass('poi_addr')
            .append($('<td>').text('Адрес: '))
            .append($('<td>').text(getdata.addr ||"").addClass('poi_value'))
          )
          .append(operator)
          .append(brand)
          .append(phone)
          .append(fax)
          .append(website)
          .append(email)
          .append(moretags)
          .append(description)
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
  }

}

var poi = osm.poi;

}).call(this);