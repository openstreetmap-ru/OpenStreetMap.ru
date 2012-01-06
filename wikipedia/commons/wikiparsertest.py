# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding("utf-8")

text1 = """{{Information
|Description = Hunebed D25 near Bronneger, August 2004.
{{location dec|52.9446|6.8023|region:NL-DR|}}
|Source      = Own picture from [[User:Andre Engels|Andre Engels]]. 
|Date        = {{date|2004|08}} (2004-08-20, according to EXIF data)
|Author      = [[User:Andre Engels|Andre Engels]]
|Permission  = {{cc-by}}
|other_versions =
}}


[[Category:Borger-Odoorn]]
[[Category:Hunebed D25 in Bronneger]]
"""

text2 = """{{Information
|Description    ={{en|1=Map of Manx Electric Railway.}}
{{ru|1=Схема электрической железной дороги острова Мэн.}}
|Source         =http://openstreetmap.org
|Author         =OpenStreetMap contributors
|Date           =26.08.2011
|Permission     ={{cc-by-sa-2.0}}
|other_versions =
}}

[[Category:OpenStreetMap maps of the United Kingdom]]
[[Category:Rail transport map of Isle of Man]]
[[Category:Manx Electric Railway]]
"""

text3 = """{{Information
|Description=
{{en|Backyard gates of the Embassy of South Korea in Moscow (Plyuschikha st 56/1).}}
{{ru|Задние ворота посольства Южной Кореи в Москве (улица Плющиха, 56/1).}}
{{commonist}}
|Source=Own picture
|Date=2010-05-09 (see EXIF data below for exact UTC time)
|Author=[[User:Kalan]]
|Permission=
|other_versions=
}}
{{Location dec|55.737905|37.575120|}}
{{self|cc-by-sa-3.0}}

[[Category:South Korean Embassy, Moscow]]
"""

text4 = """=== h3eq ====

para1

para2

== h2eq ==

 ind http://ya.ru/
 ind (https://google.com/linux)
 ind [http://osm.sbin.ru/esr/ hyperlink]

text
"""

from wikiparser import *

# print parse(text3)
print parse_format(text4)
