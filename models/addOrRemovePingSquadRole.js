const Discord = require("discord.js");

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
      `You've **${optInOrOutDesc[0]}** pings for GizzyGazza videos and Twitch streams! You will **${optInOrOutDesc[1]}** be notified when any go live.
        --
        You can ${optInOrOutDesc[2]} this at any time by typing \`${optInOrOutDesc[3]}\` in the same channel.`
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

module.exports = addOrRemovePingSquadRole;
