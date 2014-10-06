from django import forms
from _calendar.models import Event, Event_Group, Not_At_Event_Person, Event_Person_Comment, Event_Person_Grading
from django.forms import ModelForm
from django.contrib.admin import widgets
from django.contrib.auth.models import User

class LoginForm(forms.Form):
	email = forms.CharField(max_length=100)
	password = forms.CharField(widget=forms.PasswordInput())

class Event_Serie_Form(ModelForm):
	name = forms.CharField(error_messages={'required': 'Kein Name!'})
	#date = forms.CharField(widget=forms.HiddenInput)
	#start_time = forms.DateTimeField(input_formats=('%H:%M',), error_messages={'required': 'Datumsformat ist hh:mm z.B. 10:30'})
	#end_time = forms.DateTimeField(input_formats=('%H:%M',), error_messages={'required': 'Datumsformat ist hh:mm z.B. 10:30'})
	#users = forms.MultipleChoiceField(required=False, widget=forms.CheckboxSelectMultiple, choices={"test":"test", "test":"test"})

	class Meta:
		model = Event
		widgets = {
			#'date' : widgets.AdminDateWidget(format='%d.%m.%Y'),
			#'start_time' : widgets.AdminTimeWidget(format='%H:%M'),
			#'end_time': widgets.AdminTimeWidget(format='%H:%M'),
			#'date' : widgets.AdminDateWidget(format='%d.%m.%Y'),
			#'start_time': widgets.AdminTimeWidget(format='%H:%M'),
		}
		exclude = []

	def __init__(self, *args, **kwargs):
		super(ModelForm, self).__init__(*args, **kwargs)
		self.fields['date'].widget.format = '%d.%m.%Y'
		self.fields['date'].input_formats = ['%d.%m.%Y','%Y-%m-%d']
		self.fields['start_time'].widget.format = '%d.%m.%Y %H:%M'
		self.fields['start_time'].input_formats = ['%d.%m.%Y %H:%M']
		self.fields['end_time'].widget.format = '%d.%m.%Y %H:%M'
		self.fields['end_time'].input_formats = ['%d.%m.%Y %H:%M']
		self.fields['users'].queryset = User.objects.order_by('last_name')
		self.fields['lead'].queryset = User.objects.order_by('last_name')
		self.fields['name'].widget.attrs['readonly'] = "readonly"

class Event_Group_Form(ModelForm):
	#name = forms.CharField(widget=forms.HiddenInput)
	#start_date = forms.DateTimeField(input_formats=('%d.%m.%Y',), error_messages={'required': 'Datumsformat ist hh:mm z.B. 01.01.2000'})
	#end_date = forms.DateTimeField(input_formats=('%d.%m.%Y',), error_messages={'required': 'Datumsformat ist hh:mm z.B. 01.01.2000'})

	class Meta:
		model = Event_Group
		exclude = []
		#widgets = {
		#	'start_date' : widgets.AdminTimeWidget(format='%d.%m.%Y'),
		#	'end_date': widgets.AdminTimeWidget(format='%d.%m.%Y'),
		#}
	def __init__(self, *args, **kwargs):
		super(ModelForm, self).__init__(*args, **kwargs)
		self.fields['start_date'].widget.format = '%d.%m.%Y'
		self.fields['start_date'].input_formats = ['%d.%m.%Y','%Y-%m-%d']
		self.fields['end_date'].widget.format = '%d.%m.%Y'
		self.fields['end_date'].input_formats = ['%d.%m.%Y','%Y-%m-%d']
		self.fields['name'].widget.attrs['readonly'] = "readonly"

class Event_Form(ModelForm):
	name = forms.CharField(error_messages={'required': 'Kein Name!'})
	#start_time = forms.DateTimeField(input_formats=('%H:%M',), error_messages={'required': 'Datumsformat ist hh:mm z.B. 10:30'})
	#end_time = forms.DateTimeField(input_formats=('%H:%M',), error_messages={'required': 'Datumsformat ist hh:mm z.B. 10:30'})
	#users = forms.MultipleChoiceField(required=False, widget=forms.CheckboxSelectMultiple, choices={"test":"test", "test":"test"})

	class Meta:
		model = Event
		widgets = {
			#'date' : widgets.AdminDateWidget(format='%d.%m.%Y'),
			#'start_time' : widgets.AdminTimeWidget(format='%H:%M'),
			#'end_time': widgets.AdminTimeWidget(format='%H:%M'),
			#'date' : widgets.AdminDateWidget(format='%d.%m.%Y'),
			#'start_time': widgets.AdminTimeWidget(format='%H:%M'),
		}
		exclude = []

	def __init__(self, *args, **kwargs):
		super(ModelForm, self).__init__(*args, **kwargs)
		self.fields['date'].widget.format = '%d.%m.%Y'
		self.fields['date'].input_formats = ['%d.%m.%Y','%Y-%m-%d']
		self.fields['start_time'].widget.format = '%H:%M'
		self.fields['start_time'].input_formats = ['%H:%M']
		self.fields['end_time'].widget.format = '%H:%M'
		self.fields['end_time'].input_formats = ['%H:%M']
		self.fields['users'].queryset = User.objects.order_by('last_name')
		self.fields['lead'].queryset = User.objects.order_by('last_name')
		self.fields['name'].widget.attrs['readonly'] = "readonly"

class Not_At_Event_Form(ModelForm):

	class Meta:
		model = Not_At_Event_Person
		exclude = []
		#fields = ['pub_date', 'headline', 'content', 'reporter']

class Event_Person_Comment_Form(ModelForm):
	comment = forms.CharField( widget=forms.Textarea)
	#user = forms.ChoiceField(widget=forms.HiddenInput())
	#event = forms.ChoiceField(widget=forms.HiddenInput())
	class Meta:
		model = Event_Person_Comment

class Event_Person_Grading_Form(ModelForm):
	id = forms.IntegerField(widget = forms.HiddenInput)
	class Meta:
		model = Event_Person_Grading
		widgets = {'event': forms.HiddenInput, 'user': forms.HiddenInput, } #"grading" : forms.Textarea,
		exclude = []