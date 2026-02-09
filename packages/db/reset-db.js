const postgres = require('postgres');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }
});

async function reset() {
  console.log('Dropping schema public...');
  await sql`DROP SCHEMA public CASCADE`;
  console.log('Creating schema public...');
  await sql`CREATE SCHEMA public`;
  console.log('Database reset complete.');
  process.exit(0);
}

reset().catch((err) => {
  console.error(err);
  process.exit(1);
});
