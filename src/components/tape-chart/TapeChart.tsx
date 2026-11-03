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
  const [totalDays, setTotalDays] = useState<number>(14);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState('ALL');
  
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
      if (selectedFloorFilter !== 'ALL' && room.floor.toString() !== selectedFloorFilter) {
        return false;
      }
      return true;
    });
  }, [rooms, selectedCategoryFilter, selectedFloorFilter]);

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

  // Status badge styling helper
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

  // Reservation block style
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
      {/* Tape Chart Top Controls Bar */}
      <div className="p-3 sm:p-4 border-b border-stone-200 bg-white flex flex-wrap items-center justify-between gap-3 shadow-sm">
        {/* Left: Timeline Navigation & Date Range */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl p-1">
            <button
              onClick={() => shiftCalendar(-7)}
              title="Previous 7 Days"
              className="p-1 hover:bg-white rounded-lg text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={resetToToday}
              className="px-2.5 py-1 text-xs font-serif font-bold text-[#936F25] hover:bg-white rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => shiftCalendar(7)}
              title="Next 7 Days"
              className="p-1 hover:bg-white rounded-lg text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom view selectors: 7d, 14d, 21d, 30d */}
          <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl p-0.5 text-xs font-mono">
            {[7, 14, 21, 30].map((days) => (
              <button
                key={days}
                onClick={() => setTotalDays(days)}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  totalDays === days
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-600 font-mono">
            <span>{formatDateEditorial(timelineStartStr)}</span>
            <span className="text-stone-400">→</span>
            <span>{formatDateEditorial(timelineEndStr)}</span>
          </div>
        </div>

        {/* Right: Filters & Search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial justify-end">
          {/* Floor filter */}
          <select
            value={selectedFloorFilter}
            onChange={(e) => setSelectedFloorFilter(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-800 focus:outline-none focus:border-[#B48C36]"
          >
            <option value="ALL">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
            <option value="4">Floor 4</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-800 focus:outline-none focus:border-[#B48C36] max-w-[140px] truncate"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Guest or Code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#B48C36] w-32 sm:w-44 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Status Badges Legend */}
      <div className="px-4 sm:px-6 py-2 border-b border-stone-200 bg-[#FAF6EC]/50 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-stone-500 uppercase tracking-wider text-[10px] font-bold">States:</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-stone-700 text-[11px]">Available</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-stone-700 text-[11px]">Occupied</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-stone-700 text-[11px]">Reserved</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-stone-700 text-[11px]">Cleaning</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-stone-500"></span>
            <span className="text-stone-700 text-[11px]">Maintenance</span>
          </div>
        </div>

        <div className="text-[11px] text-[#936F25] font-serif hidden md:block">
          💡 Click empty slot to book • Click reservation for Guest Folio & Invoicing
        </div>
      </div>

      {/* Main Tape Chart Scroll Area */}
      <div className="flex-1 overflow-auto relative scrollbar-thin">
        <div className="inline-block min-w-full">
          {/* Header Row: Dates */}
          <div className="flex sticky top-0 z-30 bg-white border-b border-stone-200 shadow-sm">
            {/* Left Frozen Column: Room Info Header */}
            <div className="w-48 sm:w-60 flex-shrink-0 sticky left-0 z-40 bg-white border-r border-stone-200 px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-xs">
              <span className="text-[11px] font-serif font-bold text-stone-900 tracking-wider uppercase">
                ROOMS & SUITES
              </span>
              <span className="text-[10px] font-mono text-[#936F25] bg-[#FAF6EC] px-2 py-0.5 rounded border border-[#B48C36]/30 font-bold">
                {filteredRooms.length}
              </span>
            </div>

            {/* Date Columns Header */}
            <div className="flex">
              {timelineDates.map((d) => (
                <div
                  key={d.dateStr}
                  className={`w-24 sm:w-28 flex-shrink-0 border-r border-stone-200 px-1 py-1.5 text-center transition-colors ${
                    d.isToday
                      ? 'bg-[#FAF6EC] border-b-2 border-b-[#B48C36] font-bold'
                      : d.isWeekend
                      ? 'bg-stone-50/60'
                      : 'bg-white'
                  }`}
                >
                  <p className="text-[9px] font-mono text-stone-500 uppercase">{d.dayName}</p>
                  <p className={`text-xs font-mono font-bold ${d.isToday ? 'text-[#B48C36]' : 'text-stone-800'}`}>
                    {d.dayNumber}
                  </p>
                  {d.isToday && (
                    <span className="inline-block text-[8px] font-mono text-[#B48C36] uppercase px-1 rounded bg-[#B48C36]/15 font-bold">
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
                  <div className="w-48 sm:w-60 flex-shrink-0 sticky left-0 z-20 bg-white border-r border-stone-200 p-2 sm:p-2.5 flex items-center justify-between gap-2 shadow-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs sm:text-sm text-stone-900 group-hover:text-[#B48C36] transition-colors">
                          {room.roomNumber}
                        </span>
                        <span className="text-[9px] font-mono text-stone-500">Fl {room.floor}</span>
                      </div>
                      <p className="text-[10px] text-stone-600 truncate max-w-[110px] sm:max-w-[140px]" title={category?.name}>
                        {category?.name || 'Standard'}
                      </p>
                      <p className="text-[9px] font-mono font-semibold text-[#936F25]">
                        {formatINR(category?.basePrice || 0)}/nt
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${getStatusBadge(room.status)}`}>
                        {room.status}
                      </span>
                      <select
                        value={room.status}
                        onChange={(e) => updateRoomStatus(room.id, e.target.value as RoomStatus)}
                        className="text-[9px] font-mono bg-stone-50 border border-stone-200 rounded px-1 py-0.5 text-stone-700"
                        title="Quick Status Override"
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  {/* Date Grid Cell Slots */}
                  <div className="flex relative">
                    {timelineDates.map((dateObj) => (
                      <div
                        key={dateObj.dateStr}
                        onClick={() => {
                          if (category) {
                            setQuickBookingSlot({
                              room,
                              category,
                              dateStr: dateObj.dateStr,
                            });
                          }
                        }}
                        className={`w-24 sm:w-28 flex-shrink-0 border-r border-stone-100 h-14 relative cursor-pointer hover:bg-stone-100/60 transition-colors flex items-center justify-center group/slot ${
                          dateObj.isWeekend ? 'bg-stone-50/30' : ''
                        }`}
                        title={`Click to book Room ${room.roomNumber} for ${dateObj.dateStr}`}
                      >
                        <Plus className="w-3.5 h-3.5 text-stone-300 opacity-0 group-hover/slot:opacity-100 transition-opacity" />
                      </div>
                    ))}

                    {/* Overlay Active Reservation Bars */}
                    {roomReservations.map((res) => {
                      const resStart = res.checkInDate < timelineStartStr ? timelineStartStr : res.checkInDate;
                      const resEnd = res.checkOutDate > timelineEndStr ? timelineEndStr : res.checkOutDate;

                      const startDiff = differenceInCalendarDays(
                        parseISO(resStart),
                        parseISO(timelineStartStr)
                      );
                      const nightSpan = differenceInCalendarDays(
                        parseISO(resEnd),
                        parseISO(resStart)
                      );

                      if (nightSpan <= 0) return null;

                      // Width per day: 96px (mobile) / 112px (desktop)
                      const dayWidth = window.innerWidth >= 640 ? 112 : 96;
                      const leftPos = Math.max(0, startDiff * dayWidth);
                      const barWidth = Math.max(dayWidth - 8, nightSpan * dayWidth - 8);

                      const style = getReservationBlockStyle(res);

                      return (
                        <div
                          key={res.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectReservation(res.id);
                          }}
                          style={{
                            left: `${leftPos + 4}px`,
                            width: `${barWidth}px`,
                            top: '6px',
                            height: '42px',
                          }}
                          className={`absolute z-10 rounded-xl border p-1.5 cursor-pointer transition-all flex flex-col justify-between overflow-hidden ${style.bg} ${style.hover}`}
                          title={`${res.guest.fullName} • ${res.bookingCode} (${res.source}) • Click for Folio`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-serif text-[11px] font-bold text-stone-900 truncate">
                              {res.guest.fullName}
                            </span>
                            <span className="shrink-0 scale-90">
                              <OtaLogo source={res.source} size="xs" />
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[9px] font-mono text-stone-500">
                            <span className="truncate">{res.bookingCode}</span>
                            <span className="font-bold text-stone-800">
                              {formatINR(res.roomRatePerNight)}
                            </span>
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

      {/* Quick Booking Drawer */}
      {quickBookingSlot && (
        <QuickReservationModal
          room={quickBookingSlot.room}
          category={quickBookingSlot.category}
          initialDate={quickBookingSlot.dateStr}
          onClose={() => setQuickBookingSlot(null)}
        />
      )}
    </div>
  );
};
