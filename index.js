const Discord = require("discord.js");

const bot = new Discord.Client();

bot.login(process.env.TOKEN);

bot.once("ready", () => {
  console.log("7333N83 up and running.");
  bot.user.setActivity("with your mum");
});

bot.on("messageReactionAdd", (reaction, user) => {
  if (reaction.message.id === "547243138616393742" && reaction.name === "👍") {
    try {
      const pingSquadRole = reaction.message.guild.roles.cache.find(
        (role) => role.name.toLowerCase() === "pingsquad"
      );
      user.roles.add(pingSquadRole);
    } catch (err) {
      bot.channels.cache
        .get("624628020937883690")
        .send(`There's been an error:\n\n${err}`);
    }
  }
});

bot.on("messageReactionRemove", (reaction, user) => {
  if (reaction.message.id === "547243138616393742" && reaction.name === "👍") {
    try {
      const pingSquadRole = reaction.message.guild.roles.cache.find(
        (role) => role.name.toLowerCase() === "pingsquad"
      );
      user.roles.remove(pingSquadRole);
    } catch (err) {
      bot.channels.cache
        .get("624628020937883690")
        .send(`There's been an error:\n\n${err}`);
    }
  }
});
