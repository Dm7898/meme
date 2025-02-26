"use client";
import { useState, useMemo, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MemeContext } from "../context/memeContext";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { debounce } from "lodash";

export default function Explorer() {
  const { memes } = useContext(MemeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const memesPerPage = 8;

  // Optimized filtering with useMemo
  const filteredMemes = useMemo(() => {
    return memes.filter((meme) =>
      meme.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, memes]);

  // Optimized pagination with useMemo
  const paginatedMemes = useMemo(() => {
    const startIndex = (page - 1) * memesPerPage;
    return filteredMemes.slice(startIndex, startIndex + memesPerPage);
  }, [page, filteredMemes]);

  // Debounced search input
  const debouncedSearch = useCallback(
    debounce((query) => setSearchTerm(query), 300),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-[#fffdfa] dark:bg-darkBg text-black dark:text-white p-6 mt-20"
    >
      <div className="relative max-w-6xl mx-auto mb-6 flex flex-col justify-between sm:flex-row ">
        <h1 className="text-2xl sm:text-3xl font-semibold">Explore Memes</h1>
        <div className="relative">
          <label htmlFor="searchMemes" className="sr-only">
            Search Memes
          </label>
          <Search
            className="absolute left-3 top-3.5 text-gray-500 dark:text-gray-400"
            size={20}
          />
          <input
            id="searchMemes"
            type="text"
            placeholder="Search memes..."
            className="pl-14 pr-10 py-3 w-full rounded-full bg-white  dark:bg-gray-800 shadow-lg border-none  focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
      </div>

      <section className="max-w-6xl mx-auto">
        <div className="columns-2 sm:columns-3 md:columns-4 gap-6 space-y-6">
          {paginatedMemes.map((meme) => (
            <motion.div
              key={meme.id}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all"
            >
              <Link href={`/meme/${meme.id}`}>
                {meme.url ? (
                  <Image
                    src={meme.url}
                    alt={meme.name || "Meme image"}
                    width={300}
                    height={400}
                    className="w-full h-auto rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <p className="p-4 text-center">No Image Found</p>
                )}
                <h3 className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white p-3 text-base sm:text-lg font-semibold">
                  {meme.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="flex justify-center mt-8 gap-4">
        <button
          aria-label="Previous Page"
          className="flex items-center px-5 py-2 bg-[#512FEB] dark:bg-[#4a28df] text-white rounded-full shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          <ChevronLeft size={20} /> Prev
        </button>
        <button
          aria-label="Next Page"
          className="flex items-center px-5 py-2 bg-[#512FEB] dark:bg-[#4a28df] text-white rounded-full shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page * memesPerPage >= filteredMemes.length}
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}
