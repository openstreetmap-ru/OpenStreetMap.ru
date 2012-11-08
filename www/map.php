<?
$page_logo = "/img/logo.png";

$page_head = <<<PHP_HEAD
  <link rel="stylesheet" href="css/leaflet.css" />
  <script src="js/leaflet.js"></script>
  <!--[if lte IE 8]><link rel="stylesheet" href="css/leaflet.ie.css" /><![endif]-->
  <script type="text/javascript" src="js/osm.common.js"></script>
  <script type="text/javascript" src="js/osm.utils.js"></script>
  <script type="text/javascript" src="js/osm.utils.search.js"></script>
  <script type="text/javascript" src="js/osm.dyk.js"></script>
  <script type="text/javascript" src="js/map.js"></script>
  <script type="text/javascript" src="geo.php"></script>
  <script type="text/javascript" src="js/Control.Permalink.js"></script>
  <script type="text/javascript" src="js/Control.GoToOSM.js"></script>
  <script type="text/javascript" src="js/Control.Scale.js"></script>
  <script type="text/javascript" src="js/Control.Distance.js"></script>
  <script type="text/javascript" src="js/Layer.TileLayer.Bing.js"></script>
  <script type="text/javascript" src="js/KML.js"></script>
  <script type="text/javascript" src="js/suncalc.js"></script>
  <script type="text/javascript" src="js/osmjs-validators-layer.js"></script>
  <script type="text/javascript" src="js/osmjs-validators-errors.js"></script>
  <script type="text/javascript" src="js/osmjs-weather-layer.js"></script>
  <script type="text/javascript" src="js/OpenStreetBugs.js"></script>
  <script type="text/javascript" src="js/markers.js"></script>
  <script type="text/javascript" src="js/validators.js"></script>
  <script type="text/javascript" src="js/wpc.js"></script>
  <script type="text/javascript" src="http://yui.yahooapis.com/3.7.2/build/yui/yui-min.js"></script>
  <script type="text/javascript" src="js/jquery.jstree.js"></script>
  <script type="text/javascript" src="js/poi.js"></script>

  <link rel="stylesheet" href="css/osb.css" />
  <link rel="stylesheet" href="css/jstree/jstree.css" />
PHP_HEAD;

$page_topmenu = <<<PHP_TOPMENU
          <td id="mainmenupage-osb"><a href="/" title="Достаточно двойного клика мышью по месту и указать неточность" onclick="osm.osbclickon(this); return false;"><div>Указать неточность на карте</div></a></td>
PHP_TOPMENU;

$page_topbar = <<<PHP_TOPBAR
      <div id="newstop">
        <a href="http://gisconf.ru/ru/" title="Открытые ГИС!">
          <img src="/img/news/OpenGISavatar5eof.png" style="height: 100%;">
        </a>
      </div>
      <div id="searchpan" class="yui3-skin-sam">
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

      <script>
      YUI().use('autocomplete', 'autocomplete-highlighters', 'datasource-get', function (Y) {
        var inputNode = Y.one('#qsearch')

        inputNode.plug(Y.Plugin.AutoComplete, {
          maxResults: 7,
          resultHighlighter: 'subWordMatch',
          resultTextLocator: 'name',
          source: 'api/autocomplete?q={query}',
          resultListLocator: 'matches'
        });
      });
      </script>
      </body>
PHP_TOPBAR;

$page_content = <<<PHP_CONTENT
  <div id="downpan">
    <div id="leftpan">
      <div id="leftpantab">
        <div id="leftsearch" class="leftgroup">
          <h1>Поиск</h1>
          <div class="leftcontent" style="display: none;">
            <p>Для поиска введите в строку искомый адрес и нажмите "Найти"</p>
          </div>
        </div>
        <div id="leftpoi" class="leftgroup">
          <h1>Точки интереса (POI)</h1>
          <div class="leftcontent" style="display: none;">
          </div>
        </div>
        <div id="leftpersmap" class="leftgroup">
          <h1>Персональная карта</h1>
          <div class="leftcontent" style="display: none;">
            <div id="pm-control">
              <p class="pm-button">
                <a id="pm-button-marker" class="pm-button-a" onclick="osm.markers.addMultiMarker()">
                  Поставить маркер
                </a>
              </p>
              <p class="pm-button">
                <a id="pm-button-path" class="pm-button-a" onclick="osm.markers.addPath()">
                  Нарисовать путь
                </a>
              </p>
              <p class="pm-button pm-save">
                <a onclick="osm.markers.saveMap();" style="cursor: pointer;">
                  Сохранить
                </a>
              </p>
            </div>
            <div id="pm-status"></div>
          </div>
        </div>
        <div id="leftvalidator" class="leftgroup">
          <h1>Данные валидаторов</h1>
          <div class="leftcontent" style="display: none;">
            <ul id="validationerrors"></ul>
          </div>
        </div>
        <div id="leftothers" class="leftgroup">
          <h1>Другие инструменты</h1>
          <div class="leftcontent" style="display: none;">
            <ul>
              <li><a onclick="osm.markers.addPoint();" href='#'>Поставить маркер</a></li>
              <li><a id="EditJOSM" href='#'>Редактировать (в JOSM)</a></li>
            </ul>
          </div>
        </div>

        <div id="DidYouKnow" style="display: none;">
          <div class="head">Полезно знать?</div>
          <div class="close"></div>
          <p></p>
        </div>
      </div>
      <div id="toggler" onClick="osm.leftpan.toggle()"></div>
    </div>
    <div id="mappan">
      <div id="map"></div>
      <div id="htpbutton" class="map-feature-button">&uarr;</div>
    </div>
  </div>
  <iframe name="hiddenIframe" id="hiddenIframe" style="display: none;"></iframe>
  <div id="pm_edit_popup" style="display: none;">
    <table cellspacing="0" cellpadding="0" border="0" id="marker_popup_###">
      <tr><td><input id="marker_name_###" type="text" value="Имя..." class="default-input" onFocus="osm.markers.focusDefaultInput(this)" onBlur="osm.markers.blurDefaultInput(this)" onkeyup="$$$.saveData()"/></td></tr>
      <tr><td><textarea id="marker_description_###" class="default-input" onFocus="osm.markers.focusDefaultInput(this)" onBlur="osm.markers.blurDefaultInput(this)" onkeyup="$$$.saveData()">Описание...</textarea></td></tr>
      <tr><td class='colour-picker'>
        <!-- <div class='colour-picker-button' style='background:{{bg}};color:{{text}}' onClick='$$$.toggleCheck({{i}});'>&#x2713;</div> - see markers.js for replacement -->
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
      <tr><td><input id="line_name_###" type="text" value="Имя..." class="default-input" onFocus="osm.markers.focusDefaultInput(this)" onBlur="osm.markers.blurDefaultInput(this)" onkeyup="$$$.saveData()"/></td></tr>
      <tr><td><textarea id="line_description_###" class="default-input" onFocus="osm.markers.focusDefaultInput(this)" onBlur="osm.markers.blurDefaultInput(this)" onkeyup="$$$.saveData()">Описание...</textarea></td></tr>
      <tr><td class='colour-picker'>
      </td></tr>
      <tr><td><a href="#" class="button" onClick="$$$.remove();return false">Delete</a>
      </td></tr>
    </table>
  </div>
  <div id="loader-overlay" style="display:none;"></div>
  <script type="text/javascript">
    osm.markers._max_markers=$PERSMAP_MAX_POINTS;
    osm.markers._max_line_points=$PERSMAP_MAX_LINE_POINTS;
  </script>
PHP_CONTENT;
?>
