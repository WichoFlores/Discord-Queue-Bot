const {
  MAJOR_LEAGUE_VOICE_CHANNEL_ID, 
  ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID, 
} = require("./config")

let MQ = {}
let AQ = {}

const MAX_MAJOR_QUEUE_MEMBERS = 16
const MAX_ALTERNATIVE_QUEUE_MEMBERS = 8

MQ.data = []
MQ.max = MAX_MAJOR_QUEUE_MEMBERS
MQ.name = "Major"
MQ.channel = MAJOR_LEAGUE_VOICE_CHANNEL_ID
MQ.blocked = false
MQ.failed = []

exports.MQ = MQ

AQ.data = []
AQ.max = MAX_ALTERNATIVE_QUEUE_MEMBERS
AQ.name = "Alternative"
AQ.channel = ALTERNATIVE_LEAGUE_VOICE_CHANNEL_ID
AQ.blocked = false
AQ.failed = []

exports.AQ = AQ

