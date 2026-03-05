import { createClient } from "@supabase/supabase-js"
import fetch from "node-fetch"

const supabase = createClient(
  "https://czppuovnxcolgjjveptz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cHB1b3ZueGNvbGdqanZlcHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDYxMTgsImV4cCI6MjA4ODI4MjExOH0.hqbbFhWLMAPMT_x_FkXaC6fBpILimYawoBVlXkE_Nkw"
)

const BOT_TOKEN = "8431008420:AAFhZTLvXzA8GvTYvdWESE-vJn674m_uDlk"
const CHAT_ID = "1332419389"

async function checkBoss() {

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

    const diff = parseInt(spawnMinute) - minute

    if (parseInt(spawnHour) === hour && diff === 5) {

      const msg =
`🔥 BOSS ALERT

Boss : ${boss.name}
Level : ${boss.level}

Spawn dalam 5 menit`

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: msg
        })
      })

      console.log("Alert terkirim:", boss.name)
    }
  }
}

setInterval(checkBoss, 60000)

console.log("Bot boss alert berjalan...")