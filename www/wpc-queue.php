<?php
include_once("include/passwd.php");
pg_connect($pgconnstr);

$query = "SELECT * FROM wpc_req";
$res = pg_query($query);

Header("Content-Type: text/html; charset=utf-8");

if (!pg_num_rows($res)) {
  print "<p>Очередь пуста</p>";
} else {
  print "Очередь<p>\n<table border=\"1\" cellspacing=\"0\">\n<tr><th>Страница</th><th>Дата</th></tr>\n";
  while ($row = pg_fetch_assoc($res)) {
    print "<tr><td>".htmlentities($row["page"],ENT_COMPAT,"utf-8")."</td><td>".$row["added"]."</td></tr>\n";
  }
  print "</table>";
}

$query = "SELECT * FROM wpc_done ORDER BY done DESC LIMIT 8";
$res = pg_query($query);

print "<p>Последние запросы</p>\n<table border=\"1\" cellspacing=\"0\">\n<tr><th>Страница</th><th>Дата</th><th>Широта</th><th>Долгота</th></tr>\n";
while ($row = pg_fetch_assoc($res)) {
  print "<tr><td>".htmlentities($row["page"],ENT_COMPAT,"utf-8")."</td><td>".$row["done"]."</td><td>".$row["lat"]."</td><td>".$row["lon"]."</td></tr>\n";
  print "<tr><td colspan=\"4\">".htmlentities($row["desc"],ENT_COMPAT,"utf-8")."</td></tr>\n";
}

print "</table>";
