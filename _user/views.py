# coding=UTF-8

import traceback

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import RequestContext, loader
from _utils.template_utils import set_session_var
from _user.forms import Person_Form, User_Form, Billing_Contact_Form
from _user.models import Person, Billing_Contact

def menu_handle_user(request=None):
	context = RequestContext(request, {
	})

	template = loader.get_template('base/menu/user.html')

	return HttpResponse(template.render(context))

# GET PERSON
def get_person_or_none(user_id=None, user=None):
	person = None

	if user_id != None:
		try:
			person = Person.objects.get(user=user_id)
		except:
			try:	
				person = user.person
			except:
				print ("no person found")

	return person


# GET BILLING CONTACT
def get_billing_contact_or_none(user_id=None, person=None):
	billing_contact = None

	if user_id != None:
		try:
			billing_contact = Billing_Contact.objects.get(person=user_id)
		except:
			try:
				billing_contact = Billing_Contact.objects.get(person=person.id)
			except:
				print ("no billing_contact found")

	return billing_contact


# GET USER
def get_user_or_none(user_id=None, request=None):
	user = None

	if user_id != None:
		try:
			user = User.objects.get(id=user_id)
		except:
			try:
				username = request.POST.get('username', None)
				user = User.objects.get(username=username)
			except:
				print ("second try... no user found")
	else:
		try:
			username = request.POST.get('username', None)
			user = User.objects.get(username=username)
		except:
			print ("second try... no user found")
			traceback.print_exc()

	return user


