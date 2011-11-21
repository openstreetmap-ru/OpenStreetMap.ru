<?
$page_logo = "/img/logo-cakes.png";

$page_head = <<<PHP_HEAD
	<link href="css/v1/styles.css" type="text/css" rel="stylesheet">
PHP_HEAD;

$page_content = <<<PHP_CONTENT

<div id="container">
	<div id="welcome">
		<p>Добро пожаловать на сайт «OpenStreetMap — Россия», российскую часть проекта <a href="http://osm.org">OpenStreetMap</a> (OSM).<br/>
	  Мы&#160;работаем над картой России и всего мира, которую может <a href="http://wiki.openstreetmap.org/wiki/RU:OpenStreetMap_License">свободно</a> использовать каждый.<br/>Это очень увлекательное занятие! Присоединяйтесь ;)</p>
	</div>
	
	<ul id="wherenext">

		<li class="look">
			<h2>Смотри</h2>
			<p><a href="http://osm.org/go/20xB"><img src="img/v1/n1.png" alt="Карты" width="200" height="100" /></a></p>
			<p>Тысячи населенных пунктов России и ближнего зарубежья уже есть в OSM.</p>
			<p>Выбери из списка:</p>
			
			<div class="search_city">
				
<select id="city-select"
        onchange="if(this.value!='') {
          document.getElementById('go-link').href='http://www.openstreetmap.org/?'+this.value+'&zoom=12';
          document.getElementById('bugs-link').href='http://openstreetbugs.schokokeks.org/?'+this.value+'&zoom=12';
        }
		  ">
