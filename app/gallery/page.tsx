'use client';

import { useState, useEffect, Suspense } from 'react';
import { unsplash } from '@/lib/unsplash';
import { OrderBy } from 'unsplash-js';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { db } from '@/lib/instantdb';
import { tx, id } from '@instantdb/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import EmojiPicker from 'emoji-picker-react';

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

function GalleryContent() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [userId, setUserId] = useState<string>("");

    const searchParams = useSearchParams();
    const router = useRouter();

    // Initialize User ID on mount (client-side only)
    useEffect(() => {
        let currentUserId = localStorage.getItem('gallery_user_id');
        if (!currentUserId) {
            currentUserId = id();
            localStorage.setItem('gallery_user_id', currentUserId);
        }
        setUserId(currentUserId);
    }, []);

    // Handle Deep Linking
    useEffect(() => {
        const photoId = searchParams.get('photoId');
        if (photoId && photos.length > 0) {
            // Check if photo is already loaded
            const photo = photos.find(p => p.id === photoId);
            if (photo) {
                setSelectedPhoto(photo);
            } else {
                // Fetch specific photo if not in current list
                const fetchSpecificPhoto = async () => {

                    if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) return; // Handle missing key gracefully
                    try {
                        const result = await unsplash.photos.get({ photoId });
                        if (result.type === 'success') {
                            setSelectedPhoto(result.response as unknown as Photo);
                        }
                    } catch (e) {
                        console.error("Failed to fetch deep-linked photo", e);
                    }
                }
                fetchSpecificPhoto();
            }
        } else if (!photoId) {
            setSelectedPhoto(null);
        }
    }, [searchParams, photos]);


    // Wrapper to update URL when selecting a photo
    const handlePhotoSelect = (photo: Photo | null) => {
        if (photo) {
            router.push('/gallery?photoId=' + photo.id, { scroll: false });
        } else {
            router.push('/gallery', { scroll: false });
        }
        setSelectedPhoto(photo);
    };

    useEffect(() => {
        const fetchPhotos = async () => {
            setLoading(true);


            if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
                console.warn('Unsplash API key missing, using mock data');
                // Mock data for development/preview without API key
                const mockPhotos: Photo[] = Array.from({ length: 12 }).map((_, i) => ({
                    id: 'mock-' + i + '-' + page,
                    urls: {
                        regular: `https://picsum.photos/seed/${i + page * 10}/800/1000`,
                        small: `https://picsum.photos/seed/${i + page * 10}/400/500`,
                    },
                    alt_description: 'Mock Photo',
                    user: {
                        name: `Photographer ${i + 1}`,
                        username: `user${i + 1}`,
                        profile_image: { small: "https://github.com/shadcn.png" }
                    }
                }));
                setPhotos(mockPhotos);
                setLoading(false);
                return;
            }

            try {
                // If we are deep-linking to a specific photo, we might want to ensure we fetch it or just general gallery

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
        <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-[1600px] mx-auto p-6 md:p-12 relative z-10">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 animate-gradient-x bg-[length:200%_auto]">
                            PixelSync
                        </h1>
                        <p className="text-lg text-neutral-400 max-w-lg font-light leading-relaxed">
                            Experience visual storytelling in real-time. Connect, react, and share your perspective with the world.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all hover:scale-105 hover:border-indigo-500/50"
                        >
                            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                            <span className="font-medium tracking-wide">Home</span>
                        </Link>
                        <Link
                            href="/feed"
                            className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all hover:scale-105 hover:border-indigo-500/50"
                        >
                            <span className="text-xl group-hover:animate-pulse">🌍</span>
                            <span className="font-medium tracking-wide">Live Activity</span>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        </Link>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                        <p className="text-neutral-500 animate-pulse">Curating your gallery...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                            {photos.map((photo, index) => (
                                <motion.div
                                    key={photo.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                                    className="group relative bg-neutral-900/50 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5 hover:ring-indigo-500/50 transition-all duration-500 cursor-zoom-in"
                                    onClick={() => handlePhotoSelect(photo)}
                                >
                                    <div className="aspect-[3/4] overflow-hidden relative">
                                        <img
                                            src={photo.urls.regular}
                                            alt={photo.alt_description || 'Unsplash Photo'}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                            loading="lazy"
                                        />
                                        {/* Cinematic Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0">
                                            <div className="flex items-center justify-between text-white">
                                                <div className="flex items-center gap-3">
                                                    <img src={photo.user.profile_image.small} alt={photo.user.name} className="w-8 h-8 rounded-full ring-2 ring-white/20" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold truncate max-w-[140px]">{photo.user.name}</span>
                                                        <span className="text-[10px] text-white/60">@{photo.user.username}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 transition-colors">
                                                    <span className="text-sm">❤️</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center gap-6">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
                            >
                                Previous
                            </button>
                            <span className="text-neutral-500 font-mono text-sm tracking-wider">PAGE {page.toString().padStart(2, '0')}</span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={loading}
                                className="px-8 py-3 rounded-2xl bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Image Detail Modal */}
            <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && handlePhotoSelect(null)}>
                <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-neutral-900 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl z-50">
                    <DialogTitle className="sr-only">Image Detail View</DialogTitle>
                    {selectedPhoto && (
                        <PhotoDetailView selectedPhoto={selectedPhoto} userId={userId} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function GalleryPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col justify-center items-center h-screen bg-neutral-950 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="text-neutral-500 animate-pulse">Initializing Gallery...</p>
            </div>
        }>
            <GalleryContent />
        </Suspense>
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
    const [showPicker, setShowPicker] = useState(false);

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
        <div className="grid md:grid-cols-[1.5fr,1fr] h-full">
            {/* Image Section - Dark & Immersive */}
            <div className="bg-black flex items-center justify-center relative group min-h-[300px]">
                <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-3xl" />
                <img
                    src={selectedPhoto.urls.regular}
                    alt={selectedPhoto.alt_description || 'Detail view'}
                    className="relative max-h-full max-w-full object-contain z-10 shadow-2xl"
                />

                {/* Floating Reactions Stream */}
                <div className="absolute bottom-6 left-6 flex gap-2 flex-wrap z-20">
                    {Object.entries(reactionCounts).map(([emoji, count]) => (
                        <div key={emoji} className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/10 text-sm font-medium animate-in fade-in zoom-in duration-300">
                            <span>{emoji}</span>
                            <span className="text-white/70 text-xs">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Interaction Section - Clean & Readable */}
            <div className="flex flex-col h-full bg-white relative z-20">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center gap-4 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-30">
                    <img
                        src={selectedPhoto.user.profile_image.small}
                        alt={selectedPhoto.user.name}
                        className="w-12 h-12 rounded-full ring-2 ring-indigo-50 p-0.5"
                    />
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{selectedPhoto.user.name}</h3>
                        <p className="text-sm text-slate-500 font-medium">@{selectedPhoto.user.username}</p>
                    </div>
                </div>

                {/* Comments Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0 bg-slate-50/50">
                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.sort((a, b) => a.timestamp - b.timestamp).map(comment => (
                            <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 group">
                                <img src={comment.userAvatar} alt="avatar" className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between mb-1">
                                        <span className="text-sm font-bold text-slate-800">{comment.userName}</span>
                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 relative group/item hover:border-indigo-100 transition-colors">
                                        <p className="text-slate-700 leading-relaxed text-[15px]">{comment.text}</p>
                                        {comment.userId === userId && (
                                            <button
                                                onClick={() => deleteComment(comment.id)}
                                                className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 hover:shadow-md border border-slate-100 opacity-0 group-hover/item:opacity-100 transition-all p-1.5 rounded-full"
                                                title="Delete comment"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {comments.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 mt-[-40px]">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl rotate-3 mb-4 flex items-center justify-center shadow-sm border border-slate-100">
                                <span className="text-2xl grayscale opacity-50">💬</span>
                            </div>
                            <p className="font-medium text-slate-400">Start the conversation</p>
                        </div>
                    )}
                </div>

                {/* Footer / Input Area */}
                <div className="p-4 border-t border-slate-100 bg-white shrink-0 relative z-40">
                    <div className="flex gap-2 mb-4 justify-center md:justify-start items-center">
                        {/* Selected Reactions */}
                        {userReactions.size > 0 && Array.from(userReactions).map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => toggleReaction(emoji)}
                                className="text-2xl transition-all p-2 rounded-xl bg-indigo-50 border border-indigo-100 scale-100 hover:scale-105 active:scale-95"
                            >
                                {emoji}
                            </button>
                        ))}

                        {/* Show Picker */}
                        <div className="relative">
                            <button
                                onClick={() => setShowPicker(!showPicker)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all text-slate-600 hover:text-indigo-600 active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                            </button>
                            {showPicker && (
                                <div className="absolute bottom-14 left-0 z-50 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="shadow-2xl rounded-2xl overflow-hidden border border-slate-100 ring-4 ring-black/5">
                                        <EmojiPicker
                                            onEmojiClick={(emojiData) => {
                                                toggleReaction(emojiData.emoji);
                                                setShowPicker(false);
                                            }}
                                            width={320}
                                            height={400}
                                            theme={"light" as any}
                                            previewConfig={{ showPreview: false }}
                                        />
                                    </div>
                                    <div
                                        className="fixed inset-0 z-[-1]"
                                        onClick={() => setShowPicker(false)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3 relative">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                            placeholder="Write a thought..."
                            className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                        />
                        <button
                            onClick={handlePostComment}
                            disabled={!commentText.trim()}
                            className="px-6 py-3 bg-neutral-900 text-white rounded-2xl font-semibold text-sm hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
