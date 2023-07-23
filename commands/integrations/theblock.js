const { SlashCommandBuilder } = require("discord.js");
const constants = require("../../constants.json");

// QUERIES
const {
    createAccountLink,
    getExistingLinkByDiscordId,
} = require("../../db/queries/theblock");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("theblock")
        .setDescription("Actions for the Block Minecraft server.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("link")
                .setDescription(
                    "Links a user's Discord account to their Minecraft account."
                )
        ),

    deployGlobally: true,

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // If user does not have the required role, notify and early return
        if (
            !interaction.member._roles.includes(
                constants.serverRoleIds.ytGoldMember
            )
        ) {
            return await interaction.followUp({
                content: `You must be a <@&${constants.serverRoleIds.ytGoldMember}> to join the Block. Head on over to https://www.youtube.com/@GizzyGazza and click 'Join' if you wish to know more!\n<@${interaction.user.id}>`,
                ephemeral: true,
            });
        }

        let accountLinkId;

        const existingLinkId = await checkForExistingLink(interaction.user.id);

        if (existingLinkId.alreadyExists) {
            const linkedMinecraftUsername =
                existingLinkId.data.minecraftUsername;

            // Check if user has already linked their accounts
            if (
                linkedMinecraftUsername === null ||
                linkedMinecraftUsername === undefined
            ) {
                accountLinkId = existingLinkId.data._id;
            } else {
                return await interaction.followUp({
                    content: `You have already linked your Discord to the following Minecraft account: **${linkedMinecraftUsername}**`,
                    ephemeral: true,
                });
            }

            // If no existing account link, create one
        } else {
            accountLinkId = await createNewAccountLink(
                interaction.user.id,
                interaction
            );
        }

        await interaction.followUp({
            content: `Please join the Barn Life Minecraft server and run the following command:\n\n\`/discordlink ${accountLinkId}\``,
            ephemeral: true,
        });
    },
};

const createNewAccountLink = async (userId, interaction) => {
    const accountLinkId = crypto.randomUUID();

    const newUserRecord = {
        _id: accountLinkId,
        discordId: userId,
        minecraftUsername: null,
    };

    await createAccountLink(newUserRecord);
    const logChannel = interaction.client.channels.cache.get(
        process.env.LOG_CHANNEL_ID
    );
    logChannel.send(
        `<@${userId}> has run \`/theblock link\` and created a link.`
    );

    return accountLinkId;
};

const checkForExistingLink = async (userId) => {
    const response = await getExistingLinkByDiscordId(userId);

    let existingLinkId = {
        alreadyExists: false,
        data: {},
    };

    if (response !== null && response !== undefined) {
        existingLinkId.alreadyExists = true;
        existingLinkId.data = response;
    }

    return existingLinkId;
};