<option value=''>Найди свой город!</option>
<option value='lat=55.7516147&lon=37.6187089'>Москва</option>
<option value='lat=59.939366&lon=30.3153623'>Санкт-Петербург</option>
<option value='lat=53.7152883&lon=91.4388763'>Абакан</option>
<option value='lat=39.9921288&lon=46.934991'>Агдам</option>
<option value='lat=43.6390555&lon=51.1708131'>Актау</option>
<option value='lat=50.2765581&lon=57.2114296'>Актобе</option>
<option value='lat=43.2389912&lon=76.9453467'>Алма-Ата</option>
<option value='lat=54.8981693&lon=52.308363'>Альметьевск</option>
<option value='lat=64.731671&lon=177.506102'>Анадырь</option>
<option value='lat=52.5308397&lon=103.8823946'>Ангарск</option>
<option value='lat=40.760107&lon=72.3670244'>Андижан</option>
<option value='lat=67.568607&lon=33.404422'>Апатиты</option>
<option value='lat=55.3985&lon=43.8385'>Арзамас</option>
<option value='lat=44.9986975&lon=41.1252241'>Армавир</option>
<option value='lat=64.5460706&lon=40.5522233'>Архангельск</option>
<option value='lat=51.1749972&lon=71.4308927'>Астана</option>
<option value='lat=46.3489385&lon=48.0374537'>Астрахань</option>
<option value='lat=47.1140881&lon=51.9297862'>Атырау</option>
<option value='lat=56.2695111&lon=90.4953761'>Ачинск</option>
<option value='lat=40.2972796&lon=44.3660668'>Аштарак</option>
<option value='lat=37.9379937&lon=58.3856669'>Ашхабад</option>
<option value='lat=40.3664619&lon=49.8353047'>Баку</option>
<option value='lat=52.0178762&lon=47.81947'>Балаково</option>
<option value='lat=55.8051388&lon=37.9505325'>Балашиха</option>
<option value='lat=53.126662&lon=26.02311'>Барановичи</option>
<option value='lat=53.3474212&lon=83.7784296'>Барнаул</option>
<option value='lat=47.1428765&lon=39.747537'>Батайск</option>
<option value='lat=41.6433997&lon=41.6337512'>Батуми</option>
<option value='lat=46.1909555&lon=30.3457853'>Белгород-Днестровский</option>
<option value='lat=49.8038191&lon=30.1116924'>Белая Церковь</option>
<option value='lat=50.5952987&lon=36.5869335'>Белгород</option>
<option value='lat=46.7611424&lon=36.7893746'>Бердянск</option>
<option value='lat=59.4080569&lon=56.8050175'>Березники</option>
<option value='lat=52.5352918&lon=85.1799129'>Бийск</option>
<option value='lat=48.7927686&lon=132.9249289'>Биробиджан</option>
<option value='lat=42.870403&lon=74.6004596'>Бишкек</option>
<option value='lat=50.2657986&lon=127.5497989'>Благовещенск</option>
<option value='lat=53.1311169&lon=29.2284285'>Бобруйск</option>
<option value='lat=43.1136926&lon=132.3507725'>Большой Камень</option>
<option value='lat=58.379381&lon=33.916989'>Боровичи</option>
<option value='lat=56.1632985&lon=101.6112811'>Братск</option>
<option value='lat=52.100512&lon=23.680022'>Брест</option>
<option value='lat=53.2442476&lon=34.3635062'>Брянск</option>
<option value='lat=39.773486&lon=64.419075'>Бухара</option>
<option value='lat=40.8058919&lon=44.4953293'>Ванадзор</option>
<option value='lat=56.3423598&lon=30.5279225'>Великие Луки</option>
<option value='lat=58.5227078&lon=31.2776162'>Великий Новгород</option>
<option value='lat=58.041446&lon=60.553707'>Верхняя Салда</option>
<option value='lat=54.6843136&lon=25.2853983'>Вильнюс</option>
<option value='lat=49.2319915&lon=28.4679262'>Винница</option>
<option value='lat=55.1930088&lon=30.2059467'>Витебск</option>
<option value='lat=43.1214207&lon=131.8857067'>Владивосток</option>
<option value='lat=56.1397&lon=40.4132'>Владимир</option>
<option value='lat=48.7086106&lon=44.5148018'>Волгоград</option>
<option value='lat=47.5087417&lon=42.1960235'>Волгодонск</option>
<option value='lat=48.7790188&lon=44.7840263'>Волжский</option>
<option value='lat=59.2185932&lon=39.8934855'>Вологда</option>
<option value='lat=67.4948866&lon=64.0400127'>Воркута</option>
<option value='lat=51.7126377&lon=39.2646882'>Воронеж</option>
<option value='lat=57.0525057&lon=53.9906132'>Воткинск</option>
<option value='lat=57.588306&lon=34.571408'>Вышний Волочек</option>
<option value='lat=58.135&lon=52.6558'>Глазов</option>
<option value='lat=52.4368343&lon=30.9743404'>Гомель</option>
<option value='lat=48.3040963&lon=38.0168102'>Горловка</option>
<option value='lat=53.683301&lon=23.834624'>Гродно</option>
<option value='lat=43.3200783&lon=45.6861979'>Грозный</option>
<option value='lat=52.49249&lon=39.93431'>Грязи</option>
<option value='lat=40.785396&lon=43.8434113'>Гюмри</option>
<option value='lat=40.6788625&lon=46.3565603'>Гянджа</option>
<option value='lat=55.8627523&lon=26.5304071'>Даугавпилс</option>
<option value='lat=41.8406342&lon=60.0065056'>Дашогуз</option>
<option value='lat=42.0576987&lon=48.2938068'>Дербент</option>
<option value='lat=40.9326849&lon=72.9981116'>Джалал-Абад</option>
<option value='lat=40.1078249&lon=67.8530369'>Джизак</option>
<option value='lat=56.2382157&lon=43.4617405'>Дзержинск</option>
<option value='lat=54.2188995&lon=49.6038982'>Димитровград</option>
<option value='lat=48.5033688&lon=34.6132068'>Днепродзержинск</option>
<option value='lat=48.4680396&lon=35.0412808'>Днепропетровск</option>
<option value='lat=48.0010796&lon=37.8042197'>Донецк</option>
<option value='lat=38.5346847&lon=68.7801624'>Душанбе</option>
<option value='lat=45.1911589&lon=33.3694606'>Евпатория</option>
<option value='lat=56.8391034&lon=60.6082502'>Екатеринбург</option>
<option value='lat=52.613814&lon=38.4884539'>Елец</option>
<option value='lat=63.4722758&lon=41.77619'>Емецк</option>
<option value='lat=48.2303208&lon=38.1846919'>Енакиево</option>
<option value='lat=40.1776121&lon=44.5125849'>Ереван</option>
<option value='lat=47.7839676&lon=67.710411'>Жезказган</option>
<option value='lat=56.2496647&lon=93.5329862'>Железногорск</option>
<option value='lat=55.7484202&lon=38.0141025'>Железнодорожный</option>
<option value='lat=50.2598352&lon=28.6692373'>Житомир</option>
<option value='lat=47.8600074&lon=35.1100843'>Запорожье</option>
<option value='lat=55.9966382&lon=37.1990245'>Зеленоград</option>
<option value='lat=55.1729794&lon=59.6711413'>Златоуст</option>
<option value='lat=48.923115&lon=24.7185684'>Ивано-Франковск</option>
<option value='lat=56.9985047&lon=40.9781085'>Иваново</option>
<option value='lat=56.8465856&lon=53.2056145'>Ижевск</option>
<option value='lat=52.2895979&lon=104.2805843'>Иркутск</option>
<option value='lat=55.914557&lon=36.8592189'>Истра</option>
<option value='lat=56.6327144&lon=47.8953961'>Йошкар-Ола</option>
<option value='lat=55.7823547&lon=49.1242266'>Казань</option>
<option value='lat=54.7066424&lon=20.5105165'>Калининград</option>
<option value='lat=54.5204001&lon=36.2746999'>Калуга</option>
<option value='lat=56.2628&lon=54.2103'>Камбарка</option>
<option value='lat=48.6769373&lon=26.58588'>Каменец-Подольский</option>
<option value='lat=56.404903&lon=61.9204311'>Каменск-Уральский</option>
<option value='lat=67.15145&lon=32.41304'>Кандалакша</option>
<option value='lat=56.2059969&lon=95.7067883'>Канск</option>
<option value='lat=39.2009781&lon=46.4287329'>Капан</option>
<option value='lat=49.8094091&lon=73.1025726'>Караганда</option>
<option value='lat=42.4900118&lon=78.3871577'>Каракол</option>
<option value='lat=38.8442225&lon=65.7931396'>Карши</option>
<option value='lat=54.8979412&lon=23.910763'>Каунас</option>
<option value='lat=55.3551248&lon=86.0872319'>Кемерово</option>
<option value='lat=45.3544007&lon=36.4544183'>Керчь</option>
<option value='lat=44.8468197&lon=65.487879'>Кзыл-орда</option>
<option value='lat=50.4499799&lon=30.5235008'>Киев</option>
<option value='lat=58.6032812&lon=49.6640767'>Киров</option>
<option value='lat=58.5416401&lon=50.0346458'>Кирово-Чепецк</option>
<option value='lat=48.5050253&lon=32.2627186'>Кировоград</option>
<option value='lat=54.0012318&lon=86.6402004'>Киселёвск</option>
<option value='lat=43.9143583&lon=42.7237033'>Кисловодск</option>
<option value='lat=56.3583676&lon=41.3140018'>Ковров</option>
<option value='lat=53.2782246&lon=69.3927867'>Кокшетау</option>
<option value='lat=55.0818065&lon=38.8037417'>Коломна</option>
<option value='lat=59.7484419&lon=30.6044785'>Колпино</option>
<option value='lat=50.5508698&lon=137.0207457'>Комсомольск-на-Амуре</option>
<option value='lat=62.2088&lon=34.264488'>Кондопога</option>
<option value='lat=55.9205587&lon=37.8340201'>Королёв</option>
<option value='lat=57.7672092&lon=40.9256164'>Кострома</option>
<option value='lat=58.305467&lon=48.336953'>Котельнич</option>
<option value='lat=48.7200435&lon=37.5605651'>Краматорск</option>
<option value='lat=55.821744&lon=37.3404142'>Красногорск</option>
<option value='lat=45.031826&lon=38.9716537'>Краснодар</option>
<option value='lat=56.0082591&lon=92.8702292'>Красноярск</option>
<option value='lat=49.0679478&lon=33.4118635'>Кременчуг</option>
<option value='lat=47.90628&lon=33.3947456'>Кривой Рог</option>
<option value='lat=59.0146073&lon=54.6641362'>Кудымкар</option>
<option value='lat=53.1156475&lon=46.5966117'>Кузнецк</option>
<option value='lat=37.9058363&lon=69.7792851'>Куляб</option>
<option value='lat=57.4308584&lon=56.9386414'>Кунгур</option>
<option value='lat=55.4543487&lon=65.3218732'>Курган</option>
<option value='lat=37.8336885&lon=68.7729047'>Курган-Тюбе</option>
<option value='lat=51.739433&lon=36.179602'>Курск</option>
<option value='lat=53.2147405&lon=63.6297267'>Кустанай</option>
<option value='lat=42.2712501&lon=42.7037954'>Кутаиси</option>
<option value='lat=51.7078797&lon=94.4235529'>Кызыл</option>
<option value='lat=54.6824372&lon=86.1828833'>Ленинск-Кузнецкий</option>
<option value='lat=52.5998491&lon=39.5782313'>Липецк</option>
<option value='lat=48.894135&lon=38.4418175'>Лисичанск</option>
<option value='lat=48.5688212&lon=39.3154202'>Луганск</option>
<option value='lat=50.7612784&lon=25.351757'>Луцк</option>
<option value='lat=49.8418918&lon=24.0315335'>Львов</option>
<option value='lat=55.6783142&lon=37.89377'>Люберцы</option>
<option value='lat=59.558853&lon=150.8051261'>Магадан</option>
<option value='lat=53.3837211&lon=59.0334294'>Магнитогорск</option>
<option value='lat=44.6084938&lon=40.1062943'>Майкоп</option>
<option value='lat=48.04467&lon=37.9642'>Макеевка</option>
<option value='lat=47.1110487&lon=37.6025729'>Мариуполь</option>
<option value='lat=37.6057005&lon=61.8460675'>Мары</option>
<option value='lat=42.9760793&lon=47.4935758'>Махачкала</option>
<option value='lat=53.686445&lon=88.0704615'>Междуреченск</option>
<option value='lat=46.8481977&lon=35.3662919'>Мелитополь</option>
<option value='lat=55.0695805&lon=60.107973'>Миасс</option>
<option value='lat=53.9022531&lon=27.5618628'>Минск</option>
<option value='lat=53.9081489&lon=30.3311351'>Могилёв</option>
<option value='lat=56.4512&lon=52.2203'>Можга</option>
<option value='lat=63.7942405&lon=74.5005267'>Муравленко</option>
<option value='lat=68.9706637&lon=33.0749718'>Мурманск</option>
<option value='lat=55.5738&lon=42.0447'>Муром</option>
<option value='lat=55.908889&lon=37.733889'>Мытищи</option>
<option value='lat=55.7420117&lon=52.3992173'>Набережные Челны</option>
<option value='lat=43.2177784&lon=44.765908'>Назрань</option>
<option value='lat=43.4930746&lon=43.619357'>Нальчик</option>
<option value='lat=41.0005034&lon=71.6686208'>Наманган</option>
<option value='lat=41.4343371&lon=75.9981676'>Нарын</option>
<option value='lat=67.6379965&lon=53.0068636'>Нарьян-Мар</option>
<option value='lat=39.2102119&lon=45.4094332'>Нахичевань</option>
<option value='lat=42.8396323&lon=132.8926599'>Находка</option>
<option value='lat=44.6333559&lon=41.9408684'>Невинномысск</option>
<option value='lat=56.09923&lon=54.2615113'>Нефтекамск</option>
<option value='lat=61.0956949&lon=72.6097159'>Нефтеюганск</option>
<option value='lat=60.933726&lon=76.579737'>Нижневартовск</option>
<option value='lat=55.6412879&lon=51.8160376'>Нижнекамск</option>
<option value='lat=56.3241427&lon=43.9902091'>Нижний Новгород</option>
<option value='lat=57.905149&lon=59.9508466'>Нижний Тагил</option>
<option value='lat=46.9635124&lon=32.0066825'>Николаев</option>
<option value='lat=47.5710414&lon=34.39794'>Никополь</option>
<option value='lat=53.7589831&lon=87.1375029'>Новокузнецк</option>
<option value='lat=53.0992438&lon=49.9483631'>Новокуйбышевск</option>
<option value='lat=54.0211785&lon=38.2737215'>Новомосковск</option>
<option value='lat=55.5326913&lon=28.6688757'>Новополоцк</option>
<option value='lat=44.7241965&lon=37.7681522'>Новороссийск</option>
<option value='lat=55.0282215&lon=82.9234476'>Новосибирск</option>
<option value='lat=56.1132356&lon=47.5004371'>Новочебоксарск</option>
<option value='lat=47.4120185&lon=40.1065898'>Новочеркасск</option>
<option value='lat=47.7558238&lon=39.9359914'>Новошахтинск</option>
<option value='lat=66.0840399&lon=76.6697752'>Новый Уренгой</option>
<option value='lat=55.8542528&lon=38.4381641'>Ногинск</option>
<option value='lat=69.3497275&lon=88.2009686'>Норильск</option>
<option value='lat=63.1975998&lon=75.4405577'>Ноябрьск</option>
<option value='lat=55.0951738&lon=36.611913'>Обнинск</option>
<option value='lat=46.4713468&lon=30.7296333'>Одесса</option>
<option value='lat=55.6713316&lon=37.2723696'>Одинцово</option>
<option value='lat=54.4850216&lon=53.4697632'>Октябрьский</option>
<option value='lat=54.9868534&lon=73.3449824'>Омск</option>
<option value='lat=52.9714692&lon=36.063372'>Орёл</option>
<option value='lat=47.6565343&lon=34.110487'>Орджоникидзе</option>
<option value='lat=51.7672701&lon=55.0967839'>Оренбург</option>
<option value='lat=55.8083278&lon=38.9790038'>Орехово-Зуево</option>
<option value='lat=51.2305134&lon=58.4738184'>Орск</option>
<option value='lat=54.5122662&lon=30.4244632'>Орша</option>
<option value='lat=40.5331113&lon=72.7963581'>Ош</option>
<option value='lat=48.5326167&lon=35.86773'>Павлоград</option>
<option value='lat=52.2823666&lon=76.9613215'>Павлодар</option>
<option value='lat=55.729171&lon=24.3654077'>Панявежис</option>
<option value='lat=53.1998079&lon=45.0000429'>Пенза</option>
<option value='lat=56.905645&lon=59.9433316'>Первоуральск</option>
<option value='lat=58.0149643&lon=56.2467244'>Пермь</option>
<option value='lat=56.7508&lon=38.8406'>Переславль-Залесский</option>
<option value='lat=61.7900409&lon=34.3899995'>Петрозаводск</option>
<option value='lat=54.8629254&lon=69.1615712'>Петропавловск</option>
<option value='lat=53.0626972&lon=158.6467983'>Петропавловск-Камчатский</option>
<option value='lat=64.7034951&lon=43.3886527'>Пинега</option>
<option value='lat=52.1210315&lon=26.0762972'>Пинск</option>
<option value='lat=55.4238911&lon=37.5441659'>Подольск</option>
<option value='lat=55.4857019&lon=28.7762951'>Полоцк</option>
<option value='lat=49.5920034&lon=34.5630624'>Полтава</option>
<option value='lat=58.5030694&lon=39.1192807'>Пошехонье</option>
<option value='lat=53.8717843&lon=86.6456812'>Прокопьевск</option>
<option value='lat=57.8190485&lon=28.3361107'>Псков</option>
<option value='lat=44.0410835&lon=43.0666626'>Пятигорск</option>
<option value='lat=40.4948788&lon=44.7669102'>Раздан</option>
<option value='lat=50.6237151&lon=26.2397505'>Ровно</option>
<option value='lat=53.9485&lon=32.8608'>Рославль</option>
<option value='lat=47.2248606&lon=39.7022857'>Ростов-на-Дону</option>
<option value='lat=52.9656983&lon=63.1349969'>Рудный</option>
<option value='lat=41.5577151&lon=44.9910574'>Рустави</option>
<option value='lat=58.0503742&lon=38.8346364'>Рыбинск</option>
<option value='lat=54.6163256&lon=39.7181403'>Рязань</option>
<option value='lat=53.3978748&lon=55.8981006'>Салават</option>
<option value='lat=66.5375387&lon=66.6157469'>Салехард</option>
<option value='lat=53.1984756&lon=50.1142415'>Самара</option>
<option value='lat=39.6503373&lon=66.9731062'>Самарканд</option>
<option value='lat=54.1877469&lon=45.1837037'>Саранск</option>
<option value='lat=56.477334&lon=53.8192957'>Сарапул</option>
<option value='lat=51.5502384&lon=46.004247'>Саратов</option>
<option value='lat=44.6114503&lon=33.5224182'>Севастополь</option>
<option value='lat=64.5634125&lon=39.8246073'>Северодвинск</option>
<option value='lat=48.9457932&lon=38.4975554'>Северодонецк</option>
<option value='lat=56.6032148&lon=84.8821185'>Северск</option>
<option value='lat=50.4053257&lon=80.2496216'>Семипалатинск</option>
<option value='lat=56.3089497&lon=38.1360855'>Сергиев Посад</option>
<option value='lat=59.60437&lon=60.5824253'>Серов</option>
<option value='lat=54.9156686&lon=37.4231938'>Серпухов</option>
<option value='lat=44.9475656&lon=34.1071534'>Симферополь</option>
<option value='lat=48.852246&lon=37.6057595'>Славянск</option>
<option value='lat=54.7940612&lon=32.0549595'>Смоленск</option>
<option value='lat=55.0829106&lon=21.8827392'>Советск</option>
<option value='lat=59.6493514&lon=56.7794344'>Соликамск</option>
<option value='lat=43.5854823&lon=39.723109'>Сочи</option>
<option value='lat=45.0433245&lon=41.9690934'>Ставрополь</option>
<option value='lat=51.3022758&lon=37.8347076'>Старый Оскол</option>
<option value='lat=39.8197675&lon=46.7603436'>Степанакерт</option>
<option value='lat=53.6323734&lon=55.9522577'>Стерлитамак</option>
<option value='lat=54.0994444&lon=22.9330556'>Сувалки</option>
<option value='lat=50.9130202&lon=34.7945068'>Сумы</option>
<option value='lat=61.2539972&lon=73.396098'>Сургут</option>
<option value='lat=53.1542826&lon=48.4630478'>Сызрань</option>
<option value='lat=61.6627496&lon=50.8266292'>Сыктывкар</option>
<option value='lat=47.2136896&lon=38.903365'>Таганрог</option>
<option value='lat=45.0005123&lon=78.3761119'>Талдыкорган</option>
<option value='lat=52.7296&lon=41.4487'>Тамбов</option>
<option value='lat=41.3097&lon=69.2935'>Ташкент</option>
<option value='lat=42.8943882&lon=71.3920902'>Тараз</option>
<option value='lat=41.7185081&lon=44.7884942'>Тбилиси</option>
<option value='lat=56.858675&lon=35.9208284'>Тверь</option>
<option value='lat=50.0549197&lon=72.9606114'>Темиртау</option>
<option value='lat=49.5557994&lon=25.5917286'>Тернополь</option>
<option value='lat=46.8523537&lon=29.617825'>Тирасполь</option>
<option value='lat=58.2012851&lon=68.2505938'>Тобольск</option>
<option value='lat=42.830066&lon=75.3000406'>Токмак</option>
<option value='lat=53.5172091&lon=49.4136783'>Тольятти</option>
<option value='lat=56.4891072&lon=84.9530537'>Томск</option>
<option value='lat=54.1938261&lon=37.6158717'>Тула</option>
<option value='lat=45.177933&lon=28.8018892'>Тулча</option>
<option value='lat=43.2919702&lon=68.2305287'>Туркестан</option>
<option value='lat=39.1007241&lon=63.5787761'>Туркменабад</option>
<option value='lat=40.0053169&lon=52.9928838'>Туркменбаши</option>
<option value='lat=57.1369473&lon=65.5819746'>Тюмень</option>
<option value='lat=48.6223502&lon=22.3021255'>Ужгород</option>
<option value='lat=51.8290077&lon=107.6230969'>Улан-Удэ</option>
<option value='lat=54.3196037&lon=48.3626636'>Ульяновск</option>
<option value='lat=51.22925&lon=51.37134'>Уральск</option>
<option value='lat=43.7971321&lon=131.9517783'>Уссурийск</option>
<option value='lat=49.9564881&lon=82.6119256'>Усть-Каменогорск</option>
<option value='lat=54.7262869&lon=55.9477285'>Уфа</option>
<option value='lat=63.5624585&lon=53.684243'>Ухта</option>
<option value='lat=40.3777852&lon=71.7928621'>Фергана</option>
<option value='lat=48.4814019&lon=135.07694'>Хабаровск</option>
<option value='lat=61.0026854&lon=69.0246937'>Ханты-Мансийск</option>
<option value='lat=49.9901077&lon=36.2302803'>Харьков</option>
<option value='lat=43.2427461&lon=46.5808469'>Хасавюрт</option>
<option value='lat=46.6551209&lon=32.6131115'>Херсон</option>
<option value='lat=55.8892847&lon=37.4449896'>Химки</option>
<option value='lat=49.4196404&lon=26.9793793'>Хмельницкий</option>
<option value='lat=37.4851443&lon=71.5340218'>Хорог</option>
<option value='lat=40.2828032&lon=69.6389657'>Худжанд</option>
<option value='lat=56.7726985&lon=54.1247155'>Чайковский</option>
<option value='lat=56.1311738&lon=47.2454815'>Чебоксары</option>
<option value='lat=55.1601725&lon=61.402735'>Челябинск</option>
<option value='lat=59.1286965&lon=37.9163892'>Череповец</option>
<option value='lat=49.4385726&lon=32.0669817'>Черкассы</option>
<option value='lat=51.4997394&lon=31.2866057'>Чернигов</option>
<option value='lat=48.2864129&lon=25.9376851'>Черновцы</option>
<option value='lat=54.6404098&lon=21.8037989'>Черняховск</option>
<option value='lat=52.033256&lon=113.5006916'>Чита</option>
<option value='lat=47.710652&lon=40.2112542'>Шахты</option>
<option value='lat=41.1999786&lon=47.1796374'>Шеки</option>
<option value='lat=40.6335347&lon=48.6398439'>Шемаха</option>
<option value='lat=39.9268106&lon=48.9182179'>Ширван</option>
<option value='lat=39.757369&lon=46.7456788'>Шуша</option>
<option value='lat=42.3119362&lon=69.6048037'>Шымкент</option>
<option value='lat=55.9232116&lon=37.9955106'>Щёлково</option>
<option value='lat=51.721378&lon=75.313446'>Экибастуз</option>
<option value='lat=55.7955391&lon=38.4375968'>Электросталь</option>
<option value='lat=46.3069981&lon=44.2701877'>Элиста</option>
<option value='lat=46.9574273&lon=142.727438'>Южно-Сахалинск</option>
<option value='lat=62.0332499&lon=129.7426537'>Якутск</option>
<option value='lat=44.4970632&lon=34.1585922'>Ялта</option>
<option value='lat=57.6263877&lon=39.8933705'>Ярославль</option>
</select>
			</div>
			<br />
