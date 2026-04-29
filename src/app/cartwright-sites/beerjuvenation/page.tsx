'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import NextImage from 'next/image';
import { X, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import ImageUploader from '@/components/navigation/ImageUploader';
import { uploadBeerjuvenation, getBeerjuvenationEntries, checkIsAdmin, deleteBeerjuvenation } from '@/app/actions/beerjuvenation';

export default function BeerjuvenationPage() {
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [secondaryImages, setSecondaryImages] = useState<File[]>([]);
    const [status, setStatus] = useState<string>('');
    const [showForm, setShowForm] = useState(false);
    const [entries, setEntries] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [resetKey, setResetKey] = useState<number>(Date.now());

    // Lightbox State
    const [lightboxImages, setLightboxImages] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number>(0);

    const [formDataState, setFormDataState] = useState({
        year: '',
        year_name: '',
        description: ''
    });

    const fetchEntries = useCallback(async () => {
        const result = await getBeerjuvenationEntries();
        if (result.success && result.data) {
            const fetchedEntries = result.data as any[];
            setEntries(fetchedEntries);

            // Automatically select the most recent year if none is selected
            if (fetchedEntries.length > 0) {
                setSelectedYear((prev) => {
                    if (prev && fetchedEntries.some(e => e.year === prev)) return prev;
                    return fetchedEntries[0].year;
                });
            }
        }
    }, []);

    const fetchRole = async () => {
        setIsAdmin(await checkIsAdmin());
    };

    useEffect(() => {
        fetchEntries();
        fetchRole();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('Uploading...');

        const formData = new FormData(e.currentTarget);
        const uploadedYear = parseInt(formDataState.year, 10); // capture before clearing

        if (mainImage) {
            formData.append('main_image', mainImage);
        }

        secondaryImages.forEach((file) => {
            formData.append('secondary_images', file);
        });

        try {
            const result = await uploadBeerjuvenation(formData);
            if (result.success) {
                setStatus('Upload successful!');
                setShowForm(false);
                setFormDataState({ year: '', year_name: '', description: '' });
                setMainImage(null);
                setSecondaryImages([]);
                setResetKey(Date.now());
                await fetchEntries(); // Refresh the list
                if (!isNaN(uploadedYear)) {
                    setSelectedYear(uploadedYear); // Jump to the newly uploaded year
                }
            } else {
                setStatus('Upload failed.');
            }
        } catch (error) {
            console.error(error);
            setStatus('An error occurred during upload.');
        }
    };

    const handleDelete = async (year: number) => {
        if (!confirm(`Are you sure you want to permanently delete the entry for ${year} and all its associated images?`)) return;
        const res = await deleteBeerjuvenation(year);
        if (res.success) {
            if (selectedYear === year) {
                setSelectedYear(null); // Will auto-fallback to newest year remaining
            }
            fetchEntries();
        } else {
            alert('Failed to delete: ' + res.error);
        }
    };

    const handleEdit = (entry: any) => {
        setFormDataState({
            year: String(entry.year),
            year_name: entry.year_name,
            description: entry.description
        });
        setMainImage(null);
        setSecondaryImages([]);
        setResetKey(Date.now());
        setStatus('');
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleForm = () => {
        setShowForm(!showForm);
        setFormDataState({ year: '', year_name: '', description: '' });
        setMainImage(null);
        setSecondaryImages([]);
        setResetKey(Date.now());
        setStatus('');
    };

    // Find the currently active entry to display — memoized so it only recomputes when entries or selectedYear change
    const activeEntry = useMemo(() => entries.find(e => e.year === selectedYear), [entries, selectedYear]);

    // Pre-parse secondary image URLs so it doesn't run inline on every render
    const { secondaryUrls, allImgs } = useMemo(() => {
        if (!activeEntry) return { secondaryUrls: [], allImgs: [] };
        let secondary: string[] = [];
        try {
            secondary = activeEntry.secondary_image_urls ? JSON.parse(activeEntry.secondary_image_urls) : [];
        } catch { }
        const all = activeEntry.main_image_url ? [activeEntry.main_image_url, ...secondary] : secondary;
        return { secondaryUrls: secondary, allImgs: all };
    }, [activeEntry]);

    return (
        <>
            {/* Full Screen Lightbox Overlay */}
            {lightboxImages.length > 0 && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
                    <button onClick={() => setLightboxImages([])} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                        <X className="w-8 h-8" />
                    </button>

                    {lightboxImages.length > 1 && (
                        <>
                            <button onClick={() => setLightboxIndex(p => (p - 1 + lightboxImages.length) % lightboxImages.length)} className="absolute left-6 text-slate-400 hover:text-white transition-colors">
                                <ChevronLeft className="w-12 h-12" />
                            </button>
                            <button onClick={() => setLightboxIndex(p => (p + 1) % lightboxImages.length)} className="absolute right-6 text-slate-400 hover:text-white transition-colors">
                                <ChevronRight className="w-12 h-12" />
                            </button>
                        </>
                    )}

                    <img src={lightboxImages[lightboxIndex]} alt={`Gallery image ${lightboxIndex + 1}`} className="max-w-full max-h-full object-contain bg-black" decoding="async" />
                    <div className="absolute bottom-6 text-slate-400 text-sm font-medium tracking-widest bg-black/50 px-4 py-2 rounded-full">
                        {lightboxIndex + 1} OF {lightboxImages.length}
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-slate-100">Beerjuvenation</h1>
                        {isAdmin && (
                            <button
                                onClick={toggleForm}
                                className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md transition-colors shadow-sm"
                            >
                                {showForm ? 'Cancel' : '+ Add New Entry'}
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">Since the beginning of time there have been men that make their fortunes off the backs of others. This holiday is meant for us who toil. Let it all go for a while. Be happy, be content with right now! Relax. Have a beer!</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Sidebar Timeline */}
                    {entries.length > 0 && (
                        <div className="w-full md:w-32 shrink-0 md:border-r border-slate-800 md:pr-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
                            {entries.map(entry => (
                                <button
                                    key={entry.year}
                                    onClick={() => {
                                        setShowForm(false);
                                        setSelectedYear(entry.year);
                                    }}
                                    className={`text-lg font-bold py-3 px-4 rounded-md transition-colors text-center md:text-left whitespace-nowrap ${selectedYear === entry.year && !showForm
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                        }`}
                                >
                                    {entry.year}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className="flex-grow min-w-0">
                        {showForm ? (
                            <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 space-y-6 text-slate-100 max-w-2xl mx-auto mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
                                    <input type="number" name="year" required value={formDataState.year} onChange={(e) => setFormDataState({ ...formDataState, year: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Year Name</label>
                                    <input type="text" name="year_name" required value={formDataState.year_name} onChange={(e) => setFormDataState({ ...formDataState, year_name: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                    <textarea name="description" required rows={6} value={formDataState.description} onChange={(e) => setFormDataState({ ...formDataState, description: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                                </div>
                                <div className="space-y-4" key={resetKey}>
                                    <ImageUploader label="Upload Main Image" multiple={false} onFileSelect={(file) => setMainImage(file as File)} />
                                    <ImageUploader label="Upload Secondary Images" multiple={true} onFileSelect={(files) => setSecondaryImages(files as File[])} />
                                </div>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md transition-colors shadow-sm">Save Beerjuvenation Entry</button>
                                {status && <div className="mt-4 text-center text-sm font-medium text-slate-300">{status}</div>}
                            </form>
                        ) : activeEntry ? (
                            <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden relative transition-opacity duration-150">
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                                        <button onClick={() => handleEdit(activeEntry)} className="p-2 bg-black/50 hover:bg-blue-600 text-slate-200 hover:text-white rounded-full backdrop-blur-md transition-all shadow-sm" title="Edit Entry">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(activeEntry.year)} className="p-2 bg-black/50 hover:bg-red-600 text-slate-200 hover:text-white rounded-full backdrop-blur-md transition-all shadow-sm" title="Delete Entry">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                                {activeEntry.main_image_url && (
                                    <div className="relative group cursor-pointer h-[400px] overflow-hidden" onClick={() => { setLightboxImages(allImgs); setLightboxIndex(0); }}>
                                        {/* Thumbnail: Next.js resizes + caches at ~800px wide, q=60. blurDataURL shows immediately while large source files (e.g. 2024's 7.7MB jpg) are being processed */}
                                        <NextImage
                                            key={activeEntry.main_image_url}
                                            src={activeEntry.main_image_url}
                                            alt={activeEntry.year_name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            quality={60}
                                            className="object-cover transition-opacity duration-500"
                                            priority
                                            placeholder="blur"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                            <span className="opacity-0 group-hover:opacity-100 bg-black/80 text-white px-6 py-3 rounded-full backdrop-blur-sm transition-opacity font-medium tracking-wide">
                                                View Gallery ({allImgs.length} Images)
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="p-8 text-slate-100">
                                    <h2 className="text-3xl font-bold mb-2">{activeEntry.year} - {activeEntry.year_name}</h2>
                                    <p className="text-slate-300 text-lg leading-relaxed mb-8">{activeEntry.description}</p>

                                    {secondaryUrls.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">More from {activeEntry.year}</h3>
                                            <div className="flex gap-3 overflow-x-auto pb-4">
                                                {secondaryUrls.map((url: string, idx: number) => (
                                                    <button key={url} onClick={() => { setLightboxImages(allImgs); setLightboxIndex(idx + 1); }} className="shrink-0 relative group h-24 w-24 rounded-lg overflow-hidden border border-slate-700 group-hover:border-blue-500 transition-colors bg-slate-950">
                                                        {/* Small thumbnails: resized to 96×96, q=50 */}
                                                        <NextImage src={url} alt={`Secondary ${idx + 1}`} fill sizes="96px" quality={50} className="object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : entries.length === 0 ? (
                            <div className="bg-slate-900 p-12 rounded-xl shadow-sm border border-slate-800 text-center text-slate-400">
                                <p className="text-lg">The Beerjuvenation gallery is currently empty.</p>
                                {isAdmin && <p className="text-sm mt-2">Click "+ Add New Entry" to get started.</p>}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}