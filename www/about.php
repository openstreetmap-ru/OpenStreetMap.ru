<?
$page_logo = "/img/logo-about.png";

$page_head = <<<PHP_HEAD
  <script type="text/javascript" src="/js/page.about.js"></script>
  <script type="text/javascript" src="/js/osm.common.js"></script>
  <script type="text/javascript" src="/js/osm.dyk.js"></script>
PHP_HEAD;

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
    </div>
    <div id="osm-dyk" class="content">
PHP_CONTENT;

$result = pg_query("SELECT * FROM \"did_you_know\" ORDER BY \"id\"");
while ($row = pg_fetch_assoc($result)) {
  $page_content = $page_content.'<div id="id'.$row['id'].'" class="section-link">';
  $page_content = $page_content.'<p class="head-link"><a name="id'.$row['id'].'">'.$row['head'].'</a></p>';
  $page_content = $page_content.'<p class="text" style="display: none;">'.$row['text'].'</p>';
  $page_content = $page_content.'</div>';
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
?>
