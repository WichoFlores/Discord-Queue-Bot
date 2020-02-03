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
  SERVER_ID,
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
  if ( !SERVER_ID || !MAJOR_LEAGUE_ROLE_ID || !MAJOR_LEAGUE_TEXT_CHANNEL_ID || 
    !ALTERNATIVE_LEAGUE_ROLE_ID || !ALTERNATIVE_LEAGUE_TEXT_CHANNEL_ID || 
    !MAJOR_LEAGUE_VOICE_CHANNEL_ID || !ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID ||
    !WELCOME_TEXT_CHANNEL_ID || !SELECT_ROLE_CHANNEL_ID ||
    !BOT_ID || !WAITING_LOBBY_VOICE_CHANNEL_ID ||
    !ADMIN_USER_ID ) {
 
    if (!SERVER_ID) console.log("SERVER_ID is not defined. Please verify .env variables.")
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
  const server = client.guilds.find(g => g.id === SERVER_ID)
  if (!server) {
    console.log("Couldn't connect to Server. (SERVER_ID)")
    error = true
  }
  if (!server.channels.find(ch => ch.id === MAJOR_LEAGUE_TEXT_CHANNEL_ID)) {
    console.log("Couldn't connect to Major League Text Channel. (MAJOR_LEAGUE_TEXT_CHANNEL_ID)")
    error = true
  }
  if (!server.channels.find(ch => ch.id === ALTERNATIVE_LEAGUE_TEXT_CHANNEL_ID)) {
    console.log("Couldn't connect to Alternative League Text Channel. (ALTERNATIVE_LEAGUE_TEXT_CHANNEL_ID)")
    error = true
  }
  if (!server.channels.find(ch => ch.id === MAJOR_LEAGUE_VOICE_CHANNEL_ID)) {
    console.log("Couldn't connect to Major League Voice Channel. (MAJOR_LEAGUE_VOICE_CHANNEL_ID)")
    error = true
  }
  if (!server.channels.find(ch => ch.id === ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID)) {
    console.log("Couldn't connect to Alternative League Voice Channel. (ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID)")
    error = true
  }
  if (!server.channels.find(ch => ch.id === WELCOME_TEXT_CHANNEL_ID)) {
    console.log("Couldn't connect to Welcome Text Channel. (WELCOME_TEXT_CHANNEL_ID)")
    error = true
  }
  
  if (!server.channels.find(ch => ch.id === SELECT_ROLE_CHANNEL_ID)) {
    console.log("Couldn't connect to Select Role Text Channel. (SELECT_ROLE_CHANNEL_ID)")
    error = true
  }
  
  if (!server.channels.find(ch => ch.id === WAITING_LOBBY_VOICE_CHANNEL_ID)) {
    console.log("Couldn't connect to Waiting Lobby Voice Channel. (WAITING_LOBBY_VOICE_CHANNEL_ID)")
    error = true
  }

  if (!server.roles.find(ch => ch.id === MAJOR_LEAGUE_ROLE_ID)) {
    console.log("Couldn't find Major League Role. (MAJOR_LEAGUE_ROLE_ID)")
    error = true
  }
  
  if (!server.roles.find(ch => ch.id === ALTERNATIVE_LEAGUE_ROLE_ID)) {
    console.log("Couldn't find Alternative League Role. (ALTERNATIVE_LEAGUE_ROLE_ID)")
    error = true
  }

  if (error) {
    console.log("Check those IDs!")
    process.exit(1)
  }
}