// import { X } from "lucide-react";
// import React from "react";

// const PackagePopup = ({ pkg, onClose }) => {
//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     if (!pkg) return null;

//     const sortedItineraries = [...(pkg.itineraries ?? [])].sort(
//         (a, b) => (a.day ?? 0) - (b.day ?? 0)
//     );

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             {/* Backdrop */}
//             <div
//                 className="absolute inset-0 bg-black/50"
//                 onClick={onClose}
//             />

//             {/* Modal */}
//             <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-xl flex flex-col">
//                 {/* Header */}
//                 <div className="flex items-center justify-between px-6 py-4 border-b">
//                     <div className="flex items-center gap-3">
//                         {pkg.emoji || pkg.images?.[0]?.image ? (
//                             <img
//                                 src={`${imgurl}/${
//                                     pkg.emoji ?? pkg.images[0].image
//                                 }`}
//                                 alt={pkg.title}
//                                 className="w-12 h-12 rounded-lg object-cover border"
//                             />
//                         ) : (
//                             <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
//                                 🏝️
//                             </div>
//                         )}
//                         <div>
//                             <h2 className="text-lg font-semibold text-gray-800">
//                                 {pkg.title}
//                             </h2>
//                             {pkg.category && (
//                                 <p className="text-xs text-gray-500">
//                                     {pkg.category}
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
//                         title="Close"
//                     >
//                         <X size={16} />
//                     </button>
//                 </div>

//                 {/* Body (scrollable) */}
//                 <div className="overflow-y-auto px-6 py-5 space-y-6">
//                     {/* Quick facts */}
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                         <div className="bg-gray-50 rounded-lg p-3">
//                             <p className="text-[10px] uppercase text-gray-400">
//                                 Destination
//                             </p>
//                             <p className="text-sm font-medium text-gray-700">
//                                 {pkg.destination?.title ?? "—"}
//                             </p>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-3">
//                             <p className="text-[10px] uppercase text-gray-400">
//                                 Days
//                             </p>
//                             <p className="text-sm font-medium text-gray-700">
//                                 {pkg.days ?? "—"}
//                             </p>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-3">
//                             <p className="text-[10px] uppercase text-gray-400">
//                                 People
//                             </p>
//                             <p className="text-sm font-medium text-gray-700">
//                                 {pkg.people ?? "—"}
//                             </p>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-3">
//                             <p className="text-[10px] uppercase text-gray-400">
//                                 Price
//                             </p>
//                             <p className="text-sm font-medium text-gray-700">
//                                 ${pkg.price ?? "—"}
//                             </p>
//                         </div>
//                     </div>

//                     {pkg.resort && (
//                         <div>
//                             <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
//                                 Resort
//                             </p>
//                             <p className="text-sm text-gray-700">{pkg.resort}</p>
//                         </div>
//                     )}

//                     {pkg.description && (
//                         <div>
//                             <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
//                                 Description
//                             </p>
//                             <p className="text-sm text-gray-700 whitespace-pre-line">
//                                 {pkg.description}
//                             </p>
//                         </div>
//                     )}

//                     {(pkg.includes || pkg.excludes) && (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             {pkg.includes && (
//                                 <div>
//                                     <p className="text-xs font-semibold uppercase text-green-600 mb-1">
//                                         Includes
//                                     </p>
//                                     <p className="text-sm text-gray-700 whitespace-pre-line">
//                                         {pkg.includes}
//                                     </p>
//                                 </div>
//                             )}
//                             {pkg.excludes && (
//                                 <div>
//                                     <p className="text-xs font-semibold uppercase text-red-500 mb-1">
//                                         Excludes
//                                     </p>
//                                     <p className="text-sm text-gray-700 whitespace-pre-line">
//                                         {pkg.excludes}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* Gallery */}
//                     {pkg.images?.length > 0 && (
//                         <div>
//                             <p className="text-xs font-semibold uppercase text-gray-400 mb-2">
//                                 Gallery
//                             </p>
//                             <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
//                                 {pkg.images.map((img) => (
//                                     <img
//                                         key={img.id}
//                                         src={`${imgurl}/${img.image}`}
//                                         alt=""
//                                         className="w-full h-20 object-cover rounded-lg border"
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Itinerary */}
//                     {sortedItineraries.length > 0 && (
//                         <div>
//                             <p className="text-xs font-semibold uppercase text-gray-400 mb-2">
//                                 Itinerary
//                             </p>
//                             <div className="space-y-3">
//                                 {sortedItineraries.map((it) => (
//                                     <div
//                                         key={it.id}
//                                         className="flex gap-3 border rounded-lg p-3"
//                                     >
//                                         <div className="shrink-0 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
//                                             {it.day ?? "-"}
//                                         </div>
//                                         <div>
//                                             {it.title && (
//                                                 <p className="text-sm font-medium text-gray-800">
//                                                     {it.title}
//                                                 </p>
//                                             )}
//                                             {it.description && (
//                                                 <p className="text-sm text-gray-600 whitespace-pre-line">
//                                                     {it.description}
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PackagePopup;




