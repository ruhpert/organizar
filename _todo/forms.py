from django.forms import ModelForm
from django import forms
from _todo.models import Todo
from django.contrib.auth.models import User

CHOICES=[
         ("False",'Offen'),
	 ("True",'Erledigt')]

class Todo_Form(ModelForm):
	text = forms.CharField( widget=forms.Textarea )


	class Meta:
		model = Todo
		exclude = []

	def __init__(self, *args, **kwargs):
		super(ModelForm, self).__init__(*args, **kwargs)
		self.fields['users'].queryset = User.objects.order_by('last_name')
