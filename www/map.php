<?
$page_logo = "/img/logo.png";

$page_head_css = <<<PHP_HEAD_CSS
  <link rel="stylesheet" href="/css/leaflet.css" />
  <link rel="stylesheet" href="/css/leaflet.draw.css" />
  <link rel="stylesheet" href="/css/L.Control.Zoomslider.css" />
  <link rel="stylesheet" href="/css/page.map.css" />
  <link rel="stylesheet" href="/css/jstree/jstree.css" />
  <!--[if lte IE 8]>
    <link rel="stylesheet" href="/css/leaflet.ie.css" />
    <link rel="stylesheet" href="/css/leaflet.draw.ie.css" />
    <link rel="stylesheet" href="/css/L.Control.Zoomslider.ie.css" />
    <script src="/js/html5shiv.js"></script>
  <![endif]-->
PHP_HEAD_CSS;

$page_head_js = <<<PHP_HEAD_JS
  <script src="/js/leaflet.js"></script>
  <script src="/js/leaflet.draw.js"></script>
  <script src="/js/suncalc.js"></script>
  <script src="/js/jquery.jstree.js"></script>
  <script src="/js/page.map.js"></script>
  <script src="/geo.php"></script>
PHP_HEAD_JS;

$page_topbar = <<<PHP_TOPBAR
    <!--
      <div id="breaking_news">
        <a href="http://gisconf.ru/ru/" title="Открытые ГИС!">
          <img src="/img/news/OpenGISavatar5eof.png" style="height: 100%;">
        </a>
      </div>
    -->

      <div id="search_container">
        <form role="search" id="search" method="get" action="/" onsubmit="return osm.ui.searchsubmit();">
          <div id="fucking_ff">
            <input type="search" id="qsearch" class="field" name="q" autocomplete="off" autofocus="" placeholder="Искать">
          </div>
          <input type="submit" id="search_button" class="button" value="Найти">
        </form>
      </div>
PHP_TOPBAR;

