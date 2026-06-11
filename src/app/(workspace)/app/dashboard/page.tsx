import React from 'react';

export default function WorkspaceDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm">
          Create Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Needs Attention</h3>
          <p className="text-3xl font-bold text-slate-900">12</p>
          <p className="text-sm text-slate-500 mt-2">Resumes queued for review</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-slate-900">8</p>
          <p className="text-sm text-slate-500 mt-2">Across 3 departments</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Interviews Today</h3>
          <p className="text-3xl font-bold text-slate-900">4</p>
          <p className="text-sm text-slate-500 mt-2">Next at 2:00 PM</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-800">Recent Uploads</h2>
        </div>
        <div className="p-6 flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No resumes parsed yet</h3>
          <p className="text-slate-500 max-w-md mb-6">Upload candidate resumes to start the automated parsing and ranking process.</p>
          <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm">
            Upload Resumes
          </button>
        </div>
      </div>
    </div>
  );
}
