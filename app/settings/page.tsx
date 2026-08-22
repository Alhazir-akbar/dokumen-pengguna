// app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AppSidebar from '@/features/common/components/AppSidebar';
import { MessageSquare, Settings as SettingsIcon, Brain, Save, Trash2, Plus, AlertCircle } from 'lucide-react';

interface AIRule {
  id: number;
  name: string;
  content: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'ai-rules'>('general');
  const [projectId, setProjectId] = useState<string | null>(null);
  
  // State General Settings
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  
  // State AI Rules
  const [aiRules, setAiRules] = useState<AIRule[]>([]);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleContent, setNewRuleContent] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Ambil ID Proyek aktif (misal dari LocalStorage setelah login/setup)
  useEffect(() => {
    // Simulasi pengambilan project ID aktif. Sesuaikan dengan penyimpanan state proyekmu.
    const activeProjectId = localStorage.getItem('active_project_id') || '1'; 
    setProjectId(activeProjectId);
    
    if (activeProjectId) {
      fetchProjectDetails(activeProjectId);
      fetchAIRules(activeProjectId);
    }
  }, []);

  const fetchProjectDetails = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/projects/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjectName(data.name);
        setProjectDesc(data.description || '');
      }
    } catch (err) {
      console.error('Gagal mengambil data proyek', err);
    }
  };

  const fetchAIRules = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/projects/${id}/ai-rules`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAiRules(data);
      }
    } catch (err) {
      console.error('Gagal mengambil aturan AI', err);
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: projectName, description: projectDesc })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Pengaturan proyek berhasil disimpan!' });
      } else {
        throw new Error('Gagal memperbarui proyek');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAIRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRuleContent.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/projects/${projectId}/ai-rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newRuleName, content: newRuleContent })
      });

      if (res.ok) {
        const newRule = await res.json();
        setAiRules([...aiRules, newRule]);
        setNewRuleName('');
        setNewRuleContent('');
        setShowAddRuleModal(false);
      }
    } catch (err) {
      console.error('Gagal menambahkan aturan AI', err);
    }
  };

  const handleDeleteRule = async (ruleId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus aturan AI ini?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/ai-rules/${ruleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setAiRules(aiRules.filter(r => r.id !== ruleId));
      }
    } catch (err) {
      console.error('Gagal menghapus aturan AI', err);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans">
      {/* Sidebar Navigasi Utama */}
      <AppSidebar activeMenu="settings" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Header Atas */}
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <span className="text-xs font-semibold text-gray-500">
            {projectName || 'Nama Proyek'} <span className="text-gray-300">/</span> Pengaturan
          </span>
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm font-medium cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              UD
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="border-b border-gray-200 px-8 flex gap-6 shrink-0 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <SettingsIcon className="w-4 h-4" /> General Settings
          </button>
          <button
            onClick={() => setActiveTab('ai-rules')}
            className={`py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ai-rules' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Brain className="w-4 h-4" /> AI Rules
          </button>
        </div>

        {/* Area Form & Pengaturan */}
        <div className="flex-1 overflow-y-auto p-8 max-w-3xl">
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-2.5 text-sm ${
              message.type === 'success' ? 'bg-green-50 border border-green-100 text-green-800' : 'bg-red-50 border border-red-100 text-red-800'
            }`}>
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          )}

          {activeTab === 'general' ? (
            <form onSubmit={handleSaveGeneral} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Proyek</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 text-sm focus:outline-hidden focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Deskripsi Proyek</label>
                <textarea
                  rows={4}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2.5 border text-gray-900 border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-hidden focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Simpan Pengaturan
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Aturan AI Proyek</h3>
                  <p className="text-xs text-gray-500">Aturan ini akan memandu AI dalam memformulasikan dokumen kebutuhan proyek Anda.</p>
                </div>
                <button
                  onClick={() => setShowAddRuleModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Aturan
                </button>
              </div>

              {aiRules.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                  <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Belum ada aturan AI khusus</p>
                  <p className="text-xs text-gray-500">Buat aturan baru untuk menyesuaikan gaya penulisan AI.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiRules.map((rule) => (
                    <div key={rule.id} className="p-5 border border-gray-200 rounded-2xl flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{rule.name}</h4>
                        <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{rule.content}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal Popup Tambah Aturan AI */}
      {showAddRuleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">Tambah Aturan AI Baru</h3>
            </div>
            <form onSubmit={handleAddAIRule} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Aturan</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Format Cerita Pengguna"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2 border text-gray-900 border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-hidden focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Konten Aturan</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Misal: Tulis cerita pengguna menggunakan struktur Bahasa Indonesia yang formal..."
                  value={newRuleContent}
                  onChange={(e) => setNewRuleContent(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2 border text-gray-900 border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-hidden focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                  Simpan Aturan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}