<?
$page_logo = "/img/logo.png";

$page_head = <<<PHP_HEAD
  <link rel="stylesheet" href="css/leaflet.css" />
  <script src="js/leaflet.js"></script>
  <!--[if lte IE 8]><link rel="stylesheet" href="css/leaflet.ie.css" /><![endif]-->
  <script type="text/javascript" src="js/map.js"></script>
  <script type="text/javascript" src="include/geo.php"></script>
  <script type="text/javascript" src="js/Control.Permalink.js"></script>
  <script type="text/javascript" src="js/Control.GoToOSM.js"></script>
  <script type="text/javascript" src="js/Control.Scale.js"></script>
  <script type="text/javascript" src="js/Layer.TileLayer.Bing.js"></script>
  <script type="text/javascript" src="js/Layer.KML.js"></script>
  <script type="text/javascript" src="js/osmjs-validators-layer.js"></script>
  <script type="text/javascript" src="js/osmjs-validators-errors.js"></script>
  <script type="text/javascript" src="js/osb.js"></script>
  <script type="text/javascript" src="js/markers.js"></script>
  <script type="text/javascript" src="js/validators.js"></script>
  <script type="text/javascript" src="js/wpc.js"></script>
  <link rel="stylesheet" href="css/osb.css" />
PHP_HEAD;

$page_topmenu = <<<PHP_TOPMENU
          <td id="mainmenupage-osb"><a href="/" title="Достаточно двойного клика мышью по месту и указать неточность" onclick="osm.osbclickon(this); return false;"><div>Указать неточность на карте</div></a></td>
PHP_TOPMENU;

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
          <p>Для поиска введите в строку искомый адрес и нажмите "Найти"</p>
        </div>
      </div>
      <div id="leftpersmappan">
        <div class="header">
          <h1>Персональная карта</h1>
        </div>
        <div class="contentpan">
          <ul class="pm-menu">
            <li class="pm-submenu"><img src='img/pencil.svg' /><span>Нарисовать</span></li>
            <li>
              <ul class="pm-options">
                <li id="multimarkerbutton" onClick="osm.markers.addMultiMarker()"><img src='img/marker.svg' /><span>Маркер</span></li>
                <li id="pathbutton" onClick='osm.markers.addPath();'><img src='img/path.svg' /><span>Путь</span></li>
              </ul>
            </li>
            <li class="pm-submenu" id="pm_save" onClick="osm.markers.saveMap()"><img src='img/save.svg' /><span>Сохранить</span></li>
          </ul>
          <div id="pm_status"></div>
        </div>
      </div>
      <div id="lefterrorspan">
        <div class="header">
          <h1>Ошибки на карте</h1>
        </div>
        <div class="contentpan">
          <ul id="validationerrors"></ul>
        </div>
      </div>
      <div id="toggler" onClick="osm.leftpan.toggle()"></div>
    </div>
    <div id="mappan">
      <div id="map"></div>
      <!--<div id="tools" onmouseover="this.className='on';" onmouseout="this.className='';">
        <div class="a">
          <a id="tools-button" href="#" title="Инструменты"></a>
        </div>
        <div class="p">
          <p><a href="#" title="Маркер" onClick="osm.markers.addPoint()">Маркер</a></p>
          <p><a id="EditJOSM" href="#" title="Редактировать">Редактировать (в JOSM)</a></p>
          <p><a href="#" title="Персональная карта" onClick="osm.markers.personalMap()">Персональная карта</a></p>
        </div>
      </div>-->
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
  <div id="pm_edit_popup" style="display: none;">
    <table cellspacing="0" cellpadding="0" border="0" id="marker_popup_###">
      <tr><td><input id="marker_name_###" type="text" value="Name..." class="default-input" onFocus="osm.markers.focusDefaultInput(this)" onBlur="osm.markers.blurDefaultInput(this)" onkeyup="$$$.saveData()"/></td></tr>
      <tr><td><textarea id="marker_description_###" class="default-input" onFocus="osm.markers.focusDefaultInput(this)" onBlur="osm.markers.blurDefaultInput(this)" onkeyup="$$$.saveData()">Description...</textarea></td></tr>
      <tr><td>
        <div class='colour-picker-button colour-picker-button-blue' onClick="$$$.toggleCheck(0);">&#x2713;</div>
        <div class='colour-picker-button colour-picker-button-red' onClick="$$$.toggleCheck(1);"></div>
        <div class='colour-picker-button colour-picker-button-green' onClick="$$$.toggleCheck(2);"></div>
        <div class='colour-picker-button colour-picker-button-yellow' onClick="$$$.toggleCheck(3);"></div>
        <div class='colour-picker-button colour-picker-button-violet' onClick="$$$.toggleCheck(4);"></div>
        <div class='colour-picker-button colour-picker-button-orange' onClick="$$$.toggleCheck(5);"></div>
      </td></tr>
      <tr><td><a href="#" class="button" onClick="$$$.remove();return false">Delete</a>
      </td></tr>
    </table>
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
  <div id="pl_edit_popup" style="display:none;">
    <table cellspacing="0" cellpadding="0" border="0" id="line_popup_###">
      <tr><td><input id="line_name_###" type="text" value="Name..." class="default-input" onFocus="osm.markers.focusDefaultInput(this)" onBlur="osm.markers.blurDefaultInput(this)" onkeyup="$$$.saveData()"/></td></tr>
      <tr><td><textarea id="line_description_###" class="default-input" onFocus="osm.markers.focusDefaultInput(this)" onBlur="osm.markers.blurDefaultInput(this)" onkeyup="$$$.saveData()">Description...</textarea></td></tr>
      <tr><td>
        <div class='colour-picker-button colour-picker-button-blue' onClick="$$$.toggleCheck(0);">&#x2713;</div>
        <div class='colour-picker-button colour-picker-button-red' onClick="$$$.toggleCheck(1);"></div>
        <div class='colour-picker-button colour-picker-button-green' onClick="$$$.toggleCheck(2);"></div>
        <div class='colour-picker-button colour-picker-button-yellow' onClick="$$$.toggleCheck(3);"></div>
        <div class='colour-picker-button colour-picker-button-violet' onClick="$$$.toggleCheck(4);"></div>
        <div class='colour-picker-button colour-picker-button-orange' onClick="$$$.toggleCheck(5);"></div>
      </td></tr>
      <tr><td><a href="#" class="button" onClick="$$$.remove();return false">Delete</a>
      </td></tr>
    </table>
  </div>
  <script type="text/javascript">
    osm.markers._max_markers=$PERSMAP_MAX_POINTS;
    osm.markers._max_line_points=$PERSMAP_MAX_LINE_POINTS;
  </script>
PHP_CONTENT;
?>
