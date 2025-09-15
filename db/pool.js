import { Pool } from 'pg';


const pool = new Pool({
  host: "localhost", 
  user: "achaparro",
  database: "club",
  password: "ustele",
  port: 5432 
});

export default pool;
