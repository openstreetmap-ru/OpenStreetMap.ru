<?
$page_logo = "/img/logo-about.png";

$page_head_css = <<<PHP_HEAD_CSS
  <link rel="stylesheet" href="/css/page.about.css" />
PHP_HEAD_CSS;

$page_head_js = <<<PHP_HEAD_JS
  <script type="text/javascript" src="/js/page.about.js"></script>
PHP_HEAD_JS;

$page_topmenu = <<<PHP_TOPMENU
PHP_TOPMENU;

$page_topbar = <<<PHP_TOPBAR
  <!--<div class="top-about">Отдельное спасибо компании <a target="_blank" href="http://rambler.ru">Рамблер</a> за всестороннюю помощь проекту!
  </div>-->

PHP_TOPBAR;

$page_content = <<<PHP_CONTENT
<div id="page-about">
  <div id="left">
    <img id="img-osm-ru" class="menu-img" src='/img/osm-ru.png' />
    <img id="img-osm-org" class="menu-img" src='/img/osm-org.png' />
    <img id="img-osm-dev" class="menu-img" src='/img/osm-dev.png' />
    <img id="img-osm-dyk" class="menu-img" src='/img/osm-dyk.png' />
    <div id='menu'>
      <ul>
        <li id="menu-osm-ru"><a href="/about/ru">Об этом сайте</a></li>
        <li id="menu-osm-org"><a href="/about/org">OpenStreetMap</a></li>
        <li id="menu-osm-dev"><a href="/about/dev">Принять участие</a></li>
        <li id="menu-osm-dyk"><a href="/about/dyk">Подсказки и советы</a></li>
      </ul>
    </div>
  </div>
  <div id="center">
    <div id="osm-ru" class="content">
       <div class="section">
        <p class="head">Куда меня занесло?</p>
        <p class="text">Сайт, на котором вы находитесь - это российский портал большого международного сообщества OpenStreetMap</p>
      </div>
      <div class="section">
        <p class="head">Для чего этот сайт?</p>
        <p class="text">Русскоговорящее сообщество OpenStreetMap быстро растёт. Мы задумали этот сайт, чтобы быстрее доносить последние новости и помогать новичкам сделать первые шаги в рисовании окружающего мира. Главное, у нас карта на русском языке, продвинутый поисковик и громадьё планов!</p>
      </div>
      <div class="section">
        <p class="head">Обратная связь</p>
        <p class="text">Если у вас есть предложения по улучшению сайта, можете написать нам на <a href="mailto:osm.ershkus@gmail.com">osm.ershkus@gmail.com</a> или сделать пометку на <a target="_blank" href="http://osmru.reformal.ru/">Reformal</a>, или вот мы ещё на <a target="_blank" href="https://github.com/ErshKUS/OpenStreetMap.ru">гитхабе</a> если у вас руки правильно заточены. Любые предложения приветствуются! <a target="_blank" href="http://forum.openstreetmap.org/viewtopic.php?id=18358">Ссылка на форум</a> (трэба регистрация OpenStreetMap).</p>
      </div>
      <div class="section">
        <p class="head">Техническая информация</p>
        <p class="text">Дата актуализации адресного поиска: <i id="dateaddr">неизвестно</i><br />Дата актуализации точек интереса: <i id="datepoi">неизвестно</i></p>
      </div>
    </div>
    <div id="osm-org" class="content">
      <div class="section">
        <p class="head">Что это?</p>
        <p class="text">Проект «OpenStreetMap» — это совместное создание и свободное распространение детальных карт всего мира.<br />Говоря проще - мы рисуем карту. Карту мира. Всего мира. Люди с разных концов земли вместе рисуют самую подробную карту нашей необъятной планеты!</p>
      </div>
      <div class="section">
        <p class="head">Зачем?</p>
        <p class="text">Каждый преследует свои цели. Кто-то рисует глухомань в Сибири, чтобы потом загрузить карту в навигатор и ездить по окрестным весям.
          Кто-то наносит на карту зимники, просеки и лесные дорожки, чтобы сэкономить бесценные часы и минуты в соревнованиях по спортивному ориентированию на местности.
          Некоторые помогают МЧС и охране природы, обводя по спутниковым снимкам выгоревшие территории. А многие занимаются этим просто потому, что им нравится рисовать карту.</p>
        <p class="text">Ведь главный девиз проекта OpenStreetMap - Получай удовольствие!</p>
      </div>
      <div class="section">
        <p class="head">Как связаться с сообществом OpenStreetMap?</p>
        <p class="text">Первый способ — зарегистрироваться на osm.org и написать в форум, либо зайти в IRC и спросить там (лучший способ получить оперативный ответ).</p>
        <p class="text">Второй способ подойдёт для организаций, которым неформальное общение неудобно: напишите на <a href="mailto:board@openstreetmap.ru">board@openstreetmap.ru</a>. Это письмо придёт Совету Российского OSM, инициативной группе, которая решает сложные вопросы. Участники проекта всегда рады помочь и всегда рады помощи в картировании планеты.</p>
      </div>
    </div>
    <div id="osm-dev" class="content">
      <div class="section">
        <p class="head">Хотите присоединиться?</p>
        <p>Это просто:</p>
        <ul>
          <li><a target="_blank" href="http://www.openstreetmap.org/user/new">Зарегистрируйтесь на главном сайте</a> проекта OpenStreetMap.org</li>
          <li><a target="_blank" href="http://wiki.openstreetmap.org/wiki/RU:FAQ">Ознакомьтесь с руководством для новичков</a>.</li>
          <li>И вперёд!</li>
        </ul>
      </div>
      <div class="section">
        <p class="head">Если появятся какие-нибудь вопросы</p>
        <p>Заходите на <a target="_blank" href="http://forum.openstreetmap.org/viewforum.php?id=21">наш форум</a> или <a>IRC канал</a></p>
      </div>
      <div class="section">
        <p class="head">Полезные ссылки</p>
        <p><a target="_blank" href="http://wiki.openstreetmap.org/wiki/RU:Main_Page">Документация по проекту - в формате Wiki</a></p>
        <ul>
          <li><a target="_blank" href="http://wiki.openstreetmap.org/wiki/RU:Map_Making_Overview">Краткая вводная</a> - как мы рисуем карту</li>
          <li><a target="_blank" href="http://wiki.openstreetmap.org/wiki/RU:%D0%9A%D0%B0%D0%BA_%D0%BE%D0%B1%D0%BE%D0%B7%D0%BD%D0%B0%D1%87%D0%B8%D1%82%D1%8C">Как обозначать объекты</a> - наиболее полный список</li>
          <li><a target="_blank" href="http://wiki.openstreetmap.org/wiki/RU:Map_Features">Каталог объектов</a>  - развёрнутое описание</li>
        </ul>
        <p><a target="_blank" href="http://forum.openstreetmap.org/viewtopic.php?id=15209">Каталог форума</a> OpenStreetMap</p>
        <ul>
          <li><a target="_blank" href="http://forum.openstreetmap.org/viewtopic.php?id=10206">Вопросы новичков</a> </li>
          <li><a target="_blank" href="http://forum.openstreetmap.org/viewtopic.php?id=18124">С чего начинать</a> - Советы бывалых</li>
          <li><a target="_blank" href="http://forum.openstreetmap.org/viewtopic.php?id=2094">Как обозначать</a> - Если не нашли ответ в документации</li>
          <li><a target="_blank" href="http://forum.openstreetmap.org/viewtopic.php?id=6577">Отдельные темы по городам России</a>.</li>
        </ul>
        <p><a target="_blank" href="http://josm.ru/">Русскоязычный сайт о JOSM</a> - хорошей программе для редактирования</p>
      </div>
    </div>
    <div id="osm-dyk" class="content">
