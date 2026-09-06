import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main(){
  const res = await pool.query('select id, email from users order by id desc limit 5');
  console.log('users:', res.rows);
  await pool.end();
}

main().catch(e=>{console.error(e); process.exit(1)});
