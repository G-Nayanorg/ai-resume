import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4">
      <header className="max-w-7xl w-full mx-auto flex justify-between items-center py-6 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="text-xl font-bold text-slate-900">ATS</span>
        </div>
        <Link 
          href="/login" 
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-md font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center space-y-8 px-4">
        <div className="max-w-3xl w-full space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            The Intelligent Hiring Platform for Modern Teams
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Automated screening, structured interviews, and data-driven matching in one adaptive workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left max-w-5xl w-full">
          <Link href="/app/dashboard" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <h2 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">Recruiter Workspace</h2>
            <p className="text-slate-600 text-sm">Review matches, manage candidates, and track interview progress.</p>
          </Link>
          
          <Link href="/candidate" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <h2 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">Candidate Experience</h2>
            <p className="text-slate-600 text-sm">A guided, distraction-free space for your interview journey.</p>
          </Link>
          
          <Link href="/admin/tenants" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <h2 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">Platform Admin</h2>
            <p className="text-slate-600 text-sm">Dense governance tools for multi-tenant management and health auditing.</p>
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">
        &copy; 2026 ATS Platform. All rights reserved.
      </footer>
    </div>
  );
}
