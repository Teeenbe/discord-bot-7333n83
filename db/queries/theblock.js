const mongoClient = require("../clients/mongo.js");

const dbName = process.env.MONGO_DB_NAME_GG;
const collectionName = process.env.MONGO_COLLECTION_NAME_BLOCK_LINK;

const createAccountLink = async (newUserRecord) => {
    let result;

    try {
        await mongoClient.connect();
        const db = await mongoClient.db(dbName);

        const collection = db.collection(collectionName);
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
        const db = await mongoClient.db(dbName);

        const collection = db.collection(collectionName);
        result = await collection.findOne({ discordId: `${userId}` });
    } finally {
        await mongoClient.close();
    }

    return result;
};

module.exports = { createAccountLink, getExistingLinkByDiscordId };
