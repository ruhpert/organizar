from django.conf.urls import patterns, url
from _user.views import menu_handle_user
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns(
    url(r'^handle_user/$', menu_handle_user, name='menu_handle_user'),
)
