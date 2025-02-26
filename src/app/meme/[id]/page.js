"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useContext } from "react";
import { MemeContext } from "../../context/memeContext";
import { Clipboard, Heart, MessageCircle, Send, Share2, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "react-toastify";

export default function MemeDetails() {
  const { memes } = useContext(MemeContext);
  const { id } = useParams();
  const [meme, setMeme] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const memeData =
      memes || JSON.parse(localStorage.getItem("uploadedMemes")) || [];
    const memeDetail = memeData.find((m) => m.id === id);

    if (memeDetail) {
      setMeme(memeDetail);
      const storedLikes = localStorage.getItem(`likes-${id}`);
      setLikes(storedLikes ? parseInt(storedLikes) : memeDetail.likes || 0);
      const storedComments =
        JSON.parse(localStorage.getItem(`comments-${id}`)) || [];
      setComments(storedComments);
    }

    // Check if the user has already liked this meme
    if (localStorage.getItem(`liked-${id}`)) {
      setHasLiked(true);
    }
  }, [memes, id]);

  // Handle Like (only once per user)
  const handleLike = () => {
    if (hasLiked) return;

    const updatedLikes = likes + 1;
    setLikes(updatedLikes);
    setHasLiked(true);
    localStorage.setItem(`likes-${id}`, updatedLikes);
    localStorage.setItem(`liked-${id}`, "true");
  };

  // Handle Comment Submission
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    const updatedComments = [...comments, newComment];
    toast.success("New comment has added");
    setComments(updatedComments);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
    setNewComment("");
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (!meme) {
    return <h1 className="text-center mt-10">Meme not found 😢</h1>;
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-[#fffdfa] dark:bg-darkBg  text-white p-6 mt-20"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="max-w-2xl w-full bg-opacity-10 backdrop-blur-lg border border-gray-500 p-6 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Title */}
        <motion.h1
          className="text-2xl sm:text-3xl font-bold text-center mb-4 text-[#292b29] dark:text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {meme.name || "Untitled Meme"}
        </motion.h1>

        {/* Meme Image */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {meme.url ? (
            <Image
              src={meme.url}
              alt="Meme"
              width={350}
              height={350}
              className="w-80 h-auto rounded-lg shadow-lg"
              //   style={{ boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.4)" }}
            />
          ) : (
            <p className="text-gray-500">No image available</p>
          )}
        </motion.div>

        {/* Like & Share Buttons */}
        <motion.div
          className="mt-6 flex justify-center gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-white transition ${
              hasLiked ? "bg-gray-600" : "bg-[#512feb] hover:bg-[#4a29dd]"
            }`}
            disabled={hasLiked}
          >
            <Heart className="w-5 h-5" /> {likes}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowPopup(!showPopup)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition"
            >
              <Share2 className="w-5 h-5" /> Share
            </button>

            {/* Floating Share Popup */}
            {showPopup && (
              <div className="absolute top-1 left-24 sm:left-28 bg-white dark:bg-gray-800 text-black dark:text-white p-3 rounded-lg shadow-lg w-36 sm:w-48 z-50">
                {/* Close Button */}
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-2 left-1"
                >
                  <X className="w-4 h-4 text-gray-600 hover:text-gray-800 dark:text-gray-300" />
                </button>

                <h2 className="text-sm font-semibold text-center mb-2">
                  Share Meme
                </h2>

                <div className="flex flex-col gap-2 text-xs">
                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-2 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded transition"
                  >
                    <Clipboard className="w-4 h-4" /> Copy Link
                  </button>

                  {/* WhatsApp Share */}
                  <Link
                    href={`https://wa.me/?text=Check%20out%20this%20meme!%20${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
                  >
                    <Share2 className="w-4 h-4" /> WhatsApp
                  </Link>

                  {/* Twitter Share */}
                  <Link
                    href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20meme!%20${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                  >
                    <Share2 className="w-4 h-4" /> Twitter
                  </Link>
                </div>
              </div>
            )}

            {/* Clicking Outside Closes Popup */}
            {showPopup && (
              <div
                className="fixed inset-0"
                onClick={() => setShowPopup(false)}
              ></div>
            )}
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-[#292b29] dark:text-white">
            <MessageCircle className="w-6 h-6" /> Comments
          </h2>

          {/* Comments List */}
          <div className="mt-2 bg-white border border-[#292b29] drak:bg-gray-900 dark:bg-opacity-50 p-4 rounded-lg h-40 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center">
                No comments yet. Be the first! 🚀
              </p>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.2 },
                  },
                }}
              >
                {comments.map((comment, index) => (
                  <motion.p
                    key={index}
                    className="border-b border-gray-600 py-2 text-[#292b29]"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    {comment}
                  </motion.p>
                ))}
              </motion.div>
            )}
          </div>

          {/* Add Comment */}
          <div className="mt-4 flex items-center gap-2">
            <motion.input
              className="w-full p-3 border border-gray-500 rounded-full bg-black text-white"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              whileFocus={{
                scale: 1.02,
                boxShadow: "0px 0px 10px rgba(0, 255, 255, 0.3)",
              }}
            />
            <motion.button
              className="p-3 bg-[#512feb] hover:bg-[#4d2be4] text-white rounded-full transition flex items-center"
              onClick={handleCommentSubmit}
              whileTap={{ scale: 0.9 }}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
