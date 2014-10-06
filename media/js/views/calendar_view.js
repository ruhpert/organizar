var Calendar_View = (function(_this, $) {
	
	_this.init = function () {
		var cal_nav = $("#cal-nav");
		var next_day_button = $("#next-day");
		var next_week_button = $("#next-week");
		var prev_day_button = $("#prev-day");
		var prev_week_button = $("#prev-week");

		if (SHOW_EVENTS) {
			Calendar_Model.init();
			cal_nav.fadeIn();
		}
		else {
			cal_nav.fadeOut();
		}

		next_day_button.click(function() {
			day_from_session = $.cookie('last_calendar_day');
		});
		
		_this.fixEventWidth();
		_this.setupClickListener();
		
		window.setTimeout(function() {
			$(window).resize(function() {
				_this.fixEventWidth();
			});
		}, 10000);
	};
	
	_this.fixEventWidth = function() {
		
		
	};


	_this.setParticipating = function() {
		var participating = $(".users .button.participating");

		participating.unbind("click");
		participating.unbind("hover");

		participating.hover(function() {
			var hoveredElem = $(this);
			var comment = hoveredElem.data("comment");
			if (typeof comment != "undefined" && comment != "" && comment != " ") {
			//	alert(comment);
			}
		});

		participating.click(function(e) {
			e.preventDefault();
			var clickedElem = $(this);
			var comment = clickedElem.data("comment");
			var href = clickedElem.attr("href");
			var html = 	"<div class=\"select-excused\">" +
							"<h2>Die Abwesenheit für den Schüler einstellen</h2>" +
							"<textarea class=\"comment\">" + comment + "</textarea>" +
							"<div class=\"button excused\">Entschuldigt</div>" +
							"<div class=\"button not-excused red \">nicht Entschuldigt</div>" +
							"<div class=\"button participating\">Anwesend</div>" +
						"</div>";
			Overlay.showData(html);
			var buttonNotExcused = $("#overlay-content").find(".button.not-excused");
			var buttonExcused = $("#overlay-content").find(".button.excused");
			var buttonParticipating = $("#overlay-content").find(".button.participating");
			var url = "/";

			buttonNotExcused.click(function() {
				url = href + "?excused=false";
				clickedElem.addClass("not-excused absent");
				callback(clickedElem);
			});

			buttonExcused.click(function() {
				url = href + "?excused=true";
				clickedElem.addClass("absent");
				clickedElem.removeClass("not-excused");
				callback(clickedElem);
			});

			buttonParticipating.click(function() {
				clickedElem.removeClass("not-excused");
				clickedElem.removeClass("absent");
				url = href + "?excused=Null";
				callback(clickedElem);
			});

			var callback = function(clickedElem) {
				Overlay.close();
				console.log("----- Calendar_View triggered callback");
				var comment = $("#overlay-content").find(".comment").val();
				if (comment.length > 0) {
					clickedElem.attr("data-comment", comment);
					clickedElem.find(".hidden-comment").html(comment);
					url = url + "&comment=" + comment
				}
				AJAX.get(url, null, null, null);
			}
			

			//var r = confirm("Ist die Person entschuldigt? \n Abbrechen drücken falls nicht!");
//			if (r == true) {
//				window.location.href = href + "?excused=true"
//			} else {
//				window.location.href = href + "?excused=false";
//			}
		});

		var active_comment_buttons = $(".comment.button.active");
		active_comment_buttons.mouseenter(function() {
			var hovered_button = $(this);
			var hidden_comment = hovered_button.find(".hidden-comment");
			if (hidden_comment.text() != "") {
				hidden_comment.removeClass("hidden");
			}
		}).mouseleave(function() {
			var hovered_button = $(this);
			var hidden_comment = hovered_button.find(".hidden-comment");
			hidden_comment.addClass("hidden");
		});
	};

	_this.newEventFormCallback = function() {
		var latest = $("#newest-event");
		latest.text("Gespeichert! Um die Daten zu sehen bitte neu laden!");
	}

	/**
	 * 
	 * FUNCTION setupClickListener
	 * 
	 * setting up mouse and <s>touch</s> events on the screen
	 * 
	 */
	_this.setupClickListener = function() {
		var timeRaster = $("#time-raster");
		var events = $(".event");
		var target = $("#events");
		var offset = timeRaster.offset().top;

		events.dblclick(function(e) {
//			var clickedEvent = $(this);
//			var eventID = clickedEvent.data("id");
//			console.log("--- clicked ---");
//
//			$.ajax({
//				type: "GET",
//				url: "/event/" + eventID + "/edit/",
//			}).done(function( data ) {
//				var form = null;
//				var overlay = null;
//				var start_time_field = null;
//				var end_time_field = null;
//				var end_time = time;
//				var form_wrapper = null;
//				var end_time_minues = null;
//
//				data = $(data);
//				form_wrapper = $(data).filter('#event-form-wrapper');
//				form = form_wrapper.find("#event-form");
//				end_time = new Date(time.getTime() + 45 * 60000);
//				end_time_minues = (end_time.getMinutes() == 0) ? "00" : end_time.getMinutes();
//
//				Overlay.showData(form[0].outerHTML);
//
//				console.log("end time " + end_time);
//				console.log("end_time.getMinutes() " + end_time.getMinutes());
//				
//				overlay = $("#overlay-content");
//				start_time_field = overlay.find("#id_start_time");
//				end_time_field = overlay.find("#id_end_time");
//				
//				end_time_field.attr("value", (end_time.getHours() + ":" + end_time_minues ));
//				start_time_field.attr("value", (time.getHours() + ":" + time.getMinutes()));
//
//				form.submit(function(e) {
//					e.preventDefault();
//					$.ajax({   
//						type: 'POST',   
//						url: "/event/new/edit/",   
//						data: form.serialize(),
//						success: success,
//						dataType: dataType 
//					});
//				});
//				_this.handleForm();
//			});
		});

		timeRaster.dblclick(function(e) {
			var height = 58;
			var tmp = 0;
			var room = 0;
			var time = 0;
			var html = "";
			var nbrOfRooms = null;
			var width = null;
			var x = null;
			var y = null;
			var realTime = null;
			var time = null;
			var strTRealTime = null;
			var calendarStart = null;
			var hours = null;
			var minutes = null;
			var pageWidth = $(window).width();

			nbrOfRooms = $("#time-raster").find("tr").last().find("td").size();
			width = Math.round(nbrOfRooms > 0) ? 100 / nbrOfRooms : 140;
			x = e.pageX;
			y = e.pageY;
			x = (100 * x) / pageWidth; 

			if (x > width) {
				var padding = pageWidth - $("#time-raster").width();
				room = Math.floor(x / (100 / nbrOfRooms));

				if (room == 0) {
					room = 1;
				}
			}
			else {
				room = 1;
			}

			if (y > height) {
				y = y - height;
				if (y > height) {
					time = Math.round(y / height) - 2;
				}
				else {
					time = 1;
				}
			}
			else {
				time = 0;
			}

			x = room * width;
			y = time * height;

			html = "<li id=\"newest-event\" class=\"event not-saved clear 11.05.2014 bwl\" style=\"width: " + width + "%; position: absolute; left: " + x + "%; top: " + y + "px; height: 360px;\">Stunde ist noch nicht gespeichert.</li> "

			target.append(html);

			realTime = time * 0.25;
			time = new Date();
			strTRealTime = String(realTime).split(".");
			calendarStart = 10;
			hours = strTRealTime[0];
			minutes = strTRealTime[1];

			if (minutes == 5) {
				minutes = 50;
			}

			minutes = parseInt(minutes);
			hours = parseInt(hours) + parseInt(calendarStart); 

			for (var i = 0; i < (minutes / 25); i++) {
				tmp = tmp + 15;
				tmp = (tmp == 100) ? 0 : tmp;
			}

			minutes = tmp;
			time.setHours(hours);
			time.setMinutes(minutes);

			$.ajax({
				type: "GET",
				url: "/event/add/add/",
			}).done(function( data ) {
				var form = null;
				var overlay = null;
				var start_time_field = null;
				var end_time_field = null;
				var end_time = time;
				var form_wrapper = null;
				var end_time_minues = null;
				var room_select = null;
				var room_option = null;
				var result = $(data);

				form_wrapper = result.filter('#content');
				form = form_wrapper.find("#event-form");

				if (form.size() > 0) {
					Overlay.showData(form[0].outerHTML);
	
					overlay = $("#overlay-content");
					room_select = overlay.find("#id_room");
					room_option = room_select.find('option[value="' + room + '"]');
					room_option.attr("selected", "selected");
					start_time_field = overlay.find("#id_start_time");
					end_time_field = overlay.find("#id_end_time");
					end_time = new Date(time.getTime() + 45 * 60000);
					end_time_minues = (end_time.getMinutes() == 0) ? "00" : end_time.getMinutes();
					//end_time_field.attr("value", (end_time.getDay()+"."+end_time.getFullMonth() + "." + end_time.getYear() + " " + end_time.getHours() + ":" + end_time_minues ));
					//start_time_field.attr("value", (time.getHours() + ":" + time.getMinutes()));
	
	//				form.submit(function(e) {
	//					e.preventDefault();
	//					$.ajax({
	//						type: 'POST',
	//						url: "/event/new/edit/",
	//						data: form.serialize(),
	//						success: success,
	//						dataType: dataType 
	//					});
	//				});
				}

				_this.handleForm();
			});
		});
	};

	_this.handleForm = function() {
		$(".search").autocomplete();

		var edit_event_group = $("#edit-event-group");
		var active_event_group = $("#id_event_group :selected");
		var active_id = active_event_group.val();
		var href = edit_event_group.attr("href");

		href = href + active_id + "/"
		day_from_session = $.cookie('last_calendar_day');

		if (typeof day_from_session != "undefined" && day_from_session != "Invalid Date") {
			day_from_session = new Date(day_from_session);
			var day = (day_from_session.getDate() < 10) ? "0" : "";
			day = day + day_from_session.getDate();
			var month = parseInt(day_from_session.getMonth()) + 1;//(parseInt(day_from_session.getMonth()) < 10) ? "0" : "";
			//month = month + day_from_session.getDay();
			month = (parseInt(month) < 10) ? "0" + month : month;
			year = day_from_session.getFullYear();
			console.log("month " + month);
			console.log("day " + day);
			console.log("year " + year);
			$("#id_date").val(day + "." + month + "." + year)
			
			console.log("curr day");
		}

		var fields = ["id_date", "id_start_time", "id_end_time", "id_room", "id_users", "id_category", "id_lead"];
		var form = $("#event-form");

//		form.submit(function( event ) {
//			
//			var form_valid = true;
//			$.each(fields, function(key, id) {
//				var elem = $("#" + id);
//				console.log("elem " , elem.val());
//				if (typeof elem.val() != "undefined" && elem.val() != "" && elem.val() != " ") {
//					console.log("valid!");
//					console.log("value = " , elem.val());
//					elem.css("border", "none");
//				}
//				else {
//					console.log("invalid");
//					elem.css("border", "5px solid red");
//					form_valid = false;
//				}
//			});
//			console.log("form_valid ", form_valid);
//			if (! form_valid) {
//				event.preventDefault();
//			}
//		});
	};

	_this.day_entinty = '<div class="day-entity">{{ time }}</div>';

	_this.template_event = 
		'<li class="event clear {{ date }} {{ category_small }}" data-id="{{ id }}" data-room="{{ room }}" data-date="{{ date_as_utc }}">' +
			'<div class="visible-data">' +
				'<h5 class="time">{{ start_time }} bis {{ end_time }}</h5>' +
				'<span class="lead"><h4>{{ lead }} <br/>{{ lead_phone }} {{ lead_mobile }}</h4></span>' +
				'<b>{{ date }}</b><br/>' +
				'<span><b>Fach:</b> {{ category }}<br/>' +
				'<b>Raum:</b> {{ room }}</span><br/>' +
				'<b>Schüler</b><br/>' +
				'{{#user_list}}' +
						'<span class="user-data">{{#person_absent}}<s><b>{{/person_absent}}{{ user_name }},{{#person_absent}}</b></s>{{/person_absent}} </span>'+
				'{{/user_list}}' +
			'</div>' +
			'<div class="hidden-data hidden {{ category_small }}">' +
				'<div class="data clear">' +
					'<h4 class="time" style="color: black;"> {{ start_time }} bis {{ end_time }} </h4><h5>{{ date }}</h5>' +
					'<span><b>Lehrer:</b> {{ lead }}' +
					'{{#user_is_superuser}}' +
						'<a class="button ajax show_in_overlay" data-divclassorid="#content" href="/person/edit/{{ lead_id }}/">'+
							'<img src="/media/img/edit.png" alt="edit"/>'+
						'</a>'+
						'{{/user_is_superuser}}' +
					'<br/>'+
					'<b>Fach:</b> {{ category }}<br/><b>Raum:</b> {{ room }}' +
					'<br/>' +
					'<ul class="users">' +
						'{{#user_list}}' +
							'<li>'+
								'<span class="user-data">{{ user_name }} <br/> {{ user_phone }} {{ user_mobile }}</span>'+
								'{{#user_is_superuser}}' +
									'<a class="button ajax show_in_overlay" data-divclassorid="#content" href="/person/edit/{{ user_id }}/">'+
										'<img src="/media/img/edit.png" alt="edit"/>'+
									'</a>' +
								'{{/user_is_superuser}}' +
								'<a class="button ajax {{#comment}}active{{/comment}} comment ajax show_in_overlay" data-divclassorid="#content" href="/add_user_comment/{{ id }}/{{ user_id }}/">'+
									'<img src="/media/img/comment.png" alt="edit"/>'+
									'<div class="hidden-comment hidden">{{comment}}</div>'+
								'</a>'+
								'<a class="button participating comment {{#person_not_excused}}not-excused{{/person_not_excused}} {{#person_absent}} active absent{{/person_absent}}" data-comment="{{ person_not_excused_comment }}" href="/user_not_participating/{{ id }}/{{ user_id }}/">'+
									'<img src="/media/img/not-participating.png" alt="abwesend"/>'+
									'<div class="hidden-comment hidden">{{ person_not_excused_comment }}</div>'+
								'</a>'+
							'</li>'+
						'{{/user_list}}' +
					'</ul>'+
					'{{#user_is_superuser}}' +
						'<div class="menu">'+
							'<a class="button ajax" data-divclassorid="#content" href="/event/{{ id }}/edit/">Stunde <img src="/media/img/edit.png" alt="edit"/></a>' +
							'<a class="button ajax delete" href="/event/{{ id }}/delete/">Stunde <img src="/media/img/delete.png" alt="delete"/></a>' +
							'{{#event_group}}' +
							'<a class="button clear ajax" data-divclassorid="#content" href="edit/group/{{ event_group }}/{{ id }}/">Serie <img src="/media/img/edit.png" alt="edit"/></a>' +
							'<a class="button delete ajax" href="delete/group/{{ event_group }}/">Serie <img src="/media/img/delete.png" alt="delete"/></a>' +
							'{{/event_group}}' +
						'</div>' +
					'{{/user_is_superuser}}' +
				'</div>' +
			'</div>' + 
		'</li>';

	return _this;
}({}, jQuery));
