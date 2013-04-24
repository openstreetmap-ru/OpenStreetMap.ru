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

if (empty($pages_menu[$_URL[0]]))
  Err404();

$current_menu = $pages_menu[$_URL[0]];

if (!file_exists($current_menu["name"].'.php'))
  Err404();

include_once ('include/external.php');
include_once ($_URL[0].'.php');
?>
<!doctype html>
<html>
<head>
  <title>OpenStreetMap Россия — <?=$current_menu['text'] ?></title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="stylesheet" href="/css/main.css" type="text/css" media="screen, projection" />
  <link rel="stylesheet" href="/css/print.css" type="text/css" media="print" />
  <link rel="search" href="/search.xml" type="application/opensearchdescription+xml" title="OpenStreetMap.Ru" />
  <script type="text/javascript" src="/js/main.js"></script>
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="stylesheet" href="http://yandex.st/jquery-ui/1.9.0/themes/base/jquery-ui.min.css" />
  <script src="http://yandex.st/jquery/1.8.2/jquery.min.js"></script>
  <script src="http://yandex.st/jquery-ui/1.9.0/jquery-ui.min.js"></script>
  <? print($external_head); ?>
  <? print($page_head); ?>
  <script type="text/javascript">
    var srv = {};
    srv.url = ['<? print(implode("','", $_URL)) ?>'];
  </script>
</head>
<body>
  <div id="menupan">
    <div id="menuback"></div>
    <table id="tablemenu"><tr>
      <td><? show_menu($pages_menu, $_URL[0]); ?></td>
      <td width="100%"></td>
      <td>
        <table id="mainmenupage"><tr>
          <? print($page_topmenu); ?>
        </tr></table>
      </td>
    </tr></table>
  </div>

  <div id="toppan">
    <a href="/">
      <img src="<? print($page_logo); ?>" alt="OpenStreetMap.ru" id="logo">
    </a>
    <div id="topbar">
      <? print($page_topbar); ?>
    </div>
    <div id="colorline" style="background:<?=$current_menu['color']?>;"></div>
  </div>

  <div id="content">
    <? print($page_content); ?>
  </div>

  <? print($external_bodyend); ?>
</body>
</html>
