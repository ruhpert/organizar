(function($) {  
	var settings = {};
	var firstRightContentRow = null;
	var widthRightContentRow = -1;
	var heightRightContentRow = -1;
	var moveDistance = 0;
	var formerMoveDistance = 0;
	var SEVERAL_VISIBLE_SLIDES = "several";
	var SINGLE_VISIBLE_SLIDE = "single";
	var LEFT = "LEFT";
	var RIGHT = "RIGHT";
	

	var methods = {
		/**
		 * INITIALIZE THE SLIDESHOW
		 */
		init : function( options ) {
			settings = $.extend({
				'pagination'     : false,
				'animationSpeed' : '300'
			}, options);

			return this.each(function(){
				var sliderWrapper = $(this);
				var parent = sliderWrapper.find(".data");
				var slides = sliderWrapper.find(".step");
				console.log(parent);
				console.log(sliderWrapper);
				
				console.log("init2");
				
				var tray = sliderWrapper.find(".tray");
				var visibleArea = sliderWrapper.find(".visible-slideshow-area");
				//getAndSetRightContentRowDimensions();
				console.log("init3 ");
				console.log(tray);
				setCorrectWidthsAndHeights(sliderWrapper, visibleArea, tray);

				visibleArea.css({
					"position": "relative",
					"width" : + sliderWrapper.width() + "px",
					"height" : sliderWrapper.height() + "px"
				});

				tray.css({
					"position" : "absolute",
					"top"      : 0,
					"left"     : 0,
					"width"    : + sliderWrapper.width() + "px",
					"height"   : sliderWrapper.height() + "px",
				});
				
				slides.css({
					"position" : "relative",
					"width"    : + sliderWrapper.width() + "px",
					"height"   : sliderWrapper.height() + "px",
					"float"    : "left"
				});
				
				
				/*
				 * ACTUALL SLIDER
				 */
				var clickCounter = 0;
				var slideLeft = sliderWrapper.find(".slide-left");console.log(slideLeft);
				var slideRight = sliderWrapper.find(".slide-right");
				var numberOfSlides = parseInt(sliderWrapper.find(".step").length);
				var numberOfHiddenSlides = 0;

				slideLeft.click(function() {
					console.log("clicked");
					numberOfHiddenSlides = calculateNumberOfHiddenSlides(sliderWrapper, numberOfSlides, visibleArea, clickCounter);
					setCorrectWidthsAndHeights(sliderWrapper, visibleArea, tray);
					console.log("clickCounter " + clickCounter);
					if (!tray.is(":animated") && (clickCounter < numberOfHiddenSlides)) {
						console.log("clicked3 ");
						clickCounter++;
						move(LEFT);
					}
				});

				slideRight.click(function() {
					console.log("clicked right");
					numberOfHiddenSlides = calculateNumberOfHiddenSlides(sliderWrapper, numberOfSlides, visibleArea, clickCounter);
					setCorrectWidthsAndHeights(sliderWrapper, visibleArea, tray);
					
					if (!tray.is(":animated") && clickCounter > 0) {
						clickCounter--;
						move(RIGHT);
					}
				});

				function move(direction) {

					var directionIndicator = null;

					if (direction == LEFT) {
						directionIndicator = "-=";
					}
					else {
						directionIndicator = "+=";
					}

					console.log("tray " + tray);
					console.log(" " + directionIndicator + moveDistance + "px");
					tray.animate({
						"left" : directionIndicator + moveDistance + "px"
					}, settings.animationSpeed);

					console.log("moved " + settings.animationSpeed);
				}
			});
		},

		/**
		 * DELETE THE SLIDESHOW
		 */
		destroy : function( ) {
			return this.each(function(){
				sliderWrapper = $(this);
				//sliderWrapper.remove();
			});
		},

		/**
		 * RELOAD THE SLIDESHOW
		 */
		reload : function( ) { 
			return this.each(function(){
				var sliderWrapper = $(this);
				var tray = sliderWrapper.find(".tray");
				var visibleArea = sliderWrapper.find(".visible-slideshow-area");
				getAndSetRightContentRowDimensions();
				setCorrectWidthsAndHeights(sliderWrapper, visibleArea, tray);
			});
		}
	};

	/**
	 * MAIN METHOD (JUST PASS ON TO THE CORRECT METHOD)
	 */
	$.fn.handleSlideshow = function(method) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.slider' );
		}
	};

	function getAndSetRightContentRowDimensions() {
		firstRightContentRow = $("#content").find(".row").first().find(".right");
		widthRightContentRow = firstRightContentRow.width();
		heightRightContentRow = firstRightContentRow.height();
	}

	function setCorrectWidthsAndHeights(sliderWrapper, visibleArea, tray) {
		var slides = sliderWrapper.find(".step");
		var trayWidth = 0;
		var currentTrayLeft = parseInt(sliderWrapper);
		var numberOfMovedSlides = Math.ceil(currentTrayLeft / formerMoveDistance);
		var newTrayLeft = 0;

		// parse slides
		$.each(slides, function(key, value) {
			var currSlide = $(this);
			var currSlideMarginLeft = parseInt(currSlide.css("margin-left").split("px")[0]);
			var currSlideMarginRight = parseInt(currSlide.css("margin-right").split("px")[0]);
			var currSlideWidth = parseInt(currSlide.width());

			currSlideMarginLeft = (isNaN(currSlideMarginLeft)) ? 0 : currSlideMarginLeft;
			currSlideMarginRight = (isNaN(currSlideMarginRight)) ? 0 : currSlideMarginRight;
			currSlideWidth = (isNaN(currSlideWidth)) ? 0 : currSlideWidth;

			console.log(" currSlideMarginRight " + currSlideMarginRight + " currSlideMarginLeft " + currSlideMarginLeft + " currSlideWidth " + currSlideWidth);

			trayWidth = trayWidth + (currSlideMarginLeft + currSlideWidth + currSlideMarginRight);

			moveDistance = (key == 0) ? (currSlideWidth + currSlideMarginLeft + currSlideMarginRight) : moveDistance;
		});

		newTrayLeft = moveDistance;
		formerMoveDistance = moveDistance;

		tray.css({
			"position" : "absolute",
			"width"    :  trayWidth + "px",
			"left"     : newTrayLeft + "px"
		});
		console.log(tray.width());
	}
	
	function calculateNumberOfHiddenSlides(sliderWrapper, numberOfSlides, visibleArea, clickCounter) {
		var maxVisibleSlides = sliderWrapper.width() / moveDistance;
		var numberOfHiddenSlides = (numberOfSlides > maxVisibleSlides) ? numberOfSlides - maxVisibleSlides : 0;

		console.log("numberOfSlides " + numberOfSlides);
		console.log("clickCounter " + clickCounter);
		numberOfHiddenSlides = numberOfHiddenSlides - clickCounter;

		console.log("numberOfHiddenSlides " + numberOfHiddenSlides);

		return numberOfHiddenSlides;
	}
})(jQuery);
