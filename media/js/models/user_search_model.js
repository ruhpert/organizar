


var Search_Model = (function(_this, $) {
	var searchArea = null; // for contract
	var valueArea = null; // for contract

	_this.init = function() {
		search($("#trigger-contract-search"), $("#contract-search-values").find(".search-value.contract"), $("#contract-search-results"), $("#id_contract"));
		searchArea = $(".user-search");
		valueArea = $(".user-search-values");

		add_select("id_contact", $("#add-contract-contact"));
		add_select("id_billing_contact", $("#add-contract-billing-contact"));
	 };

	var search = function(input, values, target, select) {

		input.click(function() {
			$(this).val("");
		});

		input.keyup(function(ev) {
			var currInput = $(this);
			var wantedValue = currInput.val();
			
			target.html("");

			$.each(values, function(key, val) {
				val = $(val);
				var valueText = val.text();

				if (valueText.indexOf(wantedValue) > -1) {
					var clone = val.clone().appendTo(target);
					clone.click(function() {
						var id = $(val).data("id");
						var select_options = select.find("option");
						select_options.attr('selected', false);
						$.each(select_options, function(key, option) {
							option = $(option);
							var value = option.val();
							if (value == id) {
								if (option.is(':selected')) {
									option.attr('selected', false);
									target.html("<b>Schüler " + option.text() + " entfernt!</b>");
								}
								else {
									option.attr('selected', true);
									target.html("<b>Schüler " + option.text() + " hinzugefügt!</b>");
								}
							}
						});
					});
				}
			});
		});
	};

	// for contract
	var add_select = function(select_id, input) {
		var select = $("#" + select_id);
		var resultTarget = searchArea.find(".results");
		var values = valueArea.find(".search-value");
	
		select.parent().hide();
	
		input.click(function() {
			$(this).val("");
		});

		input.keyup(function(ev) {
			var currInput = $(this);
			var currResultTarget = currInput.parent().find(".results");
			var inputTarget = $("#target_" + select_id);
			var wantedValue = currInput.val();
	
			console.log("inputTarget ", inputTarget);
			console.log("target id " + "target_" + select_id);
	
			currResultTarget.html("");
	
			$.each(values, function(key, val) {
				var val = $(val);
				var valueText = val.text();
	
				if (valueText.indexOf(wantedValue) > -1) {
					var clone = val.clone().appendTo(currResultTarget);
	
					clone.click(function() {
						var id = $(val).data("id");
						var name = $(val).data("name");
						var select_options = select.find("option");
	
						select_options.attr('selected', false);
	
						$.each(select_options, function(key, option) {
							var option = $(option);
							var value = option.val();
	
							if (value == id) {
								if (option.is(':selected')) {
									option.attr('selected', false);
									currResultTarget.html("<b>Schüler " + name + " entfernt!</b>");
									inputTarget.val("");
									console.log("deselected ", option);
								}
								else {
									option.attr('selected', true);
									currResultTarget.html("<b>Schüler " + name + " hinzugefügt!</b>");
									inputTarget.val(name);
									console.log("selected ", option);
								}
								return false;
							}
						});
					});
				}
			});
		});
	};
	return _this;

}({}, jQuery));


//var Search_Model = (function(_this, $) {
//
//	_this.init = function() {
//		console.log("~~~ Search_Model initialized ~~~");
//
//		searchArea = $(".user-search");
//		valueArea = $(".user-search-values");
//
//		add_select("id_contact", $("#add-contract-contact"));
//		add_select("id_billing_contact", $("#add-contract-billing-contact"));
//	};
//
//
//	var add_select = function(select_id, input) {
//		var select = $("#" + select_id);
//		var resultTarget = searchArea.find(".results");
//		var values = valueArea.find(".search-value");
//
//		select.parent().hide();
//
//		input.click(function() {
//			$(this).val("");
//		});
//
//		input.keyup(function(ev) {
//			var currInput = $(this);
//			var currResultTarget = currInput.parent().find(".results");
//			var inputTarget = $("#target_" + select_id);
//			var wantedValue = currInput.val();
//
//			console.log("inputTarget ", inputTarget);
//			console.log("target id " + "target_" + select_id);
//
//			currResultTarget.html("");
//
//			$.each(values, function(key, val) {
//				var val = $(val);
//				var valueText = val.text();
//
//				if (valueText.indexOf(wantedValue) > -1) {
//					var clone = val.clone().appendTo(currResultTarget);
//
//					clone.click(function() {
//						var id = $(val).data("id");
//						var name = $(val).data("name");
//						var select_options = select.find("option");
//
//						select_options.attr('selected', false);
//
//						$.each(select_options, function(key, option) {
//							var option = $(option);
//							var value = option.val();
//
//							if (value == id) {
//								if (option.is(':selected')) {
//									option.attr('selected', false);
//									currResultTarget.html("<b>Schüler " + name + " entfernt!</b>");
//									inputTarget.val("");
//								}
//								else {
//									option.attr('selected', true);
//									currResultTarget.html("<b>Schüler " + name + " hinzugefügt!</b>");
//									inputTarget.val(name);
//								}
//								return false;
//							}
//						});
//					});
//				}
//			});
//		});
//	};
//
//	return _this;
//
//}({}, jQuery));
