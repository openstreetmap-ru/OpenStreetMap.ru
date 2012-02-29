<?
function show_menu($current = '', $level = 0) {
  $result = pg_query('SELECT * FROM "pagedata" WHERE "level"<='.$level.' AND "activate" AND "order">0 ORDER BY "order" asc');

  echo '<table id="mainmenu"><tr>';
  $menu = array();
  while ($row = pg_fetch_assoc($result)) {
    $row['name2'] = ($row['name'] == 'map' ? '' : $row['name']);
    $menu[] = ($current == $row['name'] ? '<td><div class="current">'.$row['text'].'</div></td>' : '<td><a href="/'.$row['name2'].'"><div>'.$row['text'].'</div></a></td>');
  }
  echo implode($menu);
  echo '</tr></table>';
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
