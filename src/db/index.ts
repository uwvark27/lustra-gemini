import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Create a connection pool to your MariaDB on the QNAP
const poolConnection = mysql.createPool(process.env.DATABASE_URL as string);

// Export the db instance with the schema attached for relational queries
export const db = drizzle(poolConnection, { schema, mode: 'default' });
