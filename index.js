let Botkit = require('botkit')
let config = require('./config.js')
let moment = require('moment')
let _ = require('lodash')
let request = require('request')
let cheerio = require('cheerio')

let controller = Botkit.slackbot({
  debug: false
})

// give access to bot
let bot = controller.spawn({
  token: config.get('SLACK_TOKEN')
})

// start bot
bot.startRTM(function (err, bot, payload) {
  if (err) {
    // close the RTM for the sake of it in 5 seconds
    setTimeout(function () {
      bot.closeRTM()
    }, 5000)
    throw new Error('Could not connect to Slack')
  }
})

// sample commands
controller.hears(
  ['hello', 'hi'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) {
    bot.reply(message, 'Hello.')
  })

controller.hears(
  ['now'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) {
    bot.reply(message, moment().format('dddd, MMMM Do YYYY, h:mm:ss a'))
  })

controller.hears(
  ['echo'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) {
    bot.reply(message, message.match.input)
  })

controller.hears(
  ['tophn'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) {
    request('https://news.ycombinator.com/best', function (error, response, html) {
      if (!error && response.statusCode === 200) {
        var $ = cheerio.load(html)
        $('span.comhead').each(function (i, element) {
          var a = $(this).prev()
          var title = a.text()
          var url = a.attr('href')
          var subtext = a.parent().parent().next().children('.subtext').children()
          var points = $(subtext).eq(0).text()
          let reply = points + ':\t' + title + '\n' + url
          bot.reply(message, reply)
        })
      }
    })
  })
