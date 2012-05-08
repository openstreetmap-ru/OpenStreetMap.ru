<?php
/*
dbFacile - A Database abstraction that should have existed from the start
Version 0.4.3
See LICENSE for license details.
*/

abstract class dbFacile {
	protected $connection; // handle to Database connection
	protected $logFile;

	// implement these methods to create driver subclass
	public abstract function affectedRows($result = null);
	//public function beginTransaction();
	public abstract function close();
	//public function commitTransaction();
	public abstract function error();
	public abstract function escapeString($string);
	public abstract function lastID($table = null);
	public abstract function numberRows($result);
	//public abstract function open();
	//public function quoteField($field);
	public abstract function rewind($result);
	//public function rollbackTransaction();

	protected abstract function _fetch($result);
	protected abstract function _fetchAll($result);
	protected abstract function _fetchRow($result);
	//protected abstract function _fields($table);
	// Should return a result handle, or false
	protected abstract function _query($sql);

	public function __construct($handle = null) {
		$this->connection = $handle;
	}

	/*
	 * Performs a query using the given string.
	 * Used by the other _query functions.
	 * */
	public function execute($sql, $parameters = array()) {
		$fullSql = $this->makeQuery($sql, $parameters);

		/*
		if($this->logFile)
			$time_start = microtime(true);
		*/

		$result = $this->_query($fullSql); // sets $this->result

		/*
		if($this->logFile) {
			$time_end = microtime(true);
			fwrite($this->logFile, date('Y-m-d H:i:s') . "\n" . $fullSql . "\n" . number_format($time_end - $time_start, 8) . " seconds\n\n");
		}

		if(!$this->result && (error_reporting() & 1))
			trigger_error('dbFacile - Error in query: ' . $this->query . ' : ' . $this->_error(), E_USER_WARNING);
		*/

		// I know getting a real true or false is handy,
		// but returning the result handle gives more flexibility
		// and honestly, many oof the convenience functions check result anyway, so just pass it to them
		return $result;
	}

	/*
	 * Passed an array and a table name, it attempts to insert the data into the table.
	 * Check for boolean false to determine whether insert failed
	 * */
	public function insert($data, $table) {
		// Might need to use driver-specific quoteField() instead of this
		// But only if one of the DBMSes we support doesn't use backticks
		$fields = array_map( array($this,'quoteField'), array_keys($data) );
		$sql = 'insert into ' . $table . ' (' . implode(',', $fields) . ') values(?' . str_repeat(',?', sizeof($data)-1) . ')';
		$result = $this->execute($sql, $data);
		if(!$result) return false;

		return $this->lastID($table);
	}

	/*
	 * Passed an array, table name, where clause, and placeholder parameters, it attempts to update a record.
	 * Returns the number of affected rows
	 * */
	public function update($data, $table, $where = null, $parameters = array()) {
		// need field name and placeholder value
		// but how merge these field placeholders with actual $parameters array for the where clause
		$sql = 'update ' . $table . ' set ';
		// implode no looping
		foreach($data as $key => $value) {
			$sql .= $this->quoteField($key) . '=?,';
		}
		$sql = substr($sql, 0, -1); // strip off last comma
		$data = array_values($data);

		if($where) {
			$sql .= $this->whereHelper($where, $parameters);
			if($parameters) $data = array_merge($data, $parameters);
		}
		$result = $this->execute($sql, $data);
		return $this->affectedRows($result);
	}

	public function delete($table, $where = null, $parameters = array()) {
		$sql = 'DELETE FROM ' . $table;
		if($where) $sql .= $this->whereHelper($where, $parameters);
		$result = $this->execute($sql, $parameters);
		return $this->affectedRows($result);
	}

	/*
	 * This is intended to be the method used for large result sets.
	 * It is intended to return an iterator, and act upon buffered data.
	 * */
	public function fetch($sql, $parameters = array()) {
		$result = $this->execute($sql, $parameters);
		return $this->_fetch($result);
	}

