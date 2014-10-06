$.fn.autocomplete = function() {

	return this.each(function() {
		var searchArea = $(this);
		var searchInput = null;
		var resultArea = null;
		var searchValues = null;
		var userSelects = null;

		console.log("~~~ Autocomplete initialized for ~~~");
		console.log(searchArea);

		var init = function() {

			$.each(searchArea, function(key, searchArea) {
				searchArea = $(searchArea);
				searchInput = searchArea.find(".trigger-search");
				resultArea = searchArea.find(".search-results");
				searchValues = searchArea.find(".search-values");
	
				searchInput.focus(function() {
					$(this).attr("value", "");
					resultArea.html("");
				});
	
				searchInput.keyup( function() {
					var currInput = $(".trigger-search");
					var query = currInput.attr("value");
					var result = [];
					var html = "";

					result = searchFor(query);
					resultArea.html("");
					html = "<ul>";

					$.each(result, function() {
						var elemHTML = this.outerHTML;

						if (elemHTML.indexOf("<li>") < 0) {
							elemHTML = "<li>" + elemHTML + "</li>";
						}

						html = html + elemHTML;
					});
			
					html = html + "</ul>";
					resultArea.append(html);
					search_users(query);
				});
			});
		};

		init();

		function searchFor(query) {
			var result = [];
			var values = searchValues.find(".search-value");
			var counter = 0;

			if (values.size() <= 1) {
				values = $("#all_persons").find(".search-value");
			}

			result = get_results(values, query);
	
			return result;
		}
	
		function search_users(query) {
			var result = [];
			userSelects = $("#id_users");
			select_users();
	
			if (userSelects != null) {
				var options = userSelects.find("option");
				result = get_results(options, query);
			}
	
			return result;
		}
	
		function get_results(array, query) {
			var result = [];
			var counter = 0;
	
			if (typeof array != "undefined" && typeof query != "undefined") {
	
				$.each(array, function(key, value) {
					var currValue = $(value);
					var word = currValue.find(".text").text();
					var _query = query.toLowerCase();
					word = word.toLowerCase();

					if (word.indexOf(_query) > -1 && _query.length > 0) {
						var clone = currValue.clone();
						clone.replaceWith(currValue);
						currValue = currValue.css("opacity", 1);
						result[counter] = currValue[0];
						counter++;
					}
				});
			}
	
			return result;
		}
	
		function select_users() {
			var user_list = $(".users-list");
	
			$(".search-value.user.button").click(function() {
				var clickedUser = $(this);
				var id = clickedUser.data("id");

				$.each(userSelects.find("option"), function(key, option) {
					option = $(option);
					var value = option.attr("value");

					if (value == id) {

						if (option.is(':selected')) {
							option.attr('selected', false);
							user_list.html("<b>Schüler " + option.text() + " entfernt!</b>");
						}
						else {
							option.attr('selected', true);
							user_list.html("<b>Schüler " + option.text() + " hinzugefügt!</b>");
						}
					}
				});
			});
		}
	});
};