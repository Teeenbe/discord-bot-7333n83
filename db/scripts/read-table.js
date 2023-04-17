const pool = require("../index.js");

const readTable = () => {
  pool.getConnection((err, con) => {
    if (err) {
      throw err;
    }

    const sql = `SELECT * FROM reaction_messages;`;

    con.query(sql, (err, res) => {
      if (err) {
        throw err;
      }

      console.log(res);
    });
  });
};

readTable();