	/*
	 * Fetches all of the rows where each is an associative array.
	 * Tries to use unbuffered queries to cut down on execution time and memory usage,
	 * but you'll only see a benefit with extremely large result sets.
	 * */
	public function fetchAll($sql, $parameters = array()) {
		$result = $this->execute($sql, $parameters, false);
		if($result)
			return $this->_fetchAll($result);
		return array();
	}

	/*
	 * Fetches the first call from the first row returned by the query
	 * */
	public function fetchCell($sql, $parameters = array()) {
		$result = $this->execute($sql, $parameters);
		if($result) {
			return array_shift($this->_fetchRow($result)); // shift first field off first row
		}
		return null;
	}

	/*
	 * This method is quite different from fetchCell(), actually
	 * It fetches one cell from each row and places all the values in 1 array
	 * */
	public function fetchColumn($sql, $parameters = array()) {
		$result = $this->execute($sql, $parameters);
		if($result) {
			$cells = array();
			foreach($this->_fetchAll($result) as $row) {
				$cells[] = array_shift($row);
			}
			return $cells;
		} else {
			return array();
		}
	}

	/*
	 * Should be passed a query that fetches two fields
	 * The first will become the array key
	 * The second the key's value
	 */
	public function fetchKeyValue($sql, $parameters = array()) {
		$result = $this->execute($sql, $parameters);
		if(!$result) return array();

		$data = array();
		foreach($this->_fetchAll($result) as $row) {
			$key = array_shift($row);
			if(sizeof($row) == 1) { // if there were only 2 fields in the result
				// use the second for the value
				$data[ $key ] = array_shift($row);
			} else { // if more than 2 fields were fetched
				// use the array of the rest as the value
				$data[ $key ] = $row;
			}
		}
		return $data;
	}

	/*
	 * Like fetch(), accepts any number of arguments
	 * The first argument is an sprintf-ready query stringTypes
	 * */
	public function fetchRow($sql = null, $parameters = array()) {
		$result = $this->execute($sql, $parameters);
		// not all results look like resources, so can't use is_resource()
		if($result)
			return $this->_fetchRow($result);
		return null;
	}


	// These are defaults, since these statements are common across a few DBMSes
	// Override in driver class if they are incorrect
	public function beginTransaction() {
		// need to return true or false
		$this->_query('begin');
	}

	public function commitTransaction() {
		$this->_query('commit');
	}

	public function rollbackTransaction() {
		$this->_query('rollback');
	}


	// Fill in question mark placeholders. No more named placeholders.
	protected function makeQuery($sql, $parameters) {
		// bypass extra logic if we have no parameters
		if(sizeof($parameters) == 0)
			return $sql;
		
		$parts = explode('?', $sql);

		// sizeof($sql) == sizeof($paramters) - 1
		//var_dump($parts);var_dump($parameters);exit;
		
		$query = '';
		while(sizeof($parameters)) {
			$query .= array_shift($parts);
			//$query .= $this->escapeString( array_shift($parameters) );
			$query .= "'" . $this->escapeString( array_shift($parameters) ) . "'";
		}
		$query .= array_shift($parts);
		//var_dump($query);exit;
		return $query;
	}

	public function quoteField($field) {
		return '`' . $field . '`';
	}

	public function quoteFields($fields) {
		return array_map(array($this, 'quoteField'), $fields);
	}

	protected function whereHelper(&$where, &$parameters) {
		// make sure it's a string
		$sql = ' WHERE ';
		if(is_array($where)) {
			$w = array();
			foreach($where as $key => $value) {
				$w[] = $this->quoteField($key) . '=?'; 
				$parameters[] = $value;
			}
			$sql .= implode(' AND ', $w);
			
		} elseif(is_string($where)) {
			$sql .= $where;
		}
		return $sql;
	}
}

