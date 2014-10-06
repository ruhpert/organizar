var MENU = (function($) {
	var MENU = {};

	MENU.init = function() {
		var menu = $("#menu");
		var menuTrigger = $("#show-menu");
		var menuHeight = 0;
		var content = $("#content");
		var contentPadding = parseInt(content.css("padding-top").split("px"));

		menuClone = menu.clone();
		menuHeight = menuClone.css("height", "auto").appendTo("body").height();
		menuClone.remove();
		menu.css("height", "0px");

		menuTrigger.click(function() {
		
			if (menu.height() > 0) {
				menu.css({
					height: "0px"
				});
				content.css({
					"padding-top" : contentPadding + "px"
				});
			}
			else {
				menuClone = menu.clone();
				var menuWidth = menu.width();
				var nav = menuClone.css({"height" : "auto", "width" : menuWidth + "px"}).appendTo("body").find("nav");
				var navMargin = parseInt(nav.css("margin-top").split("px"));
				var navHeight = parseInt(nav.height());
				menuHeight = navHeight + navMargin * 2;
				menuClone.remove();

				if (menuHeight != 0) {
					content.css({
						"padding-top" : (menuHeight + contentPadding) + "px"
					});
					menu.css({
						height: menuHeight + "px"
					});
				}
				else {
					content.css({
						"padding-top" : (100 + contentPadding) + "px"
					});
					menu.css({
						height: "100px"
					});
				}
			}
		});
	}

	return MENU;
}(jQuery));

function reloadListener() {
	ButtonHandler.reload();
}

$("document").ready(function() {
	var event = $(".event");
	var rows = $(".row");


	setupInputs();
	reloadListener();
	MENU.init();

	$("#new-fach").click(function() {
		var html="<select><option value='Grundschule'>Mathe</option><option value='Hauptschule'>Englisch</option><option value='Realschule'>Phiysik</option></select>";
		$(this).parent().append(html);
		console.log($(this).parent());
	});

	var buttonBackToTop = $("#back-to-top");

	$(window).scroll(function() {
		var offset = $(window).scrollTop();

		if (offset > 0) {
			buttonBackToTop.fadeIn(100);
		}
		else {
			buttonBackToTop.fadeOut(100);
		}
	});

	buttonBackToTop.click(function() {
		$('html, body').animate({scrollTop:0}, 'medium');
	});

	$("#datepicker").datepicker();

	var reload = function() {
		console.log("reloaded");
		$(".datepicker").datepicker( "widget" );
		//overlayContent.handleSlideshow("init");
	};


	
	function setupInputs() {
		var inputs = $("input");
		console.log("monitoring ", inputs);
		inputs.click(function() {
			var clickedElem = $(this);
			clickedElem.addClass("active");
		}).blur(function() {
			var clickedElem = $(this);
			clickedElem.removeClass("active");
		});
	}
	
	
	
	
	function handleDragStart(e) {
		this.style.opacity = '0.4';  // this / e.target is the source node.
	}
	
	
	
	var userGroubButtons = $(".user-group-button");
	userGroubButtons.click(function() {
		var clickedButton = $(this);
		var buttonId = clickedButton.attr("id");
		var buttonName = "";

		userGroubButtons.removeClass("active");
		clickedButton.addClass("active");

		if (typeof buttonId != "undefined" && buttonId.length > 1) {
			var isValidName = false;
			var data = buttonId.split("-");
			var cat = data[0];
			var groupName = data[1];

			console.log("groupName " + groupName);
			console.log("cat " + cat);

			switch(cat) {
				case "showUserGroup":
					showUserGroup(groupName);
					break;
			}
		}
	});


	function showUserGroup(groupName) {
		var category = $("#user-" + groupName);
		var user = category.find(".user");
		var allCategories = $(".user-group");
		allCategories.fadeOut(100);
		allCategories.removeClass("active");
		console.log("allCategories ", allCategories);

		window.setTimeout(function() {
			category.fadeIn(100);
			category.addClass("active");
		}, 100);
	}


	
});

