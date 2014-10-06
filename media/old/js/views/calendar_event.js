
$(document).ready(function() {
	console.log("MAKING AJAX REQUEST");
	var events = AJAX.post("/",event_data);
	var output = Mustache.render("{{title}} spends {{calc}}", event_data);
	console.log(output);
});
