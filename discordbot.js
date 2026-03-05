import { Client, GatewayIntentBits } from "discord.js"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
 "https://czppuovnxcolgjjveptz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cHB1b3ZueGNvbGdqanZlcHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDYxMTgsImV4cCI6MjA4ODI4MjExOH0.hqbbFhWLMAPMT_x_FkXaC6fBpILimYawoBVlXkE_Nkw"
)


const DISCORD_TOKEN = "MTQ1OTU0MDQ2MDUwOTg2MDAwMA.GbS-wZ.Mqa62JGlSl7x07Ho35_Zovkw6aTtGYgI2xybhE"
const CHANNEL_ID = "1454839891975471104"

const client = new Client({
 intents: [GatewayIntentBits.Guilds]
})

client.once("ready", () => {
 console.log("Discord bot online")
})

async function checkBoss() {

 const { data } = await supabase
 .from("boss")
 .select("*")

 const now = new Date()
 const hour = now.getHours()
 const minute = now.getMinutes()

 for (const boss of data) {

 const [spawnHour, spawnMinute] = boss.spawn_time.split(":")

 if (
 parseInt(spawnHour) === hour &&
 parseInt(spawnMinute) - minute === 5
 ) {

 const channel = client.channels.cache.get(CHANNEL_ID)

 channel.send({
 content: `@everyone 🔥 BOSS ALERT

Boss: ${boss.name}
Level: ${boss.level}

Spawn dalam 5 menit`,
 allowedMentions: { parse: ["everyone"] }
})

 }

 }

}

setInterval(checkBoss, 60000)

client.login(process.env.DISCORD_TOKEN)
