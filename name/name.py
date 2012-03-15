from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

from google.appengine.api import urlfetch
import simplejson
import wsgiref.handlers
from google.appengine.ext.webapp import template
import re
import os

class Name_Url(db.Model):
    id = db.StringProperty(required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    updated = db.DateTimeProperty(auto_now=True)
    url = db.StringProperty(required=True)
    id_arr = db.StringListProperty(required=True)
    class_arr = db.StringListProperty(required=True)

class MainHandler(webapp.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), "templates", "index.htm")
        self.response.out.write(template.render(path, {}))

class FetchHandler(webapp.RequestHandler):
    def get(self):
        url = self.request.get("url")
        refresh = self.request.get("refresh")
        if not refresh:
            s = Name_Url.gql("where url = :1",url).get()
            if s:
                self.response.out.write("have")
                return
        result = urlfetch.fetch(url)
        class_arr = []
        id_arr = []
        if result.status_code == 200:
            first = 0
            loop = True
            p = re.compile('class="(.*?)"')
            while loop:
              m = p.search(result.content,first)
              if not m == None:
                  first = m.end()
                  class_arr2 = m.groups()[0].split(" ")
                  for c in class_arr2:
                      if c != "":
                          class_arr.append(c)
              else:
                  loop = False
            first = 0
            loop = True
            p = re.compile('id="(.*?)"')
            while loop:
              m = p.search(result.content,first)
              if not m == None:
                  first = m.end()
                  id_arr.append(m.groups()[0])
              else:
                  loop = False
        
            class_arr = sorted(set(class_arr), key=class_arr.index)
            class_arr.sort()
            id_arr = sorted(set(id_arr), key=id_arr.index)
            id_arr.sort()
            
            self.response.out.write(simplejson.dumps({
                "id":id_arr,
                "class" : class_arr
            }))

class V1MainHandler(webapp.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), "templates", "v1.htm")
        self.response.out.write(template.render(path, {}))

def main():
    application = webapp.WSGIApplication([
        ('/name/v1', V1MainHandler),
        ('/name/fetch', FetchHandler),
        ('/name', MainHandler),
                                          ],
                                         debug=True)
    util.run_wsgi_app(application)

if __name__ == '__main__':
    main()
