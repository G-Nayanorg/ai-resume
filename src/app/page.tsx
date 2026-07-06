import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Layers3,
  MessageSquareText,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Video,
  Zap,
} from 'lucide-react';

const metrics = [
  { value: '72%', label: 'less screening admin' },
  { value: '4.8x', label: 'faster shortlist reviews' },
  { value: '24/7', label: 'candidate interview access' },
];

const capabilities = [
  {
    icon: FileSearch,
    title: 'Resume intelligence',
    copy: 'Parse resumes, surface skill signals, and rank applicants against the role before recruiters open a profile.',
  },
  {
    icon: Video,
    title: 'AI interview rooms',
    copy: 'Run structured video and technical interviews with consistent prompts, transcripts, and scorecards.',
  },
  {
    icon: ClipboardCheck,
    title: 'Assessment workflows',
    copy: 'Create role-specific assessments, compare submissions, and move qualified candidates into the next stage.',
  },
  {
    icon: ShieldCheck,
    title: 'Governed hiring ops',
    copy: 'Give admins, recruiters, vendors, and candidates the right workspace with auditable access controls.',
  },
];

const workflow = [
  'Create a role and define must-have skills',
  'Invite candidates to guided AI interviews',
  'Review transcripts, scores, and fit evidence',
  'Schedule final rounds from a qualified shortlist',
];

const audiences = [
  {
    icon: BriefcaseBusiness,
    title: 'Recruiting teams',
    copy: 'Manage open roles, candidate pipelines, interview status, and hiring analytics from one workspace.',
  },
  {
    icon: UsersRound,
    title: 'Candidates',
    copy: 'A calm, guided experience for interview instructions, live assessment, and post-interview updates.',
  },
  {
    icon: Layers3,
    title: 'Platform admins',
    copy: 'Support multi-tenant controls, subscriptions, integrations, vendors, and compliance reporting.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative bg-[#07112f] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(20,184,166,0.22),transparent_32%),radial-gradient(circle_at_82%_10%,rgba(59,130,246,0.20),transparent_28%)]" />
        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="ATS home">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400 text-sm font-black text-[#07112f]">
              AI
            </span>
            <span className="text-xl font-bold">ATS Platform</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-200 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#workflow" className="transition hover:text-white">How it works</a>
            <a href="#use-cases" className="transition hover:text-white">Use cases</a>
            <a href="#security" className="transition hover:text-white">Trust</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/recruiter/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-[#07112f] shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-100"
            >
              Launch
              <ArrowRight size={16} />
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-10 sm:px-8 md:pb-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/8 px-4 py-2 text-sm font-semibold text-cyan-100">
              <Sparkles size={16} />
              AI interviews, screening, and hiring automation
            </div>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Hire faster with structured AI-powered interviews.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Build a recruitment command center for resume screening, role-based assessments,
              candidate interviews, scorecards, and operational oversight.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/candidate"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-5 py-3 text-sm font-black text-[#07112f] transition hover:bg-cyan-300"
              >
                <PlayCircle size={18} />
                Try candidate flow
              </Link>
              <Link
                href="/admin/tenants"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                View admin console
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="border-l border-white/20 pl-4">
                  <div className="text-3xl font-black text-white">{metric.value}</div>
                  <div className="mt-1 text-sm text-slate-300">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-white/15 bg-white/5 shadow-2xl shadow-cyan-950/40">
              <Image
                src="/images/ai-hiring-dashboard.png"
                alt="AI hiring dashboard with candidate pipeline, interview scorecards, resume match, schedule, and analytics"
                width={1600}
                height={1000}
                className="h-auto w-full"
                priority
              />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 grid grid-cols-3 gap-2 rounded-lg border border-white/15 bg-[#0b1738]/95 p-3 shadow-xl backdrop-blur">
              {['Resume match', 'AI scorecards', 'Live pipeline'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-700">Platform</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Everything your hiring team needs between application and offer.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <item.icon className="h-8 w-8 text-teal-700" />
                <h3 className="mt-5 text-lg font-black text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-slate-50 px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">Workflow</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Turn scattered screening tasks into one governed hiring flow.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Recruiters can move from job setup to interview evidence without juggling
              spreadsheets, calendar threads, and manual score normalization.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            {workflow.map((step, index) => (
              <div key={step} className="grid grid-cols-[44px_1fr] gap-4 border-b border-slate-100 py-5 last:border-b-0">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#07112f] text-sm font-black text-cyan-200">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-black text-slate-950">{step}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {index === 0 && 'Capture competencies, experience levels, and evaluation rules for each job.'}
                    {index === 1 && 'Send candidates a consistent, branded interview path that works around their schedule.'}
                    {index === 2 && 'Let hiring teams inspect the evidence behind every AI-assisted recommendation.'}
                    {index === 3 && 'Move finalists forward with cleaner context and fewer repetitive handoffs.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">Workspaces</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Built for every side of the hiring process.
              </h2>
            </div>
            <Link
              href="/recruiter/dashboard"
              className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-teal-700 hover:text-teal-700"
            >
              Open recruiter workspace
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {audiences.map((item) => (
              <article key={item.title} className="rounded-lg bg-slate-950 p-7 text-white">
                <item.icon className="h-9 w-9 text-cyan-300" />
                <h3 className="mt-6 text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="bg-[#eef7f6] px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-800">Trust</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Controls for serious hiring operations.
            </h2>
          </div>

          <div className="grid gap-4 lg:col-span-2 sm:grid-cols-2">
            {[
              ['Role-aware access', 'Keep admin, recruiter, vendor, and candidate experiences separated.'],
              ['Audit-ready activity', 'Track interviews, decisions, tenant activity, and platform health.'],
              ['Human review first', 'Use AI as evidence and acceleration, not a silent black-box decision.'],
              ['Scalable routing', 'Support regional portals, multiple organizations, and subscription plans.'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-lg border border-teal-900/10 bg-white p-5">
                <Zap className="h-6 w-6 text-teal-700" />
                <h3 className="mt-4 font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#07112f] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-cyan-200">
              <Bot size={24} />
              <span className="text-sm font-black uppercase tracking-[0.18em]">Ready for smarter screening</span>
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Bring AI interviews, assessments, and hiring analytics into one platform.
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-black text-[#07112f] transition hover:bg-cyan-100"
            >
              Sign in
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/candidate"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <MessageSquareText size={18} />
              Candidate demo
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <span className="font-semibold text-slate-700">ATS Platform</span>
          <span>AI hiring automation for modern recruitment teams.</span>
          <span>&copy; 2026 ATS Platform</span>
        </div>
      </footer>
    </main>
  );
}
