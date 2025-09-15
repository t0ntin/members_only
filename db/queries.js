import pool from "./pool.js";

async function addNewUserToDB(firstName, lastName, email, password) {
  
  const {rows} = await pool.query(`
    INSERT INTO users (first_name, last_name, email, password_hash)
    VALUES($1, $2, $3, $4)
  `, [firstName, lastName, email, password]
  );
  return rows[0];
}

export {
  addNewUserToDB,

}