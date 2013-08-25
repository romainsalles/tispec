fs      = require 'fs'
path    = require 'path'
{print} = require 'sys'
{spawn} = require 'child_process'
Zip     = require 'adm-zip'

COFFEE_DIR = 'coffee/'
OUTPUT_DIR = ''

readFileSystemRecursively = (dir, callback) ->

  # Get all files/directories and their path from dir param, store them in array
  files = fs.readdirSync dir

  # Process each array member:
  # - if it's a .coffee file, compile to /Resources with directory structure similar to original one
  # - ...or dive deeper and recursively if it's itself a directory
  files.forEach(
    (file) ->
      currentFile = path.normalize "#{dir}/#{file}"
      stats       = fs.statSync currentFile

      if stats.isFile()
        callback currentFile
      else
        readFileSystemRecursively currentFile, callback
      return
  )

build = ->
  readFileSystemRecursively(
    COFFEE_DIR,
    (file) ->
      outputDir =  path.dirname(file.replace(COFFEE_DIR, OUTPUT_DIR))
      spawn 'coffee', ['-c', '-o', outputDir, file] unless path.extname(file) isnt '.coffee'
  )

build_app_lib = ->
  # compile coffee files into js
  build

  # zip app library folder
  zip = new Zip()
  zip.addLocalFolder './App/Resources/lib/tispec'
  zip.writeZip       './tispec_app_lib.zip'


task 'build'        , 'compile coffeescript files'      , -> build()
task 'build_app_lib', 'build and zip tispec app library', -> build_app_lib()
