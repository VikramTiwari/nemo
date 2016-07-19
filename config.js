'use strict'

var nconf = module.exports = require('nconf')
var path = require('path')

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    'SLACK_TOKEN'
  ])
  // 3. Config file
  .file({ file: path.join(__dirname, 'config.json') })
  // 4. Defaults
  .defaults({
    SLACK_TOKEN: ''
  })

// Check for required settings
checkConfig('SLACK_TOKEN')

function checkConfig (setting) {
  if (!nconf.get(setting)) {
    throw new Error('You must set the ' + setting + ' environment variable or' +
      ' add it to config.json!')
  }
}
