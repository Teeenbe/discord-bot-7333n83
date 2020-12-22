/* Modules */
const Discord = require("discord.js");

/* Models */
const { addRole, removeRole } = require("./models/addOrRemoveRole");

/* Client */
const bot = new Discord.Client({ partials: ["MESSAGE", "REACTION"] });

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

/* Reaction add event calls addRole() for role corresponding to that reaction and adds to
  user who reacted. Reaction remove event calls removeRole() for role corresponding to that
  reaction and removes from user that reacted */

bot.on("messageReactionAdd", (reaction, user) => {
  const guild = reaction.message.guild;
  const member = guild.members.cache.get(user.id);
  if (
    guild.id === "268538200383946752" &&
    reaction.message.id === "790741183302467594"
  ) {
    addRole(guild, member, reaction);
  }
});

bot.on("messageReactionRemove", (reaction, user) => {
  const guild = reaction.message.guild;
  const member = guild.members.cache.get(user.id);
  if (
    guild.id === "268538200383946752" &&
    reaction.message.id === "790741183302467594"
  ) {
    removeRole(guild, member, reaction);
  }
});

/* Send welcome message in GizzyGazza's #public on user joining guild */
bot.on("guildMemberAdd", (member) => {
  if (member.guild.id === "268538200383946752") {
    bot.channels.cache
      .get("628675608368381953")
      .send("Someone joined GG Discord");
    bot.channels.cache.get("268538200383946752").send("Welcome! :wave:");
  }
});
