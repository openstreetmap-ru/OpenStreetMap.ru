(function() {


osm.sManager = {}
osm.p = {}

$(function() {
  osm.sManager.initialize();
});

osm.sManager.initialize = function() {
  osm.sManager.loadCookie();
  osm.sManager.loadGet();
  osm.sManager.loadAnchor();
  document.body.onhashchange = osm.sManager.loadAnchor;
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

var clone = function(obj){
  var newObj = {}, i;
  for(i in obj)
    newObj[i] = obj[i];
  return newObj;
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
  console.debug(new Date().getTime() + ' osm.sManager.loadAnchor');
  if (isUnd(osm.p.anchor))
    oldAnchor = {};
  else
    var oldAnchor = clone(osm.p.anchor);

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
        
        if (((!isUnd(oldAnchor[newP['k']]) && oldAnchor[newP['k']] !== newP['v'])
                || isUnd(oldAnchor[newP['k']]))
              && !isUnd(osm.sManager._on)
              && newP['k'] in osm.sManager._on.p
              && !(ex.indexOf(osm.sManager._on.p[newP['k']]) + 1) ) {
          ex.push(osm.sManager._on.p[newP['k']]);
        }
        osm.p.anchor[newP['k']] = newP['v'];
      }
    }
  }
  for (i in ex)
    osm.sManager._on.fn[ex[i]]({'type':'anchor'});
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

osm.sManager.setP = function(data){ // [{type, k, v}] | type=cookie: path, expires | type=anchor: del | only type=get: del
  console.debug(new Date().getTime() + ' osm.sManager.setP');
  
  var isAnchor = false;
  if (isUnd(osm.p.anchor))
    oldAnchor = {};
  else
    var oldAnchor = clone(osm.p.anchor);
  
  for (var i in data) {
    console.debug(data[i]);
    if (isUnd(data[i].v)) data[i].v = '';
    if (data[i].type == 'cookie'){
      osm.p.cookie[data[i].k] = data[i].v;
      if (isUnd(data[i].expires)) {
        data[i].expires = new Date();
        data[i].expires.setYear(data[i].expires.getFullYear() + 10);
      }
      if (isUnd(data[i].path)) data[i].path = '/';
      document.cookie = 'osm_' + data[i].k + '=' + data[i].v
        + '; path=' + data[i].path
        + '; expires=' + data[i].expires.toGMTString();
    }
    else if (data[i].type == 'get'){
      if (data[i].del)
        delete osm.p.get[data[i].k];
    }
    else if (data[i].type == 'anchor'){
      if (data[i].del)
        delete oldAnchor[data[i].k], isAnchor = true;
      else if (isUnd(osm.p.anchor[data[i].k]) || osm.p.anchor[data[i].k] !== data[i].v)
        oldAnchor[data[i].k] = data[i].v, isAnchor = true;
    }
  }
  
  if (isAnchor) {
    var newLine = osm.sManager.Param2Line(oldAnchor, '&');
    newLine = newLine ? '#' + newLine : '';
    location.replace(newLine);
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

var sm = osm.sManager;

}).call(this);