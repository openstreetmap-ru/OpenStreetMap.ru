<?

function build_modes($modes, $bgcolor) {
  if ($modes) {
    $res = '<ul style="background: '.$bgcolor.'">';

    foreach ($modes as $mode) {
      $res.= '<li class="'.$mode['name'].'"><a href="#">'.$mode['text'].'</a></li>';
    }

    $res.= "</ul>";

    return $res;
  }
}

function show_menu($pages, $current = '') {
  echo '<table id="mainmenu"><tr>';
  $menu = array();
  foreach  ($pages as $page) {
    $page['name2'] = ($page['name'] == 'map' ? '' : $page['name']);
    $menu[] = ($current == $page['name'] ? '<td><div class="current">'.$page['text'].build_modes($page['modes'], $page['modescolor']).'</div></td>' : '<td><a href="/'.$page['name2'].'"><div>'.$page['text'].'</div></a></td>');
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
