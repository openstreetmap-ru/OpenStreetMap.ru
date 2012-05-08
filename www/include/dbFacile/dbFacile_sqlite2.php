<?php
require_once('dbFacile.php');

/*
 * To create a new driver, implement the following:
 * protected _open(...)
 * protected _query($sql, $buffered)
 * protected _escapeString
 * protected _error
 * protected _affectedRows
 * protected _numberRows
 * protected _fetch
 * protected _fetchAll
 * protected _fetchRow
 * protected lastID
 * protected _schema
 * public beginTransaction
 * public commitTransaction
 * public rollbackTransaction
 * public close
 * */

class dbFacile_sqlite2 extends dbFacile {
	public function affectedRows($result = null) {
		return sqlite_changes($this->connection);
	}

	public function beginTransaction() {
		$thiss->_query('begin transaction');
	}

	public function close() {
		sqlite_close($this->connection);
	}

	public function commitTransaction() {
		$this->_query('commit transaction');
	}

	public function error() {
		return sqlite_error_string(sqlite_last_error($this->connection));
	}

	public function escapeString($string) {
		return sqlite_escape_string($string);
	}

	public function lastID($table = null) {
		return sqlite_last_insert_rowid($this->connection);
	}

	public function numberRows($result) {
		return sqlite_num_rows($result);
	}

	public function open($database) {
		$this->connection = sqlite_open($database);
		//$this->buildSchema();
		return $this->connection;
	}

	public function quoteField($field) {
		return '"' . $field . '"';
	}

	public function rewind($result) {
		sqlite_rewind($result);
	}

	public function rollbackTransaction() {
		$this->_query('rollback transaction');
	}



	protected function _fetch($result) {
		return new dbFacile_sqlite_result($result);
	}

	protected function _fetchAll($result) {
		$rows = sqlite_fetch_all($result, SQLITE_ASSOC);
		// free result?
		// rewind?
		return $rows;
	}

	// when passed result
	// returns next row
	protected function _fetchRow($result) {
		return sqlite_fetch_array($result, SQLITE_ASSOC);
	}


	protected function _query($sql) {
		return sqlite_query($this->connection, $sql);
	}

} // sqlite



/*
class dbFacile_sqlite_result implements Iterator {
	private $result;
	public function __construct($r) {
		$this->result = $r;
	}
	public function rewind() {
		sqlite_rewind($this->result);
	}
	public function current() {
		$a = sqlite_current($this->result, SQLITE_ASSOC);
		return $a;
	}
	public function key() {
		$a = sqlite_key($this->result);
		return $a;
		// getAttribute(PDO::DRIVER_NAME) to determine the sql to call
		$this->execute('describe ' . $table);
		return $this->_fetchAll();
	}
}

*/
