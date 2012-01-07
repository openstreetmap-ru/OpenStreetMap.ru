<?php
include_once("include/passwd.php");
pg_connect($pgconnstr);

$query = "SELECT * FROM wpc_req";
$res = pg_query($query);

Header("Content-Type: text/html; charset=utf-8");

if (!pg_num_rows($res)) {
  print "Очередь пуста";
  exit;
}

print "Очередь<p>\n<table border=\"1\" cellspacing=\"0\">\n<tr><th>Страница</th><th>Дата</th></tr>\n";
while ($row = pg_fetch_assoc($res)) {
  print "<tr><td>".htmlentities($row["page"])."</td><td>".$row["added"]."</td></tr>\n";
}
print "</table>";
?>
