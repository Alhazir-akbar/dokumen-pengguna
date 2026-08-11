'use client';

interface EmptyUserPanelProps {
  onOpenAddModal: () => void;
}

export default function EmptyUserPanel({ onOpenAddModal }: EmptyUserPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="mb-6 bg-slate-100 p-8 rounded-xl border border-slate-200 w-full max-w-md flex flex-col items-center">
        {/* Ilustrasi atau Placeholder Gambar */}
        <div className="w-48 h-32 bg-slate-200 rounded-lg mb-4 flex items-center justify-center text-slate-400 text-sm">
          Illustration Preview
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">User types and Personas</h2>
        <p className="text-sm text-slate-500 mb-6">
          Software is about real people, let them shine.
        </p>
        <button
          onClick={onOpenAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
        >
          <span>+ New User type</span>
        </button>
      </div>
    </div>
  );
}