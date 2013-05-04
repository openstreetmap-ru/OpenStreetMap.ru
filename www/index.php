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
<html lang=ru>
<head>
  <title>OpenStreetMap Россия — <?=$current_menu['text'] ?></title>
  <meta charset=utf-8>
  <meta name="viewport" content="initial-scale=1, width=device-width">
  <meta name="description" content="Наиболее актуальная карта, которую рисуют сами пользователи. Попробуйте - вам понравится!"> <!--Разделить формирование meta description для разных страниц-->
  <link media="print" rel="stylesheet" href="/css/print.css" />
  <link media="screen" rel="stylesheet" href="/css/main.css" />
  <link media="screen" rel="stylesheet" href="/css/menu.css" />
  <link media="screen and (max-width: 480px)" rel="stylesheet" href="/css/mobile.css" />
  <link rel="search" href="/search.xml" type="application/opensearchdescription+xml" title="OpenStreetMap.Ru" />
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
  <header>
    <nav role="navigation">
      <input type="checkbox" id="mtoggle" class="toggle">
      <label for="mtoggle" onclick></label>
      <? show_menu($pages_menu, $_URL[0]); ?>
    </nav>
    <div id="toppan">
      <a href="/">
        <img src="<? print($page_logo); ?>" alt="OpenStreetMap.ru" id="logo">
      </a>
      <div id="topbar">
        <? print($page_topbar); ?>
      </div>
      <div id="colorline" style="background:<?=$current_menu['color']?>;"></div>
    </div>
  </header>
  <div role="main" id="content">
    <? print($page_content); ?>
  </div>
  <? print($external_bodyend); ?>
</body>
</html>
