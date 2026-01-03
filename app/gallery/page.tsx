'use client';

import { useEffect, useState } from 'react';
import { unsplash } from '@/lib/unsplash';
import { OrderBy } from 'unsplash-js';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { db, Reaction } from '@/lib/instantdb';
import { tx, id } from '@instantdb/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Define a type for the Unsplash photo since the library types can be complex
type Photo = {
    id: string;
    urls: {
        regular: string;
        small: string;
    };
    alt_description: string | null;
    user: {
        name: string;
        username: string;
        profile_image: {
            small: string;
        };
    };
};

export default function GalleryPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [userId, setUserId] = useState<string>("");

    const searchParams = useSearchParams();
    const router = useRouter();
    const photoIdParam = searchParams.get('photoId');

    // Generate a random user ID on mount or retrieve from localStorage
    useEffect(() => {
        const storedUserId = localStorage.getItem("pixelsync_user_id");
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            const newId = Math.random().toString(36).substring(7);
            localStorage.setItem("pixelsync_user_id", newId);
            setUserId(newId);
        }
    }, []);

    // Deep Linking: Open photo if param exists
    useEffect(() => {
        if (photoIdParam && !selectedPhoto) {
            const fetchPhoto = async () => {
                try {
                    const result = await unsplash.photos.get({ photoId: photoIdParam });
                    if (result.type === 'success') {
                        setSelectedPhoto(result.response as unknown as Photo);
                    }
                } catch (e) {
                    console.error("Failed to load deep linked photo", e);
                }
            };
            fetchPhoto();
        }
    }, [photoIdParam]);

    // Update URL when opening/closing modal
    const handlePhotoSelect = (photo: Photo | null) => {
        setSelectedPhoto(photo);
        if (photo) {
            router.push(`/gallery?photoId=${photo.id}`, { scroll: false });
        } else {
            router.push('/gallery', { scroll: false });
        }
    };

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                setLoading(true);
                // Fallback to mock data if no key is present (for dev experience)
                if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
                    console.warn("No Unsplash Key found, using mock data");
                    // Simulate delay
                    await new Promise(resolve => setTimeout(resolve, 800));

                    const mockPhotos = Array.from({ length: 12 }).map((_, i) => ({
                        id: `mock-${page}-${i}`,
                        urls: {
                            regular: `https://picsum.photos/seed/${page * 100 + i}/800/600`,
                            small: `https://picsum.photos/seed/${page * 100 + i}/400/300`
                        },
                        alt_description: "Mock image",
                        user: {
                            name: "Mock User",
                            username: "mockuser",
                            profile_image: { small: "https://github.com/shadcn.png" }
                        }
                    }));
                    setPhotos(mockPhotos);
                    setLoading(false);
                    return;
                }

                const result = await unsplash.photos.list({
                    page,
                    perPage: 12,
                    orderBy: OrderBy.POPULAR,
                });

                if (result.type === 'success') {
                    setPhotos(result.response.results as unknown as Photo[]);
                    // Scroll to top when page changes
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } catch (error) {
                console.error('Error fetching photos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [page]);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Gallery</h1>
                        <p className="text-slate-500">Curated visuals from around the world. React instantly.</p>
                    </div>
                    <Link href="/feed" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                        <span>🌍</span> View Global Activity
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                            {photos.map((photo, index) => (
                                <motion.div
                                    key={photo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-zoom-in"
                                    onClick={() => handlePhotoSelect(photo)}
                                >
                                    <div className="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                                        <img
                                            src={photo.urls.regular}
                                            alt={photo.alt_description || 'Unsplash Photo'}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        {/* Overlay for actions */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <div className="flex items-center justify-between text-white">
                                                <div className="flex items-center gap-2">
                                                    <img src={photo.user.profile_image.small} alt={photo.user.name} className="w-6 h-6 rounded-full border border-white/50" />
                                                    <span className="text-sm font-medium truncate max-w-[120px]">{photo.user.name}</span>
                                                </div>
                                                {/* Placeholder for interactions */}
                                                <div className="flex gap-2">
                                                    <button className="p-2 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors">
                                                        ❤️
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className="px-6 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <span className="flex items-center text-slate-500 font-medium">Page {page}</span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={loading}
                                className="px-6 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Image Detail Modal */}
            <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && handlePhotoSelect(null)}>
                <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-none shadow-2xl rounded-3xl">
                    <DialogTitle className="sr-only">Image Detail View</DialogTitle>
                    {selectedPhoto && (
                        <PhotoDetailView selectedPhoto={selectedPhoto} userId={userId} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function PhotoDetailView({ selectedPhoto, userId }: { selectedPhoto: Photo, userId: string }) {
    // Query reactions and comments for this specific image
    const { isLoading, error, data } = db.useQuery({
        reactions: {
            $: {
                where: { imageId: selectedPhoto.id }
            }
        },
        comments: {
            $: {
                where: { imageId: selectedPhoto.id }
            }
        }
    });

    const [commentText, setCommentText] = useState("");

    if (isLoading) return <div className="p-12 text-center">Loading interactions...</div>;
    if (error) return <div className="p-12 text-center text-red-500">Error loading data: {error.message}</div>;

    const reactions = data?.reactions || [];
    const comments = data?.comments || [];

    const toggleReaction = (emoji: string) => {
        const existingReaction = reactions.find(
            (r: any) => r.userId === userId && r.emoji === emoji
        );

        if (existingReaction) {
            db.transact(tx.reactions[existingReaction.id].delete());
        } else {
            db.transact(tx.reactions[id()].update({
                imageId: selectedPhoto.id,
                emoji,
                userId,
                timestamp: Date.now(),
            }));
        }
    };

    const deleteComment = (commentId: string) => {
        db.transact(tx.comments[commentId].delete());
    };

    const handlePostComment = () => {
        if (!commentText.trim()) return;

        db.transact(tx.comments[id()].update({
            imageId: selectedPhoto.id,
            text: commentText,
            userId,
            userName: "User " + userId.slice(0, 4), // Simple alias
            userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
            timestamp: Date.now(),
        }));

        setCommentText("");
    };

    // Group reactions by emoji
    const reactionCounts = reactions.reduce((acc, reaction) => {
        acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Check which emojis the current user has selected
    const userReactions = new Set(
        reactions.filter((r: any) => r.userId === userId).map((r: any) => r.emoji)
    );

    return (
        <div className="grid md:grid-cols-[1.5fr,1fr] h-[80vh]">
            {/* Image Section */}
            <div className="bg-black flex items-center justify-center relative group min-h-[300px]">
                <img
                    src={selectedPhoto.urls.regular}
                    alt={selectedPhoto.alt_description || 'Detail view'}
                    className="max-h-full max-w-full object-contain"
                />

                {/* Floating Reactions Stream (Simple version) */}
                <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                    {Object.entries(reactionCounts).map(([emoji, count]) => (
                        <div key={emoji} className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-300">
                            {emoji} {count}
                        </div>
                    ))}
                </div>
            </div>

            {/* Interaction Section */}
            <div className="flex flex-col h-full border-l border-slate-100 bg-white">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center gap-4 shrink-0">
                    <img
                        src={selectedPhoto.user.profile_image.small}
                        alt={selectedPhoto.user.name}
                        className="w-10 h-10 rounded-full ring-2 ring-indigo-50"
                    />
                    <div>
                        <h3 className="font-bold text-slate-900 leading-tight">{selectedPhoto.user.name}</h3>
                        <p className="text-xs text-slate-500">@{selectedPhoto.user.username}</p>
                    </div>
                </div>

                {/* Comments Area (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                    {/* 1. Comments List */}
                    <div className="space-y-4">
                        {comments.sort((a, b) => a.timestamp - b.timestamp).map(comment => (
                            <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 group">
                                <img src={comment.userAvatar} alt="avatar" className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none relative group/item">
                                        <p className="text-xs font-bold text-slate-700 mb-1">{comment.userName}</p>
                                        <p className="text-sm text-slate-800 break-words">{comment.text}</p>
                                        {comment.userId === userId && (
                                            <button
                                                onClick={() => deleteComment(comment.id)}
                                                className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity p-1"
                                                title="Delete comment"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 2. Empty State / Reactions Stream */}
                    {comments.length === 0 && (
                        <div className="text-center text-slate-400 py-10">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">💬</span>
                            </div>
                            <p>No interactions yet. Be the first!</p>
                        </div>
                    )}
                </div>

                {/* Footer / Input Area */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
                    <div className="flex gap-2 mb-4 justify-center md:justify-start">
                        {/* Reaction Bar */}
                        {['❤️', '🔥', '👏', '😂'].map(emoji => {
                            const isSelected = userReactions.has(emoji);
                            return (
                                <button
                                    key={emoji}
                                    onClick={() => toggleReaction(emoji)}
                                    className={`text-2xl transition-all p-2 rounded-full hover:bg-slate-200/50 ${isSelected ? 'bg-indigo-100 scale-110 ring-2 ring-indigo-200' : 'hover:scale-110 active:scale-95'}`}
                                >
                                    {emoji}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-2 rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <button
                            onClick={handlePostComment}
                            disabled={!commentText.trim()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
