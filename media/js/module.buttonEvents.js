

var ButtonHandler = (function(options, $) {
	var ButtonHandler = {};
	var buttons = null;

	ButtonHandler.reload = function() {
		ButtonHandler.handleClickEvents(".button");
		ButtonHandler.handleClickEvents(".event");
		ButtonHandler.handleClickEvents(".rows");
	}

	ButtonHandler.handleClickEvents = function(_class) {
		buttons = $(_class);

		buttons.click(function() {
			var clickedButton = $(this);
			var action = clickedButton.data("action");
			var data = clickedButton.data("data");
			var buttonIsActive = clickedButton.hasClass("active");
			var buttonIsSelection = clickedButton.hasClass("select");
			console.log("buttonIsActive ", buttonIsActive);
			console.log("buttonIsSelection ", buttonIsSelection);
			
			console.log("data ", data);
			
			if (buttonIsSelection) {
				if (buttonIsActive) {
					clickedButton.removeClass("active");
				}
				else {
					clickedButton.addClass("active");
				}
			}

			if (typeof action != "undefined") {
				var actionData = action.split("("); // type(param)
				var type = actionData[0];

				switch(type) {
					case("load"):
						var url = actionData[1].split(")")[0];
						Overlay.loadContent(url, data);
						break;
				}
			}
		});
	}

	return ButtonHandler;
}({},jQuery));
