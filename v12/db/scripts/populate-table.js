const pool = require("../index.js");

// Example data
const testMessageId = 1234567890;
const testChannelId = 0987654321;
const testReactions = [":blue_circle:", ":red_circle:", ":yellow_circle:"];
const testRoles = ["blue", "red", "yellow"];

const populateTable = () => {
  pool.getConnection((err, con) => {
    if (err) {
      throw err;
    }

    const reactionsArrToObj = Object.assign({}, testReactions);
    const jsonReactions = `'${JSON.stringify(reactionsArrToObj)}'`;

    const rolesArrToObj = Object.assign({}, testRoles);
    const jsonRoles = `'${JSON.stringify(rolesArrToObj)}'`;

    const sql = `INSERT INTO reaction_messages (message_id, channel_id, reactions, roles) VALUES (${testMessageId}, ${testChannelId}, ${jsonReactions}, ${jsonRoles});`;

    con.query(sql, (err, res) => {
      if (err) {
        throw err;
      }

      console.log("TABLE reaction_messages POPULATED");
      console.log(res);
    });
  });
};

populateTable();
