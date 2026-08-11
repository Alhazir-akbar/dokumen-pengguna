'use client';

import { useState } from 'react';
import { UserType } from '@/features/users/types';
import { mockUserTypes } from '@/features/users/data/mock-users';
import UsersSidebar from '@/features/users/components/userSidebar';
import EmptyUserPanel from '@/features/users/components/emptyUserPanel';
import UserDetailPanel from '@/features/users/components/userDetailPanel';
import UserFormModal from '@/features/users/components/userFormPanel'; 
import AppSidebar from '@/features/common/components/AppSidebar';

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>(mockUserTypes);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  
  // State untuk Modal Tambah/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  // Handler saat kartu user diklik di sidebar
  const handleSelectUser = (user: UserType) => {
    setSelectedUser(user);
  };

  // Handler buka modal tambah
  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Handler buka modal edit
  const handleOpenEdit = (user: UserType) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Handler Simpan Data (Create / Update)
  const handleSaveUser = (data: Omit<UserType, 'id'> & { id?: string }) => {
    if (editingUser) {
      // Proses Update
      const updatedList = users.map((u) => (u.id === editingUser.id ? ({ ...u, ...data } as UserType) : u));
      setUsers(updatedList);
      if (selectedUser?.id === editingUser.id) {
        setSelectedUser({ ...selectedUser, ...data } as UserType);
      }
    } else {
      // Proses Create Baru
      const newUser: UserType = {
        id: data.id || Date.now().toString(),
        name: data.name,
        description: data.description,
        storiesCount: data.storiesCount,
        personasCount: data.personasCount,
      };
      setUsers([...users, newUser]);
      setSelectedUser(newUser);
    }
  };

  // Handler Hapus User
  const handleDeleteUser = (id: string) => {
    const filtered = users.filter((u) => u.id !== id);
    setUsers(filtered);
    if (selectedUser?.id === id) {
      setSelectedUser(null);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* 1. AppSidebar Utama (Menu navigasi kiri luar) */}
      <AppSidebar />

      {/* 2. UsersSidebar / Sub-Sidebar (Daftar User Types) */}
      <div className="w-80 shrink-0 border-r border-slate-200 bg-white">
        <UsersSidebar
          userTypes={users}
          selectedId={selectedUser?.id}
          onSelectUser={handleSelectUser}
          onAddNew={handleOpenAdd}
        />
      </div>

      {/* 3. Sisi Kanan: Panel Utama (Detail atau Empty State) */}
      <main className="flex-1 overflow-y-auto p-8">
        {selectedUser ? (
          <UserDetailPanel
            user={selectedUser}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteUser}
          />
        ) : (
          <EmptyUserPanel onOpenAddModal={handleOpenAdd} />
        )}
      </main>

      {/* Modal Form Tambah / Edit */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveUser}
        initialData={editingUser}
      />
    </div>
  );
}