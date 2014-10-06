
var Calendar_Model = (function(_this, $) {
	var former_day = null;
	var curr_day = null;
	var active_day = null;
	var next_day = null;
	var prev_day = null;
	var prev_week_day = null;
	var next_week_day = null;
	var events = null;
	var cal_date = null;
	var action_go_to_pre_week = null;
	var action_go_to_next_week = null;
	var action_go_to_next_day = null;
	var action_go_to_prev_day = null;
	var action_go_to_today = null;
	var action_show_date = null;
	var action_sort_by_lead = null;
	var action_sort_by_room = null;
	var day_from_session = null;
	var SORT_BY = "room";
	var found_a_event = false;


	/**
	 * 
	 * public FUNCTION init
	 * 
	 * initialize model
	 * 
	 */
	_this.init = function() {
		console.log("~~~ Calendar_Model initialized ~~~");

		curr_day = new Date();
		curr_day.setHours(23);
		curr_day.setMinutes(0);
		curr_day.setSeconds(0);
		curr_day.setMilliseconds(0);
		day_from_session = $.cookie('last_calendar_day');

		// set active day
		if (typeof day_from_session == "undefined" || day_from_session == "Invalid Date") {
			active_day = curr_day;
		}
		else {
			
			day_from_session = new Date(day_from_session);
			active_day = day_from_session;
		}

		//$.ajax({
//			type: "POST",
//			url: "/data/",
//			data: { "key": "events", "csrfmiddlewaretoken": csrf_token}
//		}).done(function( msg ) {
			

			//ALL_EVENTS = msg;
			


			// setup dates and times
			next_day = new Date(active_day.getTime() + (24 * 60 * 60 * 1000));
			prev_day = new Date(active_day.getTime() - (24 * 60 * 60 * 1000));
			next_week_day = new Date(active_day.getTime() + ((24 * 60 * 60 * 1000) * 7));
			prev_week_day = new Date(active_day.getTime() + ((24 * 60 * 60 * 1000) * 7));

			// setup selectors
			events = $(".event");
			action_go_to_next_week = $("#next-week");
			action_go_to_pre_week = $("#prev-week");
			action_go_to_next_day = $("#next-day");
			action_go_to_pre_day = $("#prev-day");
			action_go_to_today = $("#cal-go-to-today");
			action_sort_by_lead = $("#cal-action-sort-by-lead");
			action_sort_by_room  = $("#cal-action-sort-by-room");

			cal_date = $("#cal-date");
			action_show_date = $("#cal-action-show-date");

			// activate click listener
			setup_listener();

			printCalendar();
			// show date
			_this.goToDay(active_day);


			reset();

			//_this.loadData();
	//	});
	}


	/**
	 * 
	 * public FUNCTION loadData
	 * 
	 
	_this.loadData = function() {
		var days = 0;
		var doLoad = true;
		var theDay = new Date();
		var day_in_the_past = new Date();
		var day_in_the_future = new Date();
		var init = true;
		var days_to_load = 365; // 365

		var load = function() {
			day = getNexdaytDate();
			days = 1;
			$.ajax({
				type: "POST",
				url: "/data/",
				data: { "key": "events", "days": days, "day" : day, "csrfmiddlewaretoken": csrf_token}
			}).done(function( msg ) {
				console.log("ALL_EVENTS", ALL_EVENTS);
				if (ALL_EVENTS != null) {
					console.log("msg1", msg);
					console.log("msg2", msg);
					if ("" + msg != "{}" && $(msg).size() > 1) {
						msg = msg[0];
						console.log("msg3 ", msg);
						$.each(msg, function(msg_day) {
							if (msg_day != 0) {
								console.log("msg_day ", msg_day);
								ALL_EVENTS = [$.extend(true, ALL_EVENTS,msg_day)];
							}
						});
					}
				}
				else {
					console.log("init all events");
					ALL_EVENTS = {};
				}

				if (doLoad) {
					load();
				}
			});
		}

		function getNextDate() {
			var dateStr = "";
			if (init == false) {
				var sessionValue = null;

				if (i % 2){
					sessionValue = new Date($.cookie('day_in_the_future'));
					day_in_the_future = (typeof sessionValue != "undefined" && sessionValue != "Invalid Date") ? sessionValue : day_in_the_future;
					$.cookie('day_in_the_future', day_in_the_future.setDate(day_in_the_future.getDate() + 1));
					theDay = day_in_the_future;
				} else {
					sessionValue = new Date($.cookie('day_in_the_past'));
					day_in_the_past = (typeof sessionValue != "undefined" && sessionValue != "Invalid Date") ? sessionValue : day_in_the_past;
					$.cookie('day_in_the_past', day_in_the_past.setDate(day_in_the_past.getDate() - 1));
					theDay = day_in_the_past;
				}
			}
			init = false;

			/*var d = theDay.getDate();
			var m = theDay.getMonth();
			var y = theDay.getYear();

			try {
				dateStr = dateToString(theDay);
			} catch(err) {
				console.log("err", err);
			}

			return dateStr;
		}


		load();
	};
	*/

	var dateToString = function(date) {
		return date.toISOString().slice(0,10);
	}
	
	/**
	 * 
	 * public FUNCTION gotToDay
	 * 
	 * @param date object with the wanted day
	 * 
	 */
	_this.goToDay = function(date) {
		var wanted_day = null;
		var weekday = null;
		var found_a_event = false;
		var D = null;
		var strDate = null;
		Infobox.showMessage($(".status-info").data("initial"));

		//var string_date = null;
		//string_date = D + " " + (date.getDate()) + "." + (date.getMonth() + 1) + "." + date.getFullYear();

		strDate =  date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getUTCDate();
		console.log("~~~~~~~~ GOING TO DATE " + strDate + "~~~~~~~~");
		// load date 
		console.log("strDate ", strDate);

		$.ajax({
			type: "POST",
			url: "/data/",
			data: { "key": "events", "days": 1, "day" : strDate, "csrfmiddlewaretoken": csrf_token}
		}).done(function( msg ) {
			var json = null;
			console.log("msg ", msg);
			Infobox.hide();
			if (ALL_EVENTS == null) {
				ALL_EVENTS = {};
			}

			json = $.parseJSON(msg);

			console.log("json", json);

			if ("" + json != "{}" && $(json).size() > 0) {
				$.each(json, function(key, msg_day) {
					if (msg_day != 0) {
						ALL_EVENTS[key] = msg_day;
					}
				});
			}
			render(date);
			
		});

		active_day = date;

		wanted_day = date;
		weekday = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag");
		found_a_event = false;
		D = weekday[date.getDay()];
		string_date = D + " " + (date.getDate()) + "." + (date.getMonth() + 1) + "." + date.getFullYear();

		cal_date.text(string_date);
		events = $(".event");

//		$.each(events, function(key, event) {
//			event = $(event);
//			var string_date = event.data("date");
//			var event_day = new Date(string_date);
//			if (event_day - wanted_day == 0) {
//				found_a_event = true;
//			}
//		});
	}



	function reset() {
		console.log("~~~ CALDENDAR MODEL RESETED ~~~");
		next_day = new Date(active_day.getTime() + (24 * 60 * 60 * 1000));
		prev_day = new Date(active_day.getTime() - (24 * 60 * 60 * 1000));
		next_week_day = new Date(active_day.getTime() + ((24 * 60 * 60 * 1000) * 7));
		prev_week_day = new Date(active_day.getTime() - ((24 * 60 * 60 * 1000) * 7));
		$.cookie('last_calendar_day', active_day);

		// show hide event details
		events = $(".event");
		events.mouseenter(function() {
			var event = $(this);
			var hidden_data = event.find(".hidden-data");
			if (hidden_data.hasClass("hidden")) {
				$(".hidden-data").addClass("hidden");
				hidden_data.removeClass("hidden");
			}
			else{

			}
		}).mouseleave(function() {
			$(".hidden-data").addClass("hidden");
		});


		$(".button.delete").click(function(e) {

		});
		
		/**
		 * TODO find better solution
		 */
		Calendar_View.setParticipating();
		AJAX.resetListener(null);
		/**
		 * END TODO find better solution
		 */
	}

	function setup_listener() {
		action_go_to_today.click(function() {
			_this.goToDay(curr_day);
		});
		action_go_to_next_week.click(function() {
			_this.goToDay(next_week_day);
		});
		action_go_to_pre_week.click(function() {
			_this.goToDay(prev_week_day);
		});
		action_go_to_next_day.click(function() {
			console.log("going to next day");
			_this.goToDay(next_day);
		});
		action_go_to_pre_day.click(function() {
			_this.goToDay(prev_day);
		});
		action_sort_by_lead.click(function() {
			SORT_BY = "lead";
			_this.goToDay(active_day);
		});
		action_sort_by_room.click(function() {
			SORT_BY = "room";
			_this.goToDay(active_day);
		});

		action_show_date.click(function() {
			var string_date = $("#cal-go-to-date").val();
			string_date = string_date.split(".");
			string_date = string_date[2] + "-" + string_date[1] + "-" + string_date[0];
			var wanted_date = new Date(string_date);
			_this.goToDay(wanted_date);
			active_day = wanted_date;
			reset();
		});
	}

	function render(date) {
		console.log("rendering...");
		var final_output = "";
		var template_events_by_teacher = '<ul class="events">';
		var events_by_day =  null;
		var sorted_events = {};
		var nbrOfEvents = 0;

		found_a_event = false;

		console.log("got the pool", ALL_EVENTS);

		if (ALL_EVENTS != null && ! $.isEmptyObject(ALL_EVENTS)) {
			events_by_day = ALL_EVENTS;
		}

		if (events_by_day != null) {
			//events_by_day = $.parseJSON(events_by_day);
			console.log("date ", date);
			event_by_date = events_by_day["2014-09-29"];
			$.each(events_by_day, function(key, event) {
				nbrOfEvents++;
				if ($(event).size() > 1) {
					$.each(event, function(_key, ev){
						print(ev);
					});
				}
				else{
					event = event[0];
					print(event);
				}
			});
		}

		/*if (! found_a_event) {
			Infobox.showMessage($(".status-info").data("initial"));

			window.setTimeout(function() {

				if (active_day == former_day) {
					console.log("~~~ Calendar_Model: RENDERING DAY AGAIN!", date);
					render(active_day);
				}

				former_day = active_day;
			}, 5000);
		}
		else {
			Infobox.hide();
		}*/

		function print(passed_event) {
			var _date = passed_event.date_as_utc;
			var lead = passed_event.lead;
			var data = "";
			var output = "";
			
			var month = (1 + active_day.getMonth());
			var date = active_day.getDate();
			
			if (month <= 9) {
				month = "0" + month;
			}
			
			if (date <= 9) {
				date = "0" + date;
			}

			//_date = new Date(passed_date);
			var passed_date = _date;
			var active_date = active_day.getFullYear() + "-" + month + "-" + date;
			var sort_by_date = false;
			var sort_by_lead = true;
			var sort_by_room = true;

			if (SORT_BY == "room") {
				sort_by_room = true;
				sort_by_lead = false;
			}
			else if (SORT_BY == "lead") {
				sort_by_lead = true;
			}

			if (passed_date == active_date) {
				found_a_event = true;
				//
				output = Mustache.render(Calendar_View.template_event, passed_event);

				if (typeof output != "undefined") {

					var key = "";

					// sort by date
					if (sort_by_date) {
						
						key = passed_date
					}
					// sort by lead
					else if (sort_by_lead) {
						key = lead;
						
					}
					// sort by room
					else {
						key = passed_event.room
					}

					if (!(key in sorted_events)) {
						output = output;//"<b>" + key + "</b> " + output
						sorted_events[key] = output;
					}else{
						data = sorted_events[key];
						sorted_events[key] = data + output;
					}
				}
			}
		}

		var nbr_of_keys = 0;

		$.each(sorted_events, function(key, data) {
			template_events_by_teacher += '<li class="sort"><ul>' + data + '</ul></li>';
			nbr_of_keys += 1
		});

		template_events_by_teacher += "</ul>";
		events_by_day = {"events" : events_by_day};

		$("#events").html(template_events_by_teacher);
		
		if (! found_a_event) {
			$("#cal-message").html("<br/><br/><h3>Es gibt bisher keine Stunden an diesem Tag!</h3>");
		}
		else if (SORT_BY == "room") {	
			var now = new Date();
			var go_to_minuts = now.getMinutes();
			var go_to_hours = now.getHours();
			var page = $("#page");

			if (go_to_hours > 18) {
				go_to_hours = 18;
			}

			var go_to = calc_y(go_to_hours, go_to_minuts);
			//$('html,body').animate({scrollTop:go_to}, 2000,'swing');

			$("#time-raster").show();
			page.css("width", "100%");
			$("#cal-message").html("");

			if (nbr_of_keys > 12) {
				page.css("width", "140%");
			}

			var events = $(".event");	
				
			var event_list = [];

			$.each(events, function(key, event) {
				var extra = 0;
				var top = 0;
				var room = 1;
				var nbrOfRooms = 6;
				var height = 240;
				var pageWidth = 1400;
				var time = null;
				var start_time = null;
				var start_time_hours = null;
				var start_time_minutes = null;
				var end_time = null;
				var end_time_hours = null;
				var end_time_minutes = null;
				var value = null;
				var extra_height = null;
				var width_of_event = null;
				var left = null
				var currPageWidth = null;
				var ratio = null;

				event = $(event);
				time = event.find(".time").first();
				time = time.text().split(" bis ");
				room = event.data("room");
				start_time = time[0];
				start_time_hours = parseInt(start_time.split(":")[0]);
				start_time_minutes = parseInt(start_time.split(":")[1]);
				end_time = time[1];
				end_time_hours = parseInt(end_time.split(":")[0]);
				end_time_minutes = parseInt(end_time.split(":")[1]);
				value = start_time_hours+":"+start_time_minutes+"R"+room;
				extra_height = getExtaHeight(start_time_hours, start_time_minutes, end_time_hours, end_time_minutes);
				nbrOfRooms = $("#time-raster").find("tr").last().find("td").size();
				height = 240 + parseInt(extra_height);
				width_of_event = Math.round(nbrOfRooms > 0) ? 100 / nbrOfRooms : 140;
				top = 0;
				left = (calc_x(room, width_of_event));
				pageWidth = 1400;
				currPageWidth = $(window).width();
				ratio = (100 - (currPageWidth * 100 / pageWidth)) / 2;

				if ($.inArray(value, event_list) > -1) {
					// value 
					// start_time_hours+":"+start_time_minutes+"R"+room;
					// 20:45R3, 18:15R2
					event.addClass("alert");
					extra = 40;
				}else{
					event_list[key] = value;
				}

				top = (calc_y(start_time_hours, start_time_minutes) + extra);
				width_of_event = (nbrOfRooms > 0) ? width_of_event + "%" : width_of_event + "px";
				//left = Math.round((left * 100 / pageWidth) );
				event.css({
					"position"	: "absolute",
					"width"		: width_of_event,
					"left"		: left + "%",
					"top"		: top + "px",
					"height"	: height + "px"
				});
//				$.each(event_list, function(_key, eventid) {
//					var event_room = null;
//					var event_hours = null;
//					var event_minutes = null;
//					var data = null;
//					var time_is_ok = true;
//					var room_is_ok = true;
//
//					if (_key != key) {
//						console.log("eventid ", eventid);
//						data = eventid.split("R");
//						console.log("data ", data);
//						event_room = data[1];
//						data = data[0];
//						data = data.split(":");
//						console.log("data ", data);
//						event_hours = data[0];
//						event_minutes = data[1];
//						console.log("event_room ", event_room);
//	
//						console.log("start_time_hours " , start_time_hours);
//						console.log("event_hours ", event_hours);
//						console.log("start_time_minutes ", start_time_minutes);
//						console.log("event_minutes ", event_minutes);
//						console.log("event_room", event_room);
//						console.log("room ", room);
//						
//						if (
//							start_time_hours == event_hours
//							&&
//							start_time_minutes == event_minutes
//						) {
//							time_is_ok = false;
//	
//							if (event_room == room) {
//								room_is_ok = false;
//							}
//						}
//	
//						if (! room_is_ok && ! time_is_ok) {
//							event.addClass("alert");
//							extra = 40;
//						}
//						console.log("---> room_is_ok", room_is_ok);
//						console.log("---> time_is_ok", time_is_ok);
//					}
//				});
			});
		}
		else {
			$("#time-raster").hide();
			$("#page").css("width", "140%");
			$('html,body').animate({scrollTop:0}, 2000,'swing');
		}

		reset();
	}


	function getExtaHeight(hoursA, minutesA, hoursB, minutesB) {
		 // 240px = 45min
		var height = 0;
		var delta = hoursA * 60 + minutesA - hoursB * 60 - minutesB;
		var x = 4;//3.4;
		delta = (delta > 0) ? delta : delta * -1;
		
		if (delta > 45) {
			var alpha = (hoursB * 60 * x - minutesB * x) - (hoursA * 60 * x + minutesA * x);
			
			if (alpha == 0) {
				height = (240/3);
			}
			else {
				height = (alpha - 240);
			}
			
			height = (height > 0) ? height : height * -1;
		}
		else {
			height = 240;
		}
	
		return height;
	}

	function calc_y(hours, minutes) {
		var x = 3.8;
		var yPX = 0;
		var minutesPX = 0;
		var elem_height = 140 + 10 + 10;

		if (hours < 10) {
			hours = hours + 12;
		}

		yPX = ((hours * 60 + minutes) - 10 * 60) * x;

		/*hours = hours - 10;
		hours = (hours == 0) ? 1 : hours;

		
		if (minutes > 0) {
			var factor = (minutes / 25);
			var x = elem_height / 4;
			minutesPX = factor * x;
		}
		
		yPX = (hours) * elem_height + minutesPX;*/

		return yPX;
	}

	function calc_x(room, elem_width) {
//		var xPX = 0;
//		var elem_width = 140 + 10 + 10;
//		xPX = room * elem_width;
//
//		return xPX;
		var x = 0;
		x = room * elem_width;
		
		return x;
	}

	var sort_by = function(field, reverse, primer){

	   var key = primer ? 
	       function(x) {return primer(x[field])} : 
	       function(x) {return x[field]};

	   reverse = [-1, 1][+!!reverse];

	   return function (a, b) {
	       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	     } 

	}

	// Print Calendar
	var printCalendar = function() {
		var target = $("#time-raster");
		var minute = 0;
		var hour = 10;
		var interval = 15;
		var htmlOutput = "";
		var header = "<table><tr>" +
						"<th>Zeit / Räume</th>" +
						"<th class=\"room\">Raum 1</th>" +
						"<th class=\"room\">Raum 2</th>" +
						"<th class=\"room\">Raum 3</th>" +
						"<th class=\"room\">Raum 4</th>" +
						"<th class=\"room\">Raum 5</th>" +
						"<th class=\"room\">Raum 6</th>" +
						"<th class=\"room\">Raum 7</th>" +
					"</tr>";

		htmlOutput = header;

		for (var i = 0; i < 60; i++) {
			var newMinute = minute + interval;
			var nextMinute = null;
			var nextHour = null;
			var formerMinute = minute;
			var formerHour = hour;

			if (newMinute > (interval * 3)) {
				minute = 0;
			}
			else {
				minute = minute + interval;
			}

			if (minute == 0) {
				hour = hour + 1;
			}
			else {
				hour = hour;
			}

			if (hour < 10) {
				nextHour = "0" + hour;
			}
			else {
				nextHour = hour;
			}

			if (minute < 10) {
				nextMinute = "0" + minute;
			}
			else {
				nextMinute = minute;
			}

			if (formerHour < 10) {
				formerHour = "0" + formerHour;
			}

			if (formerMinute < 10) {
				formerMinute = "0" + formerMinute;
			}

			var html =
				"<tr>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'>" + formerHour + ":" + formerMinute + "</td>" //"-" + nextHour + ":" + nextMinute + "
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+ "</tr>";

			htmlOutput = htmlOutput + html;


		}
		htmlOutput = htmlOutput + "</table>";
		target.append(htmlOutput);
	}

	return _this;

}({}, jQuery));
