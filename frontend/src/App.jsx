import { useState } from "react";
import FacialExpression from "./components/FacialExpression";
import MoodSongs from "./components/MoodSongs";
import ContributionModal from "./components/ContributionModal";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songs,setSongs] = useState([])
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-6 px-4 md:px-[100px] lg:px-[200px] flex flex-col items-center relative">
        <header className="w-full flex justify-between items-center text-white font-semibold text-lg md:text-xl drop-shadow-lg absolute top-4 px-6 md:px-12">
          <span className="tracking-normal">Moody Player</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white/10 cursor-pointer hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all text-sm md:text-base backdrop-blur-sm shadow-md"
          >
            Make your Contribution
          </button>
        </header>

        <div className="h-20" />

        <div className="w-full space-y-12">
          <FacialExpression setSongs={setSongs} />
          <MoodSongs songs={songs} />
          <ContributionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </>
  );
};

export default App;
