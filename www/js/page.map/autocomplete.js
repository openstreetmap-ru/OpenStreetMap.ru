/**
 * Автокомплит к поисковой строке
 * Author: CupIvan <mail@cupivan.ru>
 */

$(function()
{
	/** подготовка запроса к серверу */
	var prepareRequest = function(x)
	{
		x = x.replace(/([\.,])(\S)/,  '$1 $2'); // отделяем сокращения от слова
		x = x.replace(/([кдс])(\d)/g, '$1 $2').replace(/(\d)([кдс])/g, '$1 $2'); // 4к4 -> 4 к 4
		x = x.replace('пр-т', 'проспект');
		return x;
	}

	/** сокращатель полной формы адреса в читаемый вариант */
	var toShortName = function(x)
	{
		x = x.replace('дом ',      'д. ');
		x = x.replace('корпус ',   'к. ');
		x = x.replace('строение ', 'с. ');
		x = x.replace('улица ',    'ул. ');
		x = x.replace('город ',    'г. ');
		x = x.replace(/[^,]*?(край|область|Башкортостан|Татарстан), /, '');
		return x;
	}

	/** подсветка слов в результатах */
	var highlight = function(x, q)
	{
		var i;
		q = prepareRequest(q);
		q = q.replace(/[^а-яёa-z0-9]/ig, ' ').replace(/\s+/, ' ');
		q = q.replace(/[её]/g, '[её]'); // в запросе считаем е и ё одной буквой
		q = q.split(' ');
		for (i in q) if (q[i])
			x = x.replace(new RegExp('(\\s|^)('+q[i]+')', 'ig'), '$1<strong>$2</strong>');
		return x;
	}

	// подключаемся к поисковой строке
	$('#qsearch').autocomplete({
		source: function(request, response){
			// запрос на сервер
			jQuery.ajax({
				url: '/api/autocomplete',
				dataType: 'json',
				minLength: 3,
				data: {
					q: prepareRequest(request.term),
					bbox: osm.map.getBounds().toBBoxString()
				},
				success: function(data)
				{
					if (data && data.find)
					response($.map(data.matches, function(item)
					{
						item.label = highlight(item.name, request.term);
						item.value = toShortName(item.display_name);
						return item;
					}));
					else $('#qsearch').autocomplete('close'); // ничего не найдено, закрываем подсказку
				}
			});
		},
		// при выборе варианта показываем метку на карте
		select: function(event, ui){
			if (!ui.item) return;
			osm.leftpan.toggleItem('leftsearch', true); // открываем левую панельку поиска
			search.processResults({find: true, matches: [ui.item]}); // имитируем результат поиска с сервера
			search.enable(); // показываем результаты поиска
		}
	}).keyup(function(e){
		// закрываем подсказку по Enter
		if (e.keyCode == 13)
			$('#qsearch').autocomplete('close')
	})
	// рендерим строки подсказки с учетом тегов
	$('#qsearch').data("autocomplete")._renderItem = function(ul, item){
		return $("<li>")
			.data("item.autocomplete", item)
			.append("<a>" + item.label + "</a>")
			.appendTo(ul);
	}
	//Увеличиваем z-index, что бы элементы панели не перекрывали
	$('#qsearch').data("autocomplete")._renderMenu = function(ul, items){
		$(ul).css({zIndex:2000})
	}
	// ставим шрифт в поисковой строке, такой же как у подсказок
	$('#qsearch').addClass('ui-widget');
});
