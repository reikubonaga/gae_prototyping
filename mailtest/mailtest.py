#!/usr/bin/env python

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
import simplejson
import logging, email
from google.appengine.ext.webapp.mail_handlers import InboundMailHandler 

class MainHandler(InboundMailHandler):
    def receive(self, mail_message):
        logging.info("Received a message from: " + mail_message.sender)
        
def main():
    application = webapp.WSGIApplication([MainHandler.mapping()], debug=True)
    util.run_wsgi_app(application)

if __name__ == '__main__':
    main()
