#!/usr/bin/env python
# -*- coding: utf8 -*-

import os, subprocess

def cmdrun(cmd, errorText=''):
  PIPE = subprocess.PIPE
  p1 = subprocess.Popen(cmd, shell = True)
  returncode = p1.wait()
  if returncode <> 0:
    raise Exception('returncode: ' + str(returncode) + ', text error: ' + str(errorText))


def main():
  cat_in_js = '/home/ershkus/osm.ru/www/js/'
  compiler = '/home/ershkus/osm.ru/compiler/compiler.jar'
  
  if cat_in_js[-1] != os.sep: cat_in_js += os.sep
  
  for fDir in os.listdir(cat_in_js): # просмотр директорий
    if os.path.isdir(cat_in_js + fDir):
      js_in = ''
      if fDir[-1] != os.sep: fDir += os.sep
      fOutName = fDir[:-1]
      fFiles = os.listdir(cat_in_js + fDir)
      fFiles.sort(key=str.lower)
      for fFile in fFiles: # просмотр файлов в директориях
        if os.path.isfile(cat_in_js + fDir + fFile):
          js_in += ' --js=' + cat_in_js + fDir + fFile
      
      cmd = 'java -jar ' + compiler + js_in + ' --js_output_file=' + cat_in_js + fOutName + '.js'
      # print '@  ' + cmd;
      cmdrun(cmd = cmd, errorText='error run compile, ' + fOutName)
  
  print 'finish'


if __name__ == '__main__':
  main()