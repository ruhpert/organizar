from django.conf.urls import patterns, url
from _utils.views import serve_data, send_a_mail, load_mail_menu, logout_user
from _utils.models import HelloWorld
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^data/$', serve_data, name='placeholder'),
    url(r'^send_mail/$', send_a_mail, name='send_mail'),
    url(r'^load_mail_menu/$', load_mail_menu, name='load_mail_menu'),
    url(r'^data/(?P<key>.*)/(?P<action>.*)/$', serve_data, name='serve_data'),
    #url(r'^hello/$', HelloWorld.as_view())
    url(r'^logout/$', logout_user, name='logout_user'),
)
