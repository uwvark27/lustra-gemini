import { db } from '@/db';
import { roles } from '@/db/schema';

export default async function RolesPage() {
  // Fetch all roles from the MariaDB database using Drizzle!
  const allRoles = await db.select().from(roles);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">System Roles</h1>
      
      {allRoles.length === 0 ? (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md border border-yellow-200">
          <p>No roles found in the database. Go add a test role in phpMyAdmin to see it appear here!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {allRoles.map((role) => (
            <li key={role.id} className="bg-white border border-slate-200 px-4 py-3 rounded-lg shadow-sm font-medium text-slate-700 flex items-center">
              <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded mr-3">ID: {role.id}</span> 
              {role.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}