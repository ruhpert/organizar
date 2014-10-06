var Overlay = (function(options, $) {
	var Overlay = {};

	Overlay.BG = null;
	Overlay.CONTENT = null;
	Overlay.INFO = null;
	Overlay.SELF = null;

	function reset() {
		Overlay.BG = $("#overlay-background");
		Overlay.CONTEN = $("#overlay-content");
		Overlay.SELF = $("#overlay");
		Overlay.INFO = $("#overlay-info");
	}
	
	Overlay.loadContent = function(url, data){
		reset();
		if (data == "" || typeof data == "undefined" || data == null) {
			data = {}
		}


		AJAX.post(url,data);

		$.ajax({
			type : "POST",
			url  : url,
			data : data
		}).done(function(jqXHR) {
			var html = jqXHR;
			Overlay.showData(html);
		});


		Overlay.BG.hover(function() {
			//Overlay.SELF.fadeIn(300);
		});
	};

	Overlay.close = function() {
		Overlay.SELF.fadeOut(300);
	}
	
	Overlay.showData = function(html) {
		Infobox.hide();
		var topDistance = $(document).scrollTop();
		reset();

		Overlay.CONTEN.html(html);
		Overlay.SELF.fadeIn(300);
		Overlay.SELF.animate({"top": topDistance +"px"}, 500);

		Overlay.BG.click(function() {
			Overlay.close();
		});
		
		var forms = Overlay.CONTEN.find("form");

		$.each(forms, function(key, form) {
			var form = $(form);
			var callback = form.data("callback");
			if (typeof form != "undefined" && callback != "") {
				console.log("!!!!! FOUND CALLBACK !!!!!!");
				eval(callback);
			}
		});
		
		
		//reloadListener();
		setLayerListener();
		checkValidation();
		handleFormPosts();
	};

	var setLayerListener = function() {
		overlay = Overlay.SELF;

		if (overlay != null) {
			var buttons = overlay.find(".buttons").find(".button");
			var header = overlay.find(".header");
			var layerNavExists = (overlay.find("#layer-nav").length > 0) ? true : false;
			var layerNav = "<nav id=\"layer-nav\"><ul></ul></nav>";
			var back = null;
			var areaToShow = null;

			if (! layerNavExists) {
				header.append(layerNav);
			}

			overlay = $("#overlay");

			buttons.click(function() {
				var button = $(this);
				areaToShow = button.data("show");
				areaToShow = overlay.find("." + areaToShow);
				back = "<li class=\"back button\">Zurück</li>";
				overlay.find("#layer-nav").append(back);
				back = overlay.find(".back");
				buttons.fadeOut(10);
				areaToShow.fadeIn(10);

				// activate back button
				if (back != false && back != null) {
					back.click(function() {
						areaToShow.fadeOut(10);
						buttons.fadeIn(10);
						back.remove();
					});
				}
			});
		}
	}

	var handleFormPosts = function() {
		var forms = $("#overlay-content").find("form");

		$.each(forms, function(key, form) {
			var form = $(form);
			var href = form.data("default-action");
			var formAction = form.attr("action");

			if (formAction == "./" && typeof href != "undefined" && href != null) {
				form.attr("action", href);
			}

			if (! form.hasClass("no-async"))  {
				form.submit(function(e) {
					e.preventDefault();

					var formIsValid = checkValidation();

					if (formIsValid) {
						var data = $(this).serialize();
						var url = $(this).attr("action");
						Infobox.showMessage("Speichere Daten... Bitte warten...");
						AJAX.post(url, data, Overlay.showData, "#content");
					}
				});
			}
		});
	}

	var checkValidation = function() {
		var forms = $("#overlay-content").find("form");
		var isValid = true;

		$.each(forms, function(key, form) {
			var form = $(form);
			var labels = form.find("label");

			$.each(labels, function(i, label) {
				var label = $(label);
				var isRequired = (label.text().indexOf("*") > -1);

				if (isRequired) {
					var forID = label.attr("for");
					var input = $("#" + forID);

					if (input.size() > 0) {
						input.attr("required", "required");
						input.attr("pattern", "[0-9a-zA-Z_-/]+");

						if (input.attr("value") == "") {
							isValid = false;
						}
					}
				}
			});
		});
		
		return isValid;
	}
	
	var generateStepNavigation = function() {
		var _data = $("#overlay-content").find(".data");
		var target = _data.find(".step-navigation");
		var steps = _data.find(".step");
		var stepNavigation = "";

		$.each(steps, function(key, value) {
			var step = $(this);
			
			if (key > 0) {
				step.css("display", "none");
			}
		});
		var HTML_MIDDLE = _data.html();
		//_data.html("");
		var HTML_SETUP_BEGINN = "<div class='visible-slideshow-area' style='position: relative; width: 100%; height: 100%;'><div class='tray' style='position: absolute; width: 100%;height: 100%; left: 0;'>";
		var HTML_SETUP_END = "</div></div>";

		html1 = "<div class='button-left slide-right'></div><span>Schritt 1 von 3</span><div class='button-right slide-left '></div>" + HTML_SETUP_BEGINN + "<div class='clear'></div";

		_data.append(HTML_SETUP_BEGINN);
		_data.append(HTML_MIDDLE)
		_data.append(HTML_SETUP_END);
	};

	return Overlay;
}({},jQuery));
