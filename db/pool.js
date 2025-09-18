// import { Pool } from 'pg';


// const pool = new Pool({
//   host: "localhost", 
//   user: "achaparro",
//   database: "club",
//   password: "",
//   port: 5432 
// });

// export default pool;
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

export default pool;
