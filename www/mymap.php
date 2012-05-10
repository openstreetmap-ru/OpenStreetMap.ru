<?php
include_once ('include/config.php');
error_reporting(E_ERROR | E_WARNING);
mb_internal_encoding("UTF-8");
// json map format
/* color are integers, not hex strings
out:{
  "service": { //only sent from server
    existing: bool, // map exists?
    editing: bool // for editing, empty for read-only
  },
  "info": {
    name: str, // map name
    description: str, //map descr
    user_osm: str, // creator
  },
  "data": { // saved at json at db, received from client side
    points: [
      {
        lat:float,
        lon:float,
        name:str,
        description:str
        color:str //1-6// hex format? image name?
      }
    ],
    lines: [
      {
        name:str,
        description:str
        color:str // hex format
        
        points:[
          [lat,lon]
        ]
      }    
    ]
  }
}

*/

/////////////////////////////////////////////
// load map from db
// in 'id'  : map id
// in 'hash': edit hash
// out: 'out' formatted json
$id = intval(@$_REQUEST['id']);
$hash = @$_REQUEST['hash'];
$action = @$_REQUEST['action'];
$format = @$_REQUEST['format'];
if (($action == 'load' || empty($action)) && $id) {
  $row = $dbapi->fetchRow("SELECT * FROM personal_map WHERE id = ?", array($id));

  if ($format === "gpx") {
    generate_gpx_output($row);
  } else // Default format
    generate_json_output($row, $hash); // only format that needs hash for administration
} 
/* saves map to server
   post data:
   name=map name
   description= map description
   hash= map admin hash [ignored if new map]
   data= json map data
   id - post or get (?): -1 - new 
  return status: 200 ok: stdout={id:ID, hash:str}, 403 auth failed, 404 not found, 500 error occured

*/
else if ($action == 'save') {
  if ($id > 0) {
    $row = $dbapi->fetchRow("SELECT admin_hash FROM personal_map WHERE id = ?", array($id));
    if (!$row) {
      header("HTTP/1.0 404 Not found");
    } else {
      if ($row["admin_hash"] !== $hash) {
        header("HTTP/1.0 403 Authentication required");
      } else {
        $map_name = html_escape(@$_REQUEST['name'], 45);
        $map_description = html_escape(@$_REQUEST['description'], 1024);
        $json_data = json_encode(json_to_data(@$_REQUEST['data']));
        
        if ($json_data) {
          $result2 = $dbapi->execute("UPDATE personal_map SET name=?, description=?, json=? WHERE id=?", array($map_name, $map_description, $json_data, $id));
          if (!$result2) {
            header("HTTP/1.0 500 Internal server error");
            // TODO: logging of such cases...
          } else {
            echo "{\"result\":\"OK\"}";
          }
        } else {
          header("HTTP/1.0 406 Data incorrect");
        }
      }
    }
  } else {
    $map_name = html_escape(@$_REQUEST['name'], 45); // change to $_POST in future
    $map_description = html_escape(@$_REQUEST['description'], 1024);
    $json_data = json_encode(json_to_data(@$_REQUEST['data']));
    if ($json_data) {
      $id = mt_rand();
      $hash = md5("$id" . mt_rand());
      $result = $dbapi->execute("INSERT INTO personal_map (id, admin_hash, name, description, json) VALUES (?, ?, ?, ?, ?)", array($id, $hash, $map_name, $map_description, $json_data));
      if ($result == false) { echo "error: ".pg_last_error()."\n";
        header("HTTP/1.0 500 Internal server error");
        // TODO: logging
      } else {
        $json = array("id"=>$id, "hash"=>$hash, "result"=>"OK");
        echo json_encode($json);
      }
    } else {
      header("HTTP/1.0 406 Data incorrect");
    }
  }  
} else {
  header("HTTP/1.0 501 Not Implemented");
}
function html_escape($str, $len) { 
  $str = mb_substr($str, 0, $len);
  return htmlspecialchars($str, ENT_NOQUOTES|ENT_HTML401, "UTF-8", false); 
}
  
