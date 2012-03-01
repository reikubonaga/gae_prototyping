#!/usr/bin/env python

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
import simplejson

class User(db.Model):
    user = db.UserProperty()
    facebook_id = db.StringProperty()

class Question(db.Model):
    title = db.StringProperty()
    question = db.TextProperty()
    variable = db.TextProperty()
    answer = db.TextProperty()
    code = db.TextProperty()

class MainHandler(webapp.RequestHandler):
    def get(self):
        self.response.out.write('I am Rei')

class QuestionHandler(webapp.RequestHandler):
    def get(self):
        id = self.request.get("id")
        if not id:
            self.response.out.write("error")
        question = Question.get_by_id(int(id))
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
        question = Question(
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
        question = Question.get_by_id(int(id))
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
        question = Question.get_by_id(int(id))
        #question.delete()

class QuestionsHandler(webapp.RequestHandler):
    def get(self):
        questions = []
        for question in Question.all():
            questions.append({
                "id":question.key().id(),
                "title" : question.title,
                "question":question.question
                })
        self.response.out.write(simplejson.dumps(questions))
        
def main():
    application = webapp.WSGIApplication([
        ('/blogcontents/wget', WgetHandler),
        ('/blogcontents.*', MainHandler),
                                          ],
                                         debug=True)
    util.run_wsgi_app(application)



if __name__ == '__main__':
    main()
