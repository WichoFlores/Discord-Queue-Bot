const {
  MAJOR_LEAGUE_ROLE_ID,
  MAJOR_LEAGUE_TEXT_CHANNEL_ID,
  ALTERNATIVE_LEAGUE_ROLE_ID,
  ALTERNATIVE_LEAGUE_TEXT_CHANNEL_ID,
  MAJOR_LEAGUE_VOICE_CHANNEL_ID,
  ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID,
  WELCOME_TEXT_CHANNEL_ID,
  SELECT_ROLE_CHANNEL_ID,
  BOT_ID,
  WAITING_LOBBY_VOICE_CHANNEL_ID,
  ADMIN_USER_ID,
} = require("./config")

exports.userInQueue = (queue, userId) => {
  return queue.find(m => m.id === userId)
}

exports.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

exports.adminIsConnected = (guild, adminId) => {
  try {
    const admin = guild.members.find(m => m.id === adminId)
    return admin.presence.status == "offline" ? false : true
  } catch (e) {
    console.log("Error while verifying if admin is connected.");
    return false
  }
}

exports.selectQueue = (member, MQ, AQ) => {
  if (member.roles.find(r => r.id === MAJOR_LEAGUE_ROLE_ID)) {
    return queue = MQ
  } else if (member.roles.find(r => r.id === ALTERNATIVE_LEAGUE_ROLE_ID)) {
    return queue = AQ
  } else {
    return false
  }
}

exports.commands = [
  "!join", 
  "!exit", 
  "!reset", 
  "!list",
  "!setmax",
  "!nuke"
]

exports.verifyEnv = () => {
  if ( !MAJOR_LEAGUE_ROLE_ID || !MAJOR_LEAGUE_TEXT_CHANNEL_ID || 
    !ALTERNATIVE_LEAGUE_ROLE_ID || !ALTERNATIVE_LEAGUE_TEXT_CHANNEL_ID || 
    !MAJOR_LEAGUE_VOICE_CHANNEL_ID || !ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID ||
    !WELCOME_TEXT_CHANNEL_ID || !SELECT_ROLE_CHANNEL_ID ||
    !BOT_ID || !WAITING_LOBBY_VOICE_CHANNEL_ID ||
    !ADMIN_USER_ID ) {
 
    if (!MAJOR_LEAGUE_ROLE_ID) console.log("MAJOR_LEAGUE_ROLE_ID is not defined. Please verify .env variables.")
    if (!MAJOR_LEAGUE_TEXT_CHANNEL_ID) console.log("MAJOR_LEAGUE_TEXT_CHANNEL_ID is not defined. Please verify .env variables.")
    if (!ALTERNATIVE_LEAGUE_ROLE_ID) console.log("ALTERNATIVE_LEAGUE_ROLE_IDis not defined. Please verify .env variables.")
    if (!ALTERNATIVE_LEAGUE_TEXT_CHANNEL_ID) console.log("ALTERNATIVE_LEAGUE_TEXT_CHANNEL_ID is not defined. Please verify .env variables.")
    if (!MAJOR_LEAGUE_VOICE_CHANNEL_ID) console.log("MAJOR_LEAGUE_VOICE_CHANNEL_ID is not defined. Please verify .env variables.")
    if (!ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID) console.log("ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID is not defined. Please verify .env variables.")
    if (!WELCOME_TEXT_CHANNEL_ID) console.log("WELCOME_TEXT_CHANNEL_ID is not defined. Please verify .env variables.")
    if (!SELECT_ROLE_CHANNEL_ID) console.log("SELECT_ROLE_CHANNEL_ID is not defined. Please verify .env variables.")
    if (!BOT_ID) console.log("BOT_ID is not defined. Please verify .env variables.")
    if (!WAITING_LOBBY_VOICE_CHANNEL_ID) console.log("WAITING_LOBBY_VOICE_CHANNEL_ID is not defined. Please verify .env variables.")
    if (!ADMIN_USER_ID) console.log("ADMIN_USER_ID is not defined. Please verify .env variables.")
    console.log("Exiting app...")
    process.exit(1)
  }
}

exports.verifyChannels = async (client) => {
  let error = false
  if (!client.channels.find(ch => ch.id === MAJOR_LEAGUE_TEXT_CHANNEL_ID)) {
    console.log("Couldn't connect to Major League Text Channel.")
    error = true
  }
  if (!client.channels.find(ch => ch.id === ALTERNATIVE_LEAGUE_TEXT_CHANNEL_ID)) {
    console.log("Couldn't connect to Alternative League Text Channel.")
    error = true
  }
  if (!client.channels.find(ch => ch.id === MAJOR_LEAGUE_VOICE_CHANNEL_ID)) {
    console.log("Couldn't connect to Major League Voice Channel.")
    error = true
  }
  if (!client.channels.find(ch => ch.id === ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID)) {
    console.log("Couldn't connect to Alternative League Voice Channel.")
    error = true
  }
  if (!client.channels.find(ch => ch.id === WELCOME_TEXT_CHANNEL_ID)) {
    console.log("Couldn't connect to Welcome Text Channel.")
    error = true
  }
  
  if (!client.channels.find(ch => ch.id === SELECT_ROLE_CHANNEL_ID)) {
    console.log("Couldn't connect to Select Role Text Channel.")
    error = true
  }
  
  if (!client.channels.find(ch => ch.id === WAITING_LOBBY_VOICE_CHANNEL_ID)) {
    console.log("Couldn't connect to Waiting Lobby Voice Channel.")
    error = true
  }

  if (error) {
    console.log("Is the ID correct?")
    process.exit(1)
  }
}