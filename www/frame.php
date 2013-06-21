<!doctype html>
<html>
<head>
  <title>OpenStreetMap Россия — Карта Online</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="stylesheet" href="/css/main.css" type="text/css" media="screen, projection" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <script src="http://yandex.st/jquery/1.8.2/jquery.min.js"></script>
  <link rel="stylesheet" href="/css/leaflet.css" />
  <script src="/js/leaflet.js"></script>
  <!--[if lte IE 8]><link rel="stylesheet" href="/css/leaflet.ie.css" /><![endif]-->
  <script type="text/javascript" src="/js/osm.common.js"></script>
  <script type="text/javascript" src="/js/map.js"></script>
  <script type="text/javascript" src="/js/markers.js"></script>
  <script type="text/javascript" src="/js/Layer.TileLayer.Bing.js"></script>
  <script type="text/javascript">frame_map = 1;</script>
  <script type="text/javascript">
    FramePos = function(){
      var pos, params, a, i, newP, getParams = {}
      var pos = location.href.indexOf('#');
      if (pos+1) {
        if (params = location.href.substr(pos+1)) {
          a = params.split('&');
          for (i in a) {
            a[i] = a[i].split('=');
            if (a[i].length == 2)
              newP = {k:a[i][0],v:decodeURIComponent(a[i][1].replace(/\+/g, " "))};
            else if (a[i].length == 1)
              newP = {k:a[i][0],v:''};
            else
              continue;
            if (newP['k'] in {'lat':1,'lon':1,'zoom':1,'layer':1})
              getParams[newP['k']] = newP['v'];
          }
        }
      }
      
      if ('lat' in getParams && 'lon' in getParams && 'zoom' in getParams) {
        osm.map.setView(new L.LatLng(getParams['lat'], getParams['lon']), getParams['zoom']);
        if (getParams['layer'] != 'M') {
          osm.map.removeLayer (osm.layers[osm.layerHash2name['M']])
          var layerName;
          for(var i = 0; i < getParams['layer'].length; i++)
            if (layerName = osm.layers[osm.layerHash2name[getParams['layer'].charAt(i)]])
              osm.map.addLayer(layerName);
        }
      }
    }
  </script>
  <link rel="stylesheet" href="css/page.map.css" />
</head>
<body>
<? if (isset($_GET['noscreenshot'])) { ?>
  <div id="logoframe">
    <a href="/">
      <img id="logo" alt="OpenStreetMap.ru" src="/img/logo.png">
    </a>  
  </div>
<? } ?>

  <div id="content" style="top:0">
   <div id="downpan">
    <div id="mappan" style="left:0">
      <div id="map"></div>
    </div>
  </div>
  <div id="pm_show_popup" style="display: none;">
    <table cellspacing="0" cellpadding="0" border="0">
    <tr><td><div class="marker-name">#name</div></td></tr>
    <tr><td><div class="marker-description">#description</div></td></tr>
    </table>
  </div>
  <div id="pl_show_popup" style="display:none;">
    <table cellspacing="0" cellpadding="0" border="0">
    <tr><td><div class="marker-name">#name</div></td></tr>
    <tr><td><div class="marker-description">#description</div></td></tr>
    </table>
  </div>

<? if (!isset($_GET['noscreenshot'])) { ?> <!-- add &noscreenshot to the URL to hide this overlay -->
  <a href="/?<?=$_SERVER['QUERY_STRING']?>" target="_blank">
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;"></div>
  </a>
<? } ?>
  <div id="loader-overlay" style="z-index:1000;display:none;position:absolute;top:0;left:0;width:100%;height:100%;background-color:white;background-position: center center;background-image:url(img/loader.gif);background-repeat:no-repeat;"></div>
  </body>
</html>
