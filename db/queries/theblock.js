const mongoClient = require("../clients/mongo.js");

const createAccountLink = async (newUserRecord) => {
    let result;

    try {
        await mongoClient.connect();
        const db = await mongoClient.db(process.env.MONGO_DB_NAME);

        const collection = db.collection(
            process.env.MONGO_COLLECTION_NAME_BLOCK_LINK
        );
        result = await collection.insertOne(newUserRecord);
    } finally {
        await mongoClient.close();
    }
    return result;
};

const getExistingLinkByDiscordId = async (userId) => {
    let result;

    try {
        await mongoClient.connect();
        const db = await mongoClient.db(process.env.MONGO_DB_NAME);

        const collection = db.collection(
            process.env.MONGO_COLLECTION_NAME_BLOCK_LINK
        );
        result = await collection.findOne({ discordId: `${userId}` });
    } finally {
        await mongoClient.close();
    }
    console.log(result);
    return result;
};

module.exports = { createAccountLink, getExistingLinkByDiscordId };
