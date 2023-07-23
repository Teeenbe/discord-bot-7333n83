const { MongoClient, ServerApiVersion } = require("mongodb");

const mongoUri = process.env.MONGO_CONNECTION_URI;

const client = new MongoClient(mongoUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

module.exports = client;
