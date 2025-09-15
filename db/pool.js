import { Pool } from 'pg';


const pool = new Pool({
  host: "localhost", // or wherever the db is hosted
  user: "achaparro",
  database: "auth",
  password: "ustele",
  port: 5432 // The default port
});

export default pool;
