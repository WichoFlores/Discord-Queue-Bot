const {
  MAJOR_LEAGUE_TEXT_CHANNEL_ID,
  ALTERNATIVE_LEAGUE_TEXT_CHANNEL_ID,
  MAJOR_LEAGUE_VOICE_CHANNEL_ID,
  ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID,
} = require("../config/config")

const { AQ, MQ } = require("../config/queues")

const { verifyEnv, verifyChannels } = require("../config/helpers")

module.exports = async (client, callback) => {
  // Verify environment variables
  verifyEnv()
  
  // Test connection to all channels
  verifyChannels(client)

  // Declare queue text and voice channels
  try {
    MQ.chat = await client.channels.find(ch => ch.id === MAJOR_LEAGUE_TEXT_CHANNEL_ID)
    AQ.chat = await client.channels.find(ch => ch.id === ALTERNATIVE_LEAGUE_TEXT_CHANNEL_ID)

    MQ.voice = await client.channels.find(ch => ch.id === MAJOR_LEAGUE_VOICE_CHANNEL_ID)
    AQ.voice = await client.channels.find(ch => ch.id === ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID)
  } catch (e) {
    if (e.message) console.log(e.message)
    else console.log("Error while initializing league channels. This is probably a Discord API / Discor.js error.")
    console.log("Exiting app...")
    process.exit(1)
  }
  
  if (MQ.chat && AQ.chat) {
    callback()
  } else {
    console.log("Couldn't find league channels, verify their IDs in the .env file.")
    console.log("Exiting app.")
    process.exit(1)
  }
}