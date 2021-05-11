/* Modules */
const Discord = require("discord.js");

/* Models */
const setMessageText = require("./models/reaction-message/setMessageText");
const {
  addReactionMessage,
  getReactionMessage,
} = require("./models/reaction-message/queries.js");

/* Client */
const bot = new Discord.Client({ partials: ["MESSAGE", "REACTION"] });

/* Environment variables */
const TOKEN = process.env.TOKEN;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;

/* Teeenbe personal server log channel */
let botLogChannel;

bot.login(TOKEN);

bot.once("ready", () => {
  console.log("Testing ready to go.");
  bot.user.setActivity("with some new code");
  botLogChannel = bot.channels.cache.get(LOG_CHANNEL_ID);
});

bot.on("message", async (msg) => {
  if (msg.author.bot || msg.content !== "|rmsg create") {
    return;
  }

  /* Data about message that will be stored in the database entry. */
  const messageData = {
    id: 0,
    channelId: 0,
    reactions: [],
    roles: [],
  };

  /* If 'cancel' is received, value is changed to true and early return. */
  let cancelled = false;

  /* Filter used in message collectors. Messages will not be collected if condition is not met. */
  const filter = (m) => m.author.id === msg.author.id;

  const [instructions, embed] = await setMessageText(filter, msg.channel);
  const embedPreview = await msg.channel.send(`${instructions}\n\n`, { embed });

  /*
  Loop awaits a message from the user containing a reaction and a role name. Splits the message
  to store each in their respective arrays within the messageData object. Will then update the
  embed description with the added reaction and role name pairing by mapping through the
  reactions array. 'Done' and 'cancel' both break from the loop, with 'cancel' setting a boolean
  value, which results in an early return.
  */
  while (messageData.reactions.length < 16) {
    const userMessage = await msg.channel.awaitMessages(filter, { max: 1 });
    const response = userMessage.first().content;

    if (response.toLowerCase() === "done") {
      console.log("DONE");
      break;
    }
    if (response.toLowerCase() === "cancel") {
      cancelled = true;
      console.log("CANCELLED: " + cancelled);
      break;
    }
    /* If the space is omitted, the reaction and role can't be separated - error message and continue to next iteration */
    if (response.split(" ").length < 2) {
      const errorMsg = await msg.channel.send(
        "Incorrect emoji and role pairing. Please write it in the format `:emoji: roleName`\nRemember the space between the two!"
      );
      errorMsg.delete({ timeout: 10000 });
      continue;
    }

    /* Expected message format: `:emojiName: role name here` */
    const reactionAndRole = response.split(" ");
    const reaction = reactionAndRole[0];
    const roleNameArray = reactionAndRole.slice(1, reactionAndRole.length);
    const roleName = roleNameArray.join(" ");

    messageData.reactions.push(reaction);
    messageData.roles.push(roleName);

    embed.setDescription(`${embed.description}\n${reaction} - ${roleName}`);
    embedPreview.edit(embed);
    embedPreview.react(reaction);
  }

  if (cancelled) {
    msg.channel.send("Message creation cancelled.");
    return;
  }

  /*
  Requests that the user specifies a channel to send the embed to. Collects next user message
  which should mention the channel or contain its ID. Embed then sent to given channel and
  reactions added to it.
  */
  msg.channel.send(
    "Which channel would you like me to send it to? Mention/link it or paste the channel ID."
  );

  const response = await msg.channel.awaitMessages(filter, { max: 1 });
  const responseMsg = response.first();
  messageData.channelId = responseMsg.content;

  if (responseMsg.mentions.channels.size > 0) {
    messageData.channelId = responseMsg.mentions.channels.first().id;
  }

  const targetChannel = msg.guild.channels.cache.get(messageData.channelId);
  const reactionMessage = await targetChannel.send(embed);
  messageData.id = reactionMessage.id;
  messageData.reactions.forEach((r) => {
    reactionMessage.react(r);
  });

  /* INSERTs the data into the database as a new entry. Returns boolean value dependent on query success. */
  const entrySuccessful = await addReactionMessage({ ...messageData });

  if (entrySuccessful) {
    msg.channel.send("Message successfully created!");
  }
  if (!entrySuccessful) {
    msg.channel.send(
      "Issue adding the message to the database. Please try again."
    );
  }
});

bot.on("messageReactionAdd", async (reaction, user) => {
  /* Queries database to see if an entry exists for the message. */
  const messageData = await getReactionMessage(reaction.message.id);

  if (user.bot || messageData === undefined || messageData === null) {
    return;
  }

  const guild = reaction.message.guild;
  const member = guild.members.cache.get(user.id);

  /* Converting reactions and roles JSON back to arrays. */
  const messageReactions = Object.values(JSON.parse(messageData.reactions));
  const messageRoles = Object.values(JSON.parse(messageData.roles));

  /* Determines which role the reaction corresponds to based on the index of each (should match). */
  const index = messageReactions.findIndex((r) => {
    if (r.charAt(0) === "<") {
      const emojiData = r.split(":");
      let emojiId = emojiData[2];
      emojiId = emojiId.slice(0, emojiId.length - 1);
      r = bot.emojis.cache.get(emojiId);
    }
    return r.name.toLowerCase() === reaction.emoji.name.toLowerCase();
  });
  const roleName = messageRoles.find((r, i) => i === index);
  const role = guild.roles.cache.find(
    (r) => r.name.toLowerCase() === roleName.toLowerCase()
  );

  /*
  Adds or removes role from user, depending on whether they already have it
  or not and removes user's reaction that was added (cancels it out).
  */
  if (member.roles.cache.has(role.id)) {
    member.roles.remove(role);
    reaction.message.reactions.cache
      .find((r) => r === reaction)
      .users.remove(member);
    return;
  }
  member.roles.add(role);
  reaction.message.reactions.cache
    .find((r) => r === reaction)
    .users.remove(member);
});
