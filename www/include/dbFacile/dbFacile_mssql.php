<?php


class dbFacile_mssql extends dbFacile {
	public function beginTransaction() {
		//mssql_query('begin', $this->connection);
	}

	public function commitTransaction() {
		//mssql_query('commit', $this->connection);
	}

	public function close() {
		mssql_close($this->connection);
	}

	public function rollbackTransaction() {
		//mssql_query('rollback', $this->connection);
	}

	protected function _affectedRows() {
		return mssql_rows_affected($this->connection);
	}

	protected function _error() {
		return mssql_get_last_message();
	}

	protected function _escapeString($string) {
		$s = stripslashes($string);
		$s = str_replace( array("'", "\0"), array("''", '[NULL]'), $s);
		return $s;
	}

	protected function _fetch() {
		// use mysql_data_seek to get to row index
		return $this->_fetchAll();
	}

	protected function _fetchAll() {
		$data = array();
		while($row = mssql_fetch_assoc($this->result)) {
			$data[] = $row;
		}
		//mssql_free_result($this->result);
		// rewind?
		return $data;
	}

	protected function _fetchRow() {
		return mssql_fetch_assoc($this->result);
	}

	protected function _fields($table) {
		$this->execute('select COLUMN_NAME,DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME=?', array($table), false);
		return $this->_fetchAll();
	}

	protected function _foreignKeys($table) {
	}

	protected function _lastID() {
		return $this->fetchCell('select scope_identity()');
	}

	protected function _open($database, $user, $password, $host) {
		$this->connection = mssql_connect($host, $user, $password);
		if($this->connection)
			mssql_select_db($database, $this->connection);
		//$this->buildSchema();
		return $this->connection;
	}

	protected function _numberRows() {
		return mssql_num_rows($this->result);
	}

	protected function _primaryKey($table) {
	}

	protected function _query($sql, $buffered = true) {
		return mssql_query($sql, $this->connection);
	}

	protected function _quoteField($field) {
		return $field;
	}
	protected function _quoteFields($fields) {
		return $fields;
	}

	protected function _rewind($result) {
	}
	
	protected function _tables() {
	}
} // mssql

