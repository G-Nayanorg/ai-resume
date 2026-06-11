import React from 'react';
import Link from 'next/link';
import { 
  Server, 
  Users, 
  ShieldAlert, 
  Activity, 
  Settings, 
  Search,
  Bell,
  Menu,
  Database
} from 'lucide-react';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-slate-900 text-slate-300 h-screen sticky top-0">
        <div className="h-16 flex items-center px-4 border-b border-slate-800">
          <span className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert size={20} className="text-primary" />
            Super Admin
          </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Governance</div>
          <NavItem href="/admin/tenants" icon={<Database size={18} />} label="Tenants" active />
          <NavItem href="/admin/users" icon={<Users size={18} />} label="Global Users" />
          <NavItem href="/admin/audits" icon={<Server size={18} />} label="Audit Logs" />
          
          <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</div>
          <NavItem href="/admin/health" icon={<Activity size={18} />} label="Health" />
          <NavItem href="/admin/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-4">
          <div className="flex items-center gap-4 md:hidden">
            <button className="text-slate-500 hover:text-slate-700">
              <Menu size={24} />
            </button>
            <span className="font-bold text-slate-900">Admin Console</span>
          </div>

          <div className="hidden md:flex items-center gap-2 flex-1">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tenant ID or email..." 
                className="w-full bg-slate-100 border-none rounded pl-9 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-primary focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">All Systems Operational</span>
            <button className="text-slate-500 hover:text-slate-700">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
        active 
          ? 'bg-slate-800 text-white' 
          : 'hover:bg-slate-800/50 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
