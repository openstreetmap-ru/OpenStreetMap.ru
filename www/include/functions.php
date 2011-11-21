<?
function show_menu($current = '', $level = 0) {
  $result = pg_query('SELECT * FROM pagedata WHERE level<='.$level.' AND activate');

  echo '<div id="menupan"><div id="menuback"></div><table><tr>';
  $menu = array();
  while ($row = pg_fetch_assoc($result))
    $menu[] = ($current == $row['name'] ? '<td><div class="current">'.$row['text'].'</div></td>' : '<td><a href="/'.$row['name'].'"><div>'.$row['text'].'</div></a></td>');
  echo implode($menu);
  echo '</tr></table></div>';
}

function show_menu_old($current = '', $level = 0) {
  $result = pg_query('SELECT * FROM pagedata WHERE level<='.$level);

  echo '<div id="menupan"><ul>';
  $menu = array();
  while ($row = pg_fetch_assoc($result))
    $menu[] = ($current == $row['name'] ? '<li><div class="current">'.$row['text'].'</div></li>' : '<li><a href="'.$row['name'].'"><div>'.$row['text'].'</div></a></li>');
  echo implode($menu);
  echo '</ul></div>';
}

function err404($code=0) {
  header("Status: 404 Not Found");
  include_once '404.php';
  exit();
}

function err500() {
  header("Status: 500 Internal Server Error");
  echo 'Ошибка на сервере.';
  exit();
}

?>
