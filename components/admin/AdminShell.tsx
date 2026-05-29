'use client';

import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Toast } from './Toast';
import { TopBar } from './TopBar';

type User = {
  email?: string;
  name?: string;
};

export function AdminShell({ children, user }: { children: ReactNode; user?: User | null }) {
  return (
    <div className="admin-shell">
      <Toast />
      <Sidebar user={user} />
      <main className="admin-main">
        <TopBar user={user} />
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
