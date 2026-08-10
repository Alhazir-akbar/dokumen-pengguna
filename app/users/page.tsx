// app/users/page.tsx
'use client';

import { useState } from 'react';
import AppSidebar from '@/features/common/components/AppSidebar';
import UsersSidebar from '@/features/users/components/userSidebar';
import UserDetailPanel from '@/features/users/components/userDetailPanel';
import EmptyUserPanel from '@/features/users/components/emptyUserPanel';
import { mockUserTypes } from '@/features/users/data/mock-users';
import { UserType } from '@/features/users/types';
import { MessageSquare } from 'lucide-react';

export default function UsersPage() {
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(mockUserTypes[0] || null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans">
      {/* 1. Main Navigation Toolbar (Global Sidebar dengan menu aktif 'users') */}
      <AppSidebar activeMenu="users" />

      {/* 2. Sub-Sidebar (Daftar User Types khusus halaman ini) */}
      <UsersSidebar 
        userTypes={mockUserTypes} 
        selectedId={selectedUserType?.id} 
        onSelectUser={(user: UserType) => setSelectedUserType(user)} 
      />

      {/* 3. Main Content / Detail Panel (Sisi Kanan) */}
      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Top Navbar Kecil */}
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
          <span className="text-xs font-medium text-gray-500">alalal -</span>
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-100 transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              UD
            </div>
          </div>
        </div>

        {/* Dynamic Detail Panel */}
        {selectedUserType ? (
          <UserDetailPanel userType={selectedUserType} />
        ) : (
          <EmptyUserPanel />
        )}
      </main>
    </div>
  );
}