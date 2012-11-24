<?
$page_logo = "/img/logo-navigator.png";

$page_head = <<<PHP_HEAD
  <link rel="stylesheet" href="css/page.navigator.css" />
PHP_HEAD;

$page_topmenu = <<<PHP_TOPMENU
PHP_TOPMENU;

$page_topbar = <<<PHP_TOPBAR
PHP_TOPBAR;

$page_content = <<<PHP_CONTENT

<div id="ncontent">
  <img src="/img/navigators.png" usemap="#navigators">
  <map id="navigators" name="navigators">
    <area id="garmin" shape="rect" coords="175,13,460,92" href="http://gis-lab.info/data/mp" target="blank">
    <area id="navitel" shape="rect" coords="80,110,414,200" href="http://navitel.osm.rambler.ru/" target="blank">
    <area id="cityguide" shape="rect" coords="486,51,650,172" href="http://peirce.gis-lab.info/daily" target="blank">
    <area id="osmand" shape="rect" coords="15,224,295,317" href="http://osmand.net/" target="blank">
    <area id="gisrussa" shape="rect" coords="325,207,425,329" href="http://osm-russa.narod.ru/" target="blank">
    <area id="pocketgis" shape="rect" coords="463,205,710,330" href="http://probki77.ru/pgs/russia.php" target="blank">
    <area id="autosputnik" shape="rect" coords="75,353,355,465" href="http://openstreetmaps.ru/" target="blank">
    <area id="7ways" shape="rect" coords="405,360,646,445" href="http://www.megamaps.org/" target="blank">
  </map>
</div>

PHP_CONTENT;
?>
