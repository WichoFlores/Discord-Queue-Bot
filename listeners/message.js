const { userInQueue, adminIsConnected, selectQueue } = require('../config/helpers')
const { AQ, MQ } = require("../config/queues")
const { commands } = require("../config/helpers")
const {
  MAJOR_LEAGUE_VOICE_CHANNEL_ID, 
  ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID, 
  SELECT_ROLE_CHANNEL_ID,
  BOT_ID,
  ADMIN_USER_ID,
} = require("../config/config")

module.exports = (client) => {
  client.on("message", async message => {
    // Ignore if bot says something or it's not a command
    if (message.author.id == BOT_ID || message.content[0] !== "!") return
    
    // If admin is not connected, do nothing
    if (!adminIsConnected(message.guild, ADMIN_USER_ID)) return console.log("Administrator is offline.")
    
    // Exit if not a valid command
    if (!commands.find(c => c == message.content.toLowerCase().split(" ")[0])) return console.log("\x1b[33m", `${message.content} is not a valid command. (Available commands are in config.js file)`)
  

    // Declare variables
    const user = message.author.id
    const userMention = `<@${user}>`
    const channel = message.channel

    if (message.content.toLowerCase() == '!reset' && message.author.id === ADMIN_USER_ID) {
      message.guild.channels.find(ch => ch.id === MAJOR_LEAGUE_VOICE_CHANNEL_ID).members.forEach(member => member.setVoiceChannel(null))
      message.guild.channels.find(ch => ch.id === ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID).members.forEach(member => member.setVoiceChannel(null))
  
      MQ.data = []
      MQ.name = "Major"
      MQ.blocked = false
      MQ.failed = []
  
      AQ.data = []
      AQ.name = "Alternative"
      AQ.blocked = false
      AQ.failed = []
  
      return message.channel.send("Queues have been restarted successfully.")
    }
  
    if (message.content.toLowerCase() == '!list') {
      let mainMessage = ""
      let ML = ""
      let AL = ""
      
      if (MQ.data) {
        MQ.data.forEach(member => {
          ML += ("> " + member.user.username + "\n")
        })
      }
  
      if (AQ.data) {
        AQ.data.forEach(member => {
          AL += ("> " + member.user.username + "\n")
        })
      }
  
      mainMessage = `\`Main League Queue (${MQ.data.length}/${MQ.max})\`` + (MQ.blocked ? " \`(blocked)\`" : "") + "\n" + (ML || "*Empty queue*\n") + "\n" + `\`Alternative League Queue (${AQ.data.length}/${AQ.max})\`` + (AQ.blocked ? " \`(blocked)\`" : "") + "\n" + (AL || "*Empty queue*")
      return message.channel.send(mainMessage)
    }

    if (message.author.id === ADMIN_USER_ID && (message.content.toLowerCase().split(" ")[0] == "!setmax")) {
      if (!((message.content.toLowerCase().split(" ")[1] == "alt" || message.content.toLowerCase().split(" ")[1] == "major") && (!isNaN(message.content.toLowerCase().split(" ")[2])))) {
        return message.channel.send("Invalid syntax. Use either \`!setMax alt [number]\` or \`!setMax major [number]\`")
      }
      let queue = message.content.toLowerCase().split(" ")[1]
      let max = Number(message.content.toLowerCase().split(" ")[2])

      if (queue == "major") {
        MQ.max = max
        return channel.send("Major queue max number updated.")
      } else {
        AQ.max = max
        return channel.send("Alternative queue max number updated.")
      }
    } 
  
    if (message.content.toLowerCase().split(" ")[0] == '!nuke' && message.author.id === ADMIN_USER_ID) {
      let limit = 100
      if (message.content.toLowerCase().split(" ")[1]) {
        if (!isNaN(message.content.toLowerCase().split(" ")[1])) {
          limit = Number(message.content.toLowerCase().split(" ")[1])
          if (limit > 100) limit = 100
        }
      }

      try {
        const fetched = await message.channel.fetchMessages({ limit });
        fetched.forEach(message => {
          try {
            message.delete()
            .then(success => {})
            .catch(error => {})
          } catch (error) {
            console.log(error);
          }
        })
      } catch (error) {
        console.log(error);
      }
      return
    }
  
    // Select que based on role
    let queue = selectQueue(message.member, MQ, AQ)
    // If user doesn't have a valid role
    if (!queue) {
      if (message.author.id !== BOT_ID) {
        const roleChannel = message.guild.channels.find(channel => channel.id === SELECT_ROLE_CHANNEL_ID).toString();
        return channel.send(`You don't have a valid role, ${userMention}! Make sure to choose one in ${roleChannel} and then try again.`)
      } else {
        return
      }
    }
  
    if (message.content.toLowerCase() == "!join") {
      // Prevent moving forward if queue is blocked
      if (queue.blocked) {
        let failedUsersString = ""  
        queue.failed.forEach(fail => failedUsersString += ` <@${fail.member.id}> `)
        return channel.send(`**${queue.name}** queue is blocked. Either all pending users (${failedUsersString}) must go into the Waiting Room or use !reset to start over.`)
      }
      // Add user to queue if he isn't in it
      if (!userInQueue(queue.data, user)) {
        queue.data.push(message.member)
        channel.send(`Added, to the **${queue.name}** queue ${userMention}! (${queue.data.length}/${queue.max})`)
        channel.send(`Remember to join the Waiting Lobby Voice Channel!`)
      } else {
        channel.send(`Hey, ${userMention}! You're already in the **${queue.name}** queue. Chill. (${queue.data.length}/${queue.max})`)
      }
  
      // Move users when queue fills up
      if (queue.data.length === queue.max) {
        channel.send(`${queue.name} queue is now full. Moving users...`)
        for (let i = 0; i < queue.data.length; i++) {
          try {
            await queue.data[i].setVoiceChannel(queue.voice)
          } catch (error) {
            // Error 40032 means not connected to a voice channel
            if (error.code === 40032) {
              try {
                // Try reaching the user via DM
                // Add user to the queue respective fail list
                await queue.data[i].send("Hey! The tournament is almost starting!")
                queue.failed.push({ member: queue.data[i] , private: false })
                await queue.data[i].send(`We tried moving yo into <#${queue.voice.id}> but you weren't in a voice room. We can't force you in, so... can you join us?`)
                setTimeout(async () => {
                  await queue.data[i].send("We'll be waiting for you!")
                }, 2000)
              } catch (error) {
                // If can't reach the user via DM, turn on private flag so they'll be mentioned in the chat room
                queue.failed.push({ member: queue.data[i] , private: true })
              }
            }
          }
        }
      
        // If failed list is empty, it means every user was successfully moved
        if (queue.failed.length === 0) {
          queue.data = []
          channel.send(`Done! **${queue.name}** queue is now empty. (${queue.data.length}/${queue.max})`)
        } else {
          // If not, block the queue until every user has been moved
          queue.blocked = true
          channel.send(`Some users weren't in the Waiting Lobby, so I couldn't move them to the ${queue.name} room. I contacted them via DM, though!`)
          let failedUsersString = ""  
          let failed = false
          queue.failed.forEach(fail => {
            if (fail.private) {
              failed = true
              failedUsersString += ` <@${fail.member.id}> `
            }
          })
          if (failed) {
            // If any private users exist, mention them in the chat room
            channel.send(`${failedUsersString} I tried DMing you but I couldn't. :( Please join the Waiting Lobby voice channel so I can move you.`)
          }
        }
      }
    }
  
    if (message.content.toLowerCase() == "!exit") {  
      // If queue is blocked, prevent from going forward
      if (queue.blocked) {
        let failedUsersString = ""  
        queue.failed.forEach(fail => failedUsersString += ` <@${fail.member.id}> `)
        return channel.send(`**${queue.name}** queue is blocked. Either all pending users (${failedUsersString}) must go into the Waiting Room or use \`!reset\` (admin-only) to start over.`)
      } 
  
      if (userInQueue(queue.data, user)) {
        queue.data = queue.data.filter(m => m.id !== user)
        channel.send(`Successfully removed from **${queue.name}** queue, ${userMention}. (${queue.data.length}/${queue.max})`)
      } else {
        channel.send(`You're not in the **${queue.name}** queue, ${userMention}. Use the \`!join\` if you want to join!`)
      }
    }
  })
}