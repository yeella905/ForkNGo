const db = require("../connection");

const getUser = (recipients) => {
  const querystring = `SELECT * FROM recipients 
    WHERE name = $1 AND email = $2;`;
  const values = [recipients.name, recipients.email];
  return db.query(querystring, values).then((data) => {
    return data.rows;
  });
};

module.exports = { getUser };
