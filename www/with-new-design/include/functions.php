<?
function show_menu($current = '', $level = 0) {
  $result = mysql_query('SELECT * FROM pagedata WHERE level<='.$level);

  echo '<div id="menupan"><ul>';
  $menu = array();
  while ($row = mysql_fetch_assoc($result))
    $menu[] = ($current == $row['name'] ? '<li><div class="current">'.$row['text'].'</div></li>' : '<li><a href="'.$row['name'].'.htm"><div>'.$row['text'].'</div></a></li>');
  echo implode($menu);
  echo '</ul></div>';
}

function err404($code=0) {
  header("Status: 404 Not Found");
  include_once 'include/404.php';
  exit();
}

function err500() {
  header("Status: 500 Internal Server Error");
  echo 'Ошибка на сервере.';
  exit();
}

?>
