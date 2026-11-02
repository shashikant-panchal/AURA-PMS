import React, { useState } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { CleanlinessStatus } from '../../types/hotel';
import { 
  BedDouble, 
  Brush, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  Filter
} from 'lucide-react';

export const HousekeepingManager: React.FC = () => {
  const { rooms, categories, updateCleanliness, updateRoomStatus } = usePmsStore();

  const [filterCleanliness, setFilterCleanliness] = useState<string>('ALL');

  const filteredRooms = rooms.filter((r) => {
    if (filterCleanliness !== 'ALL' && r.cleanliness !== filterCleanliness) {
      return false;
    }
    return true;
  });

  const getCleanlinessPill = (cleanliness: CleanlinessStatus) => {
    switch (cleanliness) {
      case 'Inspected':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Clean':
        return 'bg-cyan-50 text-cyan-800 border-cyan-300';
      case 'In Progress':
        return 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse';
      case 'Dirty':
        return 'bg-rose-50 text-rose-800 border-rose-300';
    }
  };

  const getCategoryName = (catId: string) => {
    return categories.find((c) => c.id === catId)?.name || 'Residence';
  };

  const cleanCount = rooms.filter((r) => r.cleanliness === 'Clean' || r.cleanliness === 'Inspected').length;
  const dirtyCount = rooms.filter((r) => r.cleanliness === 'Dirty').length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAF8]">
      {/* Top Banner */}
      <div className="p-6 border-b border-stone-200 bg-white shadow-soft-luxury">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
              <BedDouble className="w-6 h-6 text-[#B48C36]" />
              Housekeeping, Sanitation & Turn-Down Management
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Dispatch housekeeping teams, log VIP white-glove inspections, and release sanitized suites for guest arrival.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
              <p className="text-[10px] font-mono text-stone-500 font-bold">Pristine & Inspected</p>
              <p className="font-mono font-bold text-base text-emerald-700">{cleanCount} Suites</p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-rose-50 border border-rose-200 shadow-sm">
              <p className="text-[10px] font-mono text-stone-500 font-bold">Needs Turn-Down / Dirty</p>
              <p className="font-mono font-bold text-base text-rose-700">{dirtyCount} Suites</p>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-stone-200">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-serif">
            {['ALL', 'Clean', 'Dirty', 'Inspected', 'In Progress'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterCleanliness(status)}
                className={`px-3 py-1 rounded-xl transition-all font-bold ${
                  filterCleanliness === status
                    ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const catName = getCategoryName(room.categoryId);

            return (
              <div
                key={room.id}
                className="p-5 rounded-2xl bg-white border border-stone-200 shadow-soft-luxury hover:border-[#B48C36]/50 transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg text-stone-900 group-hover:text-[#B48C36] transition-colors">
                      Suite {room.roomNumber}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">Floor {room.floor}</span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getCleanlinessPill(room.cleanliness)}`}>
                    {room.cleanliness}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-stone-700 font-serif font-bold truncate">{catName}</p>
                  <p className="text-[10px] font-mono text-stone-500 mt-0.5">
                    PMS State: <strong className="text-stone-800">{room.status}</strong>
                  </p>
                  {room.maintenanceNote && (
                    <p className="text-[10px] text-amber-700 font-mono mt-1 flex items-center gap-1 font-semibold">
                      <Wrench className="w-3 h-3 flex-shrink-0" />
                      {room.maintenanceNote}
                    </p>
                  )}
                </div>

                {/* Quick Housekeeping Action Buttons */}
                <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => {
                      updateCleanliness(room.id, 'Inspected');
                      if (room.status === 'Cleaning') updateRoomStatus(room.id, 'Available');
                    }}
                    title="Mark VIP Inspected & Ready"
                    className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Inspected
                  </button>

                  <button
                    onClick={() => updateCleanliness(room.id, 'Clean')}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                  >
                    <Brush className="w-3 h-3" />
                    Clean
                  </button>

                  <button
                    onClick={() => {
                      updateCleanliness(room.id, 'Dirty');
                      if (room.status === 'Available') updateRoomStatus(room.id, 'Cleaning');
                    }}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Dirty
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
