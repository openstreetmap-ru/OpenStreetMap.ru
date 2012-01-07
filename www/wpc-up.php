<?
include_once("include/passwd.php");
pg_connect($pgconnstr);

if (!isset($_GET["title"])) {
  Header("Content-Type: text/html; charset=utf-8");
  print "Обязательный параметр title не определён!";
  exit;
}

$title = $_GET["title"];

$query = "INSERT INTO wpc_req (page, added) VALUES ('".pg_escape_string($title)."', NOW())";
$res = pg_query($query);

print "Страница <b>$title</b> добавлена в <a href=\"wpc-queue.php\">очередь</a> на обновление";
?>
