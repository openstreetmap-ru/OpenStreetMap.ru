<?
$page_logo = "/img/logo-cakes.png";

$page_head = <<<PHP_HEAD
	<link href="css/v1/styles.css" type="text/css" rel="stylesheet">
PHP_HEAD;

$page_topmenu = <<<PHP_TOPMENU
PHP_TOPMENU;

$page_topbar = <<<PHP_TOPBAR
PHP_TOPBAR;

$page_content = <<<PHP_CONTENT

<div id="container">
  
	<div id="welcome">
		<p>Добро пожаловать на сайт «OpenStreetMap — Россия», российскую часть проекта <a href="http://osm.org">OpenStreetMap</a> (OSM).<br/>
	  Мы&#160;работаем над картой России и всего мира, которую может <a href="http://wiki.openstreetmap.org/wiki/RU:OpenStreetMap_License">свободно</a> использовать каждый.<br/>Это очень увлекательное занятие! Присоединяйтесь ;)</p>
	</div>
	
	<ul id="wherenext">

    	<li class="use">
			<h2>Используй</h2>
			<p><a href="http://wiki.openstreetmap.org/wiki/RU:ВикиПроект_Россия/Карты_России"><img src="img/v1/n3.png" alt="В навигаторах, ГИС и сервисах" width="200" height="100" /></a></p>
			<p>OSM — это  карты для навигаторов, обновляемые каждый день.</p>

		    <p>Выбери свою программу:</p>
		    
			<ul class="programms">
				<li class="p1"><a href="http://gis-lab.info/data/mp"><img width="88" height="24" alt="Карты для навигаторов Garmin" src="img/v1/logo_garmin.gif"></a></li>
				<li class="p2"><a href="http://peirce.gis-lab.info/daily"><img src="img/v1/logo_cityguide.gif" alt="Карты для программы СитиГид" width="88" height="31" /></a></li>
				<li class="p3"><a href="http://navitel.osm.rambler.ru/"><img src="img/v1/logo_navitel.png" alt="Карты для программы Navitel" width="88" height="23" /></a></li>
				<li class="p4"><a href="http://probki77.ru/pgs/russia.php"><img src="img/v1/logo_pocketgis.png" alt="Карты для программы PocketGIS" width="65" height="31" /></a></li>
				<li class="p5"><a href="http://osm-russa.narod.ru/"><img src="img/v1/logo_gisrussa.gif" alt="Карты для программы ГИС Русса" width="88" height="31" /></a></li>
				<li class="p6"><a href="http://osmand.net/"><img src="img/v1/logo_osmand.gif" alt="Карты для программы OsmAnd" width="88" height="23" /></a></li>
				<li class="p7"><a href="http://openstreetmaps.ru/"><img src="img/v1/logo_autosputnik.gif" alt="Карты для программы Автоспутник" width="88" height="18" /></a></li>
			</ul>
		</li>

		<li class="create">
			<h2>Участвуй</h2>
			<p><a href="http://wiki.openstreetmap.org/wiki/RU:Beginners_Guide"><img src="img/v1/n2.png" alt="В исправлении ошибок и редактировании" width="200" height="100" /></a></p>
			<p>Нашел ошибку? Укажи её прямо на карте через <a id="bugs-link" href="http://openstreetbugs.schokokeks.org/?zoom=5&lat=55.7516147&lon=37.6187089&layers=B00T">OpenStreetBugs</a>.</p>
			<p>Или <a href="http://wiki.openstreetmap.org/wiki/RU:Editing">исправь</a> онлайн или с помощью <a href="http://www.josm.ru">более мощного</a> загружаемого редактора.</p>
			<p>Новичок? Прочитай <a href="http://gis-lab.info/qa/osm-begin.html">как можно начать</a> знакомство с OSM.</p>
		</li>

		<li class="join">
			<h2>Общайся</h2>
			<p><a href="http://wiki.openstreetmap.org/wiki/RU:WikiProject_Russia#.D0.9E.D0.B1.D1.89.D0.B5.D0.BD.D0.B8.D0.B5"><img src="img/v1/n4.png" alt="Мы поможем!" width="200" height="100" /></a></p>
			<p>Присоединяйся к растущему сообществу OSM.</p>
			<p>Поделиться идеями и получить ответы на свои вопросы можно:</p>
			<ul>
				<li><a href="http://forum.openstreetmap.org/viewforum.php?id=21">на форуме</a></li>
				<li><a href="http://wiki.openstreetmap.org/wiki/RU:Main_Page">в вики</a> </li>
				<li><a href="http://forum.openstreetmap.org/viewtopic.php?id=5019">в IRC</a></li>
			</ul>
		</li>
	</ul>
</div>
PHP_CONTENT;
?>
