import { useEffect, useRef, useState } from "react";

const CustomAudioPlayer = ({
  title,
  artist,
  src,
  isPlaying,
  onPlay,
  onPause,
}) => {
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  const handleSeek = (e) => {
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    audioRef.current.currentTime = newTime;
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="w-full bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-white text-base sm:text-lg font-semibold">
            {title}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">{artist}</p>
        </div>

        <button
          onClick={togglePlayPause}
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 sm:px-5 py-2 rounded-full shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer text-sm sm:text-base"
        >
          {isPlaying ? (
            <i className="fa-solid fa-pause text-lg sm:text-xl text-gray-50"></i>
          ) : (
            <i className="fa-solid fa-play text-lg sm:text-xl text-gray-50"></i>
          )}
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <div className="w-full flex items-center gap-2 sm:gap-4">
        <span className="text-gray-300 text-xs sm:text-sm w-[32px] sm:w-[40px] text-right">
          {formatTime(currentTime)}
        </span>
        <div
          className="w-full h-2 bg-gray-600 rounded-full relative cursor-pointer"
          onClick={handleSeek}
          ref={progressRef}
        >
          <div
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          />
        </div>
        <span className="text-gray-300 text-xs sm:text-sm w-[32px] sm:w-[40px]">
          {formatTime(duration)}
        </span>
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        className="hidden"
        onEnded={onPause}
      />
    </div>
  );
};

export default CustomAudioPlayer;
