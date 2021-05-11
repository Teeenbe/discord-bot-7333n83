const pool = require("../index.js");

const deleteTable = () => {
  pool.getConnection((err, con) => {
    if (err) {
      throw err;
    }

    const sql = "DROP TABLE reaction_messages;";

    con.query(sql, (err, res) => {
      if (err) {
        throw err;
      }

      console.log("Table reaction_messages dropped.");
    });
  });
};

deleteTable();
