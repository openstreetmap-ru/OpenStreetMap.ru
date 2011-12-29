<?
include_once ('include/config.php');

$_URL = preg_replace("/^(.*?)index\.php$/is", "$1", $_SERVER['SCRIPT_NAME']);
$_URL = preg_replace("/^".preg_quote($_URL, "/")."/is", "", urldecode($_SERVER['REQUEST_URI']));
$_URL = preg_replace("/(\/?)(\?.*)?$/is", "", $_URL);
$_URL = preg_replace("/[^0-9A-Za-z._\\-\\/]/is", "", $_URL); // вырезаем ненужные символы (не обязательно это делать)
$_URL = explode("/", $_URL);
if (preg_match("/^index\.(?:html|php)$/is", $_URL[count($_URL) - 1])) unset($_URL[count($_URL) - 1]); // удаляем суффикс

if (empty($_URL[0]))
  $_URL[0] = 'map';
$result = pg_query("SELECT * FROM \"pagedata\" WHERE \"name\"='".pg_escape_string($_URL[0])."' AND \"activate\"");

if (pg_num_rows($result) <= 0) Err404();
$data = pg_fetch_assoc($result);

if (!file_exists($data['name'].'.php'))
  Err404();

include_once ('include/external.php');
include_once ($_URL[0].'.php');
?>
<!doctype html>
<html>
<head>
  <title>OpenStreetMap Россия — <?=$data['text'] ?></title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="stylesheet" href="css/main.css" type="text/css" media="screen, projection" />
  <link rel="stylesheet" href="css/main_small.css" type="text/css" media="handheld, only screen and (max-device-width:800px)" />
  <link rel="search" href="/search.xml" type="application/opensearchdescription+xml" title="OpenStreetMap.Ru" />
  <script type="text/javascript" src="js/main.js"></script>
  <link rel="icon" type="image/png" href="/favicon.png" />
  <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
  <? print($external_head); ?>
  <? print($page_head); ?>
</head>
<body>

<? show_menu($_URL[0]); ?>

  <div id="toppan">
    <a href="/">
      <img src="<? print($page_logo); ?>" alt="OpenStreetMap.ru" id="logo">
    </a>
    <div id="topbar">
      <? print($page_topbar); ?>
    </div>
    <div id="colorline" style="background:<?=$data['color']?>;"></div>
  </div>
  
  <div id="content">
    <? print($page_content); ?>
  </div>
  
  <? print($external_bodyend); ?>
</body>