<a id="go-link" href="http://osm.org/go/8dwO--">перейти</a>		</li>
		<li class="use">
			<h2>Используй</h2>
			<p><a href="http://wiki.openstreetmap.org/wiki/RU:ВикиПроект_Россия/Карты_России"><img src="img/v1/n3.png" alt="В навигаторах, ГИС и сервисах" width="200" height="100" /></a></p>
			<p>OSM — это  карты для навигаторов, обновляемые каждый день.</p>

		    <p>Выбери свою программу:</p>
		    
			<ul class="programms">
				<li class="p1"><a href="http://gis-lab.info/data/mp"><img width="88" height="24" alt="Карты для навигаторов Garmin" src="img/v1/logo_garmin.gif"></a></li>
				<li class="p2"><a href="http://peirce.gis-lab.info/daily.php"><img src="img/v1/logo_cityguide.gif" alt="Карты для программы СитиГид" width="88" height="31" /></a></li>
				<li class="p3"><a href="http://navitel.osm.rambler.ru/"><img src="img/v1/logo_navitel.png" alt="Карты для программы Navitel" width="88" height="23" /></a></li>
				<li class="p4"><a href="http://probki77.ru/pgs/russia.php"><img src="img/v1/logo_pocketgis.png" alt="Карты для программы PocketGIS" width="65" height="31" /></a></li>
				<li class="p5"><a href="http://osm-russa.narod.ru/"><img src="img/v1/logo_gisrussa.gif" alt="Карты для программы ГИС Русса" width="88" height="31" /></a></li>
				<li class="p6"><a href="http://osmand.net/"><img src="img/v1/logo_osmand.gif" alt="Карты для программы OsmAnd" width="88" height="23" /></a></li>
				<li class="p7"><a href="http://openstreetmaps.ru/"><img src="img/v1/logo_autosputnik.gif" alt="Карты для программы Автоспутник" width="88" height="18" /></a></li>
			</ul>
		</li>

		<li class="create">
			<h2>Участвуй</h2>
			<p><a href="http://wiki.openstreetmap.org/wiki/RU:Beginners_Guide"><img src="img/v1/n2.png" alt="В исправлении ошибок и редактировании" width="200" height="100" /></a></p>
			<p>Нашел ошибку? Укажи её прямо на карте через <a id="bugs-link" href="http://openstreetbugs.schokokeks.org/?zoom=5&lat=55.7516147&lon=37.6187089&layers=B00T">OpenStreetBugs</a>.</p>
			<p>Или <a href="http://wiki.openstreetmap.org/wiki/RU:Editing">исправь</a> онлайн или с помощью <a href="http://www.josm.ru">более мощного</a> загружаемого редактора.</p>
			<p>Новичок? Прочитай <a href="http://gis-lab.info/qa/osm-begin.html">как можно начать</a> знакомство с OSM.</p>
		</li>

		<li class="join">
			<h2>Общайся</h2>
			<p><a href="http://wiki.openstreetmap.org/wiki/RU:WikiProject_Russia#.D0.9E.D0.B1.D1.89.D0.B5.D0.BD.D0.B8.D0.B5"><img src="img/v1/n4.png" alt="Мы поможем!" width="200" height="100" /></a></p>
			<p>Присоединяйся к растущему сообществу OSM.</p>
			<p>Поделиться идеями и получить ответы на свои вопросы можно:</p>
			<ul>
				<li><a href="http://forum.openstreetmap.org/viewforum.php?id=21">на форуме</a></li>
				<li><a href="http://wiki.openstreetmap.org/wiki/RU:Main_Page">в вики</a> </li>
				<li><a href="http://forum.openstreetmap.org/viewtopic.php?id=5019">в IRC</a></li>
			</ul>
		</li>
	</ul>	
</div>

PHP_CONTENT;
?>
