'use client';

import { useEffect, useState } from 'react';
import { unsplash } from '@/lib/unsplash';
import { OrderBy } from 'unsplash-js';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

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
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Gallery</h1>
                    <p className="text-slate-500">Curated visuals from around the world. React instantly.</p>
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
                                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
        </div>
    );
}
