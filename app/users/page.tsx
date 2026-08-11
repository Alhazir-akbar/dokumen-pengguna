'use client';

import { useState } from 'react';
import { UserType } from '@/features/users/types';
import { mockUserTypes } from '@/features/users/data/mock-users';
import UsersSidebar from '@/features/users/components/userSidebar';
import EmptyUserPanel from '@/features/users/components/emptyUserPanel';
import UserDetailPanel from '@/features/users/components/userDetailPanel';
import UserFormPanel from '@/features/users/components/userFormPanel'; // Ganti dari Modal ke Panel Inline
import AppSidebar from '@/features/common/components/AppSidebar';

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>(mockUserTypes);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  
  // State untuk mode tampilan panel kanan ('detail', 'add', atau 'edit')
  const [mode, setMode] = useState<'detail' | 'add' | 'edit'>('detail');
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  // Handler saat kartu user diklik di sidebar
  const handleSelectUser = (user: UserType) => {
    setSelectedUser(user);
    setMode('detail');
  };

  // Handler buka form tambah
  const handleOpenAdd = () => {
    setEditingUser(null);
    setMode('add');
  };

  // Handler buka form edit
  const handleOpenEdit = (user: UserType) => {
    setEditingUser(user);
    setMode('edit');
  };

  // Handler Simpan Data (Create / Update)
  const handleSaveUser = (data: Omit<UserType, 'id'> & { id?: string }) => {
    if (mode === 'edit' && editingUser) {
      // Proses Update
      const updatedList = users.map((u) => (u.id === editingUser.id ? ({ ...u, ...data } as UserType) : u));
      setUsers(updatedList);
      const updatedUser = { ...editingUser, ...data } as UserType;
      setSelectedUser(updatedUser);
    } else {
      // Proses Create Baru
      const newUser: UserType = {
        id: data.id || Date.now().toString(),
        name: data.name,
        description: data.description,
        storiesCount: data.storiesCount || 0,
        personasCount: data.personasCount || 0,
        personas: data.personas || [],
      };
      setUsers([...users, newUser]);
      setSelectedUser(newUser);
    }
    setMode('detail');
    setEditingUser(null);
  };

  // Handler Hapus User
  const handleDeleteUser = (id: string) => {
    const filtered = users.filter((u) => u.id !== id);
    setUsers(filtered);
    if (selectedUser?.id === id) {
      setSelectedUser(null);
    }
    setMode('detail');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* 1. AppSidebar Utama (Ditambahkan activeMenu="user-types" agar tidak error TypeScript) */}
      <AppSidebar activeMenu="users" />

      {/* 2. UsersSidebar / Sub-Sidebar (Daftar User Types) */}
      <div className="w-80 shrink-0 border-r border-slate-200 bg-white">
        <UsersSidebar
          userTypes={users}
          selectedId={selectedUser?.id}
          onSelectUser={handleSelectUser}
          onAddNew={handleOpenAdd}
        />
      </div>

      {/* 3. Sisi Kanan: Panel Utama yang Dinamis (Bisa Detail, Form Add/Edit, atau Empty State) */}
      <main className="flex-1 overflow-y-auto p-8">
        {mode === 'add' || mode === 'edit' ? (
          <UserFormPanel
            initialData={editingUser}
            onSubmit={handleSaveUser}
            onCancel={() => setMode(selectedUser ? 'detail' : 'detail')}
          />
        ) : selectedUser ? (
          <UserDetailPanel
            user={selectedUser}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteUser}
          />
        ) : (
          <EmptyUserPanel onOpenAddModal={handleOpenAdd} />
        )}
      </main>

    </div>
  );
}