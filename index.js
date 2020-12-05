/* Modules */
const Discord = require("discord.js");

/* Client */
const bot = new Discord.Client();

/* Environment variables */
const TOKEN = process.env.TOKEN;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;
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

function addOrRemovePingSquadRole(message, member, role) {
  const optInOrOutEmoji = message.content === "!opt-in" ? "✅" : "❌";
  const optInOrOutDesc =
    message.content === "!opt-in"
      ? ["opted into", "now", "disable", "!opt-out"]
      : ["opted out of", "no longer", "re-enable", "!opt-in"];

  const optInOutDm = new Discord.MessageEmbed()
    .setColor(0xddaa0b)
    .setTitle(`GizzyGazza video and Twitch pings  ${optInOrOutEmoji}`)
    .setDescription(
      `You've **${optInOrOutDesc[0]}** pings for GizzyGazza videos and Twitch streams! You will **${optInOrOutDesc[1]}** be notified when any go live.\n--\nYou can ${optInOrOutDesc[2]} this at any time by typing \`${optInOrOutDesc[3]}\` in the same channel.`
    )
    .setThumbnail(message.guild.iconURL());

  if (message.content === "!opt-in") {
    member.roles.add(role);
    message.delete({ timeout: 3000 });
    member.send(optInOutDm);
    return;
  }
  if (message.content === "!opt-out") {
    member.roles.remove(role);
    message.delete({ timeout: 3000 });
    member.send(optInOutDm);
    return;
  }
}

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
      return;
    }
    msg.delete({ timeout: 1000 });
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
