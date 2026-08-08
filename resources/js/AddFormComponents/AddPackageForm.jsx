// import React from "react";

// const AddPackageForm = () => {
//     const [submitting, setSubmitting] = useState(false);
//     const [packageForm, setPackageForm] = useState({
//        title: "",
//        days: "",
//        people: "",
//        resort: "",
//        price: "",
//        emoji: "",
//        destination_id: "",
//        category: "",
//        image: null,
//        description: "",
//        includes: "",
//        excludes: "",
//        itinery: "",

//     });
//     //  Use Effect
//     useEffect(() => {
//         if (editingPackage) {
//             setPackageForm({
//                 ...editingPackage,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setPackageForm({
//                  title: "",
//        days: "",
//        people: "",
//        resort: "",
//        price: "",
//        emoji: "",
//        destination_id: "",
//        category: "",
//        image: null,
//        description: "",
//        includes: "",
//        excludes: "",
//        itinery: "",
//             });
//         }
//     }, [editingPackage]);

//     // Handle Create Package
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourpackages.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating package", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in packageForm) {
//             if (packageForm[key] !== null && packageForm[key] !== "") {
//                 formData.append(key, packageForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingPackage) {
//                 // Editing existing package
//                 await handleUpdate(formData, editingPackage.id);
//             } else {
//                 // Creating new package
//                 await handleCreate(formData);
//             }
//             setPackageForm({
//                  title: "",
//        days: "",
//        people: "",
//        resort: "",
//        price: "",
//        emoji: "",
//        destination_id: "",
//        category: "",
//        image: null,
//        description: "",
//        includes: "",
//        excludes: "",
//        itinery: "",
//             });

//             setShowForm(false);
//             setEditingPackage(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setPackageForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));
//     };

//     if (!showForm) return null;
//     return (
//         <div>
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                 <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-gray-800">
//                             Add New Package
//                         </h2>
//                         <button
//                             onClick={() => {
//                                 setShowForm(false);
//                             }}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                         >
//                             <X size={24} />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddPackageForm;



import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, ImagePlus } from "lucide-react";

const emptyPackageForm = {
    title: "",
    days: "",
    people: "",
    resort: "",
    price: "",
    destination_id: "",
    category: "",
    description: "",
    includes: "",
    excludes: "",
};

const emptyItineraryRow = { day: "", title: "", description: "" };

