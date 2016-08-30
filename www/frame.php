<!doctype html>
<html lang=ru>
<head>
  <title>OpenStreetMap Россия — Карта Online</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="stylesheet" href="/css/main.css" type="text/css" media="screen, projection" />
  <link rel="stylesheet" href="/css/page.map.css" type="text/css" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <script src="/js/jquery.min.js"></script>
  <link rel="stylesheet" href="/css/leaflet.css" />
  <script src="/js/leaflet.js"></script>
  <!--[if lte IE 8]><link rel="stylesheet" href="/css/leaflet.ie.css" /><![endif]-->
  <script type="text/javascript" src="/js/page.main.js"></script>
  <script type="text/javascript" src="/js/page.map/_map.js"></script>
  <script type="text/javascript" src="/js/page.map/osm.layers.js"></script>
  <script type="text/javascript" src="/js/page.map/markers.js"></script>
  <script type="text/javascript" src="/js/page.map/Layer.TileLayer.Bing.js"></script>
  <script type="text/javascript">frame_map = 1;</script>
  <style type="text/css">
    .leaflet-control-layers {
        display: none;
    }
  </style>
</head>
<body>
<? if (isset($_GET['noscreenshot'])) { ?>
  <div>
    <a href="/">
      <img alt="OpenStreetMap.ru" src="/img/logo.png" style="background-color: rgb(239, 239, 239); border: medium none; height: 49px; left: 0px; opacity: 0.8; position: absolute; top: 0px; width: 288px; z-index: 1;">
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
