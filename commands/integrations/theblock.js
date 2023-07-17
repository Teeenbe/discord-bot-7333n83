const { SlashCommandBuilder } = require("discord.js");
const constants = require("../../constants.json");
const testData = require("../../test-data");

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
        await interaction.deferReply({ ephemeral: false });

        // If user does not have the relevant role, notify and early return
        if (
            interaction.member._roles.includes(
                constants.serverRoleIds.ytGoldMember
            )
        ) {
            return await interaction.followUp({
                content: `You must be a <@&${constants.serverRoleIds.ytGoldMember}> to join the Block. Head on over to https://www.youtube.com/@GizzyGazza and click 'Join' if you wish to know more!\n<@${interaction.user.id}>`,
                ephemeral: false,
            });
        }

        // TODO: Remove
        await interaction.followUp(
            `(CONSOLE LOG): User has the <@&${constants.serverRoleIds.ytGoldMember}> role.`
        );

        let accountLinkId;

        const existingLinkId = await checkForExistingLink(
            interaction.user.id,
            interaction
        );

        if (existingLinkId.alreadyExists) {
            accountLinkId = existingLinkId.id;
        } else {
            accountLinkId = await createAccountLink(
                interaction.user.id,
                interaction
            );
        }

        await interaction.followUp({
            content: `Please join the Block Minecraft server and run the following command:\n\n\`/discordlink ${accountLinkId}\``,
            ephemeral: false,
        });
    },
};

const createAccountLink = async (userId, interaction) => {
    const accountLinkId = crypto.randomUUID();

    // TODO: Remove and replace with DB call
    await interaction.followUp(
        `(CONSOLE LOG): Link ID created for <@${userId}>`
    );

    const newUserRecord = {
        _id: accountLinkId,
        discordId: userId,
        minecraftUsername: null,
    };

    testData.push(newUserRecord);

    console.log(testData);

    return accountLinkId;
};

const checkForExistingLink = async (userId, interaction) => {
    // TODO: Remove and replace with DB call
    await interaction.followUp(
        `(CONSOLE LOG): Checking if link ID exists for <@${userId}>`
    );
    console.log(testData);

    const response = testData.find((user) => user.discordId === userId);

    let existingLinkId = {
        alreadyExists: false,
        id: "",
    };

    if (response !== undefined) {
        existingLinkId.alreadyExists = true;
        existingLinkId.id = response._id;
        // TODO: Remove
        await interaction.followUp(
            `(CONSOLE LOG): Existing link ID found for <@${userId}>`
        );
    }

    return existingLinkId;
};
