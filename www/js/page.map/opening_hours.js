(function (root, factory) {
	if (typeof exports === 'object') {
		// For nodejs
		module.exports = factory();
	} else {
		// For browsers
		root.opening_hours = factory();
	}
}(this, function () {
	return function(value) {
		//======================================================================
		// Constants
		//======================================================================
		var months   = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
		var weekdays = { su: 0, mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6 };

		var minutes_in_day = 60 * 24;
		var msec_in_day    = 1000 * 60 * minutes_in_day;
		var msec_in_week   = msec_in_day * 7;

		//======================================================================
		// Constructor - entry to parsing code
		//======================================================================
		// Terminology:
		//
		// Mo-Fr 10:00-11:00; Th 10:00-12:00
		// \_____block_____/  \____block___/
		//
		// Mo-Fr Jan 10:00-11:00
		// \__/  \_/ \_________/
		// selectors (left to right: weekday, month, time)
		//
		// Logic:
		// - Split blocks; foreach block:
		// - Tokenize
		// - Run toplevel (block) parser
		//   - Which calls subparser for specific selector types
		//     - Which produce selectors

		// FIXME: This will also convert comments to lower case
		var rules = value.toLowerCase().split(/\s*;\s*/);
		var week_stable = true;

		var blocks = [];

		for (var rule = 0; rule < rules.length; rule++) {
			var tokens = tokenize(rules[rule]);

			var selectors = {
				// Time selectors
				time: [],

				// Temporary array of selectors from time wrapped to the next day
				wraptime: [],

				// Date selectors
				weekday: [],
				week: [],
				month: [],
				monthday: [],

				// Array with non-empty date selector types, with most optimal ordering
				date: [],

				meaning: true,
			};

			parseGroup(tokens, 0, selectors);

			if (selectors.month.length > 0)
				selectors.date.push(selectors.month);
			if (selectors.monthday.length > 0)
				selectors.date.push(selectors.monthday);
			if (selectors.week.length > 0)
				selectors.date.push(selectors.week);
			if (selectors.weekday.length > 0)
				selectors.date.push(selectors.weekday);

			blocks.push(selectors);

			// this handles selectors with time ranges wrapping over midnight (e.g. 10:00-02:00)
			// it generates wrappers for all selectors and creates a new block
			if (selectors.wraptime.length > 0) {
				var wrapselectors = {
					time: selectors.wraptime,
					date: [],

					meaning: selectors.meaning,

					wrapped: true,
				};

				for (var dselg = 0; dselg < selectors.date.length; dselg++) {
					wrapselectors.date.push([]);
					for (var dsel = 0; dsel < selectors.date[dselg].length; dsel++) {
						wrapselectors.date[wrapselectors.date.length-1].push(
								generateDateShifter(selectors.date[dselg][dsel], -msec_in_day)
							);
					}
				}

				blocks.push(wrapselectors);
			}
		}

		// Tokenization function: Splits string into parts.
		// output: array of pairs [content, type]
		function tokenize(value) {
			var tokens = new Array();

			while (value != '') {
				var tmp;
				if (tmp = value.match(/^(?:week|24\/7|off)/)) {
					// reserved word
					tokens.push([tmp[0], tmp[0]]);
					value = value.substr(tmp[0].length);
				} else if (tmp = value.match(/^(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/)) {
					// month name
					tokens.push([months[tmp[0]], 'month']);
					value = value.substr(3);
				} else if (tmp = value.match(/^(?:mo|tu|we|th|fr|sa|su)/)) {
					// weekday name
					tokens.push([weekdays[tmp[0]], 'weekday']);
					value = value.substr(2);
				} else if (tmp = value.match(/^\d+/)) {
					// number
					tokens.push([+tmp[0], 'number']);
					value = value.substr(tmp[0].length);
				} else if (value.match(/^\s/)) {
					// whitespace is ignored
					value = value.substr(1);
				} else if (value.match(/^[:.]/)) {
					// other single-character tokens
					tokens.push([value[0], 'timesep']);
					value = value.substr(1);
				} else {
					// other single-character tokens
					tokens.push([value[0], value[0]]);
					value = value.substr(1);
				}
			}

			return tokens;
		}

		// Function to check token array for specific pattern
		function matchTokens(tokens, at /*, matches... */) {
			if (at + arguments.length - 2 > tokens.length)
				return false;
			for (var i = 0; i < arguments.length - 2; i++) {
				if (tokens[at + i][1] !== arguments[i + 2])
					return false;
			}

			return true;
		}

		function generateDateShifter(func, shift) {
			return function(date) {
				var res = func(new Date(date.getTime() + shift));

				if (typeof res[1] === 'undefined')
					return res;
				return [ res[0], new Date(res[1].getTime() - shift) ];
			}
		}

		//======================================================================
		// Top-level parser
		//======================================================================
		function parseGroup(tokens, at, selectors) {
			while (at < tokens.length) {
				if (matchTokens(tokens, at, 'weekday')) {
					at = parseWeekdayRange(tokens, at, selectors);
				} else if (matchTokens(tokens, at, 'month', 'number')) {
					at = parseMonthdayRange(tokens, at);
					week_stable = false;
				} else if (matchTokens(tokens, at, 'month')) {
					at = parseMonthRange(tokens, at);
					week_stable = false;
				} else if (matchTokens(tokens, at, 'week')) {
					at = parseWeekRange(tokens, at + 1);
					week_stable = false;
				} else if (matchTokens(tokens, at, 'number', 'timesep')) {
					at = parseTimeRange(tokens, at, selectors);
				} else if (matchTokens(tokens, at, 'off')) {
					selectors.meaning = false;
					at++;
				} else if (matchTokens(tokens, at, '24/7')) {
					selectors.time.push(function(date) { return [true]; });
					at++;
				} else {
					throw 'Unexpected token: "' + tokens[at] + '"';
				}
			}

			return tokens;
		}

		//======================================================================
		// Time range parser (10:00-12:00,14:00-16:00)
		//======================================================================
		function parseTimeRange(tokens, at, selectors) {
			for (; at < tokens.length; at++) {
				if (matchTokens(tokens, at, 'number', 'timesep', 'number', '-', 'number', 'timesep', 'number')) {
					var minutes_from = tokens[at][0] * 60 + tokens[at+2][0];
					var minutes_to = tokens[at+4][0] * 60 + tokens[at+6][0];

					// this shortcut makes always-open range check faster
					// and is also useful in tests, as it doesn't produce
					// extra check points which may hide errors in other
					// selectors
					if (minutes_from == 0 && minutes_to == minutes_in_day)
						selectors.time.push(function(date) { return [true]; });

					// normalize minutes into range
					// XXX: what if it's further than tomorrow?
					// XXX: this is incorrect, as it assumes the same day
					//      should cooperate with date selectors to select the next day
					if (minutes_from >= minutes_in_day)
						throw 'Time range start outside a day';
					if (minutes_to < minutes_from)
						minutes_to += minutes_in_day;
					if (minutes_to > minutes_in_day * 2)
						throw 'Time spanning more than two midnights not supported';

					if (minutes_to > minutes_in_day) {
						selectors.time.push(function(minutes_from, minutes_to) { return function(date) {
							var ourminutes = date.getHours() * 60 + date.getMinutes();

							if (ourminutes < minutes_from)
								return [false, dateAtDayMinutes(date, minutes_from)];
							else
								return [true, dateAtDayMinutes(date, minutes_to)];
						}}(minutes_from, minutes_to));

						selectors.wraptime.push(function(minutes_from, minutes_to) { return function(date) {
							var ourminutes = date.getHours() * 60 + date.getMinutes();

							if (ourminutes < minutes_to)
								return [true, dateAtDayMinutes(date, minutes_to)];
							else
								return [false, undefined];
						}}(minutes_from, minutes_to - minutes_in_day));
					} else {
						selectors.time.push(function(minutes_from, minutes_to) { return function(date) {
							var ourminutes = date.getHours() * 60 + date.getMinutes();

							if (ourminutes < minutes_from)
								return [false, dateAtDayMinutes(date, minutes_from)];
							else if (ourminutes < minutes_to)
								return [true, dateAtDayMinutes(date, minutes_to)];
							else
								return [false, dateAtDayMinutes(date, minutes_from + minutes_in_day)];
						}}(minutes_from, minutes_to));
					}

					at += 7;
				} else {
					throw 'Unexpected token in time range: "' + tokens[at][0] + '"';
				}

				if (!matchTokens(tokens, at, ','))
					break;
			}

			return at;
		}

		// for given date, returns date moved to the start of specified day minute
		function dateAtDayMinutes(date, minutes) {
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, minutes);
		}

		//======================================================================
		// Weekday range parser (Mo,We-Fr,Sa[1-2,-1])
		//======================================================================
		function parseWeekdayRange(tokens, at, selectors) {
			for (; at < tokens.length; at++) {
				if (matchTokens(tokens, at, 'weekday', '[')) {
					// Conditional weekday (Mo[3])
					var numbers = [];

					// Get list of constraints
					var endat = parseNumRange(tokens, at+2, function(from, to) {
						if (from == to)
							numbers.push(from);
						else if (from < to)
							for (var i = from; i <= to; i++)
								numbers.push(i);
						else
							throw 'Bad range ' + from + '-' + to;
					});

					if (!matchTokens(tokens, endat, ']'))
						throw '"]" expected';

					week_stable = false;

					// Create selector for each list element
					for (var nnumber = 0; nnumber < numbers.length; nnumber++) {
						// bad number
						if (numbers[nnumber] == 0 || numbers[nnumber] < -5 || numbers[nnumber] > 5)
							throw 'Number between -5 and 5 (except 0) expected';

						selectors.weekday.push(function(weekday, number) { return function(date) {
							var start_of_this_month = new Date(date.getFullYear(), date.getMonth(), 1);
							var start_of_next_month = new Date(date.getFullYear(), date.getMonth() + 1, 1);

							var target_day_this_month;

							if (number > 0) {
								target_day_this_month = dateAtNextWeekday(start_of_this_month, weekday);
								target_day_this_month.setDate(target_day_this_month.getDate() + (number - 1) * 7);
							} else {
								target_day_this_month = dateAtNextWeekday(start_of_next_month, weekday);
								target_day_this_month.setDate(target_day_this_month.getDate() + number * 7);
							}

							if (target_day_this_month.getTime() < start_of_this_month.getTime() || target_day_this_month.getTime() >= start_of_next_month.getTime())
								return [false, start_of_next_month];

							// we hit the target day
							if (date.getDate() == target_day_this_month.getDate())
								return [true, dateAtDayMinutes(date, minutes_in_day)];

							// we're before target day
							if (date.getDate() < target_day_this_month.getDate())
								return [false, target_day_this_month];

							// we're after target day, set check date to next month
							return [false, start_of_next_month];
						}}(tokens[at][0], numbers[nnumber]));
					}

					at = endat + 1;
				} else if (matchTokens(tokens, at, 'weekday')) {
					// Single weekday (Mo) or weekday range (Mo-Fr)
					var is_range = matchTokens(tokens, at+1, '-', 'weekday');

					var weekday_from = tokens[at][0];
					var weekday_to = is_range ? tokens[at+2][0] : weekday_from;

					var inside = true;

					// handle reversed range
					if (weekday_to < weekday_from) {
						var tmp = weekday_to;
						weekday_to = weekday_from - 1;
						weekday_from = tmp + 1;
						inside = false;
					}

					if (weekday_to < weekday_from) {
						// handle full range
						selectors.weekday.push(function(date) { return [true]; });
					} else {
						selectors.weekday.push(function(weekday_from, weekday_to, inside) { return function(date) {
							var ourweekday = date.getDay();

							if (ourweekday < weekday_from || ourweekday > weekday_to) {
								return [!inside, dateAtNextWeekday(date, weekday_from)];
							} else {
								return [inside, dateAtNextWeekday(date, weekday_to + 1)];
							}
						}}(weekday_from, weekday_to, inside));
					}

					at += is_range ? 3 : 1;
				} else {
					throw 'Unexpected token in weekday range: "' + tokens[at] + '"';
				}

				if (!matchTokens(tokens, at, ','))
					break;
			}

			return at;
		}

		// Numeric list parser (1,2,3-4,-1), used in weekday parser above
		function parseNumRange(tokens, at, func) {
			for (; at < tokens.length; at++) {
				if (matchTokens(tokens, at, 'number', '-', 'number')) {
					// Number range
					func(tokens[at][0], tokens[at+2][0]);
					at += 3;
				} else if (matchTokens(tokens, at, '-', 'number')) {
					// Negative number
					func(-tokens[at+1][0], -tokens[at+1][0]);
					at += 2
				} else if (matchTokens(tokens, at, 'number')) {
					// Single number
					func(tokens[at][0], tokens[at][0]);
					at++;
				} else {
					throw 'Unexpected token in number range: "' + tokens[at][0] + '"';
				}

				if (!matchTokens(tokens, at, ','))
					break;
			}

			return at;
		}

		// for given date, returns date moved to the specific day of week
		function dateAtNextWeekday(date, day) {
			var delta = day - date.getDay();
			return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta + (delta < 0 ? 7 : 0));
		}

		//======================================================================
		// Week range parser (week 11-20, week 1-53/2)
		//======================================================================
		function parseWeekRange(tokens, at) {
			for (; at < tokens.length; at++) {
				if (matchTokens(tokens, at, 'number')) {
					var is_range = matchTokens(tokens, at+1, '-', 'number'), has_period = false;
					if (is_range)
						has_period = matchTokens(tokens, at+3, '/', 'number');

					selectors.week.push(function(tokens, at, is_range, has_period) { return function(date) {
						var ourweek = Math.floor((date - dateAtWeek(date, 0)) / msec_in_week);

						var week_from = tokens[at][0] - 1;
						var week_to = is_range ? tokens[at+2][0] - 1 : week_from;

						var start_of_next_year = new Date(date.getFullYear() + 1, 0, 1);

						// before range
						if (ourweek < week_from)
							return [false, getMinDate(dateAtWeek(date, week_from), start_of_next_year)];

						// we're after range, set check date to next year
						if (ourweek > week_to)
							return [false, start_of_next_year];

						// we're in range
						var period;
						if (has_period) {
							var period = tokens[at+4][0];
							if (period > 1) {
								var in_period = (ourweek - week_from) % period == 0;
								if (in_period)
									return [true, getMinDate(dateAtWeek(date, ourweek + 1), start_of_next_year)];
								else
									return [false, getMinDate(dateAtWeek(date, ourweek + period - 1), start_of_next_year)];
							}
						}

						return [true, getMinDate(dateAtWeek(date, week_to + 1), start_of_next_year)];
					}}(tokens, at, is_range, has_period));

					at += 1 + (is_range ? 2 : 0) + (has_period ? 2 : 0);
				} else {
					throw 'Unexpected token in week range: "' + tokens[at] + '"';
				}

				if (!matchTokens(tokens, at, ','))
					break;
			}

			return at;
		}

		function dateAtWeek(date, week) {
			var tmpdate = new Date(date.getFullYear(), 0, 1);
			tmpdate.setDate(1 - (tmpdate.getDay() + 6) % 7 + week * 7); // start of week n where week starts on Monday
			return tmpdate;
		}

		function getMinDate(date /*, ...*/) {
			for (var i = 1; i < arguments.length; i++)
				if (arguments[i].getTime() < date.getTime())
					date = arguments[i];
			return date;
		}

		//======================================================================
		// Month range parser (Jan,Feb-Mar)
		//======================================================================
		function parseMonthRange(tokens, at) {
			for (; at < tokens.length; at++) {
				if (matchTokens(tokens, at, 'month')) {
					// Single month (Jan) or month range (Feb-Mar)
					var is_range = matchTokens(tokens, at+1, '-', 'month');

					selectors.month.push(function(tokens, at, is_range) { return function(date) {
						var ourmonth = date.getMonth();
						var month_from = tokens[at][0];
						var month_to = is_range ? tokens[at+2][0] : month_from;

						var inside = true;

						// handle reversed range
						if (month_to < month_from) {
							var tmp = month_to;
							month_to = month_from - 1;
							month_from = tmp + 1;
							inside = false;
						}

						// handle full range
						if (month_to < month_from)
							return [!inside];

						if (ourmonth < month_from || ourmonth > month_to) {
							return [!inside, dateAtNextMonth(date, month_from)];
						} else {
							return [inside, dateAtNextMonth(date, month_to + 1)];
						}
					}}(tokens, at, is_range));

					at += is_range ? 3 : 1;
				} else {
					throw 'Unexpected token in month range: "' + tokens[at] + '"';
				}

				if (!matchTokens(tokens, at, ','))
					break;
			}

			return at;
		}

		function dateAtNextMonth(date, month) {
			return new Date(date.getFullYear(), month < date.getMonth() ? month + 12 : month);
		}

		//======================================================================
		// Month day range parser (Jan 26-31; Jan 26-Feb 26)
		//======================================================================
		function parseMonthdayRange(tokens, at) {
			for (; at < tokens.length; at++) {
				if (matchTokens(tokens, at, 'month', 'number', '-', 'month', 'number')) {
					selectors.monthday.push(function(tokens, at) { return function(date) {
						var start_of_next_year = new Date(date.getFullYear() + 1, 0, 1);

						var from_date = new Date(date.getFullYear(), tokens[at][0], tokens[at+1][0]);
						var to_date = new Date(date.getFullYear(), tokens[at+3][0], tokens[at+4][0] + 1);

						var inside = true;

						if (to_date < from_date) {
							var tmp = to_date;
							to_date = from_date;
							from_date = tmp;
							inside = false;
						}

						if (date.getTime() < from_date.getTime())
							return [!inside, from_date];
						else if (date.getTime() < to_date.getTime())
							return [inside, to_date];
						else
							return [!inside, start_of_next_year];
					}}(tokens, at));

					at += 5;
				} else if (matchTokens(tokens, at, 'month', 'number')) {
					var is_range = matchTokens(tokens, at+2, '-', 'number'), has_period = false;
					if (is_range)
						has_period = matchTokens(tokens, at+4, '/', 'number');

					selectors.monthday.push(function(tokens, at, is_range, has_period) { return function(date) {
						var start_of_next_year = new Date(date.getFullYear() + 1, 0, 1);

						var from_date = new Date(date.getFullYear(), tokens[at][0], tokens[at+1][0]);
						var to_date = new Date(date.getFullYear(), tokens[at][0], tokens[at+(is_range?3:1)][0] + 1);

						if (date.getTime() < from_date.getTime())
							return [false, from_date];
						else if (date.getTime() >= to_date.getTime())
							return [false, start_of_next_year];
						else if (!has_period)
							return [true, to_date];

						var period = tokens[at+5][0];
						var nday = Math.floor((date.getTime() - from_date.getTime()) / msec_in_day);
						var in_period = nday % period;

						if (in_period == 0)
							return [true, new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)];
						else
							return [false, new Date(date.getFullYear(), date.getMonth(), date.getDate() + period - in_period)];
					}}(tokens, at, is_range, has_period));

					at += 2 + (is_range ? 2 : 0) + (has_period ? 2 : 0);
				} else {
					throw 'Unexpected token in monthday range: "' + tokens[at] + '"';
				}

				if (!matchTokens(tokens, at, ','))
					break;
			}

			return at;
		}

		//======================================================================
		// Main selector traversal function
		//======================================================================
		this.getStatePair = function(date) {
			var resultstate = false;
			var changedate;

			var date_matching_blocks = [];

			for (var nblock = 0; nblock < blocks.length; nblock++) {
				var matching_date_block = true;

				// Try each date selector type
				for (var ndateselector = 0; ndateselector < blocks[nblock].date.length; ndateselector++) {
					var dateselectors = blocks[nblock].date[ndateselector];

					var has_matching_selector = false;
					for (var datesel = 0; datesel < dateselectors.length; datesel++) {
						var res = dateselectors[datesel](date);
						if (res[0])
							has_matching_selector = true;
						if (typeof changedate === 'undefined' || (typeof res[1] !== 'undefined' && res[1].getTime() < changedate.getTime()))
							changedate = res[1];
					}

					if (!has_matching_selector) {
						matching_date_block = false;
						// We can ignore other date selectors, as the state won't change
						// anyway until THIS selector matches (due to conjunction of date
						// selectors of different types).
						// This is also an optimization, if widest date selector types
						// are checked first.
						break;
					}
				}

				if (matching_date_block) {
					// The following lines implements date overwriting logic (e.g. for
					// Mo-Fr 10:00-20:00;We 10:00-16:00, We rule overrides Mo-Fr rule.
					if (blocks[nblock].date.length > 0 && blocks[nblock].meaning && !blocks[nblock].wrapped)
						date_matching_blocks = [];
					date_matching_blocks.push(nblock);
				}
			}

			for (var nblock = 0; nblock < date_matching_blocks.length; nblock++) {
				var block = date_matching_blocks[nblock];

				if (blocks[block].time.length == 0)
					resultstate = blocks[block].meaning;

				for (var timesel = 0; timesel < blocks[block].time.length; timesel++) {
					var res = blocks[block].time[timesel](date);
					if (res[0])
						resultstate = blocks[block].meaning;
					if (typeof changedate === 'undefined' || (typeof res[1] !== 'undefined' && res[1] < changedate))
						changedate = res[1];
				}
			}

			return [ resultstate, changedate ];
		}

		//======================================================================
		// Iterator interface
		//======================================================================
		this.getIterator = function(date) {
			return new function(oh) {
				if (typeof date === 'undefined')
					date = new Date();

				var prevstate = [ undefined, date ], state = oh.getStatePair(date);

				this.getState = function() {
					return state[0];
				}

				this.getDate = function() {
					return prevstate[1];
				}

				this.advance = function(datelimit) {
					if (typeof datelimit === 'undefined')
						datelimit = new Date(prevstate[1].getTime() + msec_in_day * 366 * 5);

					do {
						// open range, we won't be able to advance
						if (typeof state[1] === 'undefined')
							return false;

						// we're going backwards or staying at place
						// this always indicates coding error in a selector code
						if (state[1].getTime() <= prevstate[1].getTime())
							throw 'Fatal: infinite loop in nextChange';

						// don't advance beyond limits (same as open range)
						if (state[1].getTime() >= datelimit.getTime())
							return false;

						// do advance
						prevstate = state;
						state = oh.getStatePair(state[1]);
					} while (state[0] === prevstate[0]);
					return true;
				}
			}(this);
		}

		//======================================================================
		// Public interface
		//======================================================================

		// check whether facility is `open' on the given date (or now)
		this.getState = function(date) {
			var it = this.getIterator(date);
			return it.getState();
		}

		// returns time of next status change
		this.getNextChange = function(date, maxdate) {
			var it = this.getIterator(date);
			if (!it.advance(maxdate))
				return undefined;
			return it.getDate();
		}

		// return array of open intervals between two dates
		this.getOpenIntervals = function(from, to) {
			var res = [];

			var it = this.getIterator(from);

			if (it.getState())
				res.push([from]);

			while (it.advance(to)) {
				if (it.getState())
					res.push([it.getDate()]);
				else
					res[res.length - 1].push(it.getDate());
			}

			if (res.length > 0 && res[res.length - 1].length == 1)
				res[res.length - 1].push(to);

			return res;
		}

		// return total number of milliseconds a facility is open without a given date range
		this.getOpenDuration = function(from, to) {
			var res = 0;

			var it = this.getIterator(from);
			var prevdate = it.getState() ? from : undefined;

			while (it.advance(to)) {
				if (it.getState()) {
					prevdate = it.getDate();
				} else {
					res += it.getDate().getTime() - prevdate.getTime();
					prevdate = undefined;
				}
			}

			if (typeof prevdate !== 'undefined')
				res += to.getTime() - prevdate.getTime();

			return res;
		}

		this.isWeekStable = function() {
			return week_stable;
		}
	}
}));
