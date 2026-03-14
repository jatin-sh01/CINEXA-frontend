import { useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import MovieForm from "../components/admin/MovieForm";
import TheaterForm from "../components/admin/TheaterForm";
import ShowForm from "../components/admin/ShowForm";
import UserList from "../components/admin/UserList";
import Modal from "../components/shared/Modal";
import { get } from "../api";
import useFetch from "../hooks/useFetch";

const TABS = ["Movies", "Theaters", "Shows", "Users"];

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState("Movies");
  const [editItem, setEditItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  
  const getMovies = useMemo(() => () => get("/api/movies"), []);
  const getTheaters = useMemo(() => () => get("/api/theaters"), []);
  const getShows = useMemo(() => () => get("/api/show"), []);

  const { data: moviesRes, refetch: refetchMovies } = useFetch(getMovies, []);
  const { data: theatersRes, refetch: refetchTheaters } = useFetch(getTheaters, []);
  const { data: showsRes, refetch: refetchShows } = useFetch(getShows, []);

  const movies = moviesRes?.data || [];
  const theaters = theatersRes?.data || [];
  const shows = showsRes?.data || [];

  const openCreate = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); };
  const saved = () => {
    closeModal();
    if (tab === "Movies") refetchMovies();
    if (tab === "Theaters") refetchTheaters();
    if (tab === "Shows") refetchShows();
  };

  const availableTabs = isAdmin ? TABS : TABS.filter((t) => t !== "Users");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
      <div className="flex gap-2 border-b border-gray-800 pb-2">
        {availableTabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-t-lg text-sm font-medium transition ${tab === t ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}>{t}</button>
        ))}
      </div>

      {tab === "Movies" && (
        <div>
          <button onClick={openCreate} className="mb-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold">+ Add Movie</button>
          <div className="space-y-2">
            {movies.map((m) => (
              <div key={m._id} onClick={() => openEdit(m)} className="bg-gray-900 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-gray-800">
                <span className="text-white text-sm">{m.name}</span>
                <span className="text-gray-500 text-xs">{m.releaseStatus}</span>
              </div>
            ))}
          </div>
          <Modal open={modalOpen} onClose={closeModal} title={editItem ? "Edit Movie" : "New Movie"}>
            <MovieForm movie={editItem} onSaved={saved} />
          </Modal>
        </div>
      )}

      {tab === "Theaters" && (
        <div>
          <button onClick={openCreate} className="mb-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold">+ Add Theater</button>
          <div className="space-y-2">
            {theaters.map((t) => (
              <div key={t._id} onClick={() => openEdit(t)} className="bg-gray-900 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-gray-800">
                <span className="text-white text-sm">{t.name}</span>
                <span className="text-gray-500 text-xs">{t.city}</span>
              </div>
            ))}
          </div>
          <Modal open={modalOpen} onClose={closeModal} title={editItem ? "Edit Theater" : "New Theater"}>
            <TheaterForm theater={editItem} onSaved={saved} />
          </Modal>
        </div>
      )}

      {tab === "Shows" && (
        <div>
          <button onClick={openCreate} className="mb-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold">+ Add Show</button>
          <div className="space-y-2">
            {shows.map((s) => (
              <div key={s._id} onClick={() => openEdit(s)} className="bg-gray-900 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-gray-800">
                <span className="text-white text-sm">{s.movieId?.name || "Movie"} @ {s.theaterId?.name || "Theater"}</span>
                <span className="text-gray-500 text-xs">{s.timing}</span>
              </div>
            ))}
          </div>
          <Modal open={modalOpen} onClose={closeModal} title={editItem ? "Edit Show" : "New Show"}>
            <ShowForm show={editItem} onSaved={saved} />
          </Modal>
        </div>
      )}

      {tab === "Users" && isAdmin && <UserList />}
    </div>
  );
}