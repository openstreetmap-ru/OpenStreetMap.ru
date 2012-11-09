/**
 * Автокомплит к поисковой строке
 * Author: CupIvan <mail@cupivan.ru>
 */

$(function()
{
	/** подготовка запроса к серверу */
	var prepareRequest = function(x)
	{
		x = x.replace(/([\.,])(\S)/, '$1 $2'); // отделяем сокращения от слова
		return x;
	}

	/** сокращатель полной формы адреса в читаемый вариант */
	var toShortName = function(x)
	{
		x = x.replace('дом ', 'д. ');
		x = x.replace('улица ', 'ул. ');
		x = x.replace('город ', 'г. ');
		x = x.replace(/\S+ область, /, '');
		x = x.replace(/\S+ край, /, '');
		return x;
	}

	/** подсветка слов в результатах */
	var highlight = function(x, q)
	{
		var i;
		q = q.replace(/[^а-яa-z0-9]/ig, ' ').replace(/\s+/, ' ');
		q = q.split(' ');
		for (i in q) if (q[i])
			x = x.replace(new RegExp('('+q[i]+')', 'ig'), '<strong>$1</strong>');
		return x;
	}

	// подключаемся к поисковой строке
	$('#qsearch').autocomplete({
		source: function(request, response)
		{
			// запрос на сервер
			jQuery.ajax({
				url: '/api/autocomplete',
				dataType: 'json',
				minLength: 3,
				data: { q: prepareRequest(request.term) },
				success: function(data)
				{
					if (data && data.find)
					response($.map(data.matches, function(item)
					{
						item.label = highlight(item.name, request.term);
						item.value = toShortName(item.name);
						return item;
					}));
					else $('#qsearch').autocomplete('close'); // ничего не найдено, закрываем подсказку
				}
			});
		},
		// при выборе варианта показываем метку на карте
		select: function(event, ui)
		{
			if (!ui.item) return;
			osm.leftpan.toggle(1); // открываем левую панельку поиска
			search.processResults({find: true, matches: [ui.item]}); // имитируем результат поиска с сервера
		}
	});
	// рендерим строки подсказки с учетом тегов
	$('#qsearch').data("autocomplete")._renderItem = function(ul, item)
	{
		return $("<li>")
			.data("item.autocomplete", item)
			.append("<a>" + item.label + "</a>")
			.appendTo(ul);
	}

});
