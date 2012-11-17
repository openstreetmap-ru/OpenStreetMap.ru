var osm = {cpan: {}, leftpan: {on: false}, mappan: {}, ui:{}, layers:{}, markers:{}};
var search = {};
var wpc = {
  layers: null,
  rq: null,
  bbox: null,
  zoom: null
};

function $_(id) { return document.getElementById(id); }

osm.getCookie = function(name) {
  var cookie = " " + document.cookie;
  var search = " " + name + "=";
  var setStr = null;
  var offset = 0;
  var end = 0;
  if (cookie.length > 0) {
    offset = cookie.indexOf(search);
    if (offset != -1) {
      offset += search.length;
      end = cookie.indexOf(";", offset)
  if (end == -1) {
    end = cookie.length;
  }
      setStr = unescape(cookie.substring(offset, end));
    }
  }
  return(setStr);
}

function parseGET() {
  var tmp = new Array();
  var tmp2 = new Array();
  get = new Array();
  var url = location.search;
  if(url != '') {
    tmp = (url.substr(1)).split('&');
    for(var i=0; i < tmp.length; i++) {
      tmp2 = tmp[i].split('=');
      if (tmp2.length == 2) get[tmp2[0]] = decodeURIComponent(tmp2[1].replace(/\+/g, " "));
    }
  }
};