import { create } from 'zustand';

interface BookingState {
  selectedCenterId: string | null;
  selectedStartTime: Date | null;
  selectedEndTime: Date | null;
  selectedSeatId: string | null;
  setCenterId: (id: string) => void;
  setTimeRange: (start: Date | null, end: Date | null) => void;
  setSeatId: (id: string | null) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedCenterId: null,
  selectedStartTime: null,
  selectedEndTime: null,
  selectedSeatId: null,
  setCenterId: (id) => set({ selectedCenterId: id, selectedSeatId: null }),
  setTimeRange: (start, end) => set({ selectedStartTime: start, selectedEndTime: end, selectedSeatId: null }),
  setSeatId: (id) => set({ selectedSeatId: id }),
  clearBooking: () => set({
    selectedCenterId: null,
    selectedStartTime: null,
    selectedEndTime: null,
    selectedSeatId: null,
  }),
}));
