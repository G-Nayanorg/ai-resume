import React from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Users, 
  FileText, 
  BarChart, 
  Settings, 
  Bell, 
  Search,
  Menu,
  UserCircle
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-white/50 border-slate-200 h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-primary flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white text-sm">ATS</span>
            </div>
            Acme Corp
          </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem href="/app/dashboard" icon={<BarChart size={20} />} label="Dashboard" active />
          <NavItem href="/app/jobs" icon={<Briefcase size={20} />} label="Jobs" />
          <NavItem href="/app/candidates" icon={<Users size={20} />} label="Candidates" />
          <NavItem href="/app/resumes" icon={<FileText size={20} />} label="Resumes" />
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <NavItem href="/app/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4 md:hidden">
            <button className="text-slate-500 hover:text-slate-700">
              <Menu size={24} />
            </button>
            <span className="font-bold text-primary">ATS</span>
          </div>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search candidates, jobs..." 
                className="w-full bg-slate-100 border-none rounded-md pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 cursor-pointer">
               <UserCircle size={20} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
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
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'bg-primary/10 text-primary' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
