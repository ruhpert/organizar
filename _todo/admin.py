from django.contrib import admin
from _todo.models import Todo, Todo_Category, Todo_Priority



class TodoAdmin(admin.ModelAdmin):
	list_filter = ['done']

admin.site.register(Todo, TodoAdmin)
admin.site.register(Todo_Category)
admin.site.register(Todo_Priority)
