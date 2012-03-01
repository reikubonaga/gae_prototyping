# -*- coding: utf-8 -*-
#!/usr/bin/env python

#localhost:8083
FACEBOOK_APP_ID = "191040330938892"
FACEBOOK_APP_SECRET = "24e13ef4216150a55d91014b557df8bc"


from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

import os.path
import wsgiref.handlers
import simplejson
from programing import facebook
from google.appengine.ext.webapp import template

class User(db.Model):
    id = db.StringProperty(required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    updated = db.DateTimeProperty(auto_now=True)
    name = db.StringProperty(required=True)
    profile_url = db.StringProperty(required=True)
    access_token = db.StringProperty(required=True)

class Puser(db.Model):
    user = db.ReferenceProperty(User)

class Pquestion(db.Model):
    title = db.StringProperty()
    question = db.TextProperty()
    variable = db.TextProperty()
    answer = db.TextProperty()
    code = db.TextProperty()
    user = db.ReferenceProperty(Puser)

class Panswer(db.Model):
    answer = db.TextProperty()
    user = db.ReferenceProperty(Puser)

class BaseHandler(webapp.RequestHandler):
    @property
    def current_user(self):
        if not hasattr(self, "_current_user"):
            self._current_user = None
            cookie = facebook.get_user_from_cookie(
                self.request.cookies, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET)
            if cookie:
                # Store a local instance of the user data so we don't need
                # a round-trip to Facebook on every request
                user = User.get_by_key_name(cookie["uid"])
                if not user:
                    graph = facebook.GraphAPI(cookie["access_token"])
                    profile = graph.get_object("me")
                    user = User(key_name=str(profile["id"]),
                                id=str(profile["id"]),
                                name=profile["name"],
                                profile_url=profile["link"],
                                access_token=cookie["access_token"])
                    user.put()
                elif user.access_token != cookie["access_token"]:
                    user.access_token = cookie["access_token"]
                    user.put()
                self._current_user = user
        return self._current_user

    def render(self, path, **kwargs):
        args = dict(current_user=self.current_user,
                    facebook_app_id=FACEBOOK_APP_ID)
        args.update(kwargs)
        path = os.path.join(os.path.dirname(__file__), "templates", path)
        self.response.out.write(template.render(path, args))


class MainHandler(BaseHandler):
    def get(self):
        if not self.current_user:
            self.render("index.html")
            return
        self.render("home.html")

class MyHandler(BaseHandler):
    def get(self):
        user = self.current_user
        if not user:
            self.response.out.write(simplejson.dumps({
                "login":False
                }))
        else:
            self.response.out.write(simplejson.dumps({
                "id":user.id,
                "login":True,
                }))
            
class QuestionHandler(BaseHandler):
    def get(self):
        id = self.request.get("id")
        if not id:
            self.response.out.write("error")
        question = Pquestion.get_by_id(int(id))
        self.response.out.write(simplejson.dumps({
            "id":id,
            "title" : question.title,
            "code":question.code,
            "answer":question.answer,
            "question":question.question,
            "variable":question.variable
            }))
        
    def post(self):
        data = simplejson.loads(self.request.body)
        question = Pquestion(
            title = data["title"],
            code = data["code"],
            answer = data["answer"],
            question = data["question"],
            variable = data["variable"]
        ).put()
        self.response.out.write(simplejson.dumps({
            "id":question.id(),
            "title" : data["title"],
            "code":data["code"],
            "answer":data["answer"],
            "question":data["question"],
            "variable":data["variable"]
            }))
    def put(self):
        data = simplejson.loads(self.request.body)
        id = data["id"]
        if not id:
            self.response.out.write("error")
        question = Pquestion.get_by_id(int(id))
        if "title" in data:
            question.title = data["title"]
        if "code" in data:
            question.code = data["code"]
        if "answer" in data:
            question.answer = data["answer"]
        if "question" in data:
            question.question = data["question"]
        if "variable" in data:
            question.variable = data["variable"]
        question.put()
        self.response.out.write(simplejson.dumps(data))
    def delete(self):
        data = simplejson.loads(self.request.body)
        id = data["id"]
        if not id:
            self.response.out.write("error")
        question = Pquestion.get_by_id(int(id))
        #question.delete()

class QuestionsHandler(webapp.RequestHandler):
    def get(self):
        questions = []
        for question in Pquestion.all():
            questions.append({
                "id":question.key().id(),
                "title" : question.title,
                "question":question.question
                })
        self.response.out.write(simplejson.dumps(questions))
        
def main():
    application = webapp.WSGIApplication([
        ('/programing/question', QuestionHandler),
        ('/programing/questions', QuestionsHandler),
        ('/programing/me', MyHandler),
        ('/programing.*', MainHandler),
                                          ],
                                         debug=True)
    util.run_wsgi_app(application)



if __name__ == '__main__':
    main()
