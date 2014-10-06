/**
 * 
 * MODEL Menu_Model
 * 
 * handles the menu
 * 
 */
var Menu_Model = (function(_this, $) {
	var TYPE_MENU = "show_in_menu";
	var TYPE_OVERLAY = "show_in_overlay";
	var header = null;
	var inner_wrapper = null;
	var menu = null;
	var type = null;
	var callback = null;

	_this.init = function() {
		console.log("~~~ Menu_Model initialized ~~~");
		handle_fade_In_Out();
		reset();
	};

	function reset() {
		console.log("~~~ Menu_Model reseted ~~~");
		header = $("#header");
		inner_wrapper = header.find(".inner-wrapper");
		menu = header.find(".menu");

		$(".search").autocomplete();
		/**
		 * 
		 * TODO REMOVE / RESOLVE
		 * 
		 * these functions  should be placed in the according model or view
		 * 
		 */
		try {
			handle_contract();
		}
		catch(e) {
			console.log("~~~ Menu_Model ERROR: could not handle contract " + e);
		}
		try {
			handlePrint();
		}
		catch(e) {
			console.log("~~~ Menu_Model ERROR: could not handle print " + e);
		}
		/**
		 * END TODO
		 */
	}

	/**
	 * 
	 * FUNCTION showMenuEntry
	 * 
	 * renders and handles the given menu in the menu area
	 * 
	 * @param html - html to be shown
	 * 
	 */
	_this.showMenuEntry = function (html) {
		var backButton = null;

		if (typeof type == "undefined" || type == null || type == TYPE_MENU) {
			menu.hide();
			inner_wrapper.find(".ajax-data").remove();
			inner_wrapper.append("<div class=\"ajax-data\">" + html + "</div>");
			header = $("#header");
			backButton = header.find(".button.back");

			if (backButton.size() > 1) {
				backButton.first().remove();
			}

			backButton.click(function(e) {
				e.preventDefault();
				header.find(".ajax-data").remove();
				menu.show();
			});
		}
		else {
			Overlay.showData(html);
		}

		reset();

	};

	
	/**
	 * +++++++++++++++++
	 * NOW IN AJAX_MODEL
	 * +++++++++++++++++
	 * 
	 * 
	 * FUNCTION handle_menu_items
	 * 
	 * handles interactions like 
	 * clicking on one menu items 
	 * and triggers the according action
	 * 
	 
	function handle_menu_items() {
		var menuItems = menu.find("li>a");

		menuItems.click(function(e) {
			e.preventDefault();

			var item = $(this);
			var href= item.attr("href");
			console.log("clicked");
			if (item.hasClass("ajax")) {
				var data = {'load' : 'overloaded_events'};
				var divClassOrID = item.data("divclassorid");
				console.log("~~~")
				console.log("TYPE_OVERLAY " + TYPE_OVERLAY + " item " , item);
				console.log("item.hasClass(TYPE_MENU)", item.hasClass(TYPE_MENU));
				console.log("item.hasClass(TYPE_OVERLAY) ", item.hasClass(TYPE_OVERLAY));
				console.log("divClassOrID " +divClassOrID);

				if (item.hasClass(TYPE_MENU)) {
					type = TYPE_MENU;
				}
				else if(item.hasClass(TYPE_OVERLAY)) {
					type = TYPE_OVERLAY;
					console.log("!!! setted type overlay !!!");
				}

				if (typeof divClassOrID != "undefined" && divClassOrID != "") {
					AJAX.get(href, null, _this.showMenuEntry, divClassOrID);
				}
				else {
					AJAX.get(href, null, _this.showMenuEntry, null);
				}
			}
			else {
				window.location = href;
			}
		});
	}
	*/

	function handle_fade_In_Out() {
		var nav = $("#logo");
		var header = $("#header");
		var wrapper = header.find(".inner-wrapper");
		var page = $("#page");
		var small_height = 35;
		var big_height = $(window).height() - (small_height);
		var menu_status = $.cookie('menu-status');

		// init
		header.css({
			"height" : small_height + "px",
		});
		wrapper.css({
			"height" : small_height + "px",
		});
		page.css({
			"margin-top" : (small_height + 60) + "px",
		});

		nav.click(function() {
			if (header.hasClass("out")) {
				header.removeClass("out");
				header.css({
					"height" : small_height + "px",
				});

				wrapper.css({
					"height" : small_height + "px",
				});
			}
			else {
				header.addClass("out");
				header.css({
					"height" : big_height + "px",
					"overflow" : "visible",
				});
				wrapper.css({
					"height" : big_height + "px",
				});
			}
		});
	}

	return _this;

}({}, jQuery));
