/******************************************
 * 
 * 
 * MODULE Infobox
 * 
 * 
 * *****************************************/
var Infobox = (function($, _this) {

	var infobox = null;
	var infoboxContent = null;
	var infoboxBg = null;

	$(window).load(function() {
		infobox = $(".status-info-wrapper");
		infoboxContent = infobox.find(".status-info");
		infoboxClose = infobox.find(".close");

		infoboxClose.click(function() {
			_this.hide();
		});
	});

	_this.showMessage = function(theMessage) {
		if (infobox != null) {
			infobox.fadeIn(200);
			infoboxContent.html(theMessage);
		}
	};
	
	_this.hide = function() {
		infobox.fadeOut(200);
	};
	
	return _this;
}(jQuery, {}));
