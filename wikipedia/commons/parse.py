#!/usr/bin/python
# -*- coding:utf-8 -*-
# vim:shiftwidth=2:autoindent:et
import sys
reload(sys)
sys.setdefaultencoding("utf-8")
import re
import xml
from xml.sax import make_parser, handler
from xml.utils.iso8601 import parse

import psycopg2
from psycopg2.extensions import adapt

import wikiparser
from config import *

try:
  import psyco
  psyco.full()
except ImportError:
  pass

typeof = type

def sqlesc(value):
  adapted = adapt(value.encode('utf-8'))
  if hasattr(adapted, 'getquoted'):
    adapted = adapted.getquoted()
  return adapted

def pgconn(_host,_user,_pass,_data):
  if not _data:
    return pgconn(pghost,pguser,pgpass,pgdata)
  conn = "dbname='%s'" % _data
  if _host:
    conn = conn + " host='%s'" % _host
  if _user:
    conn = conn + " user='%s'" % _user
  if _pass:
    conn = conn + " password='%s'" % _pass
  return psycopg2.connect(conn)

pg = pgconn(pghost,pguser,pgpass,pgdata)
cc=pg.cursor()

cc.execute("DELETE FROM wpc_img");

class xmlWikiParser(handler.ContentHandler):
  def __init__(self, filename):
    self.page = {}
    self.tag = None
    self.text = ""
    self.debug = 3
    self.count = 0
    try:
      parser = make_parser()
      parser.setContentHandler(self)
      parser.parse(filename)
    except xml.sax._exceptions.SAXParseException:
      sys.stderr.write( "Error loading %s\n" % filename)

  def startElement(self, name, attrs):
    if self.debug > 4:
      print "BEGIN TAG %s" % name
    if name == 'page':
      self.page = {}
    self.tag = name
    self.text = ""

  def characters(self, contents):
    if self.debug > 4:
      print "CTYPE %s" % str(typeof(contents))
      print "CONTENTS ###\n%s\n###" % contents
    if self.tag:
      self.text = self.text + contents
    #if self.tag in ['title', 'text']:
  
  def endElement(self, name):
    if self.debug > 4:
      print "END TAG %s" % name
    if self.tag == 'title':
      self.page['title'] = self.text
    if self.tag == 'text':
      self.text = self.text.replace('\n', ' ').replace('\r', '')
      if re.search('^File:', self.page['title']):
        meta = wikiparser.parse(self.text)
        if meta.has_key("lat") and meta.has_key("lon"):
          if not meta.has_key("desc"):
            meta["desc"] = re.sub(ur'\.[^\.]+$', '', self.page['title'].replace('File:', '', 1))
          # take only first paragraph from description
          m = re.compile(ur'<p>(.+?)</p>', re.M|re.S).search(meta["desc"])
          if m:
            meta["desc"] = m.group(1)
          print "%d>%s: [%s,%s] [%s]" % (self.count, self.page['title'], meta['lat'], meta['lon'], meta['desc'])
          # FIXME validate lat and lon as float
          try:
            q = u"INSERT INTO wpc_img (page, \"desc\", point) VALUES(%s,%s,ST_SetSRID(ST_MakePoint(%lf,%lf),4326))" % (sqlesc(self.page['title']), sqlesc(meta['desc']), float(meta['lat']), float(meta['lon']))
            #print q
            cc.execute(q)
          except ValueError:
            print "ValueError: meta=%s" % repr(meta)
            pass
          self.count = self.count + 1
          #if self.count % 1000 == 0:
          #  pg.commit()
          #if self.count > 1000:
          #  pg.commit()
          #  sys.exit(0)
    self.tag = None

xmlWikiParser(sys.stdin)
pg.commit()
