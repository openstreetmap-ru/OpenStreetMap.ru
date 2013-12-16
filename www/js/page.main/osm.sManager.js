osm.sManager = {}
osm.p = {}

$(function() {
  osm.sManager.initialize();
});

osm.sManager.initialize = function() {
  osm.sManager.loadCookie();
  osm.sManager.loadGet();
  osm.sManager.loadAnchor();
  document.body.onhashchange = function(){ osm.sManager.loadAnchor(); }
}

osm.sManager.loadCookie = function() {
  var i, a, params;
  osm.p.cookie = {};
  if (params = document.cookie) {
    a = params.split(';');
    for (i in a) {
      a[i] = a[i].trim().split('=');
      if (a[i][0].substr(0,4) == 'osm_')
        a[i][0] = a[i][0].substr(4)
      if (a[i].length == 2)
        osm.p.cookie[a[i][0]] = a[i][1];
    }
  }
}

osm.sManager.loadGet = function() {
  var i, a, params;
  osm.p.get = {};
  if (params = location.search.substr(1)) {
    a = params.split('&');
    for (i in a) {
      a[i] = a[i].split('=');
      if (a[i].length == 2)
        osm.p.get[a[i][0]] = a[i][1];
    }
  }
}

osm.sManager.loadAnchor = function() {
  console.debug(new Date().getTime() + ' start fn osm.sManager.loadAnchor');
  function clone(obj){
    var newObj = {}, i;
    for(i in obj)
      newObj[i] = obj[i];
    return newObj;
  }
  if (isUnd(osm.p.anchor)) {
    oldAnchor = {};
  } else {
    var oldAnchor = clone(osm.p.anchor);
  }
  var i, params, newP, a, ex = [];
  osm.p.anchor = {};
  
  if((i = location.href.indexOf('#')) + 1) {
    if (params = location.href.substr(i + 1).split('&')) {
      for (i in params) {
        params[i] = params[i].split('=');
        if (params[i].length == 2)
          newP = {k:params[i][0], v:params[i][1]};
        else if (params[i].length == 1)
          newP = {k:params[i][0], v:''};
        else
          continue;
        
        if ((!isUnd(oldAnchor[newP['k']]) && oldAnchor[newP['k']] !== newP['v'])
                || (isUnd(oldAnchor[newP['k']]) && !isUnd(this._on))
              && newP['k'] in this._on.p
              && !(ex.indexOf(this._on.p[newP['k']]) + 1) ) {
          ex.push(this._on.p[newP['k']]);
        }
        osm.p.anchor[newP['k']] = newP['v'];
      }
    }
  }
  for (i in ex)
    this._on.fn[ex[i]]({'type':'anchor'});
}

osm.sManager.decodeURI = function(str) {
  if (isUnd(str)) return undefined;
  return decodeURIComponent(str.replace(/\+/g, " "));
}

osm.sManager.Param2Line = function(obj, sep){
  var a, url = [];
  for (a in obj)
    url.push(a + '=' + obj[a]);
  return url.join(sep)
}

osm.sManager.setP = function(k, v, type){
  console.debug(new Date().getTime() + ' start fn osm.sManager.setP'+' - k=' + k + ' - type=' + type);
  if (isUnd(v)) v = '';
  if (type == 'cookie'){
    osm.p.cookie[k] = v;
    var d = new Date();
    d.setYear(d.getFullYear() + 10);
    document.cookie = 'osm_' + k + '=' + v + '; path=/ ; expires=' + d.toGMTString();
  }
  else if (type == 'get'){
  }
  else if (type == 'anchor'){
    if (!isUnd(osm.p.anchor[k]) && osm.p.anchor[k] === v) return;
    osm.p.anchor[k] = v;
    var newLine = osm.sManager.Param2Line(osm.p.anchor, '&');
    location.hash = newLine ? '#' + newLine : '';
  }
}

osm.sManager.updGet = function() {
  var newLine = osm.sManager.Param2Line(osm.p.get, '&');
  location.search = newLine ? '?' + newLine : '';
}

osm.sManager.on = function(p, fn) {
  var i, a, ex = false, type;
  if (isUnd(this._on)) this._on = {};
  if (isUnd(this._on.p)) this._on.p = {};
  if (isUnd(this._on.fn)) this._on.fn = [];
  a = this._on.fn.length;
  this._on.fn[a] = fn;
  for (i in p) {
    this._on.p[p[i]] = a;
    if (!ex) {
      if (p[i] in osm.p.anchor) {
        type = 'anchor';
        ex = true;
      }
      else if (p[i] in osm.p.get) {
        type = 'get';
        ex = true;
      }
    }
  }
  if (ex)
    fn({'type':type});
}
