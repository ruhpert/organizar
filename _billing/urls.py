from django.conf.urls import patterns, include, url
from _billing.views import handle_contract, handle_cash_payer
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns(
	url(r'^contract/new/$', handle_contract, name='handle_contract'),
	url(r'^contract/(?P<contract_id>.*)/$', handle_contract, name='handle_contract'),
	url(r'^handle_cash_payer/$', handle_cash_payer, name='handle_cash_payer'),
	
	
)
