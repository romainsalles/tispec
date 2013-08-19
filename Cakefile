fs      = require 'fs'
path    = require 'path'
{print} = require 'sys'
{spawn} = require 'child_process'
Zip     = require 'adm-zip'

COFFEE_DIR = 'coffee/'
OUTPUT_DIR = ''

readFileSystemRecursively = (dir) ->

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
        outputDir =  path.dirname(currentFile.replace(COFFEE_DIR, OUTPUT_DIR))
        spawn 'coffee', ['-c', '-o', outputDir, currentFile] unless path.extname(currentFile) isnt '.coffee'
      else
        readFileSystemRecursively currentFile
  )

build = ->
  readFileSystemRecursively COFFEE_DIR

task 'build'        , 'compile coffeescript files'      , -> build()
