<?
Header('Content-Type: text/html; charset=UTF-8');
setlocale(LC_ALL, 'ru_RU.UTF-8');

include_once ('/include/passwd.php');
include_once ('/include/functions.php');

mysql_connect($mysql_host, $mysql_user, $mysql_pass) or die(Err500());
mysql_query('SET CHARACTER SET utf8');
mysql_query('SET NAMES utf8');
mysql_select_db($mysql_base);

session_start();
ob_start();
?>
