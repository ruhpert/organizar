from datetime import datetime, timedelta
import json

from django.contrib.auth.decorators import login_required
from restless.views import Endpoint

from _calendar.models import Event, Event_Person_Comment, Not_At_Event_Person


# Create your models here.
class HelloWorld(Endpoint):
    
    def get(self, request):
        start_time = datetime.now()
        print "start"
        print start_time
        end_time = None
        days = {}
        json_events = []
        events = []
        now = datetime.now()
        min_date = timedelta(days=int(-1)) + now
        max_date = timedelta(days=int(1)) + now
        min_month = min_date.month
        max_month = max_date.month
        min_year = min_date.year
        max_year = max_date.year
        former_date = None
        day_counter = 0
        
        where = '%(min_year)s <= YEAR(date) AND %(max_year)s >= YEAR(date) AND (%(min_month)s <= MONTH(date) AND %(max_month)s >= MONTH(date))' % {'min_year': min_year, 'max_year':max_year, 'min_month': min_month, 'max_month':max_month}
        events = Event.objects.extra(where=[where])
        
        print ("found " + str(len(events)) + " events")
        
        for event in events:
            print (str(event))
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
  
            if lead != None:
                if lead.first_name and lead.last_name:
                    _event["lead"] = str(lead.last_name.encode('utf-8') + " " + str(lead.first_name[0].encode('utf-8')) + ".")
  
                elif lead.last_name:
                    _event["lead"] = str(lead.last_name.encode('utf-8'))
                    _event["lead_id"] = str(lead.id)
  
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
        json_events.append(days)


        end_time = datetime.now
        delta = start_time.date - end_time.date
        print ("end time ") + str(end_time)
        print ("start time ") + str(start_time)
        print ("load took") + str(delta);

        print ("serializing events...")
        data = json.dumps(json_events)
        print ("...done")

        name = request.params.get('name', 'World')

        return {'message': 'Hello, %s!' % data}
