<?
include_once ('include/config.php');
include_once ('include/pages.php');

if (file_exists($pages[$page]['file']))
  include ($pages[$page]['file']);
else
  Header("Location: /");
?>