PHP_CONTENT;

if (function_exists("pg_connect")) {
  $result = pg_query("SELECT * FROM \"did_you_know\" ORDER BY \"id\"");
  while ($row = pg_fetch_assoc($result)) {
    $page_content = $page_content.'<div id="id'.$row['id'].'" class="section-link">';
    $page_content = $page_content.'<p class="head-link"><a name="id'.$row['id'].'">'.$row['head'].'</a></p>';
    $page_content = $page_content.'<div class="text" style="display: none;">'.$row['text'].'</div>';
    $page_content = $page_content.'</div>';
  }
}

$page_content = $page_content.<<<PHP_CONTENT
      <div id="dyk-tools">
        <div class="tools-head">Настроить оповещения</div>
          <p class="tools-null"></p>
          <p class="tools-button" id="dyk-know">
            Я все эти советы знаю
          </p>
          <p class="tools-text">
            Старые подсказки больше не будут всплывать в левой панели, но если у нас появится что-то новенькое, мы обязательно вам сообщим.
          </p>
          <p class="tools-space"></p>
          <p class="tools-button" id="dyk-forget">
            Забыть, что советы я смотрел
          </p>
          <p class="tools-text">
            Если нажать эту кнопку, то при входе на сайт вы снова сможете увидеть все советы и подсказки.
          </p>
      </div>
    </div>
  </div>
</div>
PHP_CONTENT;

// add date actual
if (function_exists("pg_connect")) {
  $result = pg_query("SELECT * FROM \"config\" WHERE \"key\"='dateaddr'");
  while ($row = pg_fetch_assoc($result)) {
    $page_content = str_replace('<i id="dateaddr">неизвестно</i>', '<samp>'.$row['value'].'</samp>', $page_content);
  }
  
  $result = pg_query("SELECT * FROM \"config\" WHERE \"key\"='datepoi'");
  while ($row = pg_fetch_assoc($result)) {
    $page_content = str_replace('<i id="datepoi">неизвестно</i>', '<samp>'.$row['value'].'</samp>', $page_content);
  }
}

?>
