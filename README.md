Это проект создания OpenStreetMap с русским лицом

Обсуждение:
 * http://forum.openstreetmap.org/viewtopic.php?id=2689
 * http://forum.openstreetmap.org/viewtopic.php?id=14295
 * https://groups.google.com/group/openstreetmap-ru

Обратная связь без регистрации http://osmru.reformal.ru/

Каталог объектов (сейчас только POI) https://github.com/ErshKUS/osmCatalog

Про добавление пои и/или корректировку списка пишите, или сюда https://github.com/ErshKUS/osmCatalog/issues , или сюда http://forum.openstreetmap.org/viewtopic.php?pid=294559

## Info

Протокол валидаторов: http://wiki.openstreetmap.org/wiki/RU:Validator_protocol


## Local development

### www

Ставим следующие зависимости

    apache2 php5 libapache2-mod-php5 php5-curl

Создаем конфиг апача примерно следующего содержания, где `/path/to/repo/osmru` --- это путь до скачанного репозитория.

```
#Listen 8011
<VirtualHost *:80>
	ServerAdmin webmaster@localhost
	ServerName osmru

	DocumentRoot /path/to/repo/osmru/www
	<Directory />
		Options FollowSymLinks
		AllowOverride All
	</Directory>
	<Directory /path/to/repo/osmru/www>
		Options Indexes FollowSymLinks -MultiViews
		AllowOverride All
		Order allow,deny
		allow from all
	</Directory>

	ScriptAlias /api/ /path/to/repo/osmru/api/
	<Directory "/path/to/repo/osmru/api">
		AllowOverride All
		Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
		Order allow,deny
		Allow from all
	</Directory>

	ErrorLog /var/log/apache2/osm.ru-error.log

	# Possible values include: debug, info, notice, warn, error, crit,
	# alert, emerg.
	LogLevel warn

	CustomLog /var/log/apache2/osm.ru-access.log combined

    Alias /doc/ "/usr/share/doc/"
    <Directory "/usr/share/doc/">
        Options Indexes -MultiViews FollowSymLinks
        AllowOverride All
        Order deny,allow
        Deny from all
        Allow from 127.0.0.0/255.0.0.0 ::1/128
    </Directory>
</VirtualHost>
```

Кладем этот конфиг по адресу `/etc/apache2/sites-available/osmru`

Включаем сайт osmru

	sudo a2ensite osmru

Включаем mod_rewrite

	sudo a2enmod rewrite

Добавляем в `/etc/hosts` строчку

	127.0.0.1 	osmru

Перезагружаем apache
    
    sudo /etc/init.d/apache2 restart

### db & search

Ставим следующие пакеты

    postgresql-8.4 postgresql-client-8.4 postgresql-contrib-8.4 postgresql-doc-8.4 postgresql-8.4-postgis postgis

Создаем пользователя postgres в OS (вернее с установкой пакета он уже должен появиться)... Проверяем

	groups postgres
	
...а затем и базы данных (эта и последующие команды должны исполняться от имени postgres)

	createuser

Создаем базу данных с именем, например, `postgistemplate`. Прикручиваем PostGIS к PostgreSQL

	createdb postgistemplate
	createlang plpgsql postgistemplate

	psql -d postgistemplate -f /usr/share/postgresql/8.4/contrib/postgis-2.0/postgis.sql	
	psql -d postgistemplate -f /usr/share/postgresql/8.4/contrib/postgis-2.0/spatial_ref_sys.sql
	psql -d postgistemplate -f /usr/share/postgresql/8.4/contrib/postgis_comments.sql

Заливаем данные в базу


Ставим сфинкса отсюда http://sphinxsearch.com/downloads/release/.

Кладем конфиг сфинкса по адресу `/etc/sphinxsearch/sphinx.conf` // TODO: описать конфиг

Создаем папку /var/cache/sphinx.

Запускаем индексацию

	indexer --all

Запускаем демона сфинкса

	searchd


C помощью easy_install ставим питоновский пакет `psycopg2` // TODO: добавить ссылку на описание easy_install

