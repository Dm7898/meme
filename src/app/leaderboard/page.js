"use client";
import { useMemo, useContext } from "react";
import Image from "next/image";
import { MemeContext } from "../context/memeContext";
import { Award, Heart, Medal, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const { likedMemes } = useContext(MemeContext);

  // Memoize sorted memes to prevent unnecessary sorting
  const topMemes = useMemo(() => {
    if (!likedMemes || likedMemes.length === 0) return [];
    return [...likedMemes].sort((a, b) => b.likes - a.likes).slice(0, 10);
  }, [likedMemes]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-6 bg-[#fffdfa] dark:bg-gray-900 text-black dark:text-white mt-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="max-w-6xl w-full">
        {/* Header */}
        <motion.h1 className="text-2xl sm:text-4xl font-bold flex items-center gap-2 justify-center">
          <Award className="text-yellow-500" /> Meme Leaderboard
        </motion.h1>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Top 10 most liked memes
        </p>

        {/* No Memes Message */}
        {topMemes.length === 0 ? (
          <p className="mt-6 text-gray-500 dark:text-gray-400 text-center">
            No memes available yet! Start uploading and liking memes. 🚀
          </p>
        ) : (
          <motion.div
            className="mt-6 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.2 } },
            }}
            initial="hidden"
            animate="show"
          >
            {topMemes.map((meme, index) => {
              const rankIcons = [
                <Award key="gold" className="text-yellow-500" />,
                <Medal key="silver" className="text-gray-500" />,
                <Star key="bronze" className="text-orange-500" />,
              ];

              const rankColors = [
                "border-yellow-400 bg-yellow-100 dark:bg-yellow-800",
                "border-gray-400 bg-gray-200 dark:bg-gray-700",
                "border-orange-400 bg-orange-100 dark:bg-orange-800",
              ];

              const rankClass =
                index < 3
                  ? rankColors[index]
                  : "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800";

              return (
                <motion.div
                  key={meme.id}
                  className={`p-3 border rounded-lg shadow-lg ${rankClass}`}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    show: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <h2 className="text-base font-semibold flex items-center gap-2">
                    {index < 3 && rankIcons[index]} #{index + 1} Meme
                  </h2>
                  <Image
                    src={meme.url}
                    alt={`Meme ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-auto rounded-lg mt-3 shadow-md object-cover"
                  />
                  <p className="text-gray-600 dark:text-gray-300 mt-3 flex items-center gap-2">
                    <Heart className="text-red-500" /> {meme.likes || 0} Likes
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