const AddPackageForm = ({
    showForm,
    setShowForm,
    setReloadTrigger,
    editingPackage,
    setEditingPackage,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [destinations, setDestinations] = useState([]);
    const [packageForm, setPackageForm] = useState(emptyPackageForm);
    const [itineraries, setItineraries] = useState([{ ...emptyItineraryRow, day: 1 }]);
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    // Emoji is a single image upload, tracked separately from packageForm
    const [emojiFile, setEmojiFile] = useState(null);
    const [emojiPreview, setEmojiPreview] = useState(null);
    const [removeEmoji, setRemoveEmoji] = useState(false);

    const [errors, setErrors] = useState({});

    // Fetch destinations for the select dropdown
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await axios.get(route("ourdestinations.index"));
                // DestinationController::index returns { success, data: <paginator> }
                setDestinations(response.data?.data?.data ?? []);
            } catch (error) {
                console.error("Error fetching destinations", error);
            }
        };

        fetchDestinations();
    }, []);

    // Populate form when editing, reset when creating
    useEffect(() => {
        if (editingPackage) {
            setPackageForm({
                title: editingPackage.title ?? "",
                days: editingPackage.days ?? "",
                people: editingPackage.people ?? "",
                resort: editingPackage.resort ?? "",
                price: editingPackage.price ?? "",
                destination_id: editingPackage.destination_id ?? "",
                category: editingPackage.category ?? "",
                description: editingPackage.description ?? "",
                includes: editingPackage.includes ?? "",
                excludes: editingPackage.excludes ?? "",
            });

            setItineraries(
                editingPackage.itineraries?.length
                    ? editingPackage.itineraries.map((it) => ({
                          day: it.day,
                          title: it.title,
                          description: it.description ?? "",
                      }))
                    : [{ ...emptyItineraryRow, day: 1 }]
            );

            setExistingImages(editingPackage.images ?? []);
            setNewImages([]);

            setEmojiFile(null);
            setEmojiPreview(
                editingPackage.emoji ? `/storage/${editingPackage.emoji}` : null
            );
            setRemoveEmoji(false);

            setShowForm(true);
        } else {
            setPackageForm(emptyPackageForm);
            setItineraries([{ ...emptyItineraryRow, day: 1 }]);
            setExistingImages([]);
            setNewImages([]);
            setEmojiFile(null);
            setEmojiPreview(null);
            setRemoveEmoji(false);
        }

        setErrors({});
    }, [editingPackage]);

    // Handle text / select input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPackageForm((prev) => ({ ...prev, [name]: value }));
    };

    // Emoji/icon image handlers
    const handleEmojiChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setEmojiFile(file);
        setEmojiPreview(URL.createObjectURL(file));
        setRemoveEmoji(false);
        e.target.value = null;
    };

    const clearEmoji = () => {
        setEmojiFile(null);
        setEmojiPreview(null);
        setRemoveEmoji(true);
    };

    // Handle new gallery image selection (multiple)
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files ?? []);
        setNewImages((prev) => [...prev, ...files]);
        e.target.value = null; // allow re-selecting the same file
    };

    const removeNewImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (id) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== id));
    };

    // Itinerary row handlers
    const handleItineraryChange = (index, field, value) => {
        setItineraries((prev) =>
            prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
        );
    };

    const addItineraryRow = () => {
        setItineraries((prev) => [
            ...prev,
            { ...emptyItineraryRow, day: prev.length + 1 },
        ]);
    };

    const removeItineraryRow = (index) => {
        setItineraries((prev) => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setPackageForm(emptyPackageForm);
        setItineraries([{ ...emptyItineraryRow, day: 1 }]);
        setExistingImages([]);
        setNewImages([]);
        setEmojiFile(null);
        setEmojiPreview(null);
        setRemoveEmoji(false);
        setErrors({});
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingPackage(null);
        resetForm();
    };

    // Create a new package
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourpackage.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating package", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();

        // Basic fields
        Object.entries(packageForm).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        // Emoji/icon image
        if (emojiFile) {
            formData.append("emoji", emojiFile);
        } else if (removeEmoji && editingPackage) {
            formData.append("remove_emoji", "1");
        }

        // New gallery images
        newImages.forEach((file) => {
            formData.append("images[]", file);
        });

        // Existing gallery images to keep (only relevant on edit)
        existingImages.forEach((img) => {
            formData.append("existing_images[]", img.id);
        });

        // Itineraries
        itineraries.forEach((row, index) => {
            formData.append(`itineraries[${index}][day]`, row.day);
            formData.append(`itineraries[${index}][title]`, row.title);
            if (row.description) {
                formData.append(
                    `itineraries[${index}][description]`,
                    row.description
                );
            }
        });

        try {
            setSubmitting(true);

            if (editingPackage) {
                await handleUpdate(formData, editingPackage.id);
            } else {
                await handleCreate(formData);
            }

            closeForm();
        } catch (error) {
            console.log("Error saving data", error);
            if (error?.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl my-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingPackage ? "Edit Package" : "Add New Package"}
                    </h2>
                    <button
                        type="button"
                        onClick={closeForm}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={packageForm.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500 mt-1">{errors.title[0]}</p>
                        )}
                    </div>

                    {/* Destination select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destination
                        </label>
                        <select
                            name="destination_id"
                            value={packageForm.destination_id}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            required
                        >
                            <option value="" disabled>
                                Select a destination
                            </option>
                            {destinations.map((destination) => (
                                <option key={destination.id} value={destination.id}>
                                    {destination.title}
                                </option>
                            ))}
                        </select>
                        {errors.destination_id && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.destination_id[0]}
                            </p>
                        )}
                    </div>

                    {/* Days / People */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Days
                            </label>
                            <input
                                type="text"
                                name="days"
                                value={packageForm.days}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                People
                            </label>
                            <input
                                type="text"
                                name="people"
                                value={packageForm.people}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Resort / Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Resort
                            </label>
                            <input
                                type="text"
                                name="resort"
                                value={packageForm.resort}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={packageForm.price}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Emoji / icon image + Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Icon Image
                            </label>

                            {emojiPreview ? (
                                <div className="relative w-16 h-16">
                                    <img
                                        src={emojiPreview}
                                        alt="Package icon"
                                        className="w-16 h-16 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={clearEmoji}
                                        className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <label className="w-16 h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <ImagePlus size={20} className="text-gray-400" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleEmojiChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                            {errors.emoji && (
                                <p className="text-sm text-red-500 mt-1">{errors.emoji[0]}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={packageForm.category}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={packageForm.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Includes / Excludes */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Includes
                            </label>
                            <textarea
                                name="includes"
                                value={packageForm.includes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Excludes
                            </label>
                            <textarea
                                name="excludes"
                                value={packageForm.excludes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Itinerary */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Itinerary
                            </label>
                            <button
                                type="button"
                                onClick={addItineraryRow}
                                className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                            >
                                <Plus size={16} /> Add day
                            </button>
                        </div>

                        <div className="space-y-3">
                            {itineraries.map((row, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-3 space-y-2"
                                >
                                    <div className="flex gap-2 items-start">
                                        <input
                                            type="number"
                                            min={1}
                                            placeholder="Day"
                                            value={row.day}
                                            onChange={(e) =>
                                                handleItineraryChange(index, "day", e.target.value)
                                            }
                                            className="w-20 border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            value={row.title}
                                            onChange={(e) =>
                                                handleItineraryChange(index, "title", e.target.value)
                                            }
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                        {itineraries.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItineraryRow(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <textarea
                                        placeholder="Description (optional)"
                                        value={row.description}
                                        onChange={(e) =>
                                            handleItineraryChange(
                                                index,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={2}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gallery Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gallery Images
                        </label>

                        {existingImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {existingImages.map((img) => (
                                    <div key={img.id} className="relative">
                                        <img
                                            src={`/storage/${img.image}`}
                                            alt="Package"
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(img.id)}
                                            className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {newImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {newImages.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="New upload"
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.images && (
                            <p className="text-sm text-red-500 mt-1">{errors.images[0]}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60"
                        >
                            {submitting
                                ? "Saving..."
                                : editingPackage
                                  ? "Update Package"
                                  : "Create Package"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPackageForm;