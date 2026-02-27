import React from 'react';
import { createClient } from "@/lib/supabase/server";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Fetch users from profiles
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* PageHeading Component */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h2>
          <p className="text-slate-500 mt-1">Manage, monitor and moderate the IELTS self-study community members.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-lg">file_download</span>
            <span>Export Users</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer">
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Filters and Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* SearchBar & Filter Component */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input className="w-full pl-10 pr-4 py-2.5 bg-background-light border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Search by name or ID..." type="text" />
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-background-light border-none rounded-lg text-sm px-4 py-2.5 min-w-[140px] focus:ring-2 focus:ring-primary/50 outline-none">
              <option>All Roles</option>
              <option>student</option>
              <option>admin</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Target Band</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users && users.length > 0 ? users.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatar_url ? (
                        <div className="size-10 rounded-full bg-cover bg-center shadow-inner" style={{ backgroundImage: `url(${u.avatar_url})` }}></div>
                      ) : (
                        <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                          {u.full_name?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{u.full_name || 'Anonymous User'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">{u.id.split('-')[0]}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[11px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role || 'student'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-700">{u.target_band || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Showing all {users ? users.length : 0} users</span>
          </div>
        </div>
      </div>
    </div>
  );
}
