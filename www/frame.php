<!doctype html>
<html>
<head>
  <title>OpenStreetMap Россия</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="stylesheet" href="css/main.css" type="text/css" media="screen, projection" />
  <link rel="stylesheet" href="css/main_small.css" type="text/css" media="handheld, only screen and (max-device-width:800px)" />
  <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
  <link rel="stylesheet" href="css/leaflet.css" />
  <script src="js/leaflet.js"></script>
  <!--[if lte IE 8]><link rel="stylesheet" href="css/leaflet.ie.css" /><![endif]-->
  <script type="text/javascript" src="js/osm.common.js"></script>
  <script type="text/javascript" src="js/map.js"></script>
  <script type="text/javascript" src="js/markers.js"></script>
  <script type="text/javascript" src="js/Layer.TileLayer.Bing.js"></script>
  <script type="text/javascript">frame_map = 1;</script>
</head>
<body onload="init()">
<? if (isset($_GET['noscreenshot'])) { ?>
  <div id="logoframe">
    <a href="/">
      <img id="logo" alt="OpenStreetMap.ru" src="/img/logo.png">
    </a>  
  </div>
<? } ?>
  <div id="downpan" class="left-on">
    <div id="leftpan" class="leftSearch">
      <div class="close" onClick="osm.leftpan.toggle(false);"></div>
      <div id="leftpersmappan" class="leftpantab">
        <div class="header">
          <h1>Персональная карта</h1>
        </div>
        <div class="contentpan">
          <div id="pm_status"></div>
        </div>
      </div>
    </div>
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