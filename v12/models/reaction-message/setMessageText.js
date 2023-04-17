const Discord = require("discord.js");

const setMessageText = async (filter, channel) => {
  channel.send("Please enter a title.");
  const titleResponse = await channel.awaitMessages(filter, { max: 1 });
  const title = titleResponse.first().content;

  channel.send("Please enter a description.");
  const descriptionResponse = await channel.awaitMessages(filter, { max: 1 });
  const description = descriptionResponse.first().content;

  const instructions = `Below is an embed preview of the message that will update as you go. To add reactions and roles, please send messages in the format: \`:emojiName: roleName\`
  (make sure to leave a space between the two).

  **NOTE:** my access to emojis works the same as Nitro as does for you - no access if not in the same server as the emoji.
  
  To **finish**, type: \`done\`
  To **cancel**, type: \`cancel\``;

  const embed = new Discord.MessageEmbed()
    .setColor("0xDDAA0B")
    .setTitle(title)
    .setDescription(`${description}\n`)
    .setFooter(
      "*If you have an issue with roles not applying, please contact an administrator!*"
    );

  return [instructions, embed];
};

module.exports = setMessageText;
