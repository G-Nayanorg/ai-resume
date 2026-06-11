import React from 'react';

export default function SuperAdminTenantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Tenants</h1>
        <button className="bg-primary text-white px-4 py-2 rounded font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm">
          Create Tenant
        </button>
      </div>

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Tenant Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Users</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">Acme Corp</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">Enterprise</td>
                <td className="px-6 py-4">42</td>
                <td className="px-6 py-4 text-slate-500">Jan 12, 2026</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary hover:text-primary/80 font-medium">Manage</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">TechFlow Inc</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">Pro</td>
                <td className="px-6 py-4">15</td>
                <td className="px-6 py-4 text-slate-500">Feb 28, 2026</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary hover:text-primary/80 font-medium">Manage</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
