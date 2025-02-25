"use client";
import { useState, useContext, useCallback, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { MemeContext } from "../context/memeContext";
import { Loader2, Send, Sparkles, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function UploadMeme() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [aiCaption, setAiCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const { addMeme, uploadedMemes } = useContext(MemeContext);

  // Handle image selection
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    if (uploadedUrl) return uploadedUrl;
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      `${process.env.NEXT_PUBLIC_CLOUDNARY_PRESET}`
    );

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDNARY_NAME}/image/upload`,
        formData
      );
      const url = res.data.secure_url;
      setUploadedUrl(url);
      return url;
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      toast.error("Failed to upload image. Please try again.");
      return null;
    }
  };

  // Generate AI Caption (Using Imgflip API for now)
  const generateAICaption = async () => {
    if (!image) return toast.warning("Please upload an image first!");
    setAiCaption("Generating... 🤖");

    try {
      const response = await axios.get("https://api.memegen.link/templates");
      const templates = response.data;
      if (templates.length > 0) {
        const randomIndex = Math.floor(Math.random() * templates.length);
        const randomTemplate = templates[randomIndex];

        setAiCaption(`Try this caption! "${randomTemplate.name}"`);
      } else {
        setAiCaption("No meme templates found. Try again!");
      }
    } catch (error) {
      console.error("Error fetching meme captions:", error);
      setAiCaption("Failed to generate 😢");
    }
  };

  // Handle Meme Upload (Store in localStorage)
  const handleUpload = async () => {
    if (!image) return toast.warning("Please select an image first!");
    if (!caption) return toast.warning("Please Enter a caption !");
    setUploading(true);

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(image);
    if (!imageUrl) {
      setUploading(false);
      return;
    }

    // Create meme object
    const newMeme = {
      id: Date.now().toString(),
      url: imageUrl,
      name: caption || aiCaption,
      uploader: "Anonymous",
      likes: 0,
      comments: [],
    };

    // Update meme list and store in localStorage
    addMeme(newMeme);

    // Reset state
    setUploading(false);
    setImage(null);
    setPreview(null);
    setCaption("");
    setAiCaption("");
    toast.success("Meme uploaded successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-[#fffdfa] dark:bg-darkBg text-black dark:text-white p-6 flex flex-col items-center mt-20"
    >
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-8">
        {/* Left: Upload Form */}
        <div className="w-full md:w-2/5">
          <h1 className="text-3xl font-semibold mb-6">Upload Your Meme</h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="py-4 flex flex-col gap-4"
          >
            <label className="max-w-48 w-full cursor-pointer flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              <Upload size={20} /> Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {/* Preview Section */}
            {preview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                className="w-full max-w-md bg-[#fffdfa] dark:bg-gray-700 p-4 rounded-lg shadow-lg text-center"
              >
                <Image
                  src={preview}
                  width={100}
                  height={100}
                  alt="Meme preview before uploading"
                  className="w-28 h-28 rounded-lg mx-auto"
                />
                <textarea
                  className="w-full mt-3 p-2 border rounded-md bg-white dark:bg-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
                  placeholder="Add a funny caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <button
                  className="mt-3 flex items-center justify-center gap-2 bg-[#512feb] text-white px-4 py-2 rounded-lg hover:bg-[#4a2ad9] transition"
                  onClick={generateAICaption}
                  aria-label="Generate AI Caption"
                >
                  <Sparkles size={18} /> Generate AI Caption
                </button>
                {aiCaption && (
                  <p className="mt-2 italic text-gray-600 dark:text-gray-300">
                    {aiCaption}
                  </p>
                )}
                <button
                  className="mt-4 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                  {uploading ? "Uploading..." : "Upload Meme"}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right: Uploaded Memes */}
        <div className="w-full md:w-3/5">
          <h2 className="text-3xl font-semibold mb-4">Uploaded Memes</h2>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="grid grid-cols-2  gap-2 sm:gap-4"
          >
            {uploadedMemes.map((meme) => (
              <motion.div
                key={meme.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                {meme.url && (
                  <Image
                    src={meme.url}
                    width={200}
                    height={200}
                    alt={meme.name || "Meme"}
                    className="w-full h-auto rounded-lg"
                  />
                )}
                <p className="mt-2 text-center text-black dark:text-white">
                  {meme.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
