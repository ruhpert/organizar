from django.contrib import admin
from _billing.models import Contract_Type, Contract, Charge, Frequency, Duration, Discount


admin.site.register(Contract)
admin.site.register(Contract_Type)
admin.site.register(Charge)
admin.site.register(Frequency)
admin.site.register(Duration)
admin.site.register(Discount)
