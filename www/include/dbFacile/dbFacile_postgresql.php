<?php
require_once('dbFacile.php');

class dbFacile_postgresql extends dbFacile {
	public function affectedRows($result = null) {
		return pg_affected_rows($result);
	}
	
	public function close() {
		pg_close($this->connection);
	}

	public function error() {
		return mysql_error($this->connection);
	}
	public function lastError() {
		return pg_last_error($this->connection);
	}

	public function escapeString($string) {
		return pg_escape_string($string);
	}

	public function lastID($table = null) {
		$sequence = $this->fetchCell("SELECT relname FROM pg_class WHERE relkind = 'S' AND relname LIKE '" . $table . "_%'");
		if(strlen($sequence))
			return $this->fetchCell('select last_value from ' . $sequence);
		return false;
	}

	public function numberRows($result) {
		return pg_num_rows($result);
	}

	// user, password, database, host
	public function open($database, $user, $password, $host = 'localhost') {
		//die("host=$host dbname=$database user=$user");
		$this->connection = pg_connect("host=$host port=5432 dbname=$database user=$user password=$password");
		return $this->connection;
	}

	// Backticks don't work for Postgresql
	public function quoteField($field) {
		return $field;
	}

	public function rewind($result) {
	}


	protected function _fetch($result) {
		return $this->_fetchAll($result);
	}

	protected function _fetchAll($result) {
		$data = array();
		while($row = pg_fetch_assoc($result)) {
			$data[] = $row;
		}
		pg_free_result($result);
		// rewind?
		return $data;
	}

	protected function _fetchRow($result) {
		return pg_fetch_assoc($result);
	}

	protected function _query($sql) {
		return pg_query($this->connection, $sql);
	}
} // postgresql

