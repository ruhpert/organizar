from _todo.forms import Todo_Form
from django.template import RequestContext, loader
from django.http import HttpResponse
from _todo.models import Todo
from _utils.template_utils import set_session_var

def handle_todo(request, todo_id=None):
	form_type = "todo"
	form = Todo_Form(initial={'done': 0})
	template = loader.get_template('base/placeholder.html')	
	print "~~~~~~~~~~~~ HANDLE TODO ~~~~~~~~~~~~"
	info = ""

	if request.method == 'POST':
		try:
			todo = Todo.objects.get(pk=todo_id)
			form = Todo_Form(request.POST, instance=todo)
		except:		
			form = Todo_Form(request.POST)

		if form.is_valid():
			form.save()
			#return HttpResponseRedirect('/calendar')
			print "todo saved"
			info = "Todo gespeichert!"
		else:
			info = "Todo NICHT gespeichert!"

	elif todo_id != None:
		try:
			todo = Todo.objects.get(pk=todo_id)
			form = Todo_Form(instance=todo)
		except:
			print "error could not find todo for id " + str(todo_id)

	context = RequestContext(request, {
		'form': form,
		"info" : info,
		"form_type"   : form_type,
	})
	

	return HttpResponse(template.render(context))
