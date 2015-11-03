<?php
require_once('dbFacile.php');

class dbFacile_mysql extends dbFacile {
	public function affectedRows($result = null) {
		return mysql_affected_rows($this->connection);
	}

	public function close() {
		mysql_close($this->connection);
	}

	public function error() {
		return mysql_error($this->connection);
	}

	public function escapeString($string) {
		return mysql_real_escape_string($string);
	}

	public function lastID($table = null) {
		$id = mysql_insert_id($this->connection);
		// $id will be 0 if insert succeeded, but statement didn't generate a new id (no auto-increment)
		if ($id == 0) return false;
		return $id;
	}

	public function numberRows($result) {
		return mysql_num_rows($result);
	}

	public function open($database, $user, $password, $host = 'localhost', $charset = 'utf8') {
		$this->database = $database;
		// force opening a new link because we might be selecting a different database
		$this->connection = mysql_connect($host, $user, $password, true);
		if($this->connection) {
			mysql_select_db($database, $this->connection);
			if ($charset)
				mysql_set_charset($charset, $this->connection);
		}
		//$this->buildSchema();
		return $this->connection;
    }

	public function rewind($result) {
	}


	// Protected internals
	protected function _fetch($result) {
		// use mysql_data_seek to get to row index
		return $this->_fetchAll($result);
	}

	protected function _fetchAll($result) {
		$data = array();
		while($row = mysql_fetch_assoc($result)) {
			$data[] = $row;
		}
		//mysql_free_result($this->result);
		return $data;
	}

	protected function _fetchRow($result) {
		return mysql_fetch_assoc($result);
	}

	// user, password, database, host

	protected function _query($sql, $buffered = true) {
		if ($buffered) {
			return mysql_query($sql, $this->connection);
		}else {
			return mysql_unbuffered_query($sql, $this->connection);
		}
	}

} // mysql

