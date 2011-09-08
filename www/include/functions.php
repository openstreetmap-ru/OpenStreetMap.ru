<?
function show_menu() {
  global $loginned, $pages, $page;
  echo '<div id="menupan"><ul>';
  $menu = array();
  foreach ($pages as $n=>$row)
    if ($row['public'] or $loginned)
      $menu[] = ($n == $page ? '<li><span class="current">'.$row['name'].'</span></li>' : '<li><a href="'.$row['file'].'">'.$row['name'].'</a></li>');
  echo implode(' | ', $menu);
  echo '</ul></div>';
}

function setPermalink() {
  $lat=$_GET['lat'];
  $lon=$_GET['lon'];
  $zoom=$_GET['zoom'];
  settype($lat,"float");
  settype($lon,"float");
  settype($zoom,"float");
  if ($lat<>0 or $lon<>0 and $zoom<>0)
    print(" osm.map.setView(new L.LatLng(".$lat.",".$lon."), ".$zoom.");");
}

?>
