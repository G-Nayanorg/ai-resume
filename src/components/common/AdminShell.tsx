"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Server, 
  Users, 
  ShieldAlert, 
  Activity, 
  Settings, 
  Search,
  Bell,
  Menu,
  Database,
  UserCircle,
  LogOut,
  Key
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';
import { authApi } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [profileOpen, setProfileOpen] = React.useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [pwdLoading, setPwdLoading] = React.useState(false);
  const [pwdError, setPwdError] = React.useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = React.useState<string | null>(null);
  const [pwdData, setPwdData] = React.useState({ current: "", new: "", confirm: "" });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);
    
    if (pwdData.new.length < 8) {
      setPwdError("New password must be at least 8 characters");
      return;
    }
    if (pwdData.new !== pwdData.confirm) {
      setPwdError("Passwords do not match");
      return;
    }

    setPwdLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPwdSuccess("Password updated successfully!");
      setPwdData({ current: "", new: "", confirm: "" });
    } catch (err) {
      setPwdError("Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logout();
      router.push('/login');
    }
  };
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
            <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full hidden sm:inline-block">All Systems Operational</span>
            <button className="text-slate-500 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
              <Bell size={18} />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-3 border-l border-slate-200 text-left hover:opacity-85 transition-opacity focus:outline-none cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-900">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{user?.role?.toLowerCase().replace('_', ' ') || 'Guest'}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                   <UserCircle size={20} />
                </div>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-40 animate-in fade-in slide-in-from-top-1 duration-100">
                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        setProfileOpen(true);
                      }} 
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserCircle size={16} className="text-slate-400" /> 
                      Profile Details
                    </button>
                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        setChangePasswordOpen(true);
                      }} 
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Key size={16} className="text-slate-400" /> 
                      Change Password
                    </button>
                    <hr className="border-slate-100 my-1" />
                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} className="text-red-500" /> 
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-slate-900">Profile Details</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Your super admin account details and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</label>
              <div className="mt-1 text-sm font-semibold text-slate-900">{user?.name || "Super Admin"}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="mt-1 text-sm font-semibold text-slate-900">{user?.email || "N/A"}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">System Role</label>
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 capitalize">
                  {user?.role?.toLowerCase().replace("_", " ") || "Super Admin"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => setProfileOpen(false)}
              className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-slate-900">Change Password</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Update your super admin account password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {pwdError && (
              <div className="p-3 text-xs text-red-700 bg-red-50 rounded border border-red-200 text-center">
                {pwdError}
              </div>
            )}
            {pwdSuccess && (
              <div className="p-3 text-xs text-emerald-700 bg-emerald-50 rounded border border-emerald-200 text-center">
                {pwdSuccess}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  value={pwdData.current}
                  onChange={(e) => setPwdData({ ...pwdData, current: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  value={pwdData.new}
                  onChange={(e) => setPwdData({ ...pwdData, new: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  value={pwdData.confirm}
                  onChange={(e) => setPwdData({ ...pwdData, confirm: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:bg-white outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button 
                type="button"
                onClick={() => {
                  setChangePasswordOpen(false);
                  setPwdData({ current: "", new: "", confirm: "" });
                  setPwdError(null);
                  setPwdSuccess(null);
                }}
                className="px-4 py-2 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={pwdLoading}
                className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-55 cursor-pointer"
              >
                {pwdLoading ? "Saving..." : "Change Password"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
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
