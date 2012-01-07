#!/usr/bin/python
# -*- coding:utf-8 -*-
# vim:shiftwidth=2:autoindent:et
import sys
reload(sys)
sys.setdefaultencoding("utf-8")
import re

import psycopg2
from psycopg2.extensions import adapt

import wikiparser
from config import *

try:
  import psyco
  psyco.full()
except ImportError:
  pass

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
pg.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)

def urllib2_get(url, data = None):
  from urllib2 import build_opener, Request
  o = build_opener()
  user_agent = 'Mozilla/1.0 (compatible; openstreetmap.ru-commons-bot/0.0)'
  headers = {'User-Agent': user_agent, 'Accept':'*/*'}
  r = Request(url, data, headers)
  return o.open(r)

http_get = urllib2_get

def process(page):
  from urllib import quote_plus
  import urllib2
  url = "http://commons.wikimedia.org/w/index.php?title=" + quote_plus(page) + "&action=raw"
  try:
    p = http_get(url).read()
  except urllib2.HTTPError:
    print "HTTP Error [%s]" % url
    sys.exit(0)

  meta = wikiparser.parse(p)
  if meta.has_key("lat") and meta.has_key("lon"):
    if not meta.has_key("desc"):
      meta["desc"] = re.sub(ur'\.[^\.]+$', '', page.replace('File:', '', 1))
    # take only first paragraph from description
    m = re.compile(ur'<p>(.+?)</p>', re.M|re.S).search(meta["desc"])
    if m:
      meta["desc"] = m.group(1)
    print ">%s: [%s,%s] [%s]" % (page, meta['lat'], meta['lon'], meta['desc'])
    # FIXME validate lat and lon as float
    cu.execute("SELECT * FROM wpc_img WHERE page=%s", (page,))
    try:
      if cu.rowcount > 0:
        query = u"UPDATE wpc_img SET \"desc\"=%s, point=ST_SetSRID(ST_MakePoint(%lf,%lf),4326) WHERE page=%s" % (sqlesc(meta['desc']), float(meta['lat']), float(meta['lon']), sqlesc(page))
      else:
        query = u"INSERT INTO wpc_img (page, \"desc\", point) VALUES(%s,%s,ST_SetSRID(ST_MakePoint(%lf,%lf),4326))" % (sqlesc(page), sqlesc(meta['desc']), float(meta['lat']), float(meta['lon']))
      #print query
      cu.execute(query)
    except ValueError:
      print "ValueError: meta=%s" % repr(meta)
      pass
  else:
    cu.execute("DELETE FROM wpc_img WHERE page=%s", (page,))

cc = pg.cursor()
cu = pg.cursor()

cc.execute("SELECT page FROM wpc_req")
while True:
  row = cc.fetchone()
  if not row:
    break
  page, = row 
  process(page)
  cu.execute("DELETE FROM wpc_req WHERE page=%s", (page,))

