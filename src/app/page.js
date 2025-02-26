"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useContext, useMemo } from "react";
import { MemeContext } from "./context/memeContext";

export default function Home() {
  const { memes } = useContext(MemeContext);
  const memoizedMemes = useMemo(() => memes, [memes]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-[#fffdfa]  dark:bg-darkBg text-black dark:text-white px-0 sm:px-6 mt-20"
    >
      <div>
        {/* Trending Memes */}
        <section className="p-6 max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-[#292b29] dark:text-white mb-6"
            aria-label="Trending Memes"
          >
            🔥 Trending Memes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {memoizedMemes.map((meme, index) => (
              <div
                key={meme.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 hover:shadow-xl"
              >
                <Link
                  href={`/meme/${meme.id}`}
                  className="block focus:ring-2 focus:ring-gray-400"
                >
                  {meme.url ? (
                    <div className="h-60 w-full overflow-hidden">
                      <Image
                        src={meme.url}
                        alt={meme.name ? meme.name : "meme"}
                        width={300}
                        height={240}
                        className="w-full h-full object-cover"
                        priority={index < 4}
                        placeholder="blur"
                        blurDataURL="/placeholder.jpg"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-60 bg-gray-300 dark:bg-gray-600">
                      <p className="text-gray-700 dark:text-gray-300">
                        Image not found
                      </p>
                    </div>
                  )}
                  <h3 className="text-base font-semibold text-[#292b29] dark:text-white p-4 text-center capitalize">
                    {meme.name}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
