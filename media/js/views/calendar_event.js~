
$(document).ready(function() {
	console.log("MAKING AJAX REQUEST");
	var events = AJAX.post("/",event_data);
	var output = Mustache.render("{{title}} spends {{calc}}", event_data);
	console.log(output);


});

var Calendar_View = (function(_this, $) {
	_this.template_event = 
		'<li class="event clear {{ date }} {{ category_small }}" data-date="{{ date_as_utc }}">' +
			'<div class="visible-data">' +
				'<h5 class="time" style="color: black; font-size: 16px;">{{ start_time }} bis {{ end_time }}</h5>' +
				'<h6>{{ date }}</h6><br/>' +
				'<b>Lehrer: {{ lead }}</b><br />' +
				'<span><b>Fach:</b> {{ category }}<br/>' +
				'<b>Raum:</b> {{ room }}</span><br/>' +
				'<b>Schüler</b><br/>' +
				'{{#user_list}}' +
						'<span class="user-data">{{ user_name }}, </span>'+
				'{{/user_list}}' +
			'</div>' +
			'<div class="hidden-data hidden {{ category_small }}">' +
				'<div class="data clear">' +
					'<h4 class="time" style="color: black;"> {{ start_time }} bis {{ end_time }} </h4><h5>{{ date }}</h5>' +
					'<span><b>Lehrer:</b> {{ lead }}' +
					'<a class="button" href="/person/edit/{{ lead_id }}/">'+
						'<img src="/media/img/edit.png" alt="edit"/>'+
					'</a>'+
					'<br/><b>Fach:</b> {{ category }}<br/><b>Raum:</b> {{ room }} <br/>' +
					'<ul class="users">' +
					'{{#user_list}}' +
						'<li>'+
							'<span class="user-data">{{ user_name }} <br/> {{ user_phone }}</span>'+
							'<a class="button" href="/person/edit/{{ user_id }}/">'+
								'<img src="/media/img/edit.png" alt="edit"/>'+
							'</a>'+
						'</li>'+
					'{{/user_list}}' +
					'</ul>'+
					'<div class="menu">'+
						'<a class="button" href="/event/{{ id }}/edit/">Stunde <img src="/media/img/edit.png" alt="edit"/></a>' +
						'<a class="button delete" href="/event/{{ id }}/delete/">Stunde <img src="/media/img/delete.png" alt="delete"/></a>' +
						'<a class="button" href="edit/group/{{ event_group }}/{{ id }}/">Serie <img src="/media/img/edit.png" alt="edit"/></a>' +
						'<a class="button delete" href="delete/group/{{ event_group }}/">Serie <img src="/media/img/delete.png" alt="delete"/></a>' +
									
					'</div>' +
				'</div>' +
			'</div>' + 
		'</li>';
}({}, jQuery));
