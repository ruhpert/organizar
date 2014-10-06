from django.contrib import admin
from _calendar.models import Event, Event_Group, Topic, Room, Category, Event_Person_Grading, Not_At_Event_Person

admin.site.register(Event)
admin.site.register(Event_Group)
admin.site.register(Topic)
admin.site.register(Room)
admin.site.register(Category)
admin.site.register(Event_Person_Grading)
admin.site.register(Not_At_Event_Person)
