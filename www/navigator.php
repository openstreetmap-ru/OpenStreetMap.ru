<?
$page_logo = "/img/logo-navigator.png";

$page_head_css = <<<PHP_HEAD_CSS
  <link rel="stylesheet" href="css/page.navigator.css" />
PHP_HEAD_CSS;

$page_head_js = <<<PHP_HEAD_JS
PHP_HEAD_JS;

$page_topmenu = <<<PHP_TOPMENU
PHP_TOPMENU;

$page_topbar = <<<PHP_TOPBAR
PHP_TOPBAR;

$page_content = <<<PHP_CONTENT

<div id="ncontent">
  <img src="/img/navigators.png" usemap="#navigators">
  <map id="navigators" name="navigators">
    <area id="garmin" shape="rect" coords="335,1,625,85" href="http://gis-lab.info/data/mp" target="blank">
    <area id="navitel" shape="rect" coords="295,155,634,250" href="http://navitel.osm.rambler.ru/" target="blank">
    <area id="cityguide" shape="rect" coords="230,415,395,535" href="http://peirce.gis-lab.info/daily" target="blank">
    <area id="osmand" shape="rect" coords="1,1,275,95" href="http://osmand.net/" target="blank">
    <area id="gisrussa" shape="rect" coords="435,405,535,530" href="http://osm-russa.narod.ru/" target="blank">
    <area id="pocketgis" shape="rect" coords="1,105,250,235" href="http://probki77.ru/pgs/russia.php" target="blank">
    <area id="autosputnik" shape="rect" coords="320,270,615,390" href="http://openstreetmaps.ru/" target="blank">
    <area id="navikey" shape="rect" coords="15,270,255,355" href="http://www.megamaps.org/" target="blank">
    <area id="progorod" shape="rect" coords="75,415,190,530" href="http://forum.pro-gorod.ru/viewtopic.php?f=190&t=712" target="blank">
  </map>
</div>

PHP_CONTENT;
?>
