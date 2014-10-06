# coding=UTF-8

from datetime import date

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import Max
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import RequestContext, loader

from _utils.template_utils import set_session_var
from _billing.forms import Contract_Form
from _billing.models import Contract
from _user.models import Person, Billing_Contact
from _user.forms import Person_Form, User_Form
from _user.views import save_user_form


@login_required(login_url='/')
def handle_cash_payer(request=None):
	cash_payers = Billing_Contact.objects.filter(billing_type=1)
	users = []
	print "---------- cash_payers ------------"
	print cash_payers
	for cash_payer in cash_payers:
		users.append(cash_payer.person)
	context = RequestContext(request, {
		"cash_payers" : users
	})

	template = loader.get_template('base/content/cash_payers.html')

	return HttpResponse(template.render(context))


@login_required(login_url='/')
def handle_contract(request = None, contract_id = None):
	form_type = "contract"
	contract_form = Contract_Form()
	all_users = User.objects.all()
	user_form = User_Form()
	person_form = Person_Form()
	contract = None
	is_new = False
	show_new_user = True
	status_info = "status_info"

	try:
		int(contract_id)
		set_session_var(status_info, "Vertrag bearbeiten", request)
	except:
		set_session_var(status_info, "neuen Vertrag andlegen", request)

	try:
		contract = Contract.objects.get(pk = contract_id)
		contract_form = Contract_Form(instance = contract)
	except:
		print ("could not get any contract")

	if request.method == 'POST':
		post_data = request.POST.copy()

		if contract != None:
			print ("contract exists") + str(contract)
			contract_form = Contract_Form(data=request.POST, instance=contract)
		else:
			print ("new contract")
			next_contract_number = create_next_contract_number()
			post_data.__setitem__("number", next_contract_number)
			contract_form = Contract_Form(data=post_data)
			is_new = True

		if contract_form.is_valid():
			contract = contract_form.save()
			set_session_var(status_info, "Änderung erfolgreich gespeichert!", request)

			if is_new:
				return HttpResponseRedirect('/contract/' + str(contract.pk) + "/")

		else:
			print (contract_form.errors)

			billing_contact_id = request.POST.get('billing_contact', None)
			username = request.POST.get('username', None)
			email = request.POST.get('email', None)

			if (billing_contact_id == None or billing_contact_id == "") and username != None and username != "" and email != None and email != "":
				show_new_user = False
				user = save_user_form(None, request, True)

				if user != None:
					user_form = User_Form(instance = user)

					try:
						person = Person.objects.get(user=user)
						person_form = Person_Form(instance = person)
					except:
						person_form = Person_Form(data = request.POST)
	
					post_data.__setitem__("billing_contact", user.pk)
					contract_form = Contract_Form(data=post_data)

					if contract_form.is_valid():
						contract = contract_form.save()
						set_session_var(status_info, "Änderung erfolgreich gespeichert!", request)
					else:
						set_session_var(status_info, "Fehler: Vertrag konnte nicht gespeichert werden!", request)

				else:
					set_session_var(status_info, "Fehler: Benutzer konnte nicht gespeichert werden!", request)
					user_form = User_Form(data = request.POST)

			else:
				set_session_var(status_info, "Fehler: Bitte füllen Sie alle benötigten Felder aus!", request)

	context = RequestContext(request, {
		"form_user"		: user_form,
		"form_person"	: person_form,
		"all_users"		: all_users,
		"contract_form"	: contract_form,
		"form_type"		: form_type,
		"show_new_user"	: show_new_user,
	})

	template = loader.get_template('base/placeholder.html')

	return HttpResponse(template.render(context))


def create_next_contract_number():
	number = ""
	today = date.today()
	year = str(today.year)
	month = today.month
	new_max = None
	number_max = Contract.objects.all().aggregate(Max('number'))
	number_max = number_max["number__max"]
	len_max = 0
	len_new_max = 0

	try:
		number_max = number_max.split("-")[1]
		len_max = len(number_max)
		new_max = int(number_max) + 1
		len_new_max = len(str(new_max))
	except:
		print ("invalid contract number ") + str(number_max)

	delta = len_max - len_new_max

	for x in xrange(0, delta):
		new_max = "0" + str(new_max)

	if month < 10:
		month = "0" + str(month)
	else:
		month = str(month)

	if new_max != None:
		number = year + month + "-" + str(new_max)

	print ("new contract number ") +  number

	return number


