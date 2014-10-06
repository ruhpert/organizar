var AJAX = (function(_this, $) {
	_this.post = function(url, data) {
		_data = {'form_type' : 'member_registration', "csrfmiddlewaretoken":csrf_token};
		data["csrfmiddlewaretoken"] = $(csrf_token).attr("value");
		console.log("~~~~~~~~~~ REQUEST POST ~~~~~~~~~~~~");
		console.log(data);
		console.log(csrf_token);
		console.log("csrf token = ", $(csrf_token).attr("value"));

		$.ajax({
			url: url,
			type: "POST",
			data: data,
			beforeSend: function( xhr, settings ) {
				xhr.overrideMimeType( "application/json; charset=x-user-defined" );
	
                                if (!csrfSafeMethod(settings.type)) {
					console.log("~~~~~~~~~~~~~~~~");
					console.log("csrf token send!");
                                	xhr.setRequestHeader("X-CSRFToken", csrf_token);
                                }
				else {
					console.log("CSRF TOKEN NOT SEND!")
				}
                        }
		}).done(function( data ) {
			if ( console && console.log ) {
				console.log( "Sample of data:", data.slice( 0, 100 ) );
			}
		}).fail(function() {
			console.log( "error" );
		}).always(function() {
			console.log( "complete" );
		});
	}


	return _this;

}({}, jQuery));
