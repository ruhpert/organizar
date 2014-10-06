from django.contrib import admin
from _user.models import Person, Subject, Grade, School, Child_Contact, Billing_Type, Billing_Contact

admin.site.register(Person)
admin.site.register(Subject)
admin.site.register(Grade)
admin.site.register(School)
admin.site.register(Child_Contact)
admin.site.register(Billing_Type)
admin.site.register(Billing_Contact)

