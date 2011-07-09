<?
include_once ('include/functions.php');
?>
<!doctype html>
<html>
<head>
<title>OpenStreetMap Россия — <?=$pages[$page]['name'] ?></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="css/main.css" type="text/css" media="screen, projection" />
<link rel="stylesheet" href="http://leaflet.cloudmade.com/dist/leaflet.css" />
<script src="http://leaflet.cloudmade.com/dist/leaflet.js"></script>
<!--[if lte IE 8]><link rel="stylesheet" href="http://leaflet.cloudmade.com/dist/leaflet.ie.css" /><![endif]-->
<script type="text/javascript" src="js/main.js"></script>
</head>

<body onload="init()">
<div id="toppan">
  <a href="/"><div id="logo"></div></a><div id="header"><header>OpenStreetMap</header></div>
  <div id="searchcont"><div id="searchpan"><table style="width:100%;"><tr><td><input id="search" type="search" /></td><td style="width:1px;"><button onClick="search.search();">Найти&nbsp;&raquo;</button></td></tr></table></div></div>
  <? show_menu(); ?>
  <!--<div id="loginpan"><ul><li><?=($loginned ? '<a href="map.html">Hind</a>' : '<a href="map.html">Вход</a>') ?></li> | <li><?=($loginned ? '<a href="map.html">Выход</a>' : '<a href="map.html">Регистрация</a>') ?></li></ul></div>-->
  <div class="toolbar">
    <div class="rightalign">
      <button><img src="img/ui-print.png"></button>
      <button><img src="img/ui-link.png"></button>
    </div>
  </div>
</div>
<div id="downpan">
  <div id="leftpan">
    <div id="content">
      <ul>
        <br>
        <li><span class="pseudolink" onClick="osm.ui.whereima()">Найти меня</span></li>
        <li><span class="pseudolink" onClick="osm.ui.whereima()">Проложить маршрут</span></li>
      </ul>
    </div>
    <div id="toggler" onClick="osm.leftpan.toggle()"></div>
  </div>
  <div id="mappan">
    <div id="map"></div>
    <div id="cpan">
      <img id="cpanglo" src="img/glow.png" />
      <img id="cpanarr" src="img/arrows.png" />
      <img id="cpanjoy" src="img/joy.png" />
      <div id="cpanact" onmousedown="osm.cpan.startPan(event)" onmousemove="osm.cpan.dragPan(event)" onmouseup="osm.cpan.endPan(event)" onmouseout="osm.cpan.endPan(event)"></div>
    </div>
    <div class="vshadow">
      <div class="w1"></div><div class="w2"></div><div class="w3"></div><div class="w4"></div><div class="w5"></div>
    </div>
    <div class="hshadow">
      <div class="h1"></div><div class="h2"></div><div class="h3"></div><div class="h4"></div><div class="h5"></div>
    </div>
  </div>
</div>
</body>