function color_escape($str) {
  /*if(preg_match('/^\\#[0-9a-fA-F]{1,6}$/',$str))
    return $str;
  return "#ff0000";*/
  return intval($str);
}
function json_html_db_escape($str) {
  $data = json_decode($str, true);
  $str = json_encode($data); //, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  return $str;
}

function json_to_data($str) {
  global $PERSMAP_MAX_POINTS, $PERSMAP_MAX_LINE_POINTS;
  //$data_pre = json_decode($str, true);
  $data_pre = $str; // already is the data
  // processing and filtering html where needed
  $points_pre = isset($data_pre['points'])?$data_pre['points']:array();
  $lines_pre = isset($data_pre['lines'])?$data_pre['lines']:array();
  $points = array();
  $lines = array();
  $points_pre = array_slice($points_pre, 0, $PERSMAP_MAX_POINTS);
  foreach($points_pre as $ppoint) {
    $points[]=array('lat'=>floatval($ppoint['lat']),
            'lon'=>floatval($ppoint['lon']),
            'name'=>html_escape($ppoint['name'], 45),
            'description'=>html_escape($ppoint['description'], 1024),
            'color'=>color_escape($ppoint['color']));
  }
  $points_left = $PERSMAP_MAX_LINE_POINTS;
  foreach($lines_pre as $pline) {
    $points_left -= count($pline['points']);
    if ($points_left < 0)
      continue;
    $pline['points'] = array_slice($pline['points'], 0, $PERSMAP_MAX_LINE_POINTS);
    $line = array(  'name'=>html_escape($pline['name'], 45),
            'description'=>html_escape($pline['description'], 1024),
            'color'=>color_escape($pline['color']));
    $lpoints = array();
    if (is_array($pline['points']))
    foreach($pline['points'] as $platlon)
      if (is_array($platlon)&&isset($platlon[0])&&isset($platlon[1])) 
        $lpoints[]=array(floatval($platlon[0]),floatval($platlon[1]));
    $line['points']=$lpoints;
    $lines[]=$line;
  }
  if (count($points) == 0 && count($lines) == 0)
    return false;
  $data = array("points"=>$points, "lines"=>$lines);
  return $data;
}

function generate_json_output($row, $hash) {
  $json_data = false;
  if (!$row)  {
    $result_json["service"]["existing"] = false;
  } else {
    $result_json["service"]["existing"] = true;
    $result_json["service"]["editing"] = ($hash === $row["admin_hash"]);

    $result_json["info"] = array("name"=>$row["name"], "description"=>$row["description"], "user_osm"=>$row["user_osm"]);

    $json_data = $row["json"];
  }
  $send = json_encode($result_json);
  if ($json_data!==false) {
    $send = substr($send, 0, -1);
    echo $send;
    echo ",\"data\":".$json_data;
    echo "}";
  } else {
    echo $send;
  }
}

function generate_gpx_output($row) {
  header("Content-type: application/gpx+xml");
  echo <<<EOD
<?xml version="1.0"?>
<gpx
 version="1.0"
 creator="OpenStreetMap.ru PersonalMap"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xmlns="http://www.topografix.com/GPX/1/0"
 xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd">
EOD;
  setLocale(LC_NUMERIC, "C");
  if ($row) {
    echo "<metadata>";
//  echo "<time>".$row['...']."</time>";    TODO: fill creation/modified time, map name, map description
    echo "<name>{$row['name']}</name><desc>{$row['description']}</desc>";
    echo "</metadata>";

    $data = json_decode($row['json']);
    foreach($data->points as $point) {
      echo "<wpt lat=\"{$point->lat}\" lon=\"{$point->lon}\"><name>{$point->name}</name><desc><![CDATA[{$point->description}]]></desc></wpt>";
    }
    foreach($data->lines as $line) {
      echo "<rte><name>{$line->name}</name><desc><![CDATA[{$line->description}]]></desc>";
      foreach($line->points as $point) {
        echo "<rtept lat=\"{$point[0]}\" lon=\"{$point[1]}\"/>";
      }
      echo "</rte>";
    }
  }
  echo "</gpx>";
}
?>
