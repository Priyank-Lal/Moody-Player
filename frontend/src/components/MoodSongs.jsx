import { useRef, useState } from "react";
import CustomAudioPlayer from "./CustomAudioPlayer";

const MoodSongs = ({ songs }) => {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);

  const handlePlay = (audioRef, index) => {
    if (currentAudio && currentAudio.current && currentAudio !== audioRef) {
      currentAudio.current.pause();
    }
    setCurrentAudio(audioRef);
    setPlayingIndex(index);
  };

  const handlePause = () => {
    setPlayingIndex(null);
  };

  return (
    <div className="w-full flex flex-col justify-end mt-4 sm:mt-6 px-1 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold text-left text-gray-200 mb-2 sm:mb-4 tracking-tight">
        Recommended Tracks
      </h1>
      {songs && songs.length > 0 ? (
        <div className="flex flex-col gap-3 sm:gap-4">
          {songs.map((song, index) => (
            <CustomAudioPlayer
              key={song.title}
              src={song.audio}
              title={song.title}
              artist={song.artist}
              isPlaying={playingIndex === index}
              onPlay={(audioRef) => handlePlay(audioRef, index)}
              onPause={handlePause}
            />
          ))}
        </div>
      ) : (
        <span className="text-lg sm:text-xl w-full text-center text-gray-300 mt-6 sm:mt-10">
          Nothing here yet..
        </span>
      )}
    </div>
  );
};

export default MoodSongs;
