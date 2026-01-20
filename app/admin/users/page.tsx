
import React from 'react';

export default function AdminUsersPage() {
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
            <input className="w-full pl-10 pr-4 py-2.5 bg-background-light border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Search by name, email or ID..." type="text"/>
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-background-light border-none rounded-lg text-sm px-4 py-2.5 min-w-[140px] focus:ring-2 focus:ring-primary/50 outline-none">
              <option>All Roles</option>
              <option>Student</option>
              <option>Tutor</option>
              <option>Admin</option>
            </select>
            <select className="bg-background-light border-none rounded-lg text-sm px-4 py-2.5 min-w-[140px] focus:ring-2 focus:ring-primary/50 outline-none">
              <option>All Status</option>
              <option>Active</option>
              <option>Disabled</option>
              <option>Pending</option>
            </select>
          </div>
        </div>
        
        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Static Data for Demo */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-cover bg-center shadow-inner bg-slate-200 flex items-center justify-center font-bold text-slate-500">SJ</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">Sarah Jenkins</span>
                      <span className="text-xs text-slate-500">ID: #92831</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">sarah.j@example.com</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 uppercase">Student</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <span className="size-1.5 rounded-full bg-green-600"></span>
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">Oct 12, 2023</td>
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
            </tbody>
          </table>
        </div>
        
        {/* Pagination Component */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Showing</span>
            <span className="font-bold text-slate-900">1 to 10</span>
            <span>of</span>
            <span className="font-bold text-slate-900">1,248</span>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-400 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="size-8 flex items-center justify-center rounded-md bg-primary text-white font-bold text-sm cursor-pointer">1</button>
            <button className="size-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 font-medium text-sm transition-colors cursor-pointer">2</button>
            <button className="size-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 font-medium text-sm transition-colors cursor-pointer">3</button>
            <span className="px-1 text-slate-400">...</span>
            <button className="size-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 font-medium text-sm transition-colors cursor-pointer">125</button>
            <button className="p-1 text-slate-400 hover:text-primary cursor-pointer">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
