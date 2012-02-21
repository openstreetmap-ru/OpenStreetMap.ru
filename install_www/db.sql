# --------------------------------------------------------
# Host:                         127.0.0.1
# Server version:               5.5.10
# Server OS:                    Win64
# HeidiSQL version:             6.0.0.3603
# Date/time:                    2011-10-05 21:38:56
# --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

# Dumping database structure for web_osm
#CREATE DATABASE IF NOT EXISTS `web_osm` /*!40100 DEFAULT CHARACTER SET utf8 */;
#USE `web_osm`;


# Dumping structure for table web_osm.pagedata
CREATE TABLE IF NOT EXISTS `pagedata` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `text` varchar(255) NOT NULL DEFAULT '',
  `color` varchar(32) NOT NULL DEFAULT '',
  `level` tinyint(3) unsigned NOT NULL DEFAULT '0',
  KEY `Index 1` (`id`),
  KEY `Index 2` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

# Dumping data for table web_osm.pagedata: ~7 rows (approximately)
/*!40000 ALTER TABLE `pagedata` DISABLE KEYS */;
INSERT INTO `pagedata` (`id`, `name`, `text`, `color`, `level`) VALUES
	(1, 'map', 'Карта', '#99bd1b', 0),
	(2, 'cakes', 'Плюшки', '#f9ba1c', 0),
	(3, 'about', 'О проекте', '#fad051', 0),
	(4, 'contribute', 'Участвовать', '#c3102e', 0),
	(5, 'news', 'Новости', '#db4c39', 0),
	(6, 'diaries', 'Дняффки', '#faaa87', 0),
	(7, 'login', 'Вход', '#4a8af5', 0);
/*!40000 ALTER TABLE `pagedata` ENABLE KEYS */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