# EDIT SAVE USER
@login_required(login_url='/')
def handle_user(request=None, user_id=None):

	print ("~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
	print ("~~~~~ EDIT / SAVE USER ~~~~~")
	print ("~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

	form_type = "person"
	NEW_USER = False
	form_person = Person_Form()
	form_user = User_Form()
	form_billing_contract = Billing_Contact_Form()
	info = ""

	if user_id != None and request != None:

		user = get_user_or_none(user_id, request)
		person = get_person_or_none(user_id, user)
		billing_contact = get_billing_contact_or_none(user_id, person)

		##############################
		# POST REQUEST
		##############################
		if request.method == 'POST':

			data = request.POST.copy()

			##############################
			# USER FORM 
			##############################
			user = save_user_form(user, request, NEW_USER)

			if user != None:
				data.__setitem__("id", user.id)
				data.__setitem__("user", user.id)
				data.__setitem__("user_id", user.id)
			##############################
			# PERSON FORM 
			##############################
			person = save_person_form(person, data, request)

			##############################
			# BILLING CONTACT FORM 
			##############################
			billing_contact = save_billing_contact_form(billing_contact, data, request)

			info = "Benutzer gespeichert!"

			if int(user_id) == 0 and user != None:
				return HttpResponseRedirect('/person/new/' + str(user.pk) + "/")

		# PREPARE DEAULT
		if user != None:
			form_user = User_Form(instance=user)
		else:
			if request.method == 'POST':
				form_user = User_Form(data = request.POST)
			else:
				form_user = User_Form()

		if person != None:
			form_person = Person_Form(instance=person)
		else:
			if user != None:
				form_person = Person_Form(initial={'user': user_id}, data = request.POST)
			else:
				if request.method == 'POST':
					form_person = Person_Form(data = request.POST)
				else:
					form_person = Person_Form()
					set_session_var("status_info", "Neuen Benutzer anlegen!", request)
				

		if billing_contact != None:
			form_billing_contract = Billing_Contact_Form(instance=billing_contact)
		else:
			if user != None:
				form_billing_contract = Billing_Contact_Form(initial={'child': user_id}, data = request.POST)
			else:
				if request.method == 'POST':
					form_billing_contract = Billing_Contact_Form(data = request.POST)
				else:
					form_billing_contract = Billing_Contact_Form()

	if user != None:
		user_groups = user.groups
	else:
		user_groups = None

	context = RequestContext(request, {
		"person"				: person,
		"selected_groups"		: user_groups,
		'form_user'				: form_user,
		"form_person"			: form_person,
		"form_billing_contract"	: form_billing_contract,
		"form_type" 			: form_type,
		"info"					: info,
	})

	template = loader.get_template('base/placeholder.html')

	return HttpResponse(template.render(context))

def save_billing_contact_form(billing_contract = None, data = None, request = None):

	if billing_contract != None:
		form_billing_contract = Billing_Contact_Form(data=data, instance=billing_contract)
	else:
		form_billing_contract = Billing_Contact_Form(data=data)

	# CHECK BILLING CONTACT FORM 
	if form_billing_contract.is_valid():
		try:
			billing_contract = form_billing_contract.save()
			print "form billing contact saved"
		except:
			print "form billing contact is not valid" + str(form_billing_contract.errors)
			traceback.print_exc()
	else:
		form_billing_contract = Billing_Contact_Form(request.POST)
		print "form billing contact is not valid" + str(form_billing_contract.errors)

	return billing_contract

def save_person_form(person = None, data = None, request = None):

	if person != None:
		form_person = Person_Form(data=data, instance=person)
	else:
		form_person = Person_Form(data=data)

	# CHECK PERSON FORM 
	if form_person.is_valid():
		try:
			person = form_person.save()
			data.__setitem__("person", person.id)
			print "form person saved!"
		except:
			print "form person is not valid"  + str(form_person.errors)
			traceback.print_exc()
	else:
		form_person = Person_Form(request.POST)
		print "form person is not valid" + str(form_person.errors)

	return person

def save_user_form(user = None, request = None, isNew = False):
	print ("got into the function")
	data = request.POST.copy()
	if user == None:
		user = get_user_or_none(None, request)

	if user == None:
		print "got no user"
		form_user = User_Form(data=data)
	else:
		print "got a user"
		form_user = User_Form(data=data, instance=user)
		data.__setitem__("id", user.id)
		data.__setitem__("user", user.id)
		data.__setitem__("user_id", user.id)

		groups = request.POST.getlist('groups',None)

		if groups != None:
			user.groups.clear()
			user.save()
			for group in groups:
				group = Group.objects.get(pk=group)
				user.groups.add(group)
			user.save()

	# CHECK USER FORM

	# if user is valid save form_user
	if form_user.is_valid():
		user = form_user.save()
		set_session_var("status_info", "Benutzer erfolgreich gespeichert!", request)
		print ("user form saved")

	# if not try to create a new user
	else:
		print form_user.errors
		try:
			username = request.POST.get('username',None)
			first_name = request.POST.get('first_name',None)
			last_name = request.POST.get('last_name',None)
			email = request.POST.get('email',None)
		except:
			print "could not get user data"

		if username != None and username != "" and email != None and email != "":
			password = User.objects.make_random_password()
			user = User.objects.create_user(username, email, password)
			user.first_name = first_name
			user.last_name = last_name
			user.save()
			set_session_var("status_info", "Benutzer erfolgreich gespeichert!", request)
		else:
			set_session_var("status_info", "Benutzer konnte nicht gespeichert werden! Bitte füllen Sie alle nötigen Felder aus!", request)

	if isNew and user != None:
		data.__setitem__("id", user.id)
		data.__setitem__("user", user.id)
		data.__setitem__("user_id", user.id)

		groups = request.POST.getlist('groups',None)

		if groups != None:
			user.groups.clear()
			user.save()
			for group in groups:
				group = Group.objects.get(pk=group)
				user.groups.add(group)
			user.save()

		person = save_person_form(None, data, request)

		if person != None:
			data.__setitem__("person", person.id) 
			save_billing_contact_form(None, data, request)

		#form_person = Person_Form(data=data)

		#if form_person.is_valid():
		#	print "person is valid"
# 			person = form_person.save()
# 			print "person saved"
# 			data.__setitem__("person", person.id) 
# 			form_billing_contract = Billing_Contact_Form(data=data)
# 			print form_billing_contract
# 			if form_billing_contract.is_valid():
# 				form_billing_contract.save()
# 				print "billing form saved"
# 			else:
# 				print "billing form is not valid"
# 				form_billing_contract = Billing_Contact_Form(data=data)
# 				
# 				try:
# 					return HttpResponseRedirect('/calendar')
# 				except:
# 					"could not send redirect"
# 		else:
# 			print "person form is not valid"
# 			form_person = Person_Form(data=data)

	return user