# coding=UTF-8
from django import forms
from _user.models import Person, Billing_Contact
from django.contrib.auth.models import User
from django.forms import ModelForm

class Person_Form(ModelForm):
	accessibility = forms.CharField(label="Mögliche / unmögiche Termine in der Woche.", required=False, widget=forms.Textarea )
	class Meta:
		model = Person
		#fields = ['pub_date', 'headline', 'content', 'reporter']
		#exclude = ["user"]
		widgets = {'user': forms.HiddenInput}
		exclude = []

class Billing_Contact_Form(ModelForm):
	class Meta:
		model = Billing_Contact
		widgets = {'person': forms.HiddenInput}
		exclude = []
		#exclude = ["person"]

class User_Form(ModelForm):
	id = forms.IntegerField(widget=forms.HiddenInput)
	first_name = forms.CharField(label="Vorname", error_messages={'required': 'Bitte geben Sie den Vornamen ein!'})
	last_name = forms.CharField(label="Nachname", error_messages={'required': 'Bitte geben Sie den Nachnamen ein!'})
	email = forms.EmailField(label="Email", error_messages={'required': 'Bitte geben Sie eine gültige Emailadresse ein! z.B. max_mustermann@gmx.de'})

	class Meta:
		model = User
		exclude = ["password", "is_superuser", "is_staff", "date_joined", "user_permissions", "last_login", "is_active"]#"groups",

#	def __init__(self, *args, **kwargs):
#		super(User_Form, self).__init__(*args, **kwargs)
#		self.helper = FormHelper()
#		self.helper.form_id = 'id-exampleForm'
#		self.helper.form_class = 'blueForms'
#		self.helper.form_method = 'post'
#		self.helper.form_action = 'submit_survey'
 #       	self.helper.layout = Layout(
#            		Fieldset(
#				'Benutzer',
#				'email',
#				'favorite_number',
#				'favorite_color',
#				HTML("""
#					<p>We use notes to get better, <strong>please help us {{ username }}</strong></p>
#				"""),
#				'favorite_food',
#				'notes'
#            		),
#			ButtonHolder(
#				Submit('submit', 'Submit', css_class='button white')
#			)
#        	)

