from django.conf.urls import patterns, include, url
from _todo.views import handle_todo
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
	url(r'^handle_todo/$', handle_todo, name='handle_todo'),
	url(r'^handle_todo/(?P<todo_id>.*)/$', handle_todo, name='handle_todo'),
) 
