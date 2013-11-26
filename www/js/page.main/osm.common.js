var osm = {cpan: {}, leftpan: {on: false}, mappan: {}, ui:{}, layers:{}, markers:{}};
var search = {};
var wpc = {
  layers: null,
  rq: null,
  bbox: null,
  zoom: null
};

function $_(id) { return document.getElementById(id); }
