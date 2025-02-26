"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useContext } from "react";
import { MemeContext } from "../context/memeContext";
import { Edit, Heart, Save, Upload, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { likedMemes, uploadedMemes } = useContext(MemeContext);
  const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
  const [profile, setProfile] = useState(
    storedProfile || {
      name: "Anonymous",
      bio: "Meme Lover 😎",
      avatar: "/boy.png",
    }
  );

  // Load profile & uploaded memes from LocalStorage on mount
  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (storedProfile) setProfile(storedProfile);
  }, []);

  // Sync profile changes to LocalStorage
  const handleProfileChange = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  // Handle Avatar Upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.warning("File not found");

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      `${process.env.NEXT_PUBLIC_CLOUDNARY_PRESET}`
    ); // Replace with your Cloudinary preset

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDNARY_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          avatar: data.secure_url,
        }));
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // Save Profile Data
  const handleSaveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    toast.success("Profile saved successfully!");
  };

  const fadeIn = { opacity: 0, y: 20 };
  const fadeInAnimate = { opacity: 1, y: 0, transition: { duration: 0.5 } };
  return (
    <motion.div
      className="min-h-screen p-8 bg-[#fffdfa] dark:bg-gray-900 text-black dark:text-white flex flex-col items-center mt-20"
      initial={fadeIn}
      animate={fadeInAnimate}
    >
      <div className="max-w-4xl w-full space-y-8">
        {/* Profile Section */}
        <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-semibold text-center flex items-center gap-2">
            <User size={24} /> My Profile
          </h1>
          <div className="flex flex-col items-center mt-4">
            <Image
              src={profile.avatar}
              alt={`Profile avatar of ${profile.name}`}
              width={100}
              height={100}
              className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg"
            />
            <h2 className="text-2xl mt-2 font-semibold">{profile.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{profile.bio}</p>
          </div>
        </motion.div>

        {/* Edit Profile Section */}
        <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Edit size={24} /> Edit Profile
          </h2>
          <form className="flex flex-col gap-3 mt-4">
            <input
              type="text"
              placeholder="Enter Name"
              value={profile.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
              className="p-3 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
            />
            <textarea
              placeholder="Enter Bio"
              value={profile.bio}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
              className="p-3 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
            />
            <label className="cursor-pointer flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition transform hover:scale-105">
              <Upload size={20} /> Upload New Avatar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
            <button
              type="button"
              onClick={handleSaveProfile}
              aria-label="Save profile changes"
              className="mt-2 flex items-center justify-center gap-2 bg-[#512FEB] text-white px-4 py-2 rounded-lg hover:bg-[#4b2bdb] transition transform hover:scale-105"
            >
              <Save size={18} /> Save Changes
            </button>
          </form>
        </motion.div>

        {/* Uploaded Memes */}
        <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Upload size={24} /> My Uploaded Memes
          </h2>
          {uploadedMemes.length === 0 ? (
            <p className="text-gray-500 text-center mt-2">
              No memes uploaded yet!
            </p>
          ) : uploadedMemes.slice(0, 8).length === 0 ? (
            <p className="text-gray-500 text-center mt-2">
              No memes uploaded yet!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {uploadedMemes.map((meme) => (
                <div
                  key={meme.id}
                  className="bg-gray-100 dark:bg-gray-800 p-2  h-48 sm:h-72 relative rounded-lg shadow-md transition hover:scale-105"
                >
                  <Image
                    src={meme.url}
                    alt="Meme"
                    layout="fill" // Makes it cover the container
                    objectFit="cover"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Liked Memes */}
        <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Heart size={24} className="text-red-500" /> Liked Memes
          </h2>
          {likedMemes.length === 0 ? (
            <p className="text-gray-500 text-center mt-2">
              No liked memes yet!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {likedMemes.map((meme) => (
                <div
                  key={meme.id}
                  className="bg-gray-100 dark:bg-gray-800 p-2  h-48 sm:h-72 relative rounded-lg shadow-md transition hover:scale-105"
                >
                  <Image
                    src={meme.url}
                    alt="Meme"
                    layout="fill" // Makes it cover the container
                    objectFit="cover"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
