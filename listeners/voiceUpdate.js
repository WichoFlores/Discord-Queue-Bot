const { adminIsConnected, selectQueue } = require('../config/helpers')
const { 
  ADMIN_USER_ID,
} = require("../config/config")

const { AQ, MQ } = require("../config/queues")

module.exports = (client) => {
  // Listen for user entering voice chat
  client.on("voiceStateUpdate", (oldmember, newmember) => {
    // If user gets out of voice, do nothing
    if (newmember.voiceChannelID == null) return

    // If admin is not connected, do nothing
    if (!adminIsConnected(newmember.guild, ADMIN_USER_ID)) return
    
    // Select queue based on role
    // If none, do nothing
    let queue = selectQueue(newmember, MQ, AQ)
    if (!queue) return
    // Look for that user in the failed users
    if (queue.failed.find(f => f.member == newmember)) {
      // Move the user to it's respective chat
      try {
        newmember.setVoiceChannel(queue.voice)
        queue.failed = queue.failed.filter((fail => fail.member.id != newmember.id))
        queue.chat.send(`${newmember.user.username} has been moved!`)
        if (queue.failed.length == 0) {
          queue.chat.send(`All users are now in. **${queue.name}** queue has been reseted.`)
          queue.blocked = false
          queue.data = []
        } else {
          let failedUsersString = ""  
          queue.failed.forEach(fail => failedUsersString += ` <@${fail.member.id}> `)
          queue.chat.send(`${queue.failed.length} to go! (${failedUsersString})`)
        }
      } catch (error) {
        console.log(error)
        }
      }
  })
}