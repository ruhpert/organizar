# coding=UTF-8

from django.core import serializers
from _user.models import Person
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from _calendar.models import Event, Event_Person_Comment, Not_At_Event_Person
from datetime import datetime, timedelta
import json
import time
import traceback
import sys
import gc
from django.core.mail import send_mail
from django.template import RequestContext, loader
from django.utils.dateformat import DateFormat
from django.http import HttpResponseRedirect
from django.contrib.auth import logout

@login_required(login_url='/')
def logout_user(request=None):
    if request.user:
        logout(request)
    return HttpResponseRedirect('/')

@login_required(login_url='/')
def load_mail_menu(request=None, message=""):

    context = RequestContext(request, {
        "message" : message,
    })

    template = loader.get_template('base/content/mail.html')

    return HttpResponse(template.render(context))

@login_required(login_url='/')
def send_a_mail(request=None):
    load = request.POST.get("load", "")
    data = get_data_for_mail(load)
    print "data " + str(data) 
    print "load " + str(load)
    html = str(data)
    impressum = "\n\n\n\n" + "Bildungszentrum Rheinfelden \n" + "Pauline Lewens \n" + "Karl-Fürstenberg-Str. 13 \n" + "79618 Rheinfelden \n\n" + "T: 0049 (0)7623 6808 \n" + "E: info@bildungszentrum-rheinfelden.de \n\n" 
    
    html = html + impressum
    
    try:
        send_mail('Überbelegte Stunden', html, 'Bildungszentrum Rheinfelden <info@bildungszentrum-rheinfelden.de>',
        ['robert.eisele@tlsdp.com'], fail_silently=False)
        message = "Sie haben erfolgreich die Überbelegten Stunden angefragt. \n Sie sollten nun eine E-Mail erhalten haben."
    except:
        message = "Leider hat da etwas nicht funktioniert... \n Bitte versuchen Sie es noch einmal und wenn der Fehler wieder auftritt, wenden Sie sich an den technischen Support. \n\n\n\n " + str(traceback.print_exc()) + ""
        traceback.print_exc()

    return load_mail_menu(request, message)

def get_data_for_mail(load):
    result = None

    if (load == "overloaded_events"):
        events = Event.objects.all()
        overloaded_events = []
        text = "==================== Überbelegte Stunden ==================== \n\n"
        tmp_text = ""
        i = 0
        n = 0

        for event in events:
            try:
                a = event
                b = events[(i+1)]
    
                if (a.room == b.room and 
                    ((a.start_time <= b.start_time and a.end_time > b.start_time) or 
                    (a.start_time < b.end_time and a.end_time >= b.end_time))):

                    f_a_date = DateFormat(a.date)
                    f_b_date = DateFormat(b.date)
                    date_is_equal = f_a_date.format("d.m.Y") == f_b_date.format("d.m.Y")
                    lead_exists = a.lead and b.lead

                    if (lead_exists and date_is_equal):
                        tmp_text = tmp_text + " - " + str(f_a_date.format("d.m.Y")) + " um " +  a.start_time.strftime("%H:%M") + " im: " + str(a.room) + " " + str(a.lead.last_name) + " " + str(a.lead.first_name) + " und " + str(b.lead.last_name) + " " + str(b.lead.first_name) + "\n"
                        n = n + 1
            except:
                traceback.print_exc()
            i = i + 1

        text = text + " Es wurden " + str(n) + " Konflikte entdeckt! \n\n\n"
        text = text + tmp_text
        text = text + "\n\n=============================================================\n\n"
        result = text

    return result

@login_required(login_url='/')
def serve_data(request=None):
    gc.disable()
    print("serving data")
    data = {}

    if request.method == 'POST':
        key = request.POST.get('key', None)
        _days = request.POST.get('days', None)
        _day = request.POST.get("day", None)
        data = serializers.serialize("json", Person.objects.all())
        start_time = time.clock()
        end_time = None
        try:
            _day = datetime.strptime(_day, '%Y-%m-%d')
        except:
            sys.exc_info()[0]
            _day = None
            print ("day is none using today " + str(_day))


        if _days == None:
            _days = 1
        else:
            _days = int(_days)

        if key == "events":
            days = {}
            json_events = []
            events = []
            now = datetime.now()
            if _day == None:
                _day = now
            #print ("DATE " + str(_day));
            min_date = _day#timedelta(days=int(-_days)) + _day
            max_date = _day#timedelta(days=int(_days)) + _day
