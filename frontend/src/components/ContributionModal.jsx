import axios from "axios";
import { useState, useEffect } from "react";

const ContributionModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [mood, setMood] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audioFile) {
      alert("Please select an audio file!");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("mood", mood.toLocaleLowerCase());

    setLoading(true);

    try {
       await axios.post(
         `${import.meta.env.VITE_BACKEND_URL}/songs`,
         formData
       );
      alert("Song uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading song.");
    }
    setLoading(false);

    setTitle("");
    setAudioFile("");
    setArtist("");
    setMood("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {(isOpen || showModal) && (
        <div className="fixed inset-0 z-50 bg-gray-800/80 flex justify-center items-center px-2 sm:px-0">
          <div className="bg-gray-900 text-white p-4 sm:p-8 rounded-2xl w-full max-w-xs sm:max-w-lg shadow-2xl relative mx-2 sm:mx-0">
            <button
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-400 hover:text-red-500 text-xl sm:text-2xl cursor-pointer"
              onClick={onClose}
            >
              &times;
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
              Contribute a Song
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
              <input
                disabled={loading}
                required={true}
                type="text"
                placeholder="Song Title"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800 text-sm sm:text-base"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                disabled={loading}
                required={true}
                type="text"
                placeholder="Artist"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800 text-sm sm:text-base"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800 text-white focus:outline-none text-sm sm:text-base"
              >
                <option required={true} disabled value="">
                  Select a mood
                </option>
                <option value="neutral">Neutral</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
                <option value="fearful">Fearful</option>
                <option value="surprised">Surprised</option>
              </select>

              <div className="w-full">
                <label
                  htmlFor="audio-upload"
                  className={`block w-full cursor-pointer border-2 border-dashed border-gray-600 rounded-lg px-4 py-3 text-center text-sm sm:text-base text-gray-400 bg-gray-800 hover:border-indigo-500 transition-all duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {audioFile ? (
                    <span className="text-gray-200">{audioFile.name}</span>
                  ) : (
                    "🎵 Click or drag an audio file here"
                  )}
                </label>
                <input
                  id="audio-upload"
                  type="file"
                  disabled={loading}
                  required
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => setAudioFile(e.target.files[0])}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 py-2 sm:py-3 rounded-full text-white font-semibold shadow-lg hover:scale-101 transition-transform cursor-pointer text-base sm:text-lg"
              >
                {loading ? "Uploading..." : "Upload Song"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ContributionModal;
