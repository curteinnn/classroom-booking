import { useState } from "react";
import { useRef } from "react";
import { usePageAnimations } from "../../../animations/cardAnimations";
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
  usePageAnimations(pageRef);
  const [filters, setFilters] = useState({
    tanggal: defaultBookingDate(),
    jam_mulai: "09:00",
    jam_selesai: "10:00",
    kapasitas: "1",
    lokasi: "",
  });
  const [purposes, setPurposes] = useState({});
  const roomSearch = useRoomSearch(filters);

  function handleFilterChange(event) {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
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
    filters,
    purposes,
    handleFilterChange,
    handlePurposeChange,
    handleBookClick,
  };
}
