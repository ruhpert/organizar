var Overlay = (function(options, $) {
	var Overlay = {};

	Overlay.BG = null;
	Overlay.CONTENT = null;
	Overlay.INFO = null;
	Overlay.SELF = null;

	Overlay.loadContent = function(url, data){
		Overlay.BG = $("#overlay-background");
		Overlay.CONTEN = $("#overlay-content");
		Overlay.SELF = $("#overlay");
		Overlay.INFO = $("#overlay-info");

		if (data == "" || typeof data == "undefined" || data == null) {
			data = {}
		}


		AJAX.post(url,data);
		console.log("sending data ", data);

		$.ajax({
			type : "POST",
			url  : url,
			data : data
		}).done(function(jqXHR) {
			Overlay.CONTEN.html(jqXHR);
			reloadListener();
			Overlay.SELF.fadeIn(300);
			setLayerListener();
		});

		Overlay.BG.click(function() {
			Overlay.SELF.fadeOut(300);
		});

		Overlay.BG.hover(function() {
			//Overlay.SELF.fadeIn(300);
		});
	};

	var setLayerListener = function() {
		overlay = Overlay.SELF;

		if (overlay != null) {
			console.log(" SETTING LISTENER ", infobox);
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
				console.log("______ CLICKED ________");
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
						console.log("areaToShow ", areaToShow);
						areaToShow.fadeOut(10);
						buttons.fadeIn(10);
						back.remove();
					});
				}
			});
		}
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
		console.log(_data);
		html1 = "<div class='button-left slide-right'></div><span>Schritt 1 von 3</span><div class='button-right slide-left '></div>" + HTML_SETUP_BEGINN + "<div class='clear'></div";
		
		_data.append(HTML_SETUP_BEGINN);
		_data.append(HTML_MIDDLE)
		_data.append(HTML_SETUP_END);
	};

	return Overlay;
}({},jQuery));