import { X, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";

const PackagePopup = ({ pkg, onClose, setReloadTrigger }) => {
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const [images, setImages] = useState(pkg?.images ?? []);
    const [deletingImageId, setDeletingImageId] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);

    // Keep local gallery in sync if a different package is opened
    useEffect(() => {
        setImages(pkg?.images ?? []);
        setLightboxImage(null);
    }, [pkg]);

    if (!pkg) return null;

    const sortedItineraries = [...(pkg.itineraries ?? [])].sort(
        (a, b) => (a.day ?? 0) - (b.day ?? 0)
    );

    const handleDeleteImage = async (imageId) => {
        if (!window.confirm("Delete this image? This cannot be undone.")) {
            return;
        }

        setDeletingImageId(imageId);

        try {
            await axios.delete(
                route("ourpackage.images.destroy", { imageId }),
            );

            setImages((prev) => prev.filter((img) => img.id !== imageId));
            setReloadTrigger?.((prev) => !prev);
        } catch (error) {
            console.log("Error deleting image", error);
        } finally {
            setDeletingImageId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                        {pkg.emoji || pkg.images?.[0]?.image ? (
                            <img
                                src={`${imgurl}/${
                                    pkg.emoji ?? pkg.images[0].image
                                }`}
                                alt={pkg.title}
                                className="w-12 h-12 rounded-lg object-cover border"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                                🏝️
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {pkg.title}
                            </h2>
                            {pkg.category && (
                                <p className="text-xs text-gray-500">
                                    {pkg.category}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
                        title="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body (scrollable) */}
                <div className="overflow-y-auto px-6 py-5 space-y-6">
                    {/* Quick facts */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-[10px] uppercase text-gray-400">
                                Destination
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                {pkg.destination?.title ?? "—"}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-[10px] uppercase text-gray-400">
                                Days
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                {pkg.days ?? "—"}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-[10px] uppercase text-gray-400">
                                People
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                {pkg.people ?? "—"}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-[10px] uppercase text-gray-400">
                                Price
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                ${pkg.price ?? "—"}
                            </p>
                        </div>
                    </div>

                    {pkg.resort && (
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
                                Resort
                            </p>
                            <p className="text-sm text-gray-700">{pkg.resort}</p>
                        </div>
                    )}

                    {pkg.description && (
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
                                Description
                            </p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">
                                {pkg.description}
                            </p>
                        </div>
                    )}

                    {(pkg.includes || pkg.excludes) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {pkg.includes && (
                                <div>
                                    <p className="text-xs font-semibold uppercase text-green-600 mb-1">
                                        Includes
                                    </p>
                                    <p className="text-sm text-gray-700 whitespace-pre-line">
                                        {pkg.includes}
                                    </p>
                                </div>
                            )}
                            {pkg.excludes && (
                                <div>
                                    <p className="text-xs font-semibold uppercase text-red-500 mb-1">
                                        Excludes
                                    </p>
                                    <p className="text-sm text-gray-700 whitespace-pre-line">
                                        {pkg.excludes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Gallery */}
                    {images.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-400 mb-2">
                                Gallery
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {images.map((img) => (
                                    <div key={img.id} className="relative group">
                                        <img
                                            src={`${imgurl}/${img.image}`}
                                            alt=""
                                            onClick={() =>
                                                setLightboxImage(img)
                                            }
                                            className="w-full h-36 object-cover rounded-lg border cursor-zoom-in transition group-hover:brightness-90"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteImage(img.id);
                                            }}
                                            disabled={
                                                deletingImageId === img.id
                                            }
                                            title="Delete image"
                                            className="absolute top-1 right-1 p-1 rounded-full bg-white/90 text-gray-500 shadow  group-hover:opacity-100 hover:text-rose-500 hover:bg-white transition disabled:opacity-100 disabled:cursor-not-allowed"
                                        >
                                            {deletingImageId === img.id ? (
                                                <span className="block w-3 h-3 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
                                            ) : (
                                                <Trash2 size={12} />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Itinerary */}
                    {sortedItineraries.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-400 mb-2">
                                Itinerary
                            </p>
                            <div className="space-y-3">
                                {sortedItineraries.map((it) => (
                                    <div
                                        key={it.id}
                                        className="flex gap-3 border rounded-lg p-3"
                                    >
                                        <div className="shrink-0 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                                            {it.day ?? "-"}
                                        </div>
                                        <div>
                                            {it.title && (
                                                <p className="text-sm font-medium text-gray-800">
                                                    {it.title}
                                                </p>
                                            )}
                                            {it.description && (
                                                <p className="text-sm text-gray-600 whitespace-pre-line">
                                                    {it.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        type="button"
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                        title="Close"
                    >
                        <X size={20} />
                    </button>
                    <img
                        src={`${imgurl}/${lightboxImage.image}`}
                        alt=""
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
};

export default PackagePopup;
