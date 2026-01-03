'use client';

import { db, Reaction, Comment } from '@/lib/instantdb';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMemo } from 'react';

export default function FeedPage() {
    // Fetch all reactions and comments
    // In a real app we would set a limit, but InstantDB beta might not support 'limit' in useQuery yet depending on version,
    // so we'll fetch and slice on client for this demo.
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

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading Feed...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Global Activity Feed</h1>
                        <p className="text-slate-500">See what's happening across the entire gallery.</p>
                    </div>
                    <Link href="/gallery" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors">
                        Back to Gallery
                    </Link>
                </div>

                <div className="space-y-4">
                    {feedItems.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            No activity yet. Go to the gallery and be the first!
                        </div>
                    ) : (
                        feedItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/gallery?photoId=${item.imageId}`}
                                    className="block bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${item.type === 'reaction' ? 'bg-orange-50' : 'bg-blue-50'}`}>
                                            {item.type === 'reaction' ? item.emoji : '💬'}
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="font-bold text-slate-900">
                                                    {item.type === 'comment' ? item.userName : `User ${item.userId.slice(0, 4)}`}
                                                </span>
                                                <span className="text-slate-500 text-sm">
                                                    {item.type === 'reaction' ? 'reacted with' : 'commented'}
                                                </span>
                                                {item.type === 'reaction' && <span className="text-xl">{item.emoji}</span>}
                                            </div>

                                            {item.type === 'comment' && (
                                                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg rounded-tl-none inline-block">
                                                    {item.text}
                                                </p>
                                            )}

                                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                                                <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                                                <span>•</span>
                                                <span className="group-hover:text-indigo-600 transition-colors">View Image →</span>
                                            </div>
                                        </div>
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
