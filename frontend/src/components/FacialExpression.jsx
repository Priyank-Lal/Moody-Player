import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const FacialExpression = ({ setSongs }) => {
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [mood, setMood] = useState("");
  const [error, setError] = useState("");

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsVideoReady(true);
        }
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  };

  const detectMood = async () => {
    setError("");
    setMood("");

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detections || detections.length === 0) {
      setError("Error detecting face. Please try again.");
      return;
    }

    let mostProbableExpression = 0;
    let _expression = "";
    for (let expression of Object.keys(detections[0].expressions)) {
      if (detections[0].expressions[expression] > mostProbableExpression) {
        mostProbableExpression = detections[0].expressions[expression];
        _expression = expression;
      }
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/songs?mood=${_expression}`
      );
      setMood(_expression);
      setSongs(data.songs);
    } catch (err) {
      setError("Mood detected, but failed to fetch songs.");
    }
  };

  useEffect(() => {
    loadModels().then(() => {
      startVideo();
    });
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-center w-full py-4 sm:py-6">
      <div className="aspect-video w-full max-w-xs sm:max-w-md md:w-[600px] border rounded-2xl overflow-hidden shadow-md relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover rounded-2xl transform -scale-x-100"
        />
        {!isVideoReady && (
          <div className="absolute inset-0 bg-black/60 border border-dashed border-indigo-500 rounded-2xl flex items-center justify-center h-full">
            <span className="text-gray-300 text-base sm:text-lg">
              Video will be played here
            </span>
          </div>
        )}
      </div>

      <div className="text-center max-w-xs sm:max-w-md w-full space-y-3 sm:space-y-4">
        {mood ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              Face Detection Completed
            </h2>
            <p className="text-white text-lg sm:text-xl font-medium">
              Mood Detected:{" "}
              <span className="font-semibold capitalize text-green-400">
                {mood}
              </span>
            </p>
          </>
        ) : error ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              How are you feeling?
            </h2>
            <p className="text-red-400 text-sm sm:text-base font-medium">
              {error}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              How are you feeling?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base px-2">
              Click the button and let us read your expression 😄. We'll suggest
              music to match your vibe 🎶✨
            </p>
          </>
        )}

        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:scale-102 transition-transform cursor-pointer"
          onClick={detectMood}
        >
          Detect Mood
        </button>
      </div>
    </div>
  );
};

export default FacialExpression;
