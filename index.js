var Botkit = require('botkit');
var fs = require('fs');

var controller = Botkit.slackbot({debug: false});

if (!process.env.slack_token_path) {
  console.log('Error: Specify slack_token_path in environment');
  process.exit(1);
}

fs.readFile(process.env.slack_token_path, (err, data) => {
  if (err) {
    console.log('Error: Specify token in slack_token_path file');
    process.exit(1);
  }
  data = String(data);
  data = data.replace(/\s/g, "");
  controller.spawn({token: data}).startRTM(function(err) {
    if (err) {
      throw new Error(err);
    }
  });
});

controller.hears(
    ['hello', 'hi'], ['direct_message', 'direct_mention', 'mention'],
    function(bot, message) { bot.reply(message, "Hello."); });
