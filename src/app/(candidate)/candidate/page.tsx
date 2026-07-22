import React from 'react';

export default function CandidateDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Welcome, Alex</h1>
        <p className="text-slate-500">Track your applications and upcoming interviews.</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Upcoming Interview</h2>
        <p className="text-slate-600 mb-6">Senior Frontend Engineer role at Acme Corp</p>
        
        <div className="bg-slate-50 border border-slate-200 rounded-md p-4 mb-6 inline-flex flex-col sm:flex-row items-center gap-4 text-left">
          <div className="flex-1">
            <p className="font-semibold text-slate-900">Technical Screening (Video)</p>
            <p className="text-sm text-slate-500">Duration: 45 minutes</p>
          </div>
          <div className="text-sm text-slate-600 bg-white px-3 py-2 border border-slate-200 rounded">
            Due by: June 15, 2026
          </div>
        </div>

        <div>
          <button className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto">
            Start Interview Setup
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">Application History</h3>
        
        <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-medium text-slate-900">Senior Frontend Engineer</h4>
            <p className="text-sm text-slate-500">Applied on June 10, 2026</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Interview Stage
          </span>
        </div>
      </div>
    </div>
  );
}
