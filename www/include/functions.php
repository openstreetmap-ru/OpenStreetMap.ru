<?
function show_menu($pages, $current = '') {
  echo '<table id="mainmenu"><tr>';
  $menu = array();
  foreach  ($pages as $page) {
    $page['name2'] = ($page['name'] == 'map' ? '' : $page['name']);
    $menu[] = ($current == $page['name'] ? '<td><div class="current">'.$page['text'].'</div></td>' : '<td><a href="/'.$page['name2'].'"><div>'.$page['text'].'</div></a></td>');
  }
  echo implode($menu);
  echo '</tr></table>';
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
