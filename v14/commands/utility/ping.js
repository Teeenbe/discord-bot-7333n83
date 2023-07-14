const { SlashCommandBuilder } = require("discord.js");
const constants = require("../../constants.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),

    deployGlobally: false,

    async execute(interaction) {
        await interaction.reply({
            content: "Pong!",
            ephemeral: true,
        });
    },
};
