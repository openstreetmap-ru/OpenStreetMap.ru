<?
include_once ('include/config.php');

if (empty($_GET['name']))
  $_GET['name'] = 'map';
$result = mysql_query("SELECT * FROM pagedata WHERE name='".mysql_escape_string($_GET['name'])."'");
if (mysql_num_rows($result) <= 0) Err404();
$data = mysql_fetch_assoc($result);

if (!file_exists($data['name'].'.php'))
  Err404();

?>
<!doctype html>
<html>
<head>
<title>OpenStreetMap Россия — <?=$data['text'] ?></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="css/main.css" type="text/css" media="screen, projection" />
<link rel="stylesheet" href="css/main_small.css" type="text/css" media="handheld, only screen and (max-device-width:800px)" />
<!--<link rel="stylesheet" href="http://leaflet.cloudmade.com/dist/leaflet.css" />-->
<link rel="stylesheet" href="css/leaflet.css" />
<!--<script src="http://leaflet.cloudmade.com/dist/leaflet.js"></script>-->
<script src="js/leaflet.js"></script>
<!--[if lte IE 8]><link rel="stylesheet" href="http://leaflet.cloudmade.com/dist/leaflet.ie.css" /><![endif]-->
<script type="text/javascript" src="js/main.js"></script>
</head>
<body onload="init()">
<? show_menu($_GET['name']);

include_once ($_GET['name'].'.php');

?>
</body>
