const pool = require("../../db/index.js");

const addReactionMessage = async ({ id, channelId, reactions, roles }) => {
  try {
    const reactionsArrToObj = Object.assign({}, reactions);
    const jsonReactions = `'${JSON.stringify(reactionsArrToObj)}'`;

    const rolesArrToObj = Object.assign({}, roles);
    const jsonRoles = `'${JSON.stringify(rolesArrToObj)}'`;

    const sql = `INSERT INTO reaction_messages (message_id, channel_id, reactions, roles) VALUES (${id}, ${channelId}, ${jsonReactions}, ${jsonRoles});`;

    const res = await pool.query(sql);
    console.log("ENTRY CREATED IN reaction_messages.");
    console.log(res[0]);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getReactionMessage = async (messageId) => {
  let messageData = "Not Defined";

  const sql = `SELECT * FROM reaction_messages WHERE message_id = ?;`;

  const [rows, fields] = await pool.query(sql, [messageId]);
  messageData = rows[0];

  return messageData;
};

module.exports = {
  addReactionMessage,
  getReactionMessage,
};
