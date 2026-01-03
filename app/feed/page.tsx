'use client';

import { db, Reaction, Comment } from '@/lib/instantdb';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMemo } from 'react';

export default function FeedPage() {
    // Fetch all reactions and comments
    const { isLoading, error, data } = db.useQuery({
        reactions: {},
        comments: {}
    });

    const feedItems = useMemo(() => {
        if (!data) return [];
        const reactions = (data.reactions || []).map((r: any) => ({ ...r, type: 'reaction' }));
        const comments = (data.comments || []).map((c: any) => ({ ...c, type: 'comment' }));
        return [...reactions, ...comments].sort((a, b) => b.timestamp - a.timestamp);
    }, [data]);

    if (isLoading) return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <div className="animate-spin text-indigo-500 w-8 h-8 border-2 border-current border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-indigo-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                <header className="mb-12 flex items-center justify-between border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Activity Stream
                        </h1>
                        <p className="text-neutral-500 text-sm mt-1">Live updates from the community</p>
                    </div>
                    <Link href="/gallery" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-md flex items-center gap-2">
                        <span>←</span> Back
                    </Link>
                </header>

                <div className="space-y-8 relative">
                    {/* Timeline Line */}
                    {feedItems.length > 0 && (
                        <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500/50 via-white/10 to-transparent" />
                    )}

                    {feedItems.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                <span className="text-2xl opacity-50">✨</span>
                            </div>
                            <p className="text-neutral-500">No activity yet. Be the first to start a trend!</p>
                        </div>
                    ) : (
                        feedItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative pl-16 group"
                            >
                                {/* Timeline Dot */}
                                <div className={`absolute left-3 top-4 w-6 h-6 -ml-3 rounded-full flex items-center justify-center z-10 border-4 border-neutral-950 ${item.type === 'reaction' ? 'bg-indigo-500' : 'bg-pink-500'}`}>
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                </div>

                                <Link
                                    href={`/gallery?photoId=${item.imageId}`}
                                    className="block relative bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            {item.type === 'comment' ? (
                                                <img src={item.userAvatar} alt="user" className="w-6 h-6 rounded-full ring-1 ring-white/20" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                                    {item.userId.slice(0, 1).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="font-medium text-neutral-300 text-sm">
                                                {item.type === 'comment' ? item.userName : `User ${item.userId.slice(0, 4)}`}
                                            </span>
                                        </div>
                                        <span className="text-xs text-neutral-600 font-mono">
                                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {item.type === 'reaction' ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-neutral-500 text-sm">reacted with</span>
                                            <span className="text-2xl animate-bounce-short inline-block ml-1 bg-white/10 p-1.5 rounded-lg">{item.emoji}</span>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-neutral-200 text-lg font-light leading-relaxed">"{item.text}"</p>
                                        </div>
                                    )}

                                    <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-indigo-400 font-medium tracking-wide">
                                        VIEW IMAGE →
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
