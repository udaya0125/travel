// import React from "react";

// const AddDestinationForm = ({
//     editingDestination,
//     setShowForm,
//     setEditingDestination,
//     setReloadTrigger,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [destinationForm, setDestinationForm] = useState({
//         title: "",
//         description: "",
//         rating: "",
//         image: null,
//         price: "",
//     });
//     //  Use Effect
//     useEffect(() => {
//         if (editingDestination) {
//             setDestinationForm({
//                 ...editingDestination,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setDestinationForm({
//                 title: "",
//                 description: "",
//                 rating: "",
//                 image: null,
//                 price: "",
//             });
//         }
//     }, [editingDestination]);

//     // Handle Create Destination
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourdestinations.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating destination", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in destinationForm) {
//             if (destinationForm[key] !== null && destinationForm[key] !== "") {
//                 formData.append(key, destinationForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingDestination) {
//                 // Editing existing destination
//                 await handleUpdate(formData, editingDestination.id);
//             } else {
//                 // Creating new destination
//                 await handleCreate(formData);
//             }
//             setDestinationForm({
//                 title: "",
//                 description: "",
//                 rating: "",
//                 image: null,
//                 price: "",
//             });

//             setShowForm(false);
//             setEditingDestination(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setDestinationForm((prev) => ({
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
//                             Add New Destination
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

// export default AddDestinationForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader2 } from "lucide-react";

const AddDestinationForm = ({
    showForm,
    editingDestination,
    setShowForm,
    setEditingDestination,
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [destinationForm, setDestinationForm] = useState({
        title: "",
        description: "",
        rating: "",
        price: "",
    });
    const [newImages, setNewImages] = useState([]); // File[] to upload
    const [existingImages, setExistingImages] = useState([]); // [{id, image}] kept on edit

    // Populate / reset form when editing target changes
    useEffect(() => {
        if (editingDestination) {
            setDestinationForm({
                title: editingDestination.title ?? "",
                description: editingDestination.description ?? "",
                rating: editingDestination.rating ?? "",
                price: editingDestination.price ?? "",
            });
            setExistingImages(editingDestination.images ?? []);
            setNewImages([]);
        } else {
            setDestinationForm({
                title: "",
                description: "",
                rating: "",
                price: "",
            });
            setExistingImages([]);
            setNewImages([]);
        }
    }, [editingDestination]);

    // Handle Create Destination
    const handleCreate = async (formData) => {
        await axios.post(route("ourdestinations.store"), formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        setReloadTrigger((prev) => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDestinationForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages((prev) => [...prev, ...files]);
        e.target.value = ""; // allow re-selecting the same file
    };

    const removeNewImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (id) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== id));
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingDestination(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("title", destinationForm.title);
        formData.append("description", destinationForm.description);
        formData.append("price", destinationForm.price);
        if (destinationForm.rating !== "") {
            formData.append("rating", destinationForm.rating);
        }

        newImages.forEach((file) => {
            formData.append("images[]", file);
        });

        // Tell the backend which existing images survived (removed ones get deleted server-side)
        if (editingDestination) {
            existingImages.forEach((img) => {
                formData.append("existing_images[]", img.id);
            });
        }

        try {
            setSubmitting(true);

            if (editingDestination) {
                await handleUpdate(formData, editingDestination.id);
            } else {
                await handleCreate(formData);
            }

            closeForm();
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingDestination ? "Edit Destination" : "Add New Destination"}
                    </h2>
                    <button
                        onClick={closeForm}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={destinationForm.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={destinationForm.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="price"
                                value={destinationForm.price}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rating
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                name="rating"
                                value={destinationForm.rating}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Images
                        </label>
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            multiple
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-600"
                        />

                        {(existingImages.length > 0 || newImages.length > 0) && (
                            <div className="flex flex-wrap gap-3 mt-3">
                                {existingImages.map((img) => (
                                    <div key={`existing-${img.id}`} className="relative">
                                        <img
                                            src={`/storage/${img.image}`}
                                            alt="Existing"
                                            className="w-16 h-16 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(img.id)}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                {newImages.map((file, index) => (
                                    <div key={`new-${index}`} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="New"
                                            className="w-16 h-16 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:opacity-60"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            {editingDestination ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDestinationForm;
