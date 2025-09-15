import pool from "./pool.js";

async function addNewUserToDB(firstName, lastName, email, password) {
  
  const {rows} = await pool.query(`
    INSERT INTO users (first_name, last_name, email, password_hash)
    VALUES($1, $2, $3, $4)
  `, [firstName, lastName, email, password]
  );
  return rows[0];
}

async function getAllDataFromDB() {
  const {rows} = await pool.query(`
    SELECT 
    messages.title,
    messages.content,
    messages.created_at,
    users.first_name,
    users.last_name
    FROM messages
    JOIN users ON messages.author_id = users.id;
  `);
  return rows;
}

export {
  addNewUserToDB,
  getAllDataFromDB,

}

