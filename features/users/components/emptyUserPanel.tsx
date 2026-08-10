// features/users/components/EmptyUserPanel.tsx
'use client';

export default function EmptyUserPanel() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50/30">
      <p className="text-xs text-gray-400">Pilih salah satu User Type di samping kiri untuk melihat detailnya.</p>
    </div>
  );
}