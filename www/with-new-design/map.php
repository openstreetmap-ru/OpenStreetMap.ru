<div id="toppan">
  <a href="/"><div id="logo"></div></a>
  <div id="searchcont"><div id="searchpan"><form id="search" onsubmit="search.search(); return false;" method="get" action="/"><table style="width:100%;"><tr>
    <td>
      <input id="qsearch" autocomplete="off" type="search"  />
    </td>
    <td style="width:1px;">
      <button>Найти&nbsp;&raquo;</button>
    </td>
  </tr></table></form></div></div>
  <div id="colorline" style="background:<?=$data['color']?>;"></div>
</div>
<div id="downpan" class="left-on">
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
    <div id="fsbutton" onClick="osm.ui.togglefs()">&uarr;</div>
    <div id="cpan">
      <img id="cpanglo" src="img/glow.png" />
      <img id="cpanarr" src="img/arrows.png" />
      <img id="cpanjoy" src="img/joy.png" />
      <div id="cpanact" onmousedown="osm.cpan.startPan(event)" onmousemove="osm.cpan.dragPan(event)" onmouseup="osm.cpan.endPan(event)" onmouseout="osm.cpan.endPan(event)"></div>
    </div>
    <!--<div class="vshadow">
      <div class="w1"></div><div class="w2"></div><div class="w3"></div><div class="w4"></div><div class="w5"></div>
    </div>
    <div class="hshadow">
      <div class="h1"></div><div class="h2"></div><div class="h3"></div><div class="h4"></div><div class="h5"></div>
    </div>-->
  </div>
</div>
