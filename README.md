Это проект создания OpenStreetMap с русским лицом

Обсуждение:
 * http://forum.openstreetmap.org/viewtopic.php?id=2689
 * http://forum.openstreetmap.org/viewtopic.php?id=14295 - про поиск, включая описание JSON-API
 * http://forum.openstreetmap.org/viewtopic.php?id=18358

Обратная связь без регистрации http://osmru.reformal.ru/

Каталог объектов (сейчас только POI) https://github.com/ErshKUS/osmCatalog

Про добавление пои и/или корректировку списка пишите, или сюда https://github.com/ErshKUS/osmCatalog/issues , или сюда http://forum.openstreetmap.org/viewtopic.php?pid=294559

Протокол валидаторов: http://wiki.openstreetmap.org/wiki/RU:Validator_protocol

## Development

Этот раздел описывает способ настроить локальный вариант сайта.


Ставим зависимости:

```
sudo apt-get install apache2 php5 libapache2-mod-php5 php5-curl
```

Дальше необходимо поднять локальный веб-сервер.
Один из способов это сделать --- использовать утилиту [phpup](https://github.com/lox/phpup).
Скачиваем phpup:

```
wget https://raw.github.com/lox/phpup/master/phpup
chmod +x phpup
```

Чтобы не поднимать локальную базу данных и поиск, можно настроить перенаправление запросов на главный сервер openstreetmap.ru:

```
mkdir www/api
echo "Redirect /api/ http://openstreetmap.ru/api/" > www/api/.htaccess
```

Запускаем веб-сервер:

```
./phpup -p 8000 www
```

Теперь сайт доступен по адресу

```
localhost:8000
```


## Deployment

Этот раздел описывает способ развертывания сайта на удаленном сервере.

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

Вэлкам

	http://osmru/

#### Меню страниц

Специально чтобы можно было тестировать не поднимая БД сделан fallback на отсутствие pg_connect: https://github.com/ErshKUS/OpenStreetMap.ru/blob/master/www/include/config.php#L20
Однако можно и поднять БД. Для этого следует выполнить 3 первых шага из п. db & search + установить пакет php5-pgsql. Перезагрузить apache.
В файл /www/include/passwd.php прописать нужные параметры подключения: пользователя, пароль и БД.
Чтобы этот файл не коммитился в репозитарий (мы разработчики или кто!?) выполняем

	git update-index --assume-unchanged www/include/passwd.php
нет, .gitignore лучше пользовать

	git commit -a


### db & search

Ставим следующие пакеты

    postgresql-8.4 postgresql-client-8.4 postgresql-contrib-8.4 postgresql-doc-8.4 postgresql-8.4-postgis postgis

Создаем пользователя postgres в OS (вернее с установкой пакета он уже должен появиться. Проверяем это

	groups postgres
	
)..., а затем и базы данных. Эта и последующие команды должны исполняться от имени postgres

	createuser

Создаем базу данных с именем, например, `postgistemplate`. Прикручиваем PostGIS к PostgreSQL

	createdb postgistemplate
	createlang plpgsql postgistemplate

	psql -d postgistemplate -f /usr/share/postgresql/8.4/contrib/postgis-2.0/postgis.sql	
	psql -d postgistemplate -f /usr/share/postgresql/8.4/contrib/postgis-2.0/spatial_ref_sys.sql
	psql -d postgistemplate -f /usr/share/postgresql/8.4/contrib/postgis_comments.sql

Заливаем данные в базу (Готового скрипта пока нет: обращаться к ErshKUS)


Ставим сфинкса отсюда http://sphinxsearch.com/downloads/release/.

Берем конфиг сфинкса  [отсюда](../master/search/configs/sphinx.conf) и кладем по адресу `/etc/sphinxsearch/sphinx.conf`.

Создаем папку /var/cache/sphinx.

Запускаем индексацию

	indexer --all

Запускаем демона сфинкса

	searchd


C помощью easy_install ставим питоновский пакет `psycopg2` // TODO: добавить ссылку на описание easy_install