#             min_month = min_date.month
#             max_month = max_date.month
#             min_year = min_date.year
#             max_year = max_date.year
#             print "test"
#             try:
#                 min_days = min_date.day
#                 max_days = max_date.day
#             except:
#                 traceback.print_exc()
            former_date = None
            day_counter = 0

            try:
                #print ("min date " + str(min_date))
                #print ("max date " + str(max_date))
                logged_in_user = request.user
                if (logged_in_user != None and logged_in_user.is_superuser):
                    print ("is superuser")
                    events = Event.objects.all()
                    print(events)
                    print(_day)
                    print("day " + str(_day.day))
                    events = Event.objects.filter(date__year=_day.year, date__month=_day.month, date__day=_day.day)#(date__gt=min_date, date__lt=max_date)
                else:
                    events = Event.objects.filter(date = _day, lead = logged_in_user)#(date__gt=min_date, date__lt=max_date)
                #print ("found " + str(len(events)) + " events")
                user_is_superuser = request.user.is_superuser
                print(events)
                for event in events:
                    day_list = None
                    lead = event.lead
                    _event = {}
                    month_date = int(event.date.month)
                    day_date = int(event.date.day)
                    hour_date = int(event.date.hour)
                    minute_date = int(event.date.minute)
                    hour_start_time = int(event.start_time.hour)
                    minute_start_time = int(event.start_time.minute)
                    hour_end_time = int(event.end_time.hour)
                    minute_end_time = int(event.end_time.minute)

                    if hour_start_time < 10:
                        hour_start_time = "0" + str(hour_start_time)
           
                    if minute_start_time < 10:
                        minute_start_time = "0" + str(minute_start_time)
                       
                    if hour_end_time < 10:
                        hour_end_time = "0" + str(hour_end_time)
           
                    if minute_end_time < 10:
                        minute_end_time = "0" + str(minute_end_time)
           
                    if hour_date < 10:
                        hour_date = "0" + str(hour_date)
           
                    if minute_date < 10:
                        minute_date = "0" + str(minute_date)
                       
                    if day_date < 10:
                        day_date = "0" + str(day_date)
                   
                    if month_date < 10:
                        month_date = "0" + str(month_date)
           
                    _event["user_is_superuser"] = user_is_superuser

                    if lead != None:
                        if lead.first_name and lead.last_name:
                            _event["lead"] = str(lead.last_name.encode('utf-8') + " " + str(lead.first_name[0].encode('utf-8')) + ".")
           
                        elif lead.last_name:
                            _event["lead"] = str(lead.last_name.encode('utf-8'))
                        else:
                            _event["lead"] = "Kein Lehrer"

                        _event["lead_id"] = str(lead.id)

                        if hasattr(lead, "person"):
                            _event["lead_phone"] = str(lead.person.phone)
                            _event["lead_mobile"] = str(lead.person.mobile)

                    date_as_string = str(day_date) + "." + str(month_date) + "." + str(event.date.year) 
                    date_as_utc = str(event.date.year) + "-" + str(month_date) + "-" + str(day_date)

                    _event["date"] = date_as_string
                    _event["day_of_week"] = event.date.strftime("%A")
                    _event["date_as_utc"] = date_as_utc
                    _event["start_time"] = str(hour_start_time) + ":" + str(minute_start_time)
                    _event["end_time"] = str(hour_end_time) + ":" + str(minute_end_time)
                    _event["id"] = event.id

                    if event.room:
                        _event["room"] = int(event.room.id)
                    else:
                        _event["room"] = 0
          
                    if event.event_group:
                        _event["event_group"] = int(event.event_group.id)
                    else:
                        _event["event_group"] = 0
          
                    if event.category:
                        _event["category"] = str(event.category)
                        _event["category_small"] = str(event.category).lower()
                    else:
                        _event["category"] = "Kein Fach"
          
                    user_list = []
     
                    if event.users.all() != None:
                        for user in event.users.all():
                            _user = {}
                            _user["user_name"] = user.first_name + " " + user.last_name
                            _user["user_id"] = user.id
                            person_found = False
      
                            try:
                                comment = Event_Person_Comment.objects.get(user=user, event=event)
                                _user["comment"] = comment.comment
                            except:
                                comment = None
           
                            try:
                                person_absent = Not_At_Event_Person.objects.get(user=user, event=event)    
                                _user["person_absent"] = True
                            except:
                                person_absent = None
                                
                            try:
                                person_not_excused = Not_At_Event_Person.objects.get(user=user, event=event)    
                                _user["person_not_excused"] = (person_not_excused.excused == False)
                                _user["person_not_excused_comment"] = person_not_excused.comment
                            except:
                                person_not_excused = None

                            try:    
                                person = user.person
                                if person:
                                    person_found = True
                                    _user["user_phone"] = str(person.phone)
                                    _user["user_mobile"] = str(person.mobile)
                            except:
                                hellO="hello"
                            user_list.append(_user)
          
                    _event["user_list"] = user_list
           
                    # new day 
                    if (former_date == None or former_date < event.date) or date_as_utc not in days:
                        day_counter = day_counter + 1
                        day_list = []
                    # already existing date                
                    else:
                        day_list = days[date_as_utc]#
           
                    if day_list != None:
                        day_list.append(_event)
                        days[date_as_utc] = day_list
                    elif _event != None:
                        day_list = []
                        day_list.append(_event)
                        days[date_as_utc] = day_list
                    former_date = event.date

                if (len(days) == 0):
                	data = {}
                else:
                	data = json.dumps(days)
                #print ("...done")
            except:
                traceback.print_exc(file=sys.stdout)

    
            try:
                end_time = time.clock()
                #print (str(end_time))
                delta =  end_time - start_time
                #print ("end time ") + str(end_time)
                #print ("start time ") + str(start_time)
                #print ("load took ") + str(delta);
            except:
                print ("could not get end time")
	 #response = JsonResponse(content=data, status=201)
    return JsonResponse(data, safe=False)