Это проект создания OpenStreetMap с русским лицом

Обсуждение:
 * http://forum.openstreetmap.org/viewtopic.php?id=2689
 * http://forum.openstreetmap.org/viewtopic.php?id=14295
 * https://groups.google.com/group/openstreetmap-ru


## Development

### www

Ставим зависимости

    sudo apt-get install apache2 php5 libapache2-mod-php5 php5-curl

Прописываем сайт в конфиге апача

    TODO

Перезагружаем apache
    
    sudo /etc/init.d/apache2 restart

### db & search

Ставим зависимости

    sudo apt-get install postgresql-8.4 postgresql-client-8.4 postgresql-contrib-8.4 postgresql-doc-8.4 postgresql-8.4-postgis
    sudo apt-get install sphinxsearch

    easy_install psycopg2

...
