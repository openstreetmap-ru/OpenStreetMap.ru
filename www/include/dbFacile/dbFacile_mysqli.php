<?php
require_once('dbFacile.php');

class dbFacile_mysqli extends dbFacile {
	public function affectedRows($result = null) {
		return mysql_affected_rows($this->connection);
	}

	public function beginTransaction() {
		mysqli_autocommit($this->connection, false);
	}

	public function close() {
		mysqli_close($this->connection);
	}

	public function commitTransaction() {
		mysqli_commit($this->connection);
		mysqli_autocommit($this->connection, true);
	}

	public function escapeString($string) {
		return mysql_real_escape_string($string);
	}

	public function lastError() {
		return mysqli_error($this->connection);
	}

	public function escapeString($string) {
		return mysqli_real_escape_string($string);
	}

	public function lastID($table = null) {
		return mysqli_insert_id($this->connection);
	}

	public function numberRows($result) {
		if(mysqli_affected_rows($this->connection)) { // for insert, update, delete
			$this->numberRecords = mysqli_affected_rows($this->connection);
		} elseif(!is_bool($result)) { // for selects
			$this->numberRecords = mysqli_num_rows($result);
		} else { // will be boolean for create, drop, and other
			$this->numberRecords = 0;
		}
	}

	public function open($database, $user, $password, $host='localhost', $charset='utf-8') {
                // force opening a new link because we might be selecting a different database
                $this->connection = mysqli_connect($host, $user, $password, $database);
                return $this->connection;
        }

	public function rewind($result) {
	}

	public function rollbackTransaction() {
		mysqli_rollback($this->connection);
		mysqli_autocommit($this->connection, true);
	}


	protected function _fetch($result) {
		return $this->_fetchAll($result);
	}
	protected function _fetchAll($result) {
		$data = array();
		for($i = 0; $i < $this->numberRecords($result); $i++) {
			$data[] = mysqli_fetch_assoc($result);
		}
		mysqli_free_result($result);
		return $data;
	}
	protected function _fetchRow($result) {
		return mysqli_fetch_assoc($result);
	}
	protected function _query($query) {
		return mysqli_query($this->connection, $query);
	}
} // mysqli

