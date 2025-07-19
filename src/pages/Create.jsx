"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { Save, ArrowLeft, FileText, Edit3, Sparkles, Clock } from "lucide-react";
import api from "./api";

export default function Create() {
  const navigate = useNavigate();
  const { id: noteId } = useParams(); // Get noteId from URL parameters
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // New state to indicate edit mode

  useEffect(() => {
    const words = note
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  }, [note]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedToken = localStorage.getItem("userToken");
        if (storedToken) {
          setToken(storedToken);
        } else {
          throw new Error("Token is missing. Please log in again.");
        }

        const storedDetails = localStorage.getItem("userDetails");
        if (storedDetails) {
          setUserDetails(JSON.parse(storedDetails));
        } else {
          throw new Error("User details are missing. Please log in again.");
        }

        // If noteId exists, we are in edit mode
        if (noteId) {
          setIsEditing(true);
          await fetchNoteForEdit(storedToken, noteId);
        }
      } catch (error) {
        console.error("Initialization Error:", error);
        alert(error.message);
        navigate("/login");
      }
    };

    initializeData();
  }, [navigate, noteId]); // Add noteId to dependencies

  const fetchNoteForEdit = async (token, id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${api}/notes/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch note for editing.");
      }

      const noteData = await response.json();
      setTitle(noteData.title);
      setNote(noteData.content);
    } catch (error) {
      console.error("Fetch Note Error:", error);
      alert(error.message);
      navigate("/home"); // Redirect to home if fetching fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !note.trim()) {
      alert("Title and content cannot be empty");
      return;
    }

    if (!userDetails?.id || !token) {
      alert("Authentication is missing. Please log in again.");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const requestData = {
        title: title.trim(),
        content: note.trim(),
        user_id: userDetails.id,
      };

      let url = `${api}/create`;
      let method = "POST";

      if (isEditing) {
        url = `${api}/edit/${noteId}`; // Assuming an update endpoint
        method = "PUT"; // Or PATCH, depending on your API
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Note ${isEditing ? "update" : "creation"} failed. Please try again.`);
      }

      alert(`Note ${isEditing ? "updated" : "created"} successfully`);
      navigate("/home");
    } catch (error) {
      console.error("Note Save Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements - Lighter colors, subtle blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-200/50 to-pink-200/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-200/40 to-indigo-200/50 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Floating particles - Lighter, more pastel colors */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-purple-300/80 rounded-full animate-bounce delay-300" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300/80 rounded-full animate-bounce delay-700" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-pink-300/80 rounded-full animate-bounce delay-1000" />
      </div>

      {/* Header with Glass Effect - Lighter background, subtle border */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="group w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 transition-all duration-300 text-gray-600 hover:text-gray-800 hover:scale-105 hover:rotate-3"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {/* Icon background - Brighter, softer gradient */}
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-md">
                    <Edit3 className="w-6 h-6 text-white" />
                  </div>
                  {/* Sparkle icon - Retained bright */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div>
                  {/* Title text - Darker, but still vibrant gradient */}
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-purple-700 to-blue-700 bg-clip-text text-transparent">
                    {isEditing ? "Edit Note" : "Create New Note"} {/* Dynamic title */}
                  </h1>
                  <p className="text-gray-500 text-sm font-medium">
                    {isEditing ? "Refine your thoughts beautifully" : "Express your thoughts beautifully"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Title Section with Enhanced Styling */}
            <div className="group space-y-4">
              <label className="flex items-center space-x-3 text-xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span>Note Title</span>
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-16 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 rounded-3xl px-8 text-2xl font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 shadow-lg hover:shadow-purple-100"
                  placeholder="Give your note an amazing title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${title.trim() ? "bg-green-500 shadow-lg shadow-green-300/50" : "bg-gray-300"}`}
                  />
                </div>
              </div>
            </div>

            {/* Content Section with Enhanced Styling */}
            <div className="group space-y-4">
              <label className="flex items-center space-x-3 text-xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-white" />
                </div>
                <span>Note Content</span>
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-300" />
              </label>
              <div className="relative">
                <textarea
                  className="w-full h-96 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-400 rounded-3xl p-8 text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 resize-none shadow-lg hover:shadow-blue-100 leading-relaxed"
                  placeholder="Start writing your amazing note here... Let your creativity flow!"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <div className="absolute bottom-6 right-6 flex items-center space-x-4">
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${note.trim() ? "bg-green-500 shadow-lg shadow-green-300/50" : "bg-gray-300"}`}
                  />
                  <div className="text-gray-500 text-sm font-medium bg-gray-100/70 backdrop-blur-sm px-3 py-1 rounded-full">
                    {note.length} chars
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Save Button - Vibrant but softer gradient */}
            <div className="hidden lg:flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={isLoading || !title.trim() || !note.trim()}
                className="group relative inline-flex items-center space-x-4 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-purple-200 disabled:cursor-not-allowed disabled:opacity-50 hover:scale-105 transform"
              >
                <div className="absolute inset-0 bg-white/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/50 border-t-white rounded-full animate-spin" />
                    <span>{isEditing ? "Updating Your Note..." : "Saving Your Note..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span>{isEditing ? "Update Note" : "Save Note"}</span>
                    <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card - Lighter background, soft border, dark text */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-500" />
                <span>Writing Stats</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Characters</span>
                  <span className="text-gray-800 font-bold">{note.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Words</span>
                  <span className="text-gray-800 font-bold">{wordCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Title Length</span>
                  <span className="text-gray-800 font-bold">{title.length}</span>
                </div>
              </div>
            </div>
            {/* Tips Card could go here */}
          </div>
        </div>
      </div>

      {/* Enhanced Floating Save Button - Mobile - Vibrant but softer gradient */}
      <button
        onClick={handleSave}
        disabled={isLoading || !title.trim() || !note.trim()}
        className="lg:hidden fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full shadow-xl hover:shadow-purple-200 transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 hover:scale-110 transform group"
      >
        <div className="absolute inset-0 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {isLoading ? (
          <div className="w-8 h-8 border-3 border-white/50 border-t-white rounded-full animate-spin" />
        ) : (
          <Save className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
        )}

        {/* Pulse ring animation - Softer color */}
        <div className="absolute inset-0 rounded-full border-4 border-purple-300/50 animate-ping" />
      </button>

      {/* Success/Error Toast would go here */}
    </div>
  );
}