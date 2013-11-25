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
  include_once '404.php';

$current_menu = $pages_menu[$_URL[0]];

if (!file_exists($current_menu["name"].'.php'))
  include_once '404.php';

include_once ('include/external.php');
include_once ($_URL[0].'.php');
?>
<!DOCTYPE html>
<html lang=ru>
<head>
  <meta charset=utf-8>
  <title>OpenStreetMap Россия — <?=$current_menu['text'] ?></title>
  <meta name="viewport" content="initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, width=device-width">
  <meta name="description" content="Наиболее актуальная карта, которую рисуют сами пользователи. Попробуйте - вам понравится!">
  <link media="screen" rel="stylesheet" href="/css/main.css" />
  <link media="screen and (max-width: 480px)" rel="stylesheet" href="/css/mobile.css" />
  <link rel="search" href="/search.xml" type="application/opensearchdescription+xml" title="OpenStreetMap.Ru" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="stylesheet" href="http://yandex.st/jquery-ui/1.9.0/themes/base/jquery-ui.min.css" />
  <? print($page_head_css); ?>
  <link media="print" rel="stylesheet" href="/css/print.css" />
  <script src="http://yandex.st/jquery/1.8.2/jquery.min.js"></script>
  <script src="http://yandex.st/jquery-ui/1.9.0/jquery-ui.min.js"></script>
  <script src="/js/page.main.js"></script>
  <? print($page_head_js); ?>
  <? print($external_head); ?>
  <script type="text/javascript">
    var srv = {};
    srv.url = ['<? print(implode("','", $_URL)) ?>'];
  </script>
</head>
<body>
  <nav role="navigation">
    <? show_menu($pages_menu, $_URL[0]); ?>
  </nav>
  <header>
    <a href="/">
      <img src="<? print($page_logo); ?>" alt="OpenStreetMap.ru" id="logo">
    </a>
    <div id="topbar">
      <? print($page_topbar); ?>
    </div>
    <div id="colorline" style="background:<?=$current_menu['color']?>;"></div>
    <div id="ttoggle" class="button toggle" accesskey="t" onclick="osm.toppan_toggle();" style="display: none;">&uarr;</div>
  </header>
  <article role="main" id="content">
    <? print($page_content); ?>
  </article>
  <? print($external_bodyend); ?>
</body>
</html>
