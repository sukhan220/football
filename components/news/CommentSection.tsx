

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Send, Lock, CornerDownRight, MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  body?: string;    // ব্যাকএন্ডের ভিন্ন নামের সেফটি চেক
  content?: string; // ডাটাবেজের content ফিল্ড সাপোর্ট করার জন্য
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
  replies?: Comment[]; // রিপ্লাইগুলোর জন্য অ্যারে
}

interface CommentSectionProps {
  articleId: string;
  initialComments: Comment[];
}

export default function CommentSection({ articleId, initialComments }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // কোন কমেন্টের রিপ্লাই বক্স ওপেন হবে তা ট্র্যাক করার স্টেট
  const [activeReplyBoxId, setActiveReplyBoxId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // মূল কমেন্ট সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newComment.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/news/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newComment }),
      });

      if (res.ok) {
        const addedComment = await res.json();
        setComments([addedComment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // রিপ্লাই সাবমিট হ্যান্ডলার
  const handleReplySubmit = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!session || !replyText.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/news/${articleId}/comments/${commentId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyText }),
      });

      if (res.ok) {
        const addedReply = await res.json();
        
        // স্টেট আপডেট করে নির্দিষ্ট কমেন্টের ভেতর রিপ্লাই পুশ করা
        setComments(comments.map(c => {
          if (c.id === commentId) {
            return { ...c, replies: [addedReply, ...(c.replies || [])] };
          }
          return c;
        }));
        
        setReplyText("");
        setActiveReplyBoxId(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 space-y-6 border-t border-emerald-950/40 pt-8">
      <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
        <span>জনগণের মতামত</span>
        <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-full">
          {comments.length}
        </span>
      </h3>

      {/* কমেন্ট বক্স বা লগইন মেসেজ */}
      {session ? (
        <form onSubmit={handleSubmit} className="flex gap-4 items-start bg-[#0b130e]/30 p-4 rounded-2xl border border-emerald-950/40">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-emerald-500/30 flex-shrink-0">
            <Image src={session.user?.image || "/default-avatar.png"} alt="User" fill className="object-cover" />
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="আপনার মূল্যবান মতামত শেয়ার করুন..."
              rows={2}
              className="w-full bg-[#070b08] border border-emerald-950/80 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-emerald-500/50 resize-none pr-12"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="absolute right-3 bottom-4 text-emerald-500 hover:text-emerald-400 disabled:opacity-40 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 bg-amber-950/10 border border-amber-900/30 rounded-2xl text-center">
          <Lock className="w-6 h-6 text-amber-500/80 mb-2" />
          <p className="text-sm text-amber-200/80 font-medium">
            মন্তব্য করতে বা মতামত দেখতে আপনাকে অবশ্যই একাউন্টে লগইন করতে হবে।
          </p>
        </div>
      )}

      {/* কমেন্ট ফিড ও লিস্ট */}
      {session && (
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {comments.length === 0 ? (
            <p className="text-xs text-gray-500 italic">প্রথম মন্তব্যটি আপনিই করুন!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                
                {/* মেইন কমেন্ট কার্ড */}
                <div className="flex gap-3 bg-[#0b130e]/10 p-4 rounded-xl border border-emerald-950/20">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-emerald-900/20">
                    <Image src={comment.user.image || "/default-avatar.png"} alt={comment.user.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-emerald-400">{comment.user.name}</h4>
                      <span className="text-[10px] text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                    {/* এখানে বডি অথবা কনটেন্ট দুটাই সেফলি হ্যান্ডেল করা হয়েছে */}
                    <p className="text-sm text-gray-300 leading-relaxed font-normal">
                        
                        
                      {comment.body || comment.content || "মন্তব্য লোড করা যায়নি"}
                    </p>

                    {/* রিপ্লাই অ্যাকশন বাটন */}
                    <div className="pt-2">
                      <button 
                        onClick={() => {
                          setActiveReplyBoxId(activeReplyBoxId === comment.id ? null : comment.id);
                          setReplyText("");
                        }}
                        className="text-xs text-emerald-500/70 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>উত্তর দিন</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* রিপ্লাই ইনপুট বক্স (যদি একটিভ হয়) */}
                {activeReplyBoxId === comment.id && (
                  <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="flex gap-3 items-start ml-8 bg-emerald-950/5 p-3 rounded-xl border border-emerald-950/20">
                    <div className="flex-1 relative">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="আপনার উত্তর লিখুন..."
                        rows={1}
                        className="w-full bg-[#070b08] border border-emerald-950/80 rounded-xl px-3 py-2 text-xs text-gray-200 placeholder:text-gray-600 outline-none focus:border-emerald-500/50 resize-none pr-10"
                      />
                      <button
                        type="submit"
                        disabled={submitting || !replyText.trim()}
                        className="absolute right-2.5 bottom-3 text-emerald-500 hover:text-emerald-400 disabled:opacity-40"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* সাব-রিপ্লাই লিস্ট রেন্ডারিং */}
                {comment.replies && comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3 ml-8 bg-emerald-950/5 p-3 rounded-xl border border-emerald-950/10 items-start">
                    <CornerDownRight className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-1" />
                    <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-emerald-900/20">
                      <Image src={reply.user.image || "/default-avatar.png"} alt={reply.user.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[11px] font-bold text-emerald-500">{reply.user.name}</h5>
                        <span className="text-[9px] text-gray-600">
                          {new Date(reply.createdAt).toLocaleDateString('bn-BD')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed font-normal">
                        {reply.body || reply.content}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}