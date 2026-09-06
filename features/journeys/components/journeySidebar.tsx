'use client';

import { Search, Map, User } from 'lucide-react';

interface JourneysSidebarProps {
  journeys: any[];
  selectedJourneyId?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectJourney: (journey: any) => void;
  onOpenMapModal: () => void;
}

export default function JourneysSidebar({
  journeys,
  selectedJourneyId,
  searchQuery,
  onSearchChange,
  onSelectJourney,
  onOpenMapModal,
}: JourneysSidebarProps) {
  const filteredJourneys = journeys.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search journeys..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button 
            onClick={onOpenMapModal}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer shrink-0 shadow-sm flex items-center justify-center"
            title="Create New Journey / Map"
          >
            <Map className="w-4 h-4" />
          </button>
        </div>
        <div className="text-[11px] font-semibold text-gray-500 tracking-wider">
          Showing {filteredJourneys.length} journeys
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredJourneys.map((journey) => (
          <div
            key={journey.id}
            onClick={() => onSelectJourney(journey)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedJourneyId === journey.id 
                ? 'bg-blue-50/60 border-blue-300 shadow-sm' 
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            }`}
          >
            <h4 className="font-semibold text-xs text-gray-900 mb-1 leading-snug line-clamp-2">
              {journey.title}
            </h4>
            <p className="text-[11px] text-gray-500 mb-3 line-clamp-1">
              {journey.description}
            </p>
            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-gray-400" /> {journey.personasCount || 0} Personas
              </span>
              <span>•</span>
              <span>{journey.storiesCount || 0} Stories</span>
              <span>•</span>
              {/* PERBAIKAN: sebelumnya ada fallback "|| 5" yang membuat sidebar menampilkan
                  "5 Steps" walaupun journey sebenarnya belum punya step sama sekali di
                  database — menyesatkan karena kelihatan seperti ada data padahal kosong.
                  Sekarang menampilkan jumlah step yang sebenarnya (bisa 0). */}
              <span>{journey.steps?.length ?? journey.stepsCount ?? 0} Steps</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}