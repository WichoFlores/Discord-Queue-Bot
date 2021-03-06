# Discord-Queue-Bot

Discord Bot to help manage tournament participants by joining a queue that, when maxed out, will move the players to a specific voice channel.

## Features
- Welcome messages
- Custom commands
- Admin only commands
- Deleting messages
- User queues
- Moving users between voice channels
- Only works when admin is online

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/download/)
* [Discord](https://discordapp.com/)

### Installing

#### On the console:

Clone the repository

```
git clone https://github.com/WichoFlores/Discord-Queue-Bot
```

Navigate to folder and install dependencies

```
npm i
```

Run index.js

```
node index.js
```

## Channel connections

The bot will try to connect to every channel before even starting up. If an error occurs, it will be logged.

### Configuration

Channels, roles and users ID go in **config.js** file. Just change the id, while mantaining the quotes, to fit the server the bot's on.

To get the IDs, enable Developer Mode by going into Discord > User Settings > Appearance > Developer Mode.

Now you can right-click a user/channel and choose the option "Copy ID".

For a role ID, mention the role with a special syntax (a backslash before @):

```
\@[ROLE]
```

## Discord Connection

The bot token is store in an environment variable called DISCORD_TOKEN.

Be sure to create an .env file with the token.

```
DISCORD_TOKEN=token
```

## Using the bot

### Commands

#### !join
```
Adds user to queue. Must have a valid role to use it.
```

#### !exit
```
Removes user from queue. Must be part of it's current role queue.
```

#### !list
```
List current users from both queues.
```
#### !setmax [queue] [number] (admin)
```
Sets max queue users. Default are Major 16 and Alternative 8.
```

#### !reset (admin)
```
Removes everyone from queues and kicks all users from both leagues voice channels.
```

#### !nuke [number] (admin)
```
Deletes [number] messages. If not specified, it'll be set to 100.
```

## Built With

* [Node.js](https://nodejs.org/)
* [Discord.js](https://discord.js.org/) - Discord API Wrapper

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Made for dragalevcig
