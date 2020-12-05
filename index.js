/* Modules */
const Discord = require("discord.js");

/* Models */
const addOrRemovePingSquadRole = require("./models/addOrRemovePingSquadRole");

/* Client */
const bot = new Discord.Client();

/* Environment variables */
const TOKEN = process.env.TOKEN;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;

/* Teeenbe personal server log channel */
let botLogChannel;

bot.login(TOKEN);

bot.once("ready", () => {
  console.log("7333N83 up and running.");
  bot.user.setActivity("with your mum");
  botLogChannel = bot.channels.cache.get(LOG_CHANNEL_ID);
});

/* If 'message' event triggered in #opt-in-out channel on GizzyGazza's server,
   give PingSquad role to author if message content is '!opt-in' and remove role if
   message content is '!opt-out'. Message user, confirming role addition/removal */

bot.on("message", (msg) => {
  try {
    if (
      msg.channel.id === "547236933726896138" &&
      msg.content.startsWith("!opt")
    ) {
      const pingSquadRole = msg.guild.roles.cache.find(
        (role) => role.name.toLowerCase() === "pingsquad"
      );
      const member = msg.guild.members.cache.get(msg.author.id);

      addOrRemovePingSquadRole(msg, member, pingSquadRole);
    }
    // Deletes message from GizzyGazza's #opt-in-out after 1000ms if not an opt-in/out command
    if (
      msg.channel.id === "547236933726896138" &&
      msg.content !== "!opt-in" &&
      msg.content !== "!opt-out"
    ) {
      msg.delete({ timeout: 1000 });
    }
  } catch (err) {
    console.error(err);
    botLogChannel.send(err);
  }
});

/* Send welcome message in GizzyGazza's #public on user joining guild */
bot.on("guildMemberAdd", (member) => {
  if (member.guild.id === "268538200383946752") {
    bot.channels.cache.get("268538200383946752").send("Welcome! :wave:");
  }
});
