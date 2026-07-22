import React from 'react';
import { CandidateShell } from '@/components/common/CandidateShell';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return <CandidateShell>{children}</CandidateShell>;
}
