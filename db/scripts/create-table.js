const pool = require("../index.js");

const createTable = () => {
  pool.getConnection((err, con) => {
    if (err) {
      throw err;
    }

    const sql = `CREATE TABLE IF NOT EXISTS reaction_messages (message_id BIGINT(255) PRIMARY KEY, channel_id BIGINT(255) NOT NULL, reactions LONGTEXT, roles LONGTEXT);`;

    con.query(sql, (err, res) => {
      if (err) {
        throw err;
      }

      console.log("Table reaction_messages created:");
      console.log(res);
    });
  });
};

createTable();
