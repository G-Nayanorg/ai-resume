import React from 'react';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

interface CandidateShellProps {
  children: React.ReactNode;
}

export function CandidateShell({ children }: CandidateShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
        <Link href="/candidate" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">ATS</span>
          </div>
          <span className="font-semibold text-slate-900 hidden sm:inline-block">Acme Corp Careers</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <HelpCircle size={18} />
            <span className="hidden sm:inline-block">Support</span>
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8">
        <div className="w-full max-w-3xl">
          {children}
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-slate-500 shrink-0">
        &copy; {new Date().getFullYear()} Acme Corp. All rights reserved.
      </footer>
    </div>
  );
}
