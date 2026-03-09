import { Client, GatewayIntentBits } from "discord.js"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
 process.env.SUPABASE_URL,
 process.env.SUPABASE_KEY
)

const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const CHANNEL_ID = process.env.CHANNEL_ID

const client = new Client({
 intents: [GatewayIntentBits.Guilds]
})

process.on("unhandledRejection", err => {
 console.error("Unhandled Rejection:", err)
})

client.once("clientReady", () => {
 console.log("Discord bot online")
})

async function checkBoss() {

 try {

  const { data, error } = await supabase
   .from("boss")
   .select("*")

  if (error) {
   console.log("Supabase error:", error)
   return
  }

  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()

  for (const boss of data) {

   const [spawnHour, spawnMinute] = boss.spawn_time.split(":")

   if (
    parseInt(spawnHour) === hour &&
    parseInt(spawnMinute) - minute === 5
   ) {

    const channel = await client.channels.fetch(CHANNEL_ID)

    await channel.send({
     content: `@everyone 🔥 BOSS ALERT

Boss: ${boss.name}
Level: ${boss.level}

Spawn dalam 5 menit`,
     allowedMentions: { parse: ["everyone"] }
    })

    console.log("Alert terkirim:", boss.name)

   }

  }

 } catch (err) {
  console.log("Boss check error:", err)
 }

}

setInterval(checkBoss, 60000)

client.login(DISCORD_TOKEN)
