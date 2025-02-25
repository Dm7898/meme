"use client";

import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

const MemeContext = createContext();

const MemeProvider = ({ children }) => {
  const [memes, setMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedMemeIds, setLikedMemeIds] = useState(new Set());
  const [uploadedMemes, setUploadedMemes] = useState([]);

  // Fetch uploaded memes from localStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMemes =
        JSON.parse(localStorage.getItem("uploadedMemes")) || [];
      setUploadedMemes(storedMemes);
    }
  }, []);

  // Fetch memes from API and localStorage
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}`);
        const fetchedMemes = res.data.data.memes.slice(0, 10);

        setMemes((prevMemes) => [...uploadedMemes, ...fetchedMemes]);
      } catch (err) {
        console.error("Error fetching memes:", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchMemes();
  }, [uploadedMemes]);

  // Load liked meme IDs once
  useEffect(() => {
    if (typeof window !== "undefined") {
      const likedIds = new Set(
        Object.keys(localStorage)
          .filter((key) => key.startsWith("liked-"))
          .map((key) => key.replace("liked-", ""))
      );

      setLikedMemeIds(likedIds);
    }
  }, []);

  // Update likedMemes when memes change
  useEffect(() => {
    if (!memes.length) return;

    const filteredMemes = memes
      .filter((meme) => likedMemeIds.has(meme.id.toString()))
      .map((meme) => ({
        ...meme,
        likes: parseInt(localStorage.getItem(`likes-${meme.id}`)) || 0,
      }));

    setLikedMemes(filteredMemes);
  }, [memes, likedMemeIds]);

  // Function to add a new meme
  const addMeme = useCallback((newMeme) => {
    setUploadedMemes((prevMemes) => {
      const updatedMemes = [newMeme, ...prevMemes];

      if (typeof window !== "undefined") {
        localStorage.setItem("uploadedMemes", JSON.stringify(updatedMemes));
      }

      return updatedMemes;
    });
  }, []);

  return (
    <MemeContext.Provider value={{ memes, likedMemes, addMeme, uploadedMemes }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#fffdfa] dark:bg-darkBg">
          <motion.div
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="w-20 h-20 rounded-full border-t-4 border-blue-500 border-solid animate-spin"
          />
        </div>
      ) : (
        children
      )}
    </MemeContext.Provider>
  );
};

export { MemeProvider, MemeContext };
