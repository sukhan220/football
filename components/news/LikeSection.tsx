"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Heart, MessageSquare, Share2 } from "lucide-react";

interface LikeSectionProps {
  articleId: string;
  initialLikes: number;
  initialHasLiked: boolean;
  commentCount: number;
  labels: {                // 👈 এই টাইপটুকু নতুন যোগ করুন
    reactText: string;
    commentText: string;
  };
}

export default function LikeSection({ articleId, initialLikes, initialHasLiked, commentCount }: LikeSectionProps) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [isAnimate, setIsAnimate] = useState(false);

  const handleLike = async () => {
    if (!session) {
      alert("লাইক বা রিঅ্যাক্ট করতে আপনাকে অবশ্যই লগইন করতে হবে!");
      return;
    }

    // অপটিমিস্টিক আপডেট (ইউজার এক্সপেরিয়েন্স ফাস্ট করার জন্য)
    setHasLiked(!hasLiked);
    setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
    setIsAnimate(!hasLiked);

    try {
      await fetch(`/api/news/${articleId}/like`, { method: "POST" });
    } catch (error) {
      console.error("Like update failed", error);
    }
  };

  useEffect(() => {
    if (isAnimate) {
      const timer = setTimeout(() => setIsAnimate(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isAnimate]);

  return (
    <div className="flex items-center justify-between border-y border-emerald-950/40 py-4 my-6 bg-[#0b130e]/20 px-6 rounded-2xl">
      <div className="flex items-center gap-6">
        {/* ইনস্টাগ্রাম স্টাইল হার্ট বাটন */}
        <button 
          onClick={handleLike} 
          className="flex items-center gap-2 group outline-none"
        >
          <Heart 
            className={`w-6 h-6 transition-transform duration-200 group-hover:scale-110 ${
              hasLiked 
                ? "fill-red-500 text-red-500 scale-110" 
                : "text-gray-400 group-hover:text-red-400"
            } ${isAnimate ? "animate-ping absolute" : ""}`} 
          />
          {isAnimate && <Heart className="w-6 h-6 fill-red-500 text-red-500 animate-bounce" />}
          <span className={`text-sm font-bold ${hasLiked ? "text-red-500" : "text-gray-400"}`}>
            {likes.toLocaleString('bn-BD')} টি রিঅ্যাক্ট
          </span>
        </button>

        {/* কমেন্ট কাউন্ট ইন্ডিকেটর */}
        <div className="flex items-center gap-2 text-gray-400">
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-semibold">{commentCount.toLocaleString('bn-BD')} টি মন্তব্য</span>
        </div>
      </div>

      <button className="text-gray-400 hover:text-emerald-400 transition-colors">
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
}