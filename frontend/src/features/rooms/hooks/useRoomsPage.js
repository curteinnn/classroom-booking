import { useRef, useState } from "react";
import { usePageAnimations } from "../../../animations/cardAnimations";
import { useSearchModeAnimation } from "../../../animations/searchAnimations";
import useRoomSearch from "./useRoomSearch";

function localDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultBookingDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return localDate(date);
}

export default function useRoomsPage() {
  const pageRef = useRef(null);
  const searchPanelRef = useRef(null);
  const activeModeRef = useRef("time");
  usePageAnimations(pageRef);
  const [mode, setMode] = useState("time");
  const [roomName, setRoomName] = useState("");
  useSearchModeAnimation(searchPanelRef, mode);
  const [filters, setFilters] = useState({
    tanggal: defaultBookingDate(),
    jam_mulai: "09:00",
    jam_selesai: "10:00",
    kapasitas: "1",
    lokasi: "",
  });
  const [purposes, setPurposes] = useState({});
  const roomSearch = useRoomSearch(filters, activeModeRef);

  function handleModeSelect(event) {
    const nextMode = event.currentTarget.dataset.mode;
    if (nextMode === mode) return;
    activeModeRef.current = nextMode;
    setMode(nextMode);
    roomSearch.clearResults();
  }

  function handleRoomNameChange(event) {
    setRoomName(event.target.value);
    roomSearch.clearResults();
  }

  function handleFilterChange(event) {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    roomSearch.clearResults();
  }

  function handleSearch(event) {
    return roomSearch.search(event, { mode, roomName });
  }

  function handlePurposeChange(event) {
    const roomId = event.target.dataset.roomId;
    setPurposes((current) => ({ ...current, [roomId]: event.target.value }));
  }

  function handleBookClick(event) {
    const room = roomSearch.rooms.find(
      ({ id }) => String(id) === event.currentTarget.dataset.roomId,
    );
    if (room) roomSearch.book(room, purposes[room.id] || "");
  }

  return {
    ...roomSearch,
    pageRef,
    searchPanelRef,
    mode,
    roomName,
    filters,
    purposes,
    handleFilterChange,
    handleModeSelect,
    handleRoomNameChange,
    handleSearch,
    handlePurposeChange,
    handleBookClick,
  };
}
