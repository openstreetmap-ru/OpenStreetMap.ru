<?
include_once("include/passwd.php");
include_once("include/functions.php");
// declare $pgconnstr in include/passwd.php
pg_connect($pgconnstr);

function furl($f) {
  $m = md5($f);
  $url = "http://upload.wikimedia.org/wikipedia/commons/thumb/".
         $m[0]."/".$m[0].$m[1]."/".$f."/180px-".$f;
  $url = str_replace(" ","_",$url);
  return $url;
}

$emptykml = 
'<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://earth.google.com/kml/2.1">
 <Style id="Commons-logo">
  <IconStyle>
   <Icon>
    <href>img/commons.png</href>
   </Icon>
  </IconStyle>
 </Style>
</kml>';

$doc = new SimpleXMLElement($emptykml);

$bbox = explode(",", $_GET["bbox"]);

foreach($bbox as $v)
  if (!preg_match('/^-?\d+(\.\d+)$/', $v)) die;

if (isset($_GET["algo"]))
  $algo = $_GET["algo"];
else
  $algo = 1;

$cx = ($bbox[1]+$bbox[3])/2;
$cy = ($bbox[0]+$bbox[2])/2;

$bboxg = "ST_SetSRID(ST_GeomFromText('LINESTRING($bbox[1] $bbox[0],$bbox[3] $bbox[2])'),4326)";
$center = "ST_SetSRID(ST_MakePoint($cx,$cy),4326)";

if ($algo == 1) {
  $dx = $bbox[3]-$bbox[1];
  $dy = $bbox[2]-$bbox[0];
  $dx = $dx/50;
  $dy = $dy/30;
  $orderby = "RANDOM()";
  $query = "SELECT COUNT(1) AS cnt,ARRAY_AGG(page) AS pages,FIRST(page) AS page,FIRST(\"desc\") AS \"desc\",FIRST(ST_X(point)) AS lon,FIRST(ST_Y(point)) AS lat FROM wpc_img WHERE point && $bboxg GROUP BY ST_SnapToGrid(point,$cx,$cy,$dx,$dy) ORDER BY $orderby ASC LIMIT 256";
} elseif($algo == 0) {
  $orderby = "ST_Distance_Sphere(FIRST(point),$center)";
  $query = "SELECT COUNT(1) AS cnt,ARRAY_AGG(page) AS pages,FIRST(page) AS page,FIRST(\"desc\") AS \"desc\",FIRST(ST_X(point)) AS lon,FIRST(ST_Y(point)) AS lat FROM wpc_img WHERE point && $bboxg GROUP BY point ORDER BY $orderby ASC LIMIT 256";
} elseif($algo == 2) {
  $query = "SELECT 1 AS cnt,page,\"desc\",ST_X(point) AS lon,ST_Y(point) AS lat FROM wpc_img WHERE point && $bboxg LIMIT 256";
}

$res = pg_query($query);

if(!$res) {
  Header("Content-Type: text/xml; charset=utf-8");
  $pm = $doc->addChild("Placemark");
  $pm->addChild("name");
  $pm->name = "Error in query";
  $pm->addChild("description");
  $pm->{'description'} = "<br/><b>$query<b>";
  $p = $pm->addChild("Point");
  $p->addChild("coordinates");
  $p->coordinates = $cx.",".$cy.",0";
  print $doc->asXML();
  exit;
}

Header("Content-Type: text/xml; charset=utf-8");

function row2desc($row) {
  $links = "<a href=\"http://commons.wikimedia.org/w/index.php?title=".urlencode($row["page"])."&action=edit\" target=\"_blank\">Править</a>";
  $links .= " <a href=\"wpc-up.php?title=".urlencode($row["page"])."\" target=\"_blank\">Обновить</a>";
  $desc = "<p>".$row["desc"]."</p><a href=\"http://commons.wikipedia.org/wiki/".htmlspecialchars($row["page"])."?uselang=ru\" target=_blank><img src=\"".htmlspecialchars(furl(str_replace(" ","_",str_replace("File:","",$row["page"]))))."\" /></a><br><font style='font-size: 9px'>".$links."</font>";
  return $desc;
}

while ($row = pg_fetch_assoc($res)) {
  $pm = $doc->addChild("Placemark");
  $pm->addChild("name");
  $pm->name = "<a href=\"http://commons.wikimedia.org/\"><img src=\"img/commons-mini.png\" width=\"20\" height=\"27\" border=\"0\"></a> Wikimedia Commons";

  $pm->addChild("description");
  $links = "<a href=\"http://commons.wikimedia.org/w/index.php?title=".urlencode($row["page"])."&action=edit\" target=\"_blank\">Править</a>";
  $links .= " <a href=\"wpc-up.php?title=".urlencode($row["page"])."\" target=\"_blank\">Обновить</a>";
  if ($row["cnt"]<2)
    $pm->{'description'} = row2desc($row);
  elseif($row["cnt"]<17) {
    $es = array();
    $pages = "";
    pg_array_parse($row["pages"],$pages);
    foreach($pages as $p) $es []= "'".pg_escape_string($p)."'";
    $q = "SELECT page,\"desc\",ST_X(point) AS lon,ST_Y(point) AS lat FROM wpc_img WHERE page IN (".implode(",",$es).") LIMIT 16";
    $qres = pg_query($q);
    $desc = null;
    $i = 1;
    while ($qrow = pg_fetch_assoc($qres)) {
      $display = "block";
      if($desc) $display = "none";
      $bar = "<br><a href='#' onclick='wpcprev(event)'>&laquo;</a> $i/".$row["cnt"]." <a href='#' onclick='wpcnext(event)'>&raquo;</a>";
      $desc .= "<div style='display: $display'>".row2desc($qrow).$bar."</div>";
      $i++;
    }
    $pm->{'description'} = $desc;
  } else {
    $other = "<br>Ещё изображений: ".($row["cnt"]-1).", приблизьтесь, чтобы увидеть их.";
    $pm->{'description'} = row2desc($row).$other;
  }
  $pm->addChild("styleUrl");
  $pm->styleUrl = "#Commons-logo";
  $p = $pm->addChild("Point");
  $p->addChild("coordinates");
  $p->coordinates = $row["lat"].",".$row["lon"].",0";
}

print $doc->asXML();
?>
