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
    <div className="w-full flex flex-col justify-end mt-6">
      <h1 className="text-3xl font-bold text-left text-gray-200 mb-4 tracking-tight">
        Recommended Tracks
      </h1>
      {songs && songs.length > 0 ? (
        <div className="flex flex-col gap-4">
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
        <span className="text-xl w-full text-center text-gray-300 mt-10">
          Nothing here yet..
        </span>
      )}
    </div>
  );
};

export default MoodSongs;
