"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Plus, Edit3, Trash2, X, Calendar, FileText, UserCircle2, Info } from "lucide-react"; // Added Info icon for error
import api from "./api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true); // New state for loading notes

  useEffect(() => {
    const userDetailsString = localStorage.getItem("userDetails");
    console.log(userDetailsString)
    const userToken = localStorage.getItem("userToken");
    if (userToken && userDetailsString) {
      setUserDetails(JSON.parse(userDetailsString));
      console.log(userDetails)
    } else {
      // Gentle alert, then redirect
      setTimeout(() => { // Small delay for better UX before redirect
        alert("Authentication required. Redirecting to login...");
        navigate("/login");
      }, 500);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoadingNotes(true); // Start loading
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          setError("Authentication token is missing. Please log in.");
          setIsLoadingNotes(false);
          return;
        }

        const res = await fetch(`${api}/notes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data)
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch notes.");
        }

        const data = await res.json();
        console.log(data,"data ")
        if (Array.isArray(data.notes)) {
          // Sort notes by createdAt in descending order (latest first)
          const sortedNotes = data.notes.map(note => ({
            ...note,
            id: note.id || note._id, // Ensure consistent ID
           
          })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
           console.log("id",sortedNotes);
          setNotes(sortedNotes);
        } else {
          setNotes([]); // Ensure notes is an array even if data.notes is not
        }
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Failed to fetch notes:", err.message);
        setError(err.message);
        setNotes([]); // Clear notes on error
      } finally {
        setIsLoadingNotes(false); // End loading
      }
    };

    if (userDetails) { // Only fetch notes if userDetails are available
      fetchNotes();
    }
  }, [userDetails]); // Depend on userDetails to trigger fetch after it's set

  const openModal = (note) => {
    if (!note?.id) {
      alert("This note does not have a valid ID.");
      return;
    }
    setSelectedNote(note);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setModalVisible(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) throw new Error("Authentication token is missing.");

        // Optimistic UI update
        const originalNotes = [...notes];
        setNotes(prev => prev.filter(note => note._id !== id));
        closeModal(); // Close modal immediately

        const res = await fetch(`${api}/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to delete the note.");
        }

        // alert("Note deleted successfully."); // Replaced with a more subtle feedback if needed
      } catch (err) {
        alert("Error: " + (err.message || "Failed to delete the note. Reverting changes."));
        setNotes(originalNotes); // Revert on error
      }
    }
  };

  const navigateToEdit = (note) => {
    closeModal();
    localStorage.setItem("selectedNote", JSON.stringify(note));
    navigate(`/edit/${note.id}`);
  };

  const navigateToCreate = () => {
    navigate("/create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Subtle Background Patterns */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-slate-200/80 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  My Notations
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">Your personal space for thoughts & ideas.</p>
              </div>
            </div>
            {userDetails && (
              <div className="hidden sm:flex items-center space-x-3 bg-white/70 rounded-full pr-4 pl-2 py-1 border border-slate-200/80 shadow-inner text-slate-700 font-medium text-sm">
                <div className="w-9 h-9 bg-gradient-to-tr from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
                  <UserCircle2 className="w-5 h-5 text-white" />
                </div>
                <span>Hello, {userDetails.name?.split(" ")[0] || "User"}!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start space-x-3 shadow-sm">
            <Info className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-700 mb-1">Oops, something went wrong!</h4>
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-3 text-red-500 hover:text-red-700 text-xs font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {isLoadingNotes ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
            <p className="text-slate-600 text-lg font-medium">Loading your notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl shadow-xl p-8">
            <div className="w-28 h-28 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <FileText className="w-14 h-14 text-slate-400 opacity-80" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">Your note library is empty!</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              It looks like you haven't created any notes yet. Let's jot down your first idea!
            </p>
            <button
              onClick={navigateToCreate}
              className="inline-flex items-center space-x-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-blue-300 transform hover:scale-105 group"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create Your First Note</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => openModal(note)}
                className="group relative cursor-pointer bg-white/80 backdrop-blur-lg border border-slate-200/70 rounded-3xl p-7 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col justify-between"
              >
                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2 pr-4">
                    {note.title}
                  </h2>
                  <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-60 group-hover:scale-125 transition-transform duration-200"></div>
                </div>
                <p className="text-slate-600 text-base leading-relaxed line-clamp-4 mb-5 flex-grow">{note.content}</p>
                {note.createdAt && (
                  <div className="flex items-center text-sm text-slate-500 space-x-2 border-t border-slate-100 pt-4">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{format(new Date(note.createdAt), "MMM dd, yyyy")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalVisible && selectedNote && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-3xl w-full max-w-3xl max-h-[90vh] flex flex-col transform scale-95 animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-5 border-b border-slate-200/70 relative">
              <h3 className="text-2xl font-bold text-slate-800 line-clamp-1 pr-10">
                {selectedNote.title || "Note Details"}
              </h3>
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/60 transition-colors duration-200 text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 flex-grow overflow-y-auto custom-scrollbar">
              <div className="prose prose-lg prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNote.content || "No content available"}
                </p>
              </div>
              {selectedNote.createdAt && (
                <div className="flex items-center text-sm text-slate-500 mt-8 pt-5 border-t border-slate-100">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  <span>
                    Created on {format(new Date(selectedNote.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50/80 px-8 py-5 border-t border-slate-200/70 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-6 py-3 text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => navigateToEdit(selectedNote)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Note</span>
              </button>
              <button
                onClick={() => handleDelete(selectedNote.id)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Note</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={navigateToCreate}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shadow-xl hover:shadow-blue-400/50 transition-all duration-300 flex items-center justify-center group transform hover:scale-110 active:scale-95"
        title="Create New Note"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Custom Scrollbar for Modal (add this to your global CSS or a style tag) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; /* slate-300 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; /* slate-400 */
        }

        /* Keyframe animations for background blobs */
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Keyframe animations for modal */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}