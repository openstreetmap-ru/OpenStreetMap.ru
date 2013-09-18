<?
include_once("include/passwd.php");
pg_connect($pgconnstr);

Header("Content-Type: text/html; charset=utf-8");

if (!isset($_GET["title"])) {
  print "Обязательный параметр title не определён!";
  exit;
}

$title = $_GET["title"];
if (isset($_GET["js"]) && $_GET["js"]) $title = urldecode($title);
$title = preg_replace("@^https?://commons\.wikimedia\.org/wiki/@", "", $title);
$title = preg_replace("@\?.+$@", "", $title);
$title = preg_replace("@#.+$@", "", $title);
$title = preg_replace("@_@", " ", $title);
if (!preg_match("@^File:@", $title)) {
  print "Страница <b>$title</b> не является страницей описания картинки";
  exit;
}

$query = "INSERT INTO wpc_req (page, added) VALUES ('".pg_escape_string($title)."', NOW())";
$res = pg_query($query);

print "Страница <b>$title</b> добавлена в <a href=\"wpc-queue.php\">очередь</a> на обновление";
?>
