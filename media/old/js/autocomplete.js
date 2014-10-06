$(document).ready(function() {
	var searchInput = $("#trigger-search");
	var resultArea = $("#search-results");

	searchInput.focus(function() {
		$(this).attr("value", "");
		resultArea.html("");
	});

	searchInput.keyup( function() {
		var currInput = $("#trigger-search");
		var query = currInput.attr("value");
		var result = [];
		var html = "";

		result = searchFor(query);
		resultArea.html("");
		html = "<ul>";

		$.each(result, function() {
			html = html + this.outerHTML;
		});

		html = html + "</ul>";

		resultArea.append(html);

		Calendarium.reloadListener();
	});

	function searchFor(query) {
		var result = [];
		var values = $("#search-values").find(".search-value");
		var counter = 0;

		$.each(values, function() {
			var currValue = $(this);
			var word = currValue.text();
			query = query.toLowerCase();
			word = word.toLowerCase();

			if (word.indexOf(query) > -1 && query.length > 0) {
				currValue.clone().replaceWith(currValue);
				currValue = currValue.css("opacity", 1);
				result[counter] = currValue[0];
				counter++;
			}
		});

		return result;
	}
});
