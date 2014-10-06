$(document).ready(function() {
	Calendarium.reloadListener();
});

var Calendarium = (function(_this, $) {
	var draggableElms = [];
	var dropableElms = [];
	var calEntrys = $(".cal-entry");
	var user = $(".user");
	var calendar = $("#calendar");
	var rows = $(".row");
	var init = true;
	var currCol = 1;
	var currRow = 1;

	_this.reloadListener = function () {
		calEntrys = $(".cal-entry");
		user = $(".user");
		calendar = $("#calendar");
		rows = $(".row");
		draggableElms = [calEntrys, user];
		dropableElms = [calEntrys, calendar];
		setEvent(DRAG, draggableElms);
		setEvent(DROP, dropableElms);
		//printCalendar();
		if (init) {
			init = false;
			createNewEvent();
		}
	}

	function setEvent(eventType, elements) {
		$.each(elements, function() {
			var currElem = $(this);

			switch(eventType) {
				case DRAG:
					currElem.draggable({
						helper: 'clone',
						drag: function( event, ui ) {
							handleDrag(event, ui, DRAG);
						},
						stop: function( event, ui ) {
							handleDrag(event, ui, DROP);
						}
					});
					break;
				case DROP:
					currElem.droppable({
						greedy: true,
						activeClass: "ui-state-hover",
						hoverClass: "ui-state-active",
						drop: function( event, ui ) {
							handleDrop(this, ui);
						}
					});
			}
		});
	}

	/**
	 *
	 * FUNCTIONS
	 *
	 */


	// create new event
	function createNewEvent() {
		calendar.dblclick(function(event) {
			console.log("event", event.originalEvent.layerX);
			var orgEvent = event.originalEvent;
			var _x = orgEvent.layerX;
			var _y = orgEvent.layerY;
			var eventTarget = calendar.find(".events");
			var calOffset = calendar.offset();
			var callOffsetX = calOffset.left;
			var callOffsetY = calOffset.top;
			var x = event.clientX- callOffsetX;
			var y = event.clientY - callOffsetY;

			console.log("_Y" + _y);
			console.log("_X" + _x);

			var event = 
				  "<div class='event day-view cal-entry f-min noob' style='top: " + y + "px; left: " + x + "px;'>"
				+ "			<dl>"
				+ "				<dt class='tutor'>KEINE LEHRER</dt>"
				+ "				<dt></dt>"
				+ "				<dd class='placeholder'>KEINE SCHÜLER</dd>"
				+ "			</dl>"
				+ "		</div>";
			eventTarget.append(event);
			var noob = eventTarget.find(".noob");

			console.log("MAKING AJAX REQUEST");

			$.ajax({
				type: "POST",
				url: "http://127.0.0.1:8000/calendar",
				data: { "newEvent": "True", "room" : currCol, "pos_x" : _x, "pos_y" : _y}
			})
			.done(function( msg ) {
				alert( "Data Saved: " + msg );
			});

			_this.reloadListener();
		});
	}



	/**
	 * DRAG & DROP
	 */

	// HANDLE DRAG
	function handleDrag(event, ui, status) {
		ui = $(ui);
		var draggedElem = $(ui[0].helper);

		switch(status) {
			case DRAG:
				break;
			case DROP:
				draggedElem.css({
					"left" : 0,
					"top"  : 0
				});
				break;
		}
	}

	// HANDLE DROP
	function handleDrop(elm, ui) {
		var draggedElm = $(ui.helper);

		elm = $(elm);

		var elmId = elm.attr("id");
		var elmClases = elm.attr("class");
		var type = null;

		if (elmId == "" || typeof elmId == "undefined") {
			elmClasses = elmClases.split(" ");

			$.each(elmClasses, function() {
				var currClass = "" + this;
				getAndSetType(currClass);
			});
		}
		else {
			getAndSetType(elmId);
		}


		function getAndSetType(name) {
			switch(name) {
				case "calendar": {
					fixPositionOf(elm, ui);
					break;
				}
				case "cal-entry": {
					addPerson(draggedElm, elm);
					break;
				}
			}
		}
	}

	_this.createCalNavigation = function() {
		/*var target = $("#cal-navigation");

		var navigation = $(".fc-header-left").html();
		var currDate = $(".fc-header-center").html();
		var views = $(".fc-header-right").html();
		
		console.log("navigation", navigation);

		target.find(".now").html(currDate);
		target.find(".navigation").html(navigation);
		target.find(".views").html(views);*/
	}

	function addPerson(person, target) {
		var placeholder = target.find(".placeholder");
		var parent = person.parent();
		var userCat = person.attr("data-cat");
		var text = person.text();

		/*console.log("person ", person);
		console.log("placeholder ", placeholder);
		console.log("userCat " + userCat);
		console.log("parent ", parent);
		console.log("former elems ", $(target).find(".person-" + userCat));*/

		placeholder.remove();

		if (parent.hasClass("multiple")) {
			add();
		}
		else if (target.find("." + userCat).length > 0) {
			// DO NOTHING
			$().showMessage("Sind sie Sicher dass sie den Lehrer tauschen möchten? <input type='button' value='Ja' /><input type='button' value='Nein' />");
		}
		else {
			add();
		}

		function add() {
			if (userCat == "employee") {
				target = target.find(".tutor");
				target.addClass(userCat);
				target.text(text);
			}
			else {
				target = target.find("dl");
				target.append("<dd class='person-" + userCat + "'>" + text + "</dd>");
			}
		}
	}

	// FIX POSITION
	function fixPositionOf(elm, ui) {
		var numberHeaderLines = 2;
		var newPosX = ui.offset.left - $(elm).offset().left;
		var newPosY = ui.offset.top - $(elm).offset().top;
		var _elm = calendar.find(".fc-border-separate").find("tbody");
		var areaWidth = _elm.width() + 2;
		var areaHeight = _elm.height() + 2;
		var firstRow = $(calendar.find("tr").last()); 
		var firstCol = firstRow.find("td").first();
		var colWidth = firstCol.width();
		var colHeight = firstCol.height() + 1;
		var numberOfRows = Math.floor(areaHeight / colHeight);
		var numberOfCols = firstRow.find("td").size() - 1;
		var droppedToRow =((areaHeight - colHeight) / newPosY);
		var droppedToCol = (areaWidth - colWidth) / newPosX;
		var col = Math.round(newPosX / colWidth);
		var row = Math.round((newPosY / colHeight) - 1);
		var newLeft = col * colWidth;
		var newTop = (row * colHeight);
		
		currCol = col;
		currRow = row;

		console.log("___________________");
		console.log("_elm", _elm);
		console.log("areaHeight " + areaHeight);
		console.log("col ", col);
		console.log("colWidth " , colWidth);
		console.log("newPosX ", newPosX);
		console.log("newPosY ", newPosY);
		console.log("firstRow " , firstRow);
		console.log("firstCol ", firstCol);
		console.log("row", (((newPosY / colHeight) - 1)));
		console.log("row ", row);
		console.log("colHeight " , colHeight);
		console.log("numberOfCols" , numberOfCols);
		console.log("numberOfRows" , numberOfRows);
		console.log("newLeft" , newLeft);
		console.log("newTop" , newTop);
		console.log("$(ui.draggable) " , $(ui.draggable));
		console.log("droppedToRow " + droppedToRow);
		console.log("droppedToCol " + droppedToCol);

		if (newLeft >= colWidth && newTop >= (colHeight * 2)) {
			newTop = newTop + colHeight;
			$(ui.draggable).css({
				"position" : "absolute",
				"left"     : newLeft + "px",
				"top"      : newTop + "px"
			});
		}
		else {
			console.log("___________ ERROR ___________");
			console.log("newLeft", newLeft);
			console.log("colWidth", colWidth);
			console.log("newTop", newTop);
			console.log("colHeight", colHeight);
			console.log("_____________________________");

			if (newLeft < colWidth && newTop < (colHeight * numberHeaderLines)) {
				$(ui.draggable).css({
					"position" : "absolute",
					"left"     : colWidth + "px",
					"top"      : (colHeight * numberHeaderLines) + "px"
				});
			}
			else if (newLeft < colWidth){
				$(ui.draggable).css({
					"position" : "absolute",
					"left"     : colWidth + "px"
				});
			}
			else if (newTop < (colHeight * numberHeaderLines)){
				$(ui.draggable).css({
					"position" : "absolute",
					"top"      : (colHeight * numberHeaderLines) + "px"
				});
			}
		}
	}


	var printEvents = function() {

		var data = event_data;
		var html = "<div class=\"events\">";

		console.log("data", data);

		$.each(data, function() {
			var data = this;
			console.log("this", data["class"]);
			var classes = "event day-view cal-entry f-min " + data["class"];
			var course = data["course"];
			var style = data["style"];
			var date = data["date"];
			var room = data["room"];
			var type = data["type"];
			
			html = html +
					"<div class=\"" + classes + "\" style=\"" + style + "\" data-date-time=\"" + date + "\" data-room=\"" + room + "\">" +
						"<dl>" +
							"<dt class=\"tutor\">KEINE LEHRER</dt>" +
							"<dt>" + course + " - " + type + "</dt>" +
							"<dd class=\"placeholder\">KEINE SCHÜLER</dd>" +
						"</dl>" +
					"</div>";
		});
		
		html = html + "</div>";
		calendar.append(html);
	}

	// Print Calendar
	_this.printCalendar = function() {
		var target = $(".fc-day-content");
		var minute = 0;
		var hour = 8;
		var interval = 15;
		var header = "<tr>" +
						"<th>Zeit / Räume</th>" +
						"<th class=\"room\">Raum 1</th>" +
						"<th class=\"room\">Raum 2</th>" +
						"<th class=\"room\">Raum 3</th>" +
						"<th class=\"room\">Raum 4</th>" +
						"<th class=\"room\">Raum 5</th>" +
						"<th class=\"room\">Raum 6</th>" +
					"</tr>";

		target.append(header);

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
				+	"<td class='row' data-event='load(forms/form-new-event.html)'>" + formerHour + ":" + formerMinute + "-" + nextHour + ":" + nextMinute + "</td>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+	"<td class='row' data-event='load(forms/form-new-event.html)'></td>"
				+ "</tr>";

			target.append(html);
		}

		printEvents();
		_this.reloadListener();
	}

	return _this;

}({}, jQuery));