$page_content = <<<PHP_CONTENT
  <aside id="leftpan">
    <div id="leftpantab">
      <div id="leftpoi" class="leftgroup">
        <h1>Точки интереса (POI) <img class="loader" src="/img/loader.gif" alt=""></h1>
        <div class="leftcontent" style="display: none;">
          <div id="leftpoisearch"><input id="poisearch" type="text" placeholder="Искать типы точек"/></div>
          <div id="leftpoiTree"></div>
        </div>
      </div>
      <div id="leftsearch" class="leftgroup" style="display: none;">
        <h1>Поиск <img class="loader" src="/img/loader.gif" alt=""></h1>
        <div class="leftcontent" style="display: none;">
          <div class="mainsearch"></div>
          <div class="othersearch"></div>
        </div>
      </div>
      <div id="leftpersmap" class="leftgroup">
        <h1>Персональная карта</h1>
        <div class="leftcontent" style="display: none;">
         <div id="pm-editing">
          <div id="pm-control">
            <div class="pm-button" id="pm-button-marker">
              <a class="pm-button-a" onclick="osm.markers.addMultiMarker()">
                Поставить маркер
              </a>
            </div>
            <div class="pm-button">
              <div id="pm-button-path">
                <a class="pm-button-a" onclick="osm.markers.addPath()">Нарисовать путь</a>
                <span><br>Чтоб закончить путь, нажмите на ESC, последнюю нарисованную точку или на кнопку "Нарисовать путь" еще раз.</span>
              </div>
            </div>
            <div class="pm-button pm-save">
              <a onclick="osm.markers.saveMap();" style="cursor: pointer;">Сохранить</a>
            </div>
          </div>
          <div id="pm-status"></div>
         </div>
         <div id="pm-legend"></div>
        </div>
      </div><!--
      <div id="leftvalidator" class="leftgroup">
        <h1>Данные валидаторов</h1>
        <div class="leftcontent" style="display: none;">
          <ul id="validationerrors"></ul>
        </div>
      </div>-->
      <div id="leftothersmaps" class="leftgroup leftlink">
        <h1>Это место на другой карте</h1>
        <div class="leftcontent" style="display: none;">
          <ul>
            <li><a id="opento-osmorg" href='#' target="_blank">OpenStreetMap.org</a></li>
            <li><a id="opento-google" href='#' target="_blank">Google карты</a></li>
            <li><a id="opento-yandex" href='#' target="_blank">Яндекс карты</a></li>
            <li><a id="opento-wikimapia" href='#' target="_blank">Wikimapia</a></li>
            <li><a id="opento-bing" href='#' target="_blank">Карты Bing</a></li>
            <li><a id="opento-panoramio" href='#' target="_blank">Panoramio</a></li>
          </ul>
        </div>
      </div>
      <div id="leftothers" class="leftgroup leftlink">
        <h1>Другие инструменты</h1>
        <div class="leftcontent" style="display: none;">
          <ul>
            <li><a onclick="osm.permalink.addMarker(); return false;" href='#'>Поставить маркер</a></li>
            <li id="EditJOSM"><a href='#'>Редактировать (в JOSM)</a></li>
            <li><a id="mapperMode" onclick="return osm.mapperMode.toggleChecked();" href='#'><ins class="checkbox"> </ins>Режим Маппера</a></li>
          </ul>
        </div>
      </div><!--
      <div id="leftosb" class="leftgroup leftlink">
        <h1>Просмотреть неточности на карте</h1>
        <div class="leftcontent" style="display: none;">
          Внимание! Сейчас недоступено создание новых заметок, но вы можете помочь с закрытием уже существующих заметок. В дальнейшем будет переход на другую систему (Notes). Спасибо за участие.
        </div>
      </div>-->
      <div id="DidYouKnow" style="display: none;">
        <div class="head">Полезно знать</div>
        <div class="close"></div>
        <p></p>
      </div>
    </div>
  </aside>
  <div id="ltoggle">
    <div accesskey="l" onclick="osm.leftpan.toggle();"></div>
  </div>

  <section id="mappan">
    <article id="map"></article>
    <article id="pers_maps">
      <div id="pm_edit_popup" style="display: none;">
        <table id="marker_popup_###">
          <tr><td><input id="marker_name_###" type="text" value="Имя..." class="default-input" onFocus="osm.markers.focusDefaultInput(this)" onBlur="osm.markers.blurDefaultInput(this)" onchange="$$$.saveData()"/></td></tr>
          <tr><td><textarea id="marker_description_###" class="default-input" onFocus="osm.markers.focusDefaultInput(this)" onBlur="osm.markers.blurDefaultInput(this)" onchange="$$$.saveData()">Описание...</textarea></td></tr>
          <tr><td class='colour-picker'>
            <!-- <div class='colour-picker-button' style='background:{{bg}};color:{{text}}' onClick='$$$.toggleCheck({{i}});'>&#x2713;</div> - see markers.js for replacement -->
          </td></tr>
          <tr><td><a href="#" class="button" onClick="$$$.remove();return false">Удалить</a>
          </td></tr>
        </table>
      </div>
      <div id="pm_show_popup" style="display: none;">
        <table>
        <tr><td><div class="marker-name">#name</div></td></tr>
        <tr><td><div class="marker-description">#description</div></td></tr>
        </table>
      </div>
      <div id="pl_show_popup" style="display:none;">
        <table>
        <tr><td><div class="marker-name">#name</div></td></tr>
        <tr><td><div class="marker-description">#description</div></td></tr>
        <tr><td><div class="marker-moreinfo">#moreinfo</div></td></tr>
        </table>
      </div>
      <div id="pl_edit_popup" style="display:none;">
        <table id="line_popup_###">
          <tr><td><input id="line_name_###" type="text" value="Имя..." class="default-input" onFocus="osm.markers.focusDefaultInput(this)" onBlur="osm.markers.blurDefaultInput(this)" onchange="$$$.saveData()"/></td></tr>
          <tr><td><textarea id="line_description_###" class="default-input" onFocus="osm.markers.focusDefaultInput(this)" onBlur="osm.markers.blurDefaultInput(this)" onchange="$$$.saveData()">Описание...</textarea></td></tr>
          <tr><td><div class="marker-moreinfo">#moreinfo</div></td></tr>
          <tr><td class='colour-picker'>
          </td></tr>
          <tr><td><a href="#" class="button" onClick="$$$.remove();return false">Удалить</a>
          </td></tr>
        </table>
      </div>
    </article>
  </section>

  <iframe name="hiddenIframe" id="hiddenIframe" style="display: none;"></iframe>
  <div id="loader-overlay" style="display:none;"></div>
  <script>
    osm.markers._max_markers=$PERSMAP_MAX_POINTS;
    osm.markers._max_line_points=$PERSMAP_MAX_LINE_POINTS;
  </script>
PHP_CONTENT;
?>
