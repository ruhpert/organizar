def set_session_var(key=None, value=None, request=None):
    if key != None and value != None and request != None:
        request.session[key] = value
