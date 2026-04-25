import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function UsersPage() {
  // Fetch all users and join their corresponding role from the roles table
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      roleName: roles.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id));

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Users</h1>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
          Add User
        </button>
      </div>
      
      {allUsers.length === 0 ? (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md border border-yellow-200">
          <p>No users found in the database. Go add a test user in phpMyAdmin to see them appear here!</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <ul className="divide-y divide-slate-200">
            {allUsers.map((user) => (
              <li key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{user.roleName || 'No Role'}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}