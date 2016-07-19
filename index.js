let Botkit = require('botkit')
let config = require('./config.js')

let controller = Botkit.slackbot({debug: false})

// give access to bot
let bot = controller.spawn({
  token: config.get('SLACK_TOKEN')
})

// start bot
bot.startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack')
  }

  // close the RTM for the sake of it in 5 seconds
  setTimeout(function () {
    bot.closeRTM()
  }, 5000)
})

// sample commands
controller.hears(
  ['hello', 'hi'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, 'Hello.'); })
