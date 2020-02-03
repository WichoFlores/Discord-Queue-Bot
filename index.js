require('dotenv').config()

// Discord client
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

// Bot event listeners
const init = require("./listeners/init")
const userJoinListener = require("./listeners/userJoin")
const voiceUpdateListener = require("./listeners/voiceUpdate")
const messageListener = require("./listeners/message")

// Initial event listener
client.on('ready', async () => {
  init(client, () => {
    console.log('League Bot - Up and running...');
    userJoinListener(client)
    voiceUpdateListener(client)
    messageListener(client)
  })
});