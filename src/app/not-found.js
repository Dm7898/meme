"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const memeList = [
  "https://i.imgflip.com/30b1gx.jpg",
  "https://i.imgflip.com/1bij.jpg",
  "https://i.imgflip.com/26am.jpg",
  "https://i.imgflip.com/1o00in.jpg",
  "https://i.imgflip.com/9ehk.jpg",
];

export default function NotFound() {
  const [randomMeme, setRandomMeme] = useState(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * memeList.length);
    setRandomMeme(memeList[randomIndex]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg mt-2">
        Oops! Looks like you got lost in meme land. 😂
      </p>

      {/* Render the image only when randomMeme is not null */}
      {randomMeme && (
        <Image
          src={randomMeme}
          alt="Funny Meme"
          width={100}
          height={100}
          className="w-80 h-auto rounded-lg mt-4 shadow-lg"
        />
      )}

      <Link
        href="/"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
      >
        Take me home 🏠
      </Link>
    </div>
  );
}
