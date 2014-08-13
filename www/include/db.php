<?php
function db_open($type, $db_name, $db_user, $db_password, $db_host) {
	$class_name = "dbFacile_" . $type;
	include_once("dbFacile/$class_name.php");
	$db = new $class_name();
	if ($type == "sqlite3")
		$db->open($db_name);
	else if ($type == "postgresql")
		$db->open($db_name, $db_user, $db_password, $db_host);
	else
		include_once '../500.php';
	return $db;
};
