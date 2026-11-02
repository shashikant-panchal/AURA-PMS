import React, { useState, useMemo } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { Room, RoomCategory, Reservation, RoomStatus } from '../../types/hotel';
import { 
  generateDateTimeline, 
  formatDateEditorial, 
  getTodayStr, 
  isDateInSpan 
} from '../../utils/dateUtils';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Sparkles, 
  Plus, 
  Filter,
  Layers,
  BedDouble
} from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { QuickReservationModal } from './QuickReservationModal';
import { OtaLogo } from '../common/OtaLogo';
import { parseISO, addDays, subDays, differenceInCalendarDays } from 'date-fns';

interface TapeChartProps {
  onSelectReservation: (resId: string) => void;
}

export const TapeChart: React.FC<TapeChartProps> = ({ onSelectReservation }) => {
  const { 
    rooms, 
    categories, 
    reservations, 
    selectedDate, 
    updateRoomStatus 
  } = usePmsStore();

  const [calendarStartDate, setCalendarStartDate] = useState<Date>(() => subDays(new Date(), 2));
  const [totalDays] = useState<number>(21);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  
  // Quick Reservation Drawer state
  const [quickBookingSlot, setQuickBookingSlot] = useState<{
    room: Room;
    category: RoomCategory;
    dateStr: string;
  } | null>(null);

  // Generate date columns
  const timelineDates = useMemo(() => {
    return generateDateTimeline(calendarStartDate, totalDays);
  }, [calendarStartDate, totalDays]);

  const timelineStartStr = timelineDates[0]?.dateStr || '';
  const timelineEndStr = timelineDates[timelineDates.length - 1]?.dateStr || '';

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (selectedCategoryFilter !== 'ALL' && room.categoryId !== selectedCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [rooms, selectedCategoryFilter]);

  // Map category lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, RoomCategory>();
    categories.forEach((cat) => map.set(cat.id, cat));
    return map;
  }, [categories]);

  // Find active reservations for each room in this timeline span
  const getRoomReservations = (roomId: string) => {
    return reservations.filter((res) => {
      if (res.roomId !== roomId) return false;
      if (res.status === 'Cancelled') return false;

      // Filter by search query if present
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = res.guest.fullName.toLowerCase().includes(query);
        const matchesCode = res.bookingCode.toLowerCase().includes(query);
        if (!matchesName && !matchesCode) return false;
      }

      // Check overlap with calendar range
      return res.checkInDate <= timelineEndStr && res.checkOutDate > timelineStartStr;
    });
  };

  // Status badge styling helper (Light Luxury Edition)
  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Occupied':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Reserved':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Cleaning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Maintenance':
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  // Reservation block style (Light Luxury Edition)
  const getReservationBlockStyle = (res: Reservation) => {
    if (res.status === 'Checked-In') {
      return {
        bg: 'bg-white border-rose-200 text-stone-900 shadow-sm border-l-4 border-l-rose-500',
        hover: 'hover:border-rose-400 hover:shadow-md',
      };
    }
    return {
      bg: 'bg-white border-purple-200 text-stone-900 shadow-sm border-l-4 border-l-purple-500',
      hover: 'hover:border-purple-400 hover:shadow-md',
    };
  };

  const shiftCalendar = (days: number) => {
    setCalendarStartDate((prev) => addDays(prev, days));
  };

  const resetToToday = () => {
    setCalendarStartDate(subDays(new Date(), 2));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAF8]">
      {/* Tape Chart Top Controls Bar (Light Luxury) */}
      <div className="p-4 border-b border-stone-200 bg-white flex flex-wrap items-center justify-between gap-3 shadow-soft-luxury">
        {/* Left: Timeline Navigation & Date Range */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl p-1">
            <button
              onClick={() => shiftCalendar(-7)}
              title="Previous 7 Days"
              className="p-1.5 hover:bg-white rounded-lg text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={resetToToday}
              className="px-3 py-1 text-xs font-serif font-bold text-[#936F25] hover:bg-white rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => shiftCalendar(7)}
              title="Next 7 Days"
              className="p-1.5 hover:bg-white rounded-lg text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-stone-600">
            <CalendarIcon className="w-4 h-4 text-[#B48C36]" />
            <span>
              {timelineDates[0] && formatDateEditorial(timelineDates[0].dateStr)} –{' '}
              {timelineDates[timelineDates.length - 1] &&
                formatDateEditorial(timelineDates[timelineDates.length - 1].dateStr)}
            </span>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search guest name or booking code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#B48C36] outline-none"
          />
        </div>

        {/* Right: Category filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
          >
            <option value="ALL">All Categories ({rooms.length} Suites)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.tier})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Badges Legend */}
      <div className="px-6 py-2.5 border-b border-stone-200 bg-[#FAF6EC]/50 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
        <div className="flex items-center gap-4">
          <span className="text-stone-500 uppercase tracking-wider text-[10px] font-bold">Suite States:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-stone-700">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-stone-700">Occupied (In-House)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span className="text-stone-700">Reserved (Confirmed)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-stone-700">Cleaning (Turn-Down)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-500"></span>
            <span className="text-stone-700">Maintenance</span>
          </div>
        </div>

        <div className="text-[11px] text-[#936F25] font-serif">
          💡 Click vacant slot to book • Click reservation for Live Guest Folio
        </div>
      </div>

      {/* Main Tape Chart Scroll Area */}
      <div className="flex-1 overflow-auto relative">
        <div className="inline-block min-w-full">
          {/* Header Row: Dates */}
          <div className="flex sticky top-0 z-30 bg-white border-b border-stone-200 shadow-sm">
            {/* Left Frozen Column: Room Info Header */}
            <div className="w-64 flex-shrink-0 sticky left-0 z-40 bg-white border-r border-stone-200 px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-stone-900 tracking-wider uppercase">
                SUITES & RESIDENCES
              </span>
              <span className="text-[10px] font-mono text-[#936F25] bg-[#FAF6EC] px-2 py-0.5 rounded border border-[#B48C36]/30 font-bold">
                {filteredRooms.length} UNITS
              </span>
            </div>

            {/* Date Columns Header */}
            <div className="flex">
              {timelineDates.map((d) => (
                <div
                  key={d.dateStr}
                  className={`w-28 flex-shrink-0 border-r border-stone-200 px-1 py-2 text-center transition-colors ${
                    d.isToday
                      ? 'bg-[#FAF6EC] border-b-2 border-b-[#B48C36] font-bold'
                      : d.isWeekend
                      ? 'bg-stone-50/60'
                      : 'bg-white'
                  }`}
                >
                  <p className="text-[10px] font-mono text-stone-500 uppercase">{d.dayName}</p>
                  <p
                    className={`text-xs font-mono font-bold mt-0.5 ${
                      d.isToday ? 'text-[#B48C36]' : 'text-stone-800'
                    }`}
                  >
                    {d.dayNumber}
                  </p>
                  {d.isToday && (
                    <span className="inline-block mt-0.5 text-[9px] font-mono text-[#B48C36] uppercase px-1 rounded bg-[#B48C36]/15 font-bold">
                      Today
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rows: Each Room & Reservation Blocks */}
          <div className="divide-y divide-stone-200 bg-white">
            {filteredRooms.map((room) => {
              const category = categoryMap.get(room.categoryId);
              const roomReservations = getRoomReservations(room.id);

              return (
                <div key={room.id} className="flex relative group hover:bg-[#FAF6EC]/30 transition-colors">
                  {/* Left Frozen Column: Room Details */}
                  <div className="w-64 flex-shrink-0 sticky left-0 z-20 bg-white border-r border-stone-200 p-3 flex items-center justify-between gap-2 shadow-sm">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900 group-hover:text-[#B48C36] transition-colors">
                          {room.roomNumber}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500">Floor {room.floor}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 truncate max-w-[140px]" title={category?.name}>
                        {category?.name || 'Luxury Category'}
                      </p>
                      <p className="text-[10px] font-mono font-semibold text-[#936F25]">
                        {formatINR(category?.basePrice || 0)}/nt
                      </p>
                    </div>

                    {/* Room Quick Status Toggle Dropdown / Button */}
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => {
                          const nextStatus: Record<RoomStatus, RoomStatus> = {
                            Available: 'Cleaning',
                            Cleaning: 'Available',
                            Occupied: 'Occupied',
                            Reserved: 'Reserved',
                            Maintenance: 'Available',
                          };
                          if (room.status !== 'Occupied' && room.status !== 'Reserved') {
                            updateRoomStatus(room.id, nextStatus[room.status]);
                          }
                        }}
                        title="Click to cycle status (Available / Cleaning)"
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border transition-all ${getStatusBadge(
                          room.status
                        )}`}
                      >
                        {room.status}
                      </button>

                      <span className="text-[9px] font-mono text-stone-500 flex items-center gap-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            room.cleanliness === 'Clean' || room.cleanliness === 'Inspected'
                              ? 'bg-emerald-500'
                              : 'bg-amber-500 animate-pulse'
                          }`}
                        ></span>
                        {room.cleanliness}
                      </span>
                    </div>
                  </div>

                  {/* Date Grid Cells */}
                  <div className="flex relative h-16">
                    {timelineDates.map((dateObj) => {
                      const isOccupiedCell = roomReservations.some((res) =>
                        isDateInSpan(dateObj.dateStr, res.checkInDate, res.checkOutDate)
                      );

                      return (
                        <div
                          key={dateObj.dateStr}
                          onClick={() => {
                            if (!isOccupiedCell && category) {
                              setQuickBookingSlot({
                                room,
                                category,
                                dateStr: dateObj.dateStr,
                              });
                            }
                          }}
                          className={`w-28 flex-shrink-0 border-r border-stone-200 h-full relative group/cell cursor-pointer transition-colors ${
                            dateObj.isWeekend ? 'bg-stone-50/40' : 'bg-white'
                          } ${
                            !isOccupiedCell ? 'hover:bg-[#FAF6EC]' : ''
                          }`}
                        >
                          {!isOccupiedCell && (
                            <div className="hidden group-hover/cell:flex absolute inset-0 items-center justify-center text-[#B48C36]">
                              <Plus className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Overlay: Positioned Reservation Blocks with Authentic Real OTA Logos */}
                    {roomReservations.map((res) => {
                      const timelineStart = parseISO(timelineStartStr);
                      const resCheckIn = parseISO(res.checkInDate);
                      const resCheckOut = parseISO(res.checkOutDate);

                      const dayOffset = differenceInCalendarDays(resCheckIn, timelineStart);
                      const durationInTimeline = Math.min(
                        differenceInCalendarDays(resCheckOut, resCheckIn),
                        totalDays - Math.max(0, dayOffset)
                      );

                      // Each column is 112px (w-28)
                      const colWidth = 112;
                      const leftPixels = Math.max(0, dayOffset) * colWidth;
                      const widthPixels = durationInTimeline * colWidth - 8;

                      const blockStyle = getReservationBlockStyle(res);

                      return (
                        <div
                          key={res.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectReservation(res.id);
                          }}
                          style={{
                            left: `${leftPixels + 4}px`,
                            width: `${Math.max(colWidth - 8, widthPixels)}px`,
                            top: '8px',
                            height: '48px',
                          }}
                          className={`absolute z-10 rounded-xl border p-2 flex items-center justify-between cursor-pointer transition-all select-none ${blockStyle.bg} ${blockStyle.hover}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-serif font-bold truncate text-stone-900 group-hover/block:text-[#B48C36]">
                                  {res.guest.fullName}
                                </p>
                                {res.guest.vipStatus && (
                                  <span title="VIP Sovereign Dignitary">
                                    <Sparkles className="w-3 h-3 text-[#B48C36] flex-shrink-0" />
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] font-mono text-stone-500 truncate">
                                {res.bookingCode} • {res.nights} nts
                              </p>
                            </div>
                          </div>

                          {/* Authentic Brand Logo */}
                          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                            <OtaLogo channel={res.source} size="xs" showText={false} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Reservation Drawer Modal */}
      {quickBookingSlot && (
        <QuickReservationModal
          room={quickBookingSlot.room}
          category={quickBookingSlot.category}
          initialCheckInDate={quickBookingSlot.dateStr}
          onClose={() => setQuickBookingSlot(null)}
          onSuccess={(resId) => {
            setQuickBookingSlot(null);
            onSelectReservation(resId);
          }}
        />
      )}
    </div>
  );
};
