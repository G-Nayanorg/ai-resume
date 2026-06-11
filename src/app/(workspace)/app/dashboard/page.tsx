import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Upload, 
  Users, 
  Briefcase, 
  Clock,
  ArrowUpRight
} from "lucide-react";

export default function WorkspaceDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Overview of your active hiring pipelines and recent activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Resumes
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Job
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Active Jobs" 
          value="12" 
          description="+2 from last month" 
          icon={<Briefcase className="w-4 h-4 text-primary" />} 
        />
        <StatsCard 
          title="Total Candidates" 
          value="1,284" 
          description="+18% growth" 
          icon={<Users className="w-4 h-4 text-primary" />} 
        />
        <StatsCard 
          title="Needs Review" 
          value="24" 
          description="Pending parsing queue" 
          icon={<Clock className="w-4 h-4 text-warning" />} 
        />
        <StatsCard 
          title="Interviews Today" 
          value="6" 
          description="Next at 2:30 PM" 
          icon={<ArrowUpRight className="w-4 h-4 text-success" />} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Recent Candidate Matches</CardTitle>
            <CardDescription>Top ranked candidates for your active job postings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Sarah Jenkins</TableCell>
                  <TableCell>Senior React Dev</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">92% Match</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Interviewing</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Marcus Chen</TableCell>
                  <TableCell>UX Designer</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">88% Match</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Screening</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Elena Rodriguez</TableCell>
                  <TableCell>Senior React Dev</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">74% Match</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Applied</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Parsing Queue</CardTitle>
              <CardDescription>System is processing 4 files.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <QueueItem name="resume_j_smith.pdf" status="Parsing" progress={75} />
              <QueueItem name="cv_final_v2.docx" status="OCR" progress={30} />
              <QueueItem name="portf_alex.pdf" status="Queued" progress={0} />
              <Button variant="ghost" className="w-full text-xs text-slate-500 mt-2 hover:bg-slate-50">
                View All Processing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, description, icon }: { title: string; value: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-slate-400 mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function QueueItem({ name, status, progress }: { name: string; status: string; progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-slate-700 truncate max-w-[150px]">{name}</span>
        <span className="text-slate-500">{status}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-primary transition-all duration-500 ${status === 'Queued' ? 'opacity-30' : ''}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
