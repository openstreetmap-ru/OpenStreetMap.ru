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

osm.setCookie = function(cookieValue) {
  var d = new Date();
  d.setYear(d.getFullYear() + 10);
  document.cookie = cookieValue + "; " + "expires=" + d.toGMTString();
}

/** Преобразуем GET парамеры в хеш get */
function parseGET()
{
  var i, a, params;

  window.get = {};
  if (params = location.search.substr(1))
  {
    a = params.split('&');
    for (i in a)
    {
      a[i] = a[i].split('=');
      if (a[i].length == 2)
        window.get[a[i][0]] = decodeURIComponent(a[i][1].replace(/\+/g, " "));
    }
  }
};
