<?php
require_once('dbFacile.php');

class dbFacile_sqlite3 extends dbFacile {
	public function affectedRows($result = null) {
		return $this->connection->changes();
	}

	public function beginTransaction() {
		$this->_query('begin transaction');
	}

	public function close() {
		$this->connection->close();
	}

	public function commitTransaction() {
		$this->_query('commit transaction');
	}

	public function error() {
		return $this->connection->lastErrorMsg();
	}

	public function escapeString($string) {
		return $this->connection->escapeString($string);
	}

	public function lastID($table = null) {
		$id = $this->connection->lastInsertRowID();
		// SQLite returns true if last statement didn't generate an id
		if ($id === true) return false;
		return $id;
	}

	public function numberRows($result) {
		$rows = $this->_fetchAll($result);
		return sizeof($rows);
	}

	public function open($database) {
		$this->connection = new SQLite3($database);
		return $this->connection;
	}

	public function quoteField($field) {
		return '"' . $field . '"';
	}

	public function rewind($result) {
		$result->reset();
	}

	public function rollbackTransaction() {
		$this->_query('rollback transaction');
	}



	protected function _fetch($result) {
		return new dbFacile_sqlite3_result($result);
	}

	protected function _fetchAll($result) {
		// loop
		$rows = array();
		while($row = $this->_fetchRow($result)) {
			$rows[] = $row;
		}
		return $rows;
	}

	// when passed result
	// returns next row
	protected function _fetchRow($result) {
		return $result->fetchArray(SQLITE3_ASSOC);
	}


	protected function _query($sql) {
		return $this->connection->query($sql);
	}

} // sqlite3

