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
        self.response.out.write("question get")
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
        self.response.out.write("question put")
    def delete(self):
        self.response.out.write("question delete")

class QuestionsHandler(webapp.RequestHandler):
    def get(self):
        questions = []
        for question in Question.all():
            questions.append({
                "id":question.key().id(),
                "title" : question.title,
                "code":question.code,
                "answer":question.answer,
                "question":question.question,
                "variable":question.variable
                })
        self.response.out.write(simplejson.dumps(questions))
        
def main():
    application = webapp.WSGIApplication([
        ('/programing/question', QuestionHandler),
        ('/programing/questions', QuestionsHandler),
        ('/programing.*', MainHandler),
                                          ],
                                         debug=True)
    util.run_wsgi_app(application)



if __name__ == '__main__':
    main()
