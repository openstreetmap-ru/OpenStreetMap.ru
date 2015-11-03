dbFacile - Trying to make a more helpful PHP Database Abstraction Class

Introduction
====

Features:

* Support for MySQL, MySQLi, Sqlite3, Postgresql
* Query placeholders: ? and #. Values associated with the former are quoted and escaped. Those associated with the latter are inserted as-is, for unquoted numbers and SQL functions in your queries.

Note: there's still no way to prevent quoting and escaping of parameters used withing insert() or update() method calls.

Setup and Installation
====

This was updated on Dec 16, 2013. We now use something resembling the factory pattern for instantiating the correct dbFacile driver subclass. There was an issue where certain versions of the mysqli driver were missing a method; using a factory allows us to elegantly work around this. More info: https://github.com/alanszlosek/dbFacile/pull/8

1. Include dbFacile.php
2. Get an instance of the correct driver class: $db = dbFacile::mysqli()
3. Call $db->open(DATABASE, USERNAME, PASSWORD, HOST), passing the appropriate parameters

Usage
====

Connection Example
----

Connect using MySQLi module, and a persistent connection

    $db = dbFacile::mysqli();
    $db->open('testDB', 'testUser', 'testPass', 'p:192.168.1.15');
		
Additional Notes
----

* When using sqlite3, pass 1 parameter to open(), the database file path.
* To re-use an existing connection resource, pass the handle to the constructor when you instantiate your driver class.

Fetching Data
----

**Fetch Rows**

Returns an array of rows. Each row is an associative array of field=>value. If there are no rows, an empty array is returned (so you won't get PHP notices if you try to loop over the result).

    $rows = $db->fetchRows('select * from users')
    foreach($rows as $row) {
        echo $row['email'] . '<br />';
    }

**Fetch a single row**

Returns associative array of fields and values. If row doesn't exist, return value may be null or false. Probably should unify this.

    $row = $db->fetchRow('select * from users');

**Fetch a single value from a single row**

Returns first field from the first row.

    $email = $db->fetchCell("select email from users where name='Alan'");

**Fetch a column of data**

Returns a one-dimensional, numerically-indexed array of column values. Empty array if there are no rows.

    $emailAddresses = $db->fetchColumn('select email from users');

**Fetch data as a key value pair**

Returns an associative array where keys come from users.id and values come from users.email.

    $idToEmail = $db->fetchKeyValue('select id,email from users');
    /*
    $idToEmail = array(
        344 => 'john@john.com',
        798 => 'brenda@brenda.com',
    );
    */

**Fetch rows, where each is indexed by a column value**

Returns an associative array using values from users.id as keys and values from users.email as corresponding values.

    $idToEmail = $db->fetchKeyedRows('select id,name,email from users');
    /*
    $idToEmail = array(
        344 => array(
            'id' => 344,
            'name' => 'John',
            'email' => 'john@john.com'
        ),
    );
    */

**Fetch using query parameters**

Returns the first row from this final query: "select email from users where date_created<1231231234"

    $row = $db->fetchRow('select email from users where date_created<#', array('unix_timestamp()'));

Inserting and Updating Data
----

Assuming a users table exists with name and email fields:

**Insert a row**

Inserts using an associative array of data, returns newly generated primary key (if table generates a key automatically).
Returns false if the insertion failed.
Returns 0 if no key was generated.

    $data = array('name' => 'Aiden', 'email' => 'aiden@gmail.com');
    $id = $db->insert($data, 'users');

**Update rows**

Updates rows, setting name to 'Aideen' where name was 'Aiden'

    $data = array('name' => 'Aideen');
    $db->update($data, 'users', 'name="Aiden"');

You can also pass an associative array as the where clause:

    $data = array('name' => 'Aideen');
    $where = array('name' => 'Aiden');
    $db->update($data, 'users', $where);

Note: As used above, all values present in the associative arrays will be escaped and quoted.

If you need more control over your where clause, use a combination of a string and parameters:

    $data = array('name' => 'John');
    // SQL will be "update users set name='John' where id>=3 and email='a@g.com'"
    $db->update($data, 'users', 'id>=# and email=?', array(3, 'a@g.com'));

Transactions
----
	
Most driver classes implement the following methods: beginTransaction(), commitTransaction(), rollbackTransaction()
