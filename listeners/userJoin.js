const { adminIsConnected } = require("../config/helpers")
const { 
  WELCOME_TEXT_CHANNEL_ID,
  SELECT_ROLE_CHANNEL_ID,
  ADMIN_USER_ID
} = require("../config/config")

module.exports = (client) => {
  // Listen for user joining the server
  client.on('guildMemberAdd', member => {
    // If admin is not connected, do nothing
    if (!adminIsConnected(member.guild, ADMIN_USER_ID)) return

    const user = `${member}`
    const roleChannel = member.guild.channels.find(channel => channel.id === SELECT_ROLE_CHANNEL_ID).toString();
    const channel = member.guild.channels.find(ch => ch.id === WELCOME_TEXT_CHANNEL_ID);
    
    channel.send(`Hi, ${user}. Please choose a role in ${roleChannel} and use the \`!join\` command in it's respective chat to get into a League Queue.`);
  });
}