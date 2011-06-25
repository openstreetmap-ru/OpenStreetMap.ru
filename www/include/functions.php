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

?>
