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
    JOIN users ON messages.author_id = users.id
    ORDER BY created_at DESC;
  `);
  return rows;
}

async function updateMembershipStatus(id) {
  const {rows} = await pool.query(`
    UPDATE users
    SET membership_status = 'member'
    WHERE id = $1
    RETURNING *;
      `, [id]
      );
    return rows[0];
}

async function postMessageToDB(messageTitle, messageContent, authorId){
  const {rows} = await pool.query(`
    INSERT INTO messages (title, content, author_id, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *;
  
  `, [messageTitle, messageContent, authorId]);
  return rows[0];
}

export {
  addNewUserToDB,
  getAllDataFromDB,
  updateMembershipStatus,
  postMessageToDB,

}

