<?
$page_logo = "/img/logo.png";

$page_head = <<<PHP_HEAD
  <link rel="stylesheet" href="css/leaflet.css" />
  <script src="js/leaflet.js"></script>
  <!--[if lte IE 8]><link rel="stylesheet" href="css/leaflet.ie.css" /><![endif]-->
  <script type="text/javascript" src="js/map.js"></script>
  <script type="text/javascript" src="js/Control.Permalink.js"></script>
  <script type="text/javascript" src="js/Control.Scale.js"></script>
  <script type="text/javascript" src="js/Control.Zoom.js"></script>
  <script type="text/javascript" src="js/Layer.TileLayer.Bing.js"></script>
  <script type="text/javascript" src="js/Layer.KML.js"></script>
  <script type="text/javascript" src="js/osb.js"></script>
  <script type="text/javascript" src="js/markers.js"></script>
  <link rel="stylesheet" href="css/osb.css" />
PHP_HEAD;

$page_topbar = <<<PHP_TOPBAR
      <div id="searchpan">
        <form id="search" method="get" action="/" onsubmit="return osm.ui.searchsubmit();"><table style="width:100%;"><tr>
          <td style="width:1px;">
            <a href="#" onClick="osm.ui.whereima(); return false;" class="wheremi" title="Где я?"><div class="wheremi">&nbsp;</div></a>
          </td>
          <td>
            <input id="qsearch" autocomplete="off" type="search" name="q" />
          </td>
          <td style="width:1px;">
            <input type="submit" value="Найти&nbsp;&raquo;" />
          </td>
        </tr></table></form>
      </div>
PHP_TOPBAR;

$page_content = <<<PHP_CONTENT
<body onload="init()">
  <div id="downpan" class="left-on">
    <div id="leftpan" class="leftSearch">
      <div class="close" onClick="osm.leftpan.toggle(false);"></div>
      <div id="leftsearchpan">
        <div class="header">
          <h1>Результаты поиска:</h1>
        </div>
        <div id="content_pan" class="contentpan">
          <ul>
            <br>
            <li><span class="pseudolink" onClick="osm.ui.whereima()">Найти меня</span></li>
            <li><span class="pseudolink" onClick="osm.ui.whereima()">Проложить маршрут</span></li>
          </ul>
        </div>
      </div>
      <div id="leftpersmappan">
        <div class="header">
          <h1>Персональная карта</h1>
        </div>
        <div class="contentpan">
          <p>Нарисовать:</p>
          <div id="multimarkerbutton" class="pseudolink" onClick="osm.markers.addMultiMarker()">Маркеры</div>
          <div id="pathbutton" class="pseudolink" onClick="osm.markers.addPath()">Путь</div>
        </div>
      </div>
      <div id="toggler" onClick="osm.leftpan.toggle()"></div>
    </div>
    <div id="mappan">
      <div id="map"></div>
      <div id="tools" onmouseover="this.className='on';" onmouseout="this.className='';">
        <div class="a">
          <a id="tools-button" href="#" title="Инструменты"></a>
        </div>
        <div class="p">
          <p><a href="#" title="Маркер" onClick="osm.markers.addPoint()">Маркер</a></p>
          <p><a id="EditJOSM" href="#" title="Редактировать">Редактировать (в JOSM)</a></p>
          <p><a href="#" title="Персональная карта" onClick="osm.markers.personalMap()">Персональная карта</a></p>
        </div>
      </div>
      <div id="fsbutton" class="map-feature-button" onClick="osm.ui.togglefs()">&uarr;</div>
      <!--<div id="cpan">
        <img id="cpanglo" src="img/glow.png" />
        <img id="cpanarr" src="img/arrows.png" />
        <img id="cpanjoy" src="img/joy.png" />
        <div id="cpanact" onmousedown="osm.cpan.startPan(event)" onmousemove="osm.cpan.dragPan(event)" onmouseup="osm.cpan.endPan(event)" onmouseout="osm.cpan.endPan(event)"></div>
      </div>-->
      <!--<div class="vshadow">
        <div class="w1"></div><div class="w2"></div><div class="w3"></div><div class="w4"></div><div class="w5"></div>
      </div>
      <div class="hshadow">
        <div class="h1"></div><div class="h2"></div><div class="h3"></div><div class="h4"></div><div class="h5"></div>
      </div>-->
    </div>
  </div>
  <iframe name="hiddenIframe" id="hiddenIframe" style="display: none;"></iframe>
  <div id="personal_marker_popup" style="display: none;">
    <div>
      <div class='colour-picker-button colour-picker-button-blue' onClick="osm.markers.toggleCheck(this);">&#x2713;</div>
      <div class='colour-picker-button colour-picker-button-red' onClick="osm.markers.toggleCheck(this);"></div>
      <div class='colour-picker-button colour-picker-button-green' onClick="osm.markers.toggleCheck(this);"></div>
      <div class='colour-picker-button colour-picker-button-yellow' onClick="osm.markers.toggleCheck(this);"></div>
      <div class='colour-picker-button colour-picker-button-violet' onClick="osm.markers.toggleCheck(this);"></div>
      <div class='colour-picker-button colour-picker-button-orange' onClick="osm.markers.toggleCheck(this);"></div>
    </div>
  </div>
</body>
PHP_CONTENT;
?>
