import sys
import re

# parse wiki text and return our metadata
def parse(text):
  if not fast_check(text):
    return {}
  text = parse_format(text)
  text = parse_links(text)
  out = parse_templates(text)
  return out

fast_check_re = re.compile(ur'{{Location', re.M)

# fast check
def fast_check(text):
  if fast_check_re.search(text):
    return True
  return False

# make html link
def make_link(name, text=None):
  if not text or text == '':
    text = name
  name = name.replace(" ","_")
  text = text.replace("_"," ")
  link = "<a href=\"http://commons.wikimedia.org/wiki/%s\" target=\"_blank\">%s</a>" % (name, text)
  return link

# parse wiki text and replace wiki links with html links
def parse_links(text):
  limit = 128
  r = re.compile(ur'\[\[([^\[\|\]]+?)\s*(?:\|([^\]]+))?\]\]', re.M|re.X)
  while 1:
    m = r.search(text)
    if not m:
      break
    try:
      link = make_link(m.group(1), m.group(2))
      link = re.sub(ur'\\', ur'\\\\', link) #workaround hack
      text = r.sub(link, text, 1)
    except:
      print "Some error occured with link [%s]" % link
      sys.exit(0)
    limit = limit - 1
    if not limit:
      break
  return text

def parse_format(text):
  text = re.sub(ur'\'\'\'(.+?)\'\'\'', ur'<b>\1</b>', text)
  text = re.sub(ur'\'\'(.+?)\'\'', ur'<i>\1</i>', text)
  text = re.sub(ur'---', ur'&mdash;', text)
  text = re.sub(ur'([^\[])(https?://[^\s]+[\w\d/])', ur'\1<a href="\2" target="_blank">\2</a>', text)
  text = re.sub(ur'\[(https?://[^\s]+?)\s+(.+?)\]', ur'<a href="\1" target="_blank">\2</a>', text)
  text = re.sub(ur'^\s*=====\s*([^=]+)\s*=====', ur'<h6>\1</h6>', text)
  text = re.sub(ur'^\s*====\s*([^=]+)\s*====', ur'<h5>\1</h5>', text)
  text = re.sub(ur'^\s*===\s*([^=]+)\s*===', ur'<h4>\1</h4>', text)
  text = re.sub(ur'^\s*==\s*([^=]+)\s*==', ur'<h3>\1</h3>', text)
  text = re.sub(ur'^\s*=\s*([^=]+)\s*=', ur'<h2>\1</h2>', text)
  #FIXME works incorrectly
  #text = re.compile(ur'((?:^\s+.+?\n)+)\n+', re.M).sub(ur'<pre>\1</pre>', text)
  text = re.compile(ur'\n\n+', re.M).sub(u"</p>\n<p>", text)
  text = "<p>%s</p>" % text
  return text

# parse wiki text and find our metadata in templates
def parse_templates(text):
  out = {}
  limit = 128
  rudesc = False
  r = re.compile(ur'{{[^{}]+?}}', re.M|re.X)
  while 1:
    m = r.search(text)
    if not m:
      break
    # just skip this buggy template
    if re.search(ur'{{\s*\|', m.group(0)):
      text = r.sub('', text, 1)
      limit = limit - 1
      continue
    mt = re.search(ur'^{{([^\|\n]+?)[\s\n]*(?:\|([^}]*))?}}', m.group(0), re.M|re.X)
    if not mt:
      print "OOPS ---\n%s---\n--- OOPS ---" % m.group(0)
    template = mt.group(1).lower()
    args = {}
    if mt.group(2):
      _args = mt.group(2).split("|")
      mi = 0
      for a in _args:
        a = a.strip()
        ma = re.match(ur'^([\w\z_-]+?)[\n\s]*=[\n\s]*(.*?)$', a, re.M|re.X)
        if ma:
          args["k_%s" % ma.group(1).lower()] = ma.group(2)
        else:
          args[mi] = a
          mi = mi + 1
    #print "FOUND TEMPLATE [%s] ARGS=%s" % (template, repr(args))
    # parse location
    try:
      if template == 'location dec':
        out["lat"] = args[0]
        out["lon"] = args[1]
    except KeyError:
      print "Error parsing location [KeyError]: %s" % m.group(0)
      pass
    # parse description
    try:
      # hack: override description only from first 'ru' template
      if not rudesc:
        if template == 'ru':
          if args.has_key("k_1"):
            out["desc"] = args["k_1"]
          else:
            out["desc"] = args[0]
        rudesc = True
      elif template == 'en':
        if args.has_key("k_1"):
          out["desc"] = args["k_1"]
        else:
          out["desc"] = args[0]
      elif template == 'information':
        if not out.has_key("desc"):
          if args.has_key("k_description"):
            out["desc"] = args["k_description"]
          else:
            out["desc"] = args[0]
    except KeyError:
      print "Error parsing description [KeyError]: %s" % m.group(0)
      pass
    text = r.sub('', text, 1)
    limit = limit - 1
    if not limit:
      break
  return out
