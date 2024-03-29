const { REST, Routes } = require("discord.js");
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.DEV_GUILD_ID;
const fs = require("node:fs");
const path = require("node:path");

const guildCommands = [];
const globalCommands = [];
// Grab all the command folders from the commands directory
const foldersPath = path.join(`${__dirname}/../`, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
            if (command.deployGlobally) {
                globalCommands.push(command.data.toJSON());
            } else {
                guildCommands.push(command.data.toJSON());
            }
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(
            `Started refreshing ${
                globalCommands.length + guildCommands.length
            } application (/) commands.`
        );

        // The put method is used to fully refresh all commands in the guild with the current set
        const globalCommandData = await rest.put(
            Routes.applicationCommands(clientId),
            { body: globalCommands }
        );
        const guildCommandData = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: guildCommands }
        );

        console.log(
            `Successfully reloaded ${
                globalCommandData.length + guildCommandData.length
            } application (/) commands.`
        );
    } catch (error) {
        console.error(error);
    }
})();
