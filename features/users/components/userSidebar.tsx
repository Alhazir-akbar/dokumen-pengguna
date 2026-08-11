// features/users/components/UsersSidebar.tsx
'use client';

import { useState, useMemo } from 'react';
import { UserType } from '../types';
import { User, Plus, Search, ChevronDown } from 'lucide-react';

interface UsersSidebarProps {
  userTypes: UserType[];
  selectedId?: string;
  onSelectUser: (user: UserType) => void;
  onAddNew?: () => void;
}

export default function UsersSidebar({ userTypes, selectedId, onSelectUser, onAddNew }: UsersSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter daftar user types berdasarkan nama atau deskripsi
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return userTypes;

    const query = searchQuery.toLowerCase();
    return userTypes.filter(
      (type) =>
        type.name.toLowerCase().includes(query) ||
        type.description.toLowerCase().includes(query)
    );
  }, [userTypes, searchQuery]);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      
      {/* Header Sub-Sidebar dengan Search Bar & Tombol Tambah */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          {/* Input Search Bar */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Tombol Add / Create */}
          <button
            type="button"
            onClick={onAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg transition-colors flex items-center justify-center shadow-sm cursor-pointer"
            title="Create New User"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="border border-gray-200 hover:bg-gray-50 text-gray-600 p-1.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            title="More options"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Informasi Jumlah (Showing X Users) */}
        <div className="text-[11px] text-gray-400 font-medium px-0.5 uppercase tracking-wider">
          Showing {filteredUsers.length} Users
        </div>
      </div>

      {/* List User Types */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredUsers.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs italic">
            No users found.
          </div>
        ) : (
          filteredUsers.map((type) => {
            const isSelected = selectedId === type.id;
            return (
              <div
                key={type.id}
                onClick={() => onSelectUser(type)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected ? 'bg-blue-50/60 border-blue-200 shadow-xs' : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-gray-900">{type.name}</h4>
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-1 mb-2">{type.description}</p>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                  <span>{type.storiesCount} Stories</span>
                  <span>•</span>
                  <span>{type.personasCount} Personas</span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}