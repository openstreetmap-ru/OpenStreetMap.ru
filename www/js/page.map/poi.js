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
    runLoaded: false,
    popupOptions: {minWidth: 242, maxWidth: 350},
    linkLength: 24
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
              _marker.bindPopup(osm.poi.createPopupText(results.data[item2]), osm.poi.opt.popupOptions);
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
    function createListValue(p, isDivMain, divClass, phone){
      var out;
      var mainTag = (isDivMain ? '<div>' : '<td>');
      p = p.trim();
      divClass = divClass || '';
      var pArr = p.split(';');
      if (pArr.length === 1)
        pArr = pArr[0].split(',');
      
      if (pArr.length > 1) {
        out = $('<ul>');
        for (var i in pArr) {
          var item = pArr[i].trim();
          if (phone)
            out = out.append($('<li>').append($('<a>').attr('href', 'tel:' + item)
              .text(item.replace(/^(\+\d) (\d{3}) (\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5'))));
          else
            out = out.append($('<li>').text(item));
        }
        out = $(mainTag).addClass(divClass).append(out);
      }
      else {
        if (phone)
          out = $(mainTag).addClass(divClass).append($('<a>').attr('href', 'tel:' + p)
              .text(p.replace(/^(\+\d) (\d{3}) (\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5')));
        else
          out = $(mainTag).addClass(divClass).text(p);
      }
      return out;
    }
    
    var operator;
    if (!(getdata.operator==null)) {
      operator=$('<div>').text(getdata.operator).addClass('operator');
    }
    var brand;
    if (!(getdata.brand==null)) {
      brand=$('<tr>').addClass('brand')
        .append($('<td>').text('Бренд: '))
        .append(createListValue(getdata.brand))
    }
    
    var phone;
    if (!(getdata.phone==null)) {
      phone = createListValue(getdata.phone, true, 'main phone', true)
    }
    
    var fax;
    if (!(getdata.fax==null)) {
      fax = createListValue(getdata.fax, true, 'main fax');
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
      if (getdata.website.length > poi.opt.linkLength)
        getdata.website = getdata.website.substr(0, poi.opt.linkLength-2) + '…';
      
      website = $('<div>').addClass('main website')
        .append($('<a>').attr('href', properLink).attr('target', '_blank').text(getdata.website));
    }

    var email;
    if (!(getdata.email==null)) {
      email = $('<div>').addClass('main email')
        .append($('<a>').attr('href', 'mailto:' + getdata.email).text(getdata.email));
    }

    var wiki;
    if (!(getdata.wikipedia == null)) {
      if (getdata.wikipedia.indexOf(':') == 2) {
        var wiki_link = getdata.wikipedia
          .replace(/(..):(.*)/g, 'http://$1.wikipedia.org/wiki/$2')
          .replace('"', '%22')
          .replace("'", '%27')
        
        var wiki_text = getdata.wikipedia.substr(3)
        if (wiki_text.length > poi.opt.linkLength)
          wiki_text = wiki_text.substr(0, poi.opt.linkLength-2) + '…';
        
        wiki = $('<div>').addClass('main wiki')
          .append($('<a>').attr('href', wiki_link).text(wiki_text));
        
        
      }
      else {
        var wiki_text = getdata.wikipedia;
        if (wiki_text.length > poi.opt.linkLength)
          wiki_text = wiki_text.substr(0, poi.opt.linkLength-2) + '…';
        
        wiki = $('<div>').addClass('main wiki').text(wiki_text);
      }
    }

    var moretags=$('');
    for (xName in getdata.tags_ru) {
      if (getdata.tags_ru[xName]!="неизвестно" && getdata.tags_ru[xName]!='' && getdata.tags_ru[xName]!==null) {
        moretags.after($('<tr>').addClass('poi_moretags')
          .append($('<td>').text(xName+': '))
          .append(createListValue(getdata.tags_ru[xName])))
      }
    }

    var opening_hours_p;
    if (!(getdata.opening_hours==null)) {
      var oh = new opening_hours(getdata.opening_hours);
      getdata.opening_hours = getdata.opening_hours.toLowerCase()
        .replace(/([a-z].) /g, '$1: ')
        .replace(/mo-fr/g, 'по будням')
        .replace(/sa ?[-,] ?su/g, 'по выходным')
        .replace(/sa,su/g, 'по выходным')
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
        .replace(/-(?=\d)/g, '\u2009−\u2009')
      // getdata.opening_hours = getdata.opening_hours.charAt(0).toUpperCase() + getdata.opening_hours.substr(1);
      oh_second = $('<div>').addClass('second').text(getdata.opening_hours);
      oh_second[0].innerHTML = oh_second[0].innerHTML.replace(/\s*;\s*/g, '<br />');
      
      if (oh.getState())
        var oh_state = $('<div>').addClass('main open').text('Сейчас открыто')
      else
        var oh_state = $('<div>').addClass('main close').text('Сейчас закрыто')
      
      opening_hours_p = $('<div>').addClass('main opening_hours')
        .append(oh_state)
        .append(oh_second);
      
      
    }

    var description;
    if (!(getdata.description==null)) {
      description = $('<div>').addClass('main description').text(getdata.description);
    }
    
    // address
    var address = osm.poi.addrForPopup({
      full: getdata.addr_full_name,
      city: getdata.addr_city,
      village: getdata.addr_village,
      street: getdata.addr_street,
      house: getdata.addr_house
    });
    
    
    // class / name
    var className = $('<div>').text(getdata.class_ru);
    if (getdata.name_ru==null) {
      className.addClass('name');
    }
    else {
      className.addClass('class')
        .after($('<div>').text(getdata.name_ru||'').addClass('name'));
    }

    ret = $('<div>').addClass('poi_popup info_popup').attr('id',getdata.id)
      .append(className)
      .append(operator)
      
      .append(address)
      
      .append(phone)
      .append(fax)
      .append(website)
      .append(email)
      
      .append(opening_hours_p)
      
      .append(wiki)
      
      .append(description)
      
    
    if (moretags.length || brand) {
      ret = ret
      .append($('<div>').addClass('moretags')
        .append($('<a>')
          .addClass('on_button')
          .attr('href', '#')
          .text('Подробнее…')
          .click(function(){
            $(this).hide();
            $(this.nextSibling).removeClass('off');
            return false;
          })
        )
        .append($('<div>').addClass('frame off')
          .append($('<table>')
            .append(moretags)
          )
        )
      )
    }
    
    // technical info
    ret = ret.append(poi.technicalForPopup(getdata.osm_id));
    
    return ret[0];
  },
  
  addrForPopup: function(inAddr) { // full, street, house, city, village
    var address;
    if (!(inAddr.full==null)) {
      var mainAddr = '';
      if (inAddr.street) {
        mainAddr = inAddr.street;
        mainAddr += (inAddr.house ? ', ' + inAddr.house : '');
      }
      else if (inAddr.city)
        mainAddr = inAddr.city;
      else if (inAddr.village)
        mainAddr = inAddr.village;
      else
        mainAddr = inAddr.full;
      
      var mainPos = inAddr.full.lastIndexOf(mainAddr);
      var secondAddr = '';
      if (mainPos + 1) {
        var secondAddr = inAddr.full.substr(0, mainPos).trim();
        if (secondAddr.substr(secondAddr.length - 1, 1) == ',')
          secondAddr = secondAddr.substr(0, secondAddr.length-1);
        if (secondAddr.substr(secondAddr.length - 5, 5) == 'город')
          secondAddr = secondAddr.substr(0, secondAddr.length-5);
        secondAddr = secondAddr.trim();
        if (secondAddr.substr(secondAddr.length - 1, 1) == ',')
          secondAddr = secondAddr.substr(0, secondAddr.length-1);
      }
      
      var cutAddr = function(addr) {
        return addr
          .replace(/Российская Федерация/g, 'Россия')
          .replace(/область/g, 'обл.')
          .replace(/городской округ/g, 'ГО')
          .replace(/город /g, 'г.')
          .replace(/улица/g, 'ул.')
          .replace(/проспект/g, 'пр-т.')
          .replace(/дом /g, '');
      }
      
      mainAddr = cutAddr(mainAddr);
      secondAddr = cutAddr(secondAddr);
      
      var address = $('<div>').addClass('main address')
        .append($('<div>').addClass('second').text(secondAddr))
        .append($('<div>').addClass('main').text(mainAddr))
    }
    return address;
  },
  
  technicalForPopup: function(osm_id) {
    var technical = $('');
    if (osm_id.charAt(0) == "{" && osm_id.charAt(osm_id.length-1) == "}")
      var id = osm_id.substr(1, osm_id.length - 2).split(',');
    else
      var id = [osm_id];
    
    if (id.length > 15) {
      technical = technical.after($('<tr>')
        .append($('<td>').addClass('osm_id').text('Отобразить все элементы нельзя, их больше 15'))
      )
    }
    else {
      for (var i in id) {
        
        var osm_id_text = id[i]
          .replace('r', 'rel: ')
          .replace('w', 'way: ')
          .replace('n', 'node: ')
        
        var osm_id_type = id[i].substr(0, 1)
          .replace('r', 'relation')
          .replace('w', 'way')
          .replace('n', 'node')
        
        var osm_id_id = id[i].substr(1);
        
        technical = technical.after($('<tr>')
          .append($('<td>').addClass('osm_id').text(osm_id_text))
          .append($('<td>').addClass('buttons')
            .append($('<a target="_blank">')
              .attr('href', 'http://www.openstreetmap.org/' + osm_id_type + '/' + osm_id_id)
              .append($('<img>').attr('src', '/img/popup/osm-info.png'))
            )
            .append($('<a target="_blank">')
              .attr('href', 'http://www.openstreetmap.org/' + osm_id_type + '/' + osm_id_id + '/history')
              .append($('<img>').attr('src', '/img/popup/osm-history.png'))
              .addClass('button_space')
            )
            .append($('<a target="_blank">')
              .attr('href', 'http://www.openstreetmap.org/edit?editor=id&' + osm_id_type + '=' + osm_id_id)
              .append($('<img>').attr('src', '/img/popup/edit-in-iD.png'))
            )
            .append($('<a>')
              .attr('href', '#')
              .click(function(){
                $.proxy(osm.inJOSM._load_object(id[i]), osm.inJOSM);
              })
              .append($('<img>').attr('src', '/img/popup/edit-in-Josm.png'))
            )
          )
        )
      }
    }
    
    technical = $('<div>').addClass('technical')
      .append($('<a>')
        .addClass('on_button')
        .attr('href', '#')
        .text('Техническая информация')
        .click(function(){
          $(this).hide();
          $(this.nextSibling).removeClass('off');
          return false;
        })
      )
      .append($('<div>').addClass('frame off')
        .append($('<table>')
          .append(technical)
        )
      )
    
    return technical;
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
        marker.bindPopup(textP, osm.poi.opt.popupOptions);
        icon_url = osm.poi.choiceMarker(json.data.nclass);
        marker.setIcon(new osm.poi.poiIcon({iconUrl: icon_url}));
        if (isopen) {marker.openPopup();}
      }
    })
  }

}

var poi = osm.poi;

}).call(this);