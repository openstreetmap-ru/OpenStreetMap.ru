<?php
include_once ('include/config.php');
error_reporting(E_ERROR | E_WARNING);
// json map format
/*
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
	"data": { // saved at json at db
		points: [
			{
				lat:float,
				lng:float,
				name:str,
				description:str
				color:str // hex format? image name?
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
if ($action == 'load' && $id) {
	$result_json = array("service"=>array());
	$result = pg_query("SELECT * FROM \"personal_map\" WHERE \"id\" = ".$id);
	$json_data = false;
	if (pg_num_rows($result) <= 0)  {
		$result_json["service"]["existing"] = false;
	} else {
		$result_json["service"]["existing"] = true;
		$row = pg_fetch_assoc($result);
		$result_json["service"]["editing"] = ($hash === $row["admin_hash"]);
		
		$result_json["info"] = array("name"=>$row["name"], "description"=>$row["description"], "user_osm"=>$row["user_osm"]);

		$json_data = $row["json"];
	}
	pg_free_result($result);
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
/* saves map to server
   post data:
   name=map name
   description= map description
   hash= map admin hash [ignored if new map]
   data= json map data
   id - post or get (?): -1 - new 
  return status: 200 ok: stdout={id:ID, hash:str}, 403 auth failed, 404 not found, 500 error occured

*/
else if ($action == 'save' && $id) {
	if ($id > 0) {
		$result = pg_query("SELECT \"admin_hash\" FROM \"personal_map\" WHERE \"id\" = ".$id);
		if (pg_num_rows($result) <= 0) {
			header("HTTP/1.0 404 Not found");
		} else {
			$row = pg_fetch_assoc($result);
			if ($row["admin_hash"] !== $hash) {
				header("HTTP/1.0 403 Authentication required");
			} else {
				$map_name = html_db_escape(@$_REQUEST['name']);
				$map_description = html_db_escape(@$_REQUEST['description']);
				$json_data = json_html_db_escape(@$_REQUEST['data']); //filtering incorrect data?
				
				$result2 = pg_query("UPDATE \"personal_map\" SET \"name\"=$map_name, \"description\"=$map_description, \"json\"=$json_data WHERE \"id\"=".$id);
				if (!$result2) {
					header("HTTP/1.0 500 Internal server error");
					// TODO: logging of such cases...
				} else {
					echo "{\"result\":\"OK\"}";
				}
			}
		}
	} else {
		$map_name = html_db_escape(@$_REQUEST['name']); // change to $_POST in future
		$map_description = html_db_escape(@$_REQUEST['description']);
		$json_data = json_html_db_escape(@$_REQUEST['data']);
		echo $json_data;
		$query = "INSERT INTO \"personal_map\" (\"name\", \"description\", \"json\") VALUES ($map_name, $map_description, $json_data);";
		$query.= "SELECT \"id\", \"admin_hash\" FROM \"personal_map\" WHERE \"id\"=currval('personal_map_id_seq');";
		$result = pg_query($query);
		if (!$result) {
			header("HTTP/1.0 500 Internal server error");
			// TODO: logging
		} else {
			$row = pg_fetch_assoc($result);
			$json = array("id"=>$row['id'], "hash"=>$row['admin_hash'], "result"=>"OK");
			echo json_encode($json);
		}
	}	
}
function html_escape($str) { return htmlspecialchars($str, ENT_NOQUOTES|ENT_HTML401, "UTF-8", false); }
function color_escape($str) {
	if(preg_match('/^\\#[0-9a-fA-F]{6}$/',$str))
		return $str;
	return "#ff0000";
}
function html_db_escape($str) {
	return "'".pg_escape_string(html_escape($str))."'";
}
function json_html_db_escape($str) {
	$data_pre = json_decode($str, true);
	// processing and filtering html where needed
	$points_pre = isset($data_pre['points'])?$data_pre['points']:array();
	$lines_pre = isset($data_pre['lines'])?$data_pre['lines']:array();
	$points = array();
	$lines = array();
	$points_pre = array_slice($points_pre, 0, PERSMAP_MAX_POINTS);
	$lines_pre = array_slice($lines_pre, 0, PERSMAP_MAX_LINES);
	foreach($points_pre as $ppoint) {
		$points[]=array('lat'=>floatval($ppoint['lat']),
						'lon'=>floatval($ppoint['lon']),
						'name'=>html_escape($ppoint['name']),
						'description'=>html_escape($ppoint['description']),
						'color'=>color_escape($ppoint['color']));
	}
	foreach($lines_pre as $pline) {
		$pline['points'] = array_slice($pline['points'], 0, PERSMAP_MAX_LINE_POINTS);
		$line = array(	'name'=>html_escape($pline['name']),
						'description'=>html_escape($pline['description']),
						'color'=>color_escape($ppoint['color']));
		$points = array();
		if (is_array($pline['points']))
		foreach($pline['points'] as $platlon)
			if (is_array($platlon)&&isset($platlon[0])&&isset($platlon[1])) 
				$points[]=array(floatval($platlon[0]),floatval($platlon[1]));
		$line['points']=$points;
		$lines[]=$line;
	}
	$data = array("points"=>$points, "lines"=>$lines);
	$str = json_encode($data);
	return "'".pg_escape_string($str)."'";
}
?>