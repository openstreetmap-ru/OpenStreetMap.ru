<?

function build_modes($modes, $bgcolor) {
  if ($modes) {
    $res = '<ul class="submenu" style="background: '.$bgcolor.'">';

    foreach ($modes as $mode) {
      $res.= '<li class="'.$mode['name'].'">'.$mode['text'].'</li>';
    }

    $res.= "</ul>";

    return $res;
  }
}

function show_menu($pages, $current = '') {
  echo '<table id="mainmenu"><tr>';
  $menu = array();
  foreach  ($pages as $page) {
    if ($page['name'] == 'map') {
      $page['name2'] = '';
      $page['imgmenu'] = '<img src="img/menu_arrow.png" id="menu_arrow_img">';
    }
    else {
      $page['name2'] = $page['name'];
      $page['imgmenu'] = '';
    }
    $line_modes=(isset($page['modes']) ? build_modes($page['modes'], $page['modescolor']):'');
    $menu[] = ($current == $page['name'] ? '<td>'.$page['imgmenu'].'<div class="current">'.$page['text'].$line_modes.'</div></td>' : '<td><a href="/'.$page['name2'].'"><div>'.$page['text'].'</div></a></td>');
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

# see http://www.php.net/manual/ru/ref.pgsql.php#89841
function pg_array_parse( $text, &$output, $limit = false, $offset = 1 )
{
  if( false === $limit )
  {
    $limit = strlen( $text )-1;
    $output = array();
  }
  if( '{}' != $text )
    do
    {
      if( '{' != $text{$offset} )
      {
        preg_match( "/(\\{?\"([^\"\\\\]|\\\\.)*\"|[^,{}]+)+([,}]+)/", $text, $match, 0, $offset );
        $offset += strlen( $match[0] );
        $output[] = ( '"' != $match[1]{0} ? $match[1] : stripcslashes( substr( $match[1], 1, -1 ) ) );
        if( '},' == $match[3] ) return $offset;
      }
      else  $offset = pg_array_parse( $text, $output[], $limit, $offset+1 );
    }
    while( $limit > $offset );
  return $output;
}

?>
