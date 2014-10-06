/******************************************
 * 
 * 
 * MODULE Infobox
 * 
 * 
 * *****************************************/
var Infobox = (function($) {

	var infobox = null;
	var infoboxContent = null;
	var infoboxBg = null;

	$(document).ready(function() {
		infobox = $("#infobox");
		infoboxContent = $("#infobox-content");
		infoboxBg = $("#infobox-bg");

		infoboxBg.click(function() {
			console.log("FADING OUT");
			infobox.fadeOut(200);
		});
	});

	$.fn.showMessage = function(theMessage) {
		infobox.fadeIn(200);
		infoboxContent.html(theMessage);
	};
}(jQuery));
