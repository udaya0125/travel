// import React, { useState, useEffect } from "react";
// import { X, Plus, Trash2, ImagePlus } from "lucide-react";

// const emptyPackageForm = {
//     title: "",
//     days: "",
//     people: "",
//     resort: "",
//     price: "",
//     destination_id: "",
//     category: "",
//     description: "",
//     includes: "",
//     excludes: "",
// };

// const emptyItineraryRow = { day: "", title: "", description: "" };

// const AddPackageForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingPackage,
//     setEditingPackage,
//     handleUpdate,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [destinations, setDestinations] = useState([]);
//     const [packageForm, setPackageForm] = useState(emptyPackageForm);
//     const [itineraries, setItineraries] = useState([
//         { ...emptyItineraryRow, day: 1 },
//     ]);
//     const [existingImages, setExistingImages] = useState([]);
//     const [newImages, setNewImages] = useState([]);

//     // Emoji is a single image upload, tracked separately from packageForm
//     const [emojiFile, setEmojiFile] = useState(null);
//     const [emojiPreview, setEmojiPreview] = useState(null);
//     const [removeEmoji, setRemoveEmoji] = useState(false);

//     const [errors, setErrors] = useState({});

//     // Fetch destinations for the select dropdown
//     useEffect(() => {
//         const fetchDestinations = async () => {
//             try {
//                 const response = await axios.get(
//                     route("ourdestinations.index"),
//                 );
//                 // DestinationController::index returns { success, data: <paginator> }
//                 setDestinations(response.data?.data?.data ?? []);
//             } catch (error) {
//                 console.error("Error fetching destinations", error);
//             }
//         };

//         fetchDestinations();
//     }, []);

//     // Populate form when editing, reset when creating
//     useEffect(() => {
//         if (editingPackage) {
//             setPackageForm({
//                 title: editingPackage.title ?? "",
//                 days: editingPackage.days ?? "",
//                 people: editingPackage.people ?? "",
//                 resort: editingPackage.resort ?? "",
//                 price: editingPackage.price ?? "",
//                 destination_id: editingPackage.destination_id ?? "",
//                 category: editingPackage.category ?? "",
//                 description: editingPackage.description ?? "",
//                 includes: editingPackage.includes ?? "",
//                 excludes: editingPackage.excludes ?? "",
//             });

//             setItineraries(
//                 editingPackage.itineraries?.length
//                     ? editingPackage.itineraries.map((it) => ({
//                           day: it.day,
//                           title: it.title,
//                           description: it.description ?? "",
//                       }))
//                     : [{ ...emptyItineraryRow, day: 1 }],
//             );

//             setExistingImages(editingPackage.images ?? []);
//             setNewImages([]);

//             setEmojiFile(null);
//             setEmojiPreview(
//                 editingPackage.emoji
//                     ? `/storage/${editingPackage.emoji}`
//                     : null,
//             );
//             setRemoveEmoji(false);

//             setShowForm(true);
//         } else {
//             setPackageForm(emptyPackageForm);
//             setItineraries([{ ...emptyItineraryRow, day: 1 }]);
//             setExistingImages([]);
//             setNewImages([]);
//             setEmojiFile(null);
//             setEmojiPreview(null);
//             setRemoveEmoji(false);
//         }

//         setErrors({});
//     }, [editingPackage]);

//     // Handle text / select input changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setPackageForm((prev) => ({ ...prev, [name]: value }));
//     };

//     // Emoji/icon image handlers
//     const handleEmojiChange = (e) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         setEmojiFile(file);
//         setEmojiPreview(URL.createObjectURL(file));
//         setRemoveEmoji(false);
//         e.target.value = null;
//     };

//     const clearEmoji = () => {
//         setEmojiFile(null);
//         setEmojiPreview(null);
//         setRemoveEmoji(true);
//     };

//     // Handle new gallery image selection (multiple)
//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files ?? []);
//         setNewImages((prev) => [...prev, ...files]);
//         e.target.value = null; // allow re-selecting the same file
//     };

//     const removeNewImage = (index) => {
//         setNewImages((prev) => prev.filter((_, i) => i !== index));
//     };

//     const removeExistingImage = (id) => {
//         setExistingImages((prev) => prev.filter((img) => img.id !== id));
//     };

//     // Itinerary row handlers
//     const handleItineraryChange = (index, field, value) => {
//         setItineraries((prev) =>
//             prev.map((row, i) =>
//                 i === index ? { ...row, [field]: value } : row,
//             ),
//         );
//     };

//     const addItineraryRow = () => {
//         setItineraries((prev) => [
//             ...prev,
//             { ...emptyItineraryRow, day: prev.length + 1 },
//         ]);
//     };

//     const removeItineraryRow = (index) => {
//         setItineraries((prev) => prev.filter((_, i) => i !== index));
//     };

//     const resetForm = () => {
//         setPackageForm(emptyPackageForm);
//         setItineraries([{ ...emptyItineraryRow, day: 1 }]);
//         setExistingImages([]);
//         setNewImages([]);
//         setEmojiFile(null);
//         setEmojiPreview(null);
//         setRemoveEmoji(false);
//         setErrors({});
//     };

//     const closeForm = () => {
//         setShowForm(false);
//         setEditingPackage(null);
//         resetForm();
//     };

//     // Create a new package
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourpackage.store"), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating package", error);
//             throw error;
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrors({});

//         const formData = new FormData();

//         // Basic fields
//         Object.entries(packageForm).forEach(([key, value]) => {
//             if (value !== null && value !== "") {
//                 formData.append(key, value);
//             }
//         });

//         // Emoji/icon image
//         if (emojiFile) {
//             formData.append("emoji", emojiFile);
//         } else if (removeEmoji && editingPackage) {
//             formData.append("remove_emoji", "1");
//         }

//         // New gallery images
//         newImages.forEach((file) => {
//             formData.append("images[]", file);
//         });

//         // Existing gallery images to keep (only relevant on edit)
//         existingImages.forEach((img) => {
//             formData.append("existing_images[]", img.id);
//         });

//         // Itineraries
//         itineraries.forEach((row, index) => {
//             formData.append(`itineraries[${index}][day]`, row.day);
//             formData.append(`itineraries[${index}][title]`, row.title);
//             if (row.description) {
//                 formData.append(
//                     `itineraries[${index}][description]`,
//                     row.description,
//                 );
//             }
//         });

//         try {
//             setSubmitting(true);

//             if (editingPackage) {
//                 await handleUpdate(formData, editingPackage.id);
//             } else {
//                 await handleCreate(formData);
//             }

//             closeForm();
//         } catch (error) {
//             console.log("Error saving data", error);
//             if (error?.response?.status === 422) {
//                 setErrors(error.response.data.errors ?? {});
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ">
//             <div
//                 className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl my-8 overflow-y-auto"
//                 style={{ maxHeight: "calc(100vh - 2rem)" }}
//             >
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         {editingPackage ? "Edit Package" : "Add New Package"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={closeForm}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     {/* Title */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Title
//                         </label>
//                         <input
//                             type="text"
//                             name="title"
//                             value={packageForm.title}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             required
//                         />
//                         {errors.title && (
//                             <p className="text-sm text-red-500 mt-1">
//                                 {errors.title[0]}
//                             </p>
//                         )}
//                     </div>

//                     {/* Destination select */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Destination
//                         </label>
//                         <select
//                             name="destination_id"
//                             value={packageForm.destination_id}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
//                             required
//                         >
//                             <option value="" disabled>
//                                 Select a destination
//                             </option>
//                             {destinations.map((destination) => (
//                                 <option
//                                     key={destination.id}
//                                     value={destination.id}
//                                 >
//                                     {destination.title}
//                                 </option>
//                             ))}
//                         </select>
//                         {errors.destination_id && (
//                             <p className="text-sm text-red-500 mt-1">
//                                 {errors.destination_id[0]}
//                             </p>
//                         )}
//                     </div>

//                     {/* Days / People */}
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Days
//                             </label>
//                             <input
//                                 type="text"
//                                 name="days"
//                                 value={packageForm.days}
//                                 onChange={handleChange}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 People
//                             </label>
//                             <input
//                                 type="text"
//                                 name="people"
//                                 value={packageForm.people}
//                                 onChange={handleChange}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     {/* Resort / Price */}
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Resort
//                             </label>
//                             <input
//                                 type="text"
//                                 name="resort"
//                                 value={packageForm.resort}
//                                 onChange={handleChange}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Price
//                             </label>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 name="price"
//                                 value={packageForm.price}
//                                 onChange={handleChange}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     {/* Emoji / icon image + Category */}
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Icon Image
//                             </label>

//                             {emojiPreview ? (
//                                 <div className="relative w-16 h-16">
//                                     <img
//                                         src={emojiPreview}
//                                         alt="Package icon"
//                                         className="w-16 h-16 object-cover rounded-lg border"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={clearEmoji}
//                                         className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
//                                     >
//                                         <X size={14} />
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <label className="w-16 h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
//                                     <ImagePlus
//                                         size={20}
//                                         className="text-gray-400"
//                                     />
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleEmojiChange}
//                                         className="hidden"
//                                     />
//                                 </label>
//                             )}
//                             {errors.emoji && (
//                                 <p className="text-sm text-red-500 mt-1">
//                                     {errors.emoji[0]}
//                                 </p>
//                             )}
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Category
//                             </label>
//                             <input
//                                 type="text"
//                                 name="category"
//                                 value={packageForm.category}
//                                 onChange={handleChange}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div>
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Description
//                         </label>
//                         <textarea
//                             name="description"
//                             value={packageForm.description}
//                             onChange={handleChange}
//                             rows={3}
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     {/* Includes / Excludes */}
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Includes
//                             </label>
//                             <textarea
//                                 name="includes"
//                                 value={packageForm.includes}
//                                 onChange={handleChange}
//                                 rows={3}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Excludes
//                             </label>
//                             <textarea
//                                 name="excludes"
//                                 value={packageForm.excludes}
//                                 onChange={handleChange}
//                                 rows={3}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div>
//                     </div>

//                     {/* Itinerary */}
//                     <div>
//                         <div className="flex justify-between items-center mb-2">
//                             <label className="block text-sm font-medium text-gray-700">
//                                 Itinerary
//                             </label>
//                             <button
//                                 type="button"
//                                 onClick={addItineraryRow}
//                                 className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
//                             >
//                                 <Plus size={16} /> Add day
//                             </button>
//                         </div>

//                         <div className="space-y-3">
//                             {itineraries.map((row, index) => (
//                                 <div
//                                     key={index}
//                                     className="border border-gray-200 rounded-lg p-3 space-y-2"
//                                 >
//                                     <div className="flex gap-2 items-start">
//                                         <input
//                                             type="number"
//                                             min={1}
//                                             placeholder="Day"
//                                             value={row.day}
//                                             onChange={(e) =>
//                                                 handleItineraryChange(
//                                                     index,
//                                                     "day",
//                                                     e.target.value,
//                                                 )
//                                             }
//                                             className="w-20 border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                             required
//                                         />
//                                         <input
//                                             type="text"
//                                             placeholder="Title"
//                                             value={row.title}
//                                             onChange={(e) =>
//                                                 handleItineraryChange(
//                                                     index,
//                                                     "title",
//                                                     e.target.value,
//                                                 )
//                                             }
//                                             className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                             required
//                                         />
//                                         {itineraries.length > 1 && (
//                                             <button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     removeItineraryRow(index)
//                                                 }
//                                                 className="p-2 text-red-500 hover:bg-red-50 rounded-full"
//                                             >
//                                                 <Trash2 size={18} />
//                                             </button>
//                                         )}
//                                     </div>
//                                     <textarea
//                                         placeholder="Description (optional)"
//                                         value={row.description}
//                                         onChange={(e) =>
//                                             handleItineraryChange(
//                                                 index,
//                                                 "description",
//                                                 e.target.value,
//                                             )
//                                         }
//                                         rows={2}
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Gallery Images */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Gallery Images
//                         </label>

//                         {existingImages.length > 0 && (
//                             <div className="flex flex-wrap gap-2 mb-2">
//                                 {existingImages.map((img) => (
//                                     <div key={img.id} className="relative">
//                                         <img
//                                             src={`/storage/${img.image}`}
//                                             alt="Package"
//                                             className="w-20 h-20 object-cover rounded-lg border"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 removeExistingImage(img.id)
//                                             }
//                                             className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
//                                         >
//                                             <X size={14} />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         {newImages.length > 0 && (
//                             <div className="flex flex-wrap gap-2 mb-2">
//                                 {newImages.map((file, index) => (
//                                     <div key={index} className="relative">
//                                         <img
//                                             src={URL.createObjectURL(file)}
//                                             alt="New upload"
//                                             className="w-20 h-20 object-cover rounded-lg border"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 removeNewImage(index)
//                                             }
//                                             className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
//                                         >
//                                             <X size={14} />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         <input
//                             type="file"
//                             accept="image/*"
//                             multiple
//                             onChange={handleImageChange}
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                         {errors.images && (
//                             <p className="text-sm text-red-500 mt-1">
//                                 {errors.images[0]}
//                             </p>
//                         )}
//                     </div>

//                     {/* Actions */}
//                     <div className="flex justify-end gap-3 pt-2">
//                         <button
//                             type="button"
//                             onClick={closeForm}
//                             className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60"
//                         >
//                             {submitting
//                                 ? "Saving..."
//                                 : editingPackage
//                                   ? "Update Package"
//                                   : "Create Package"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddPackageForm;


import React, { useState, useEffect } from "react";
import {
    X,
    Plus,
    Trash2,
    ImagePlus,
    MapPin,
    Calendar,
    Users,
    Tag,
    DollarSign,
    Images,
    FileText,
    CheckCircle2,
    XCircle,
    Route as RouteIcon,
    GripVertical,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const quillModules = {
    toolbar: [
        [{ header: [false, 3, 4] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

const quillFormats = ["header", "bold", "italic", "underline", "list", "link"];

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

/* ---------- small presentational helpers ---------- */

const SectionHeading = ({ icon: Icon, title, subtitle, action }) => (
    <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icon size={15} />
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-800 leading-none">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
                )}
            </div>
        </div>
        {action}
    </div>
);

const Field = ({ label, error, required, children, hint }) => (
    <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
            {label}
            {required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
        {children}
        {hint && !error && (
            <p className="text-xs text-gray-400 mt-1">{hint}</p>
        )}
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
);

const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-colors bg-gray-50/60 focus:bg-white";

const iconInputCls =
    "w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-colors bg-gray-50/60 focus:bg-white";

// Fixed-height Quill wrapper: toolbar stays put, the editor body scrolls once
// content grows past the set height instead of pushing the rest of the form down.
const quillWrapperCls =
    "rounded-lg border border-gray-200 overflow-hidden bg-white " +
    "[&_.ql-toolbar]:bg-gray-50/80 [&_.ql-toolbar]:border-gray-200 " +
    "[&_.ql-container]:border-none " +
    "[&_.ql-editor]:h-[140px] [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:text-sm";

// Smaller variant for the itinerary's per-day description field.
const quillWrapperClsSm =
    "rounded-lg border border-gray-200 overflow-hidden bg-white " +
    "[&_.ql-toolbar]:bg-gray-50/80 [&_.ql-toolbar]:border-gray-200 " +
    "[&_.ql-container]:border-none " +
    "[&_.ql-editor]:h-[90px] [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:text-sm";

const IconInput = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <Icon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input {...props} className={iconInputCls} />
    </div>
);

/* ---------- main component ---------- */

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
    const [itineraries, setItineraries] = useState([
        { ...emptyItineraryRow, day: 1 },
    ]);
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
                const response = await axios.get(
                    route("ourdestinations.index"),
                );
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
                    : [{ ...emptyItineraryRow, day: 1 }],
            );

            setExistingImages(editingPackage.images ?? []);
            setNewImages([]);

            setEmojiFile(null);
            setEmojiPreview(
                editingPackage.emoji
                    ? `/storage/${editingPackage.emoji}`
                    : null,
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

    // Rich text fields (description, includes, excludes) hand back raw HTML,
    // not an event, so they get their own setter.
    const handleQuillChange = (name) => (value) => {
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
            prev.map((row, i) =>
                i === index ? { ...row, [field]: value } : row,
            ),
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
                    row.description,
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
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col overflow-hidden"
                style={{ maxHeight: "calc(100vh - 2.5rem)" }}
            >
                {/* Header */}
                <div className="relative px-6 py-5 border-b border-gray-100 flex-shrink-0">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide mb-1">
                                {editingPackage ? "Editing" : "New package"}
                            </p>
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingPackage
                                    ? editingPackage.title || "Edit Package"
                                    : "Add New Package"}
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={closeForm}
                            className="p-2 -mr-2 -mt-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <form
                    id="package-form"
                    onSubmit={handleSubmit}
                    className="overflow-y-auto px-6 py-6 space-y-8"
                >
                    {/* Overview */}
                    <section>
                        <SectionHeading
                            icon={MapPin}
                            title="Overview"
                            subtitle="Core details shown on the package card"
                        />

                        <div className="space-y-4">
                            {/* Title — full width, on its own */}
                            <Field
                                label="Title"
                                required
                                error={errors.title?.[0]}
                            >
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Everest Base Camp Trek"
                                    value={packageForm.title}
                                    onChange={handleChange}
                                    className={inputCls}
                                    required
                                />
                            </Field>

                            {/* Category + Destination — same row */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <Field label="Category">
                                        <IconInput
                                            icon={Tag}
                                            type="text"
                                            name="category"
                                            placeholder="e.g. Adventure"
                                            value={packageForm.category}
                                            onChange={handleChange}
                                        />
                                    </Field>
                                </div>
                                <div className="flex-1">
                                    <Field
                                        label="Destination"
                                        required
                                        error={errors.destination_id?.[0]}
                                    >
                                        <div className="relative">
                                            <MapPin
                                                size={15}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                            />
                                            <select
                                                name="destination_id"
                                                value={
                                                    packageForm.destination_id
                                                }
                                                onChange={handleChange}
                                                className={`${iconInputCls} appearance-none bg-gray-50/60`}
                                                required
                                            >
                                                <option value="" disabled>
                                                    Select a destination
                                                </option>
                                                {destinations.map(
                                                    (destination) => (
                                                        <option
                                                            key={
                                                                destination.id
                                                            }
                                                            value={
                                                                destination.id
                                                            }
                                                        >
                                                            {destination.title}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>
                                    </Field>
                                </div>
                            </div>

                            {/* Days / People / Resort / Price — unchanged */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Days" required>
                                    <IconInput
                                        icon={Calendar}
                                        type="text"
                                        name="days"
                                        placeholder="e.g. 12"
                                        value={packageForm.days}
                                        onChange={handleChange}
                                        required
                                    />
                                </Field>

                                <Field label="People" required>
                                    <IconInput
                                        icon={Users}
                                        type="text"
                                        name="people"
                                        placeholder="e.g. 2–10"
                                        value={packageForm.people}
                                        onChange={handleChange}
                                        required
                                    />
                                </Field>

                                <Field label="Resort">
                                    <input
                                        type="text"
                                        name="resort"
                                        placeholder="Optional"
                                        value={packageForm.resort}
                                        onChange={handleChange}
                                        className={inputCls}
                                    />
                                </Field>

                                <Field
                                    label="Price"
                                    required
                                    error={errors.price?.[0]}
                                >
                                    <IconInput
                                        icon={DollarSign}
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        placeholder="0.00"
                                        value={packageForm.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </Field>
                            </div>

                            {/* Icon image — its own row, redesigned */}
                            <div className="flex">
                                <div className="flex-1">
                                    <Field
                                        label="Icon Image"
                                        hint="Small icon shown on the package card"
                                        error={errors.emoji?.[0]}
                                    >
                                        <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-3 bg-gray-50/40">
                                            <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                                                {emojiPreview ? (
                                                    <img
                                                        src={emojiPreview}
                                                        alt="Package icon"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <ImagePlus
                                                        size={20}
                                                        className="text-gray-300"
                                                    />
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label className="px-3.5 py-1.5 rounded-full border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-colors">
                                                    {emojiPreview
                                                        ? "Change"
                                                        : "Upload image"}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleEmojiChange
                                                        }
                                                        className="hidden"
                                                    />
                                                </label>

                                                {emojiPreview && (
                                                    <button
                                                        type="button"
                                                        onClick={clearEmoji}
                                                        className="px-3.5 py-1.5 rounded-full text-xs font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </Field>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Description */}
                    <section>
                        <SectionHeading
                            icon={FileText}
                            title="Description"
                            subtitle="Longer copy shown on the package detail page"
                        />
                        <div className={quillWrapperCls}>
                            <ReactQuill
                                theme="snow"
                                value={packageForm.description}
                                onChange={handleQuillChange("description")}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Tell travelers what makes this package worth booking..."
                            />
                        </div>
                    </section>

                    {/* Includes */}
                    <section>
                        <SectionHeading
                            icon={CheckCircle2}
                            title="What's included"
                            subtitle="Everything covered by the price"
                        />
                        <div className={quillWrapperCls}>
                            <ReactQuill
                                theme="snow"
                                value={packageForm.includes}
                                onChange={handleQuillChange("includes")}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Accommodation, guide, permits..."
                            />
                        </div>
                    </section>

                    {/* Excludes */}
                    <section>
                        <SectionHeading
                            icon={XCircle}
                            title="What's excluded"
                            subtitle="Costs travelers should plan for separately"
                        />
                        <div className={quillWrapperCls}>
                            <ReactQuill
                                theme="snow"
                                value={packageForm.excludes}
                                onChange={handleQuillChange("excludes")}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Flights, insurance, tips..."
                            />
                        </div>
                    </section>

                    {/* Itinerary */}
                    <section>
                        <SectionHeading
                            icon={RouteIcon}
                            title="Itinerary"
                            subtitle="Day-by-day plan"
                            action={
                                <button
                                    type="button"
                                    onClick={addItineraryRow}
                                    className="text-xs font-medium flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-full px-3 py-1.5 transition-colors"
                                >
                                    <Plus size={13} /> Add day
                                </button>
                            }
                        />

                        <div className="space-y-3">
                            {itineraries.map((row, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3 group"
                                >
                                    <div className="flex flex-col items-center pt-1">
                                        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                                            {row.day || index + 1}
                                        </div>
                                        {index < itineraries.length - 1 && (
                                            <div className="w-px flex-1 bg-gray-200 mt-1" />
                                        )}
                                    </div>

                                    <div className="flex-1 border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/40 group-hover:border-gray-300 transition-colors">
                                        <div className="flex gap-2 items-start">
                                            <input
                                                type="number"
                                                min={1}
                                                placeholder="Day"
                                                value={row.day}
                                                onChange={(e) =>
                                                    handleItineraryChange(
                                                        index,
                                                        "day",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-16 border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Title — e.g. Arrival in Kathmandu"
                                                value={row.title}
                                                onChange={(e) =>
                                                    handleItineraryChange(
                                                        index,
                                                        "title",
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                                                required
                                            />
                                            {itineraries.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItineraryRow(
                                                            index,
                                                        )
                                                    }
                                                    className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <div className={quillWrapperClsSm}>
                                            <ReactQuill
                                                theme="snow"
                                                value={row.description}
                                                onChange={(value) =>
                                                    handleItineraryChange(
                                                        index,
                                                        "description",
                                                        value,
                                                    )
                                                }
                                                modules={quillModules}
                                                formats={quillFormats}
                                                placeholder="Description (optional)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addItineraryRow}
                                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-xl py-2.5 transition-colors"
                            >
                                <Plus size={13} /> Add day
                            </button>
                        </div>
                    </section>

                    {/* Gallery Images */}
                    <section>
                        <SectionHeading
                            icon={Images}
                            title="Gallery"
                            subtitle="Photos shown on the package page"
                        />

                        {(existingImages.length > 0 || newImages.length > 0) && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {existingImages.map((img) => (
                                    <div
                                        key={`existing-${img.id}`}
                                        className="relative"
                                    >
                                        <img
                                            src={`/storage/${img.image}`}
                                            alt="Package"
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeExistingImage(img.id)
                                            }
                                            className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 border border-gray-100 text-gray-500 hover:text-rose-500"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                {newImages.map((file, index) => (
                                    <div
                                        key={`new-${index}`}
                                        className="relative"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="New upload"
                                            className="w-20 h-20 object-cover rounded-lg border-2 border-indigo-200"
                                        />
                                        <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                                            new
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeNewImage(index)
                                            }
                                            className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 border border-gray-100 text-gray-500 hover:text-rose-500"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <label className="flex items-center justify-center gap-2 w-full border border-dashed border-gray-300 rounded-xl px-3 py-4 text-sm text-gray-500 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 hover:text-indigo-600 transition-colors">
                            <ImagePlus size={16} />
                            Click to upload images, or drag and drop
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                        {errors.images && (
                            <p className="text-xs text-rose-500 mt-1">
                                {errors.images[0]}
                            </p>
                        )}
                    </section>
                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex-shrink-0">
                    <button
                        type="button"
                        onClick={closeForm}
                        className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="package-form"
                        disabled={submitting}
                        className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm shadow-indigo-200 flex items-center gap-2"
                    >
                        {submitting && (
                            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        )}
                        {submitting
                            ? "Saving..."
                            : editingPackage
                              ? "Update Package"
                              : "Create Package"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPackageForm;


// import React, { useState, useEffect } from "react";
// import {
//     X,
//     Plus,
//     Trash2,
//     ImagePlus,
//     MapPin,
//     Calendar,
//     Users,
//     Tag,
//     DollarSign,
//     Images,
//     FileText,
//     CheckCircle2,
//     XCircle,
//     Route as RouteIcon,
//     GripVertical,
// } from "lucide-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const quillModules = {
//     toolbar: [
//         [{ header: [false, 3, 4] }],
//         ["bold", "italic", "underline"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link"],
//         ["clean"],
//     ],
// };

// const quillFormats = ["header", "bold", "italic", "underline", "list", "link"];

// const emptyPackageForm = {
//     title: "",
//     days: "",
//     people: "",
//     resort: "",
//     price: "",
//     destination_id: "",
//     category: "",
//     description: "",
//     includes: "",
//     excludes: "",
// };

// const emptyItineraryRow = { day: "", title: "", description: "" };

// /* ---------- small presentational helpers ---------- */

// const SectionHeading = ({ icon: Icon, title, subtitle, action }) => (
//     <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-2">
//             <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
//                 <Icon size={15} />
//             </div>
//             <div>
//                 <h3 className="text-sm font-semibold text-gray-800 leading-none">
//                     {title}
//                 </h3>
//                 {subtitle && (
//                     <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
//                 )}
//             </div>
//         </div>
//         {action}
//     </div>
// );

// const Field = ({ label, error, required, children, hint }) => (
//     <div>
//         <label className="block text-xs font-medium text-gray-600 mb-1.5">
//             {label}
//             {required && <span className="text-rose-400 ml-0.5">*</span>}
//         </label>
//         {children}
//         {hint && !error && (
//             <p className="text-xs text-gray-400 mt-1">{hint}</p>
//         )}
//         {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
//     </div>
// );

// const inputCls =
//     "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 " +
//     "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-colors bg-gray-50/60 focus:bg-white";

// const iconInputCls =
//     "w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 " +
//     "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-colors bg-gray-50/60 focus:bg-white";

// // Fixed-height Quill wrapper: toolbar stays put, the editor body scrolls once
// // content grows past the set height instead of pushing the rest of the form down.
// const quillWrapperCls =
//     "rounded-lg border border-gray-200 overflow-hidden bg-white " +
//     "[&_.ql-toolbar]:bg-gray-50/80 [&_.ql-toolbar]:border-gray-200 " +
//     "[&_.ql-container]:border-none " +
//     "[&_.ql-editor]:h-[140px] [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:text-sm";

// // Smaller variant for the itinerary's per-day description field.
// const quillWrapperClsSm =
//     "rounded-lg border border-gray-200 overflow-hidden bg-white " +
//     "[&_.ql-toolbar]:bg-gray-50/80 [&_.ql-toolbar]:border-gray-200 " +
//     "[&_.ql-container]:border-none " +
//     "[&_.ql-editor]:h-[90px] [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:text-sm";

// const IconInput = ({ icon: Icon, ...props }) => (
//     <div className="relative">
//         <Icon
//             size={15}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//         />
//         <input {...props} className={iconInputCls} />
//     </div>
// );

// /* ---------- main component ---------- */

// const AddPackageForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingPackage,
//     setEditingPackage,
//     handleUpdate,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [destinations, setDestinations] = useState([]);
//     const [packageForm, setPackageForm] = useState(emptyPackageForm);
//     const [itineraries, setItineraries] = useState([
//         { ...emptyItineraryRow, day: 1 },
//     ]);
//     const [existingImages, setExistingImages] = useState([]);
//     const [newImages, setNewImages] = useState([]);

//     // Emoji is a single image upload, tracked separately from packageForm
//     const [emojiFile, setEmojiFile] = useState(null);
//     const [emojiPreview, setEmojiPreview] = useState(null);
//     const [removeEmoji, setRemoveEmoji] = useState(false);

//     const [errors, setErrors] = useState({});

//     // Fetch destinations for the select dropdown
//     useEffect(() => {
//         const fetchDestinations = async () => {
//             try {
//                 const response = await axios.get(
//                     route("ourdestinations.index"),
//                 );
//                 // DestinationController::index returns { success, data: <paginator> }
//                 setDestinations(response.data?.data?.data ?? []);
//             } catch (error) {
//                 console.error("Error fetching destinations", error);
//             }
//         };

//         fetchDestinations();
//     }, []);

//     // Populate form when editing, reset when creating
//     useEffect(() => {
//         if (editingPackage) {
//             setPackageForm({
//                 title: editingPackage.title ?? "",
//                 days: editingPackage.days ?? "",
//                 people: editingPackage.people ?? "",
//                 resort: editingPackage.resort ?? "",
//                 price: editingPackage.price ?? "",
//                 destination_id: editingPackage.destination_id ?? "",
//                 category: editingPackage.category ?? "",
//                 description: editingPackage.description ?? "",
//                 includes: editingPackage.includes ?? "",
//                 excludes: editingPackage.excludes ?? "",
//             });

//             setItineraries(
//                 editingPackage.itineraries?.length
//                     ? editingPackage.itineraries.map((it) => ({
//                           day: it.day,
//                           title: it.title,
//                           description: it.description ?? "",
//                       }))
//                     : [{ ...emptyItineraryRow, day: 1 }],
//             );

//             setExistingImages(editingPackage.images ?? []);
//             setNewImages([]);

//             setEmojiFile(null);
//             setEmojiPreview(
//                 editingPackage.emoji
//                     ? `/storage/${editingPackage.emoji}`
//                     : null,
//             );
//             setRemoveEmoji(false);

//             setShowForm(true);
//         } else {
//             setPackageForm(emptyPackageForm);
//             setItineraries([{ ...emptyItineraryRow, day: 1 }]);
//             setExistingImages([]);
//             setNewImages([]);
//             setEmojiFile(null);
//             setEmojiPreview(null);
//             setRemoveEmoji(false);
//         }

//         setErrors({});
//     }, [editingPackage]);

//     // Handle text / select input changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setPackageForm((prev) => ({ ...prev, [name]: value }));
//     };

//     // Rich text fields (description, includes, excludes) hand back raw HTML,
//     // not an event, so they get their own setter.
//     const handleQuillChange = (name) => (value) => {
//         setPackageForm((prev) => ({ ...prev, [name]: value }));
//     };

//     // Emoji/icon image handlers
//     const handleEmojiChange = (e) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         setEmojiFile(file);
//         setEmojiPreview(URL.createObjectURL(file));
//         setRemoveEmoji(false);
//         e.target.value = null;
//     };

//     const clearEmoji = () => {
//         setEmojiFile(null);
//         setEmojiPreview(null);
//         setRemoveEmoji(true);
//     };

//     // Handle new gallery image selection (multiple)
//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files ?? []);
//         setNewImages((prev) => [...prev, ...files]);
//         e.target.value = null; // allow re-selecting the same file
//     };

//     const removeNewImage = (index) => {
//         setNewImages((prev) => prev.filter((_, i) => i !== index));
//     };

//     const removeExistingImage = (id) => {
//         setExistingImages((prev) => prev.filter((img) => img.id !== id));
//     };

//     // Itinerary row handlers
//     const handleItineraryChange = (index, field, value) => {
//         setItineraries((prev) =>
//             prev.map((row, i) =>
//                 i === index ? { ...row, [field]: value } : row,
//             ),
//         );
//     };

//     const addItineraryRow = () => {
//         setItineraries((prev) => [
//             ...prev,
//             { ...emptyItineraryRow, day: prev.length + 1 },
//         ]);
//     };

//     const removeItineraryRow = (index) => {
//         setItineraries((prev) => prev.filter((_, i) => i !== index));
//     };

//     const resetForm = () => {
//         setPackageForm(emptyPackageForm);
//         setItineraries([{ ...emptyItineraryRow, day: 1 }]);
//         setExistingImages([]);
//         setNewImages([]);
//         setEmojiFile(null);
//         setEmojiPreview(null);
//         setRemoveEmoji(false);
//         setErrors({});
//     };

//     const closeForm = () => {
//         setShowForm(false);
//         setEditingPackage(null);
//         resetForm();
//     };

//     // Create a new package
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourpackage.store"), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating package", error);
//             throw error;
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrors({});

//         const formData = new FormData();

//         // Basic fields
//         Object.entries(packageForm).forEach(([key, value]) => {
//             if (value !== null && value !== "") {
//                 formData.append(key, value);
//             }
//         });

//         // Emoji/icon image
//         if (emojiFile) {
//             formData.append("emoji", emojiFile);
//         } else if (removeEmoji && editingPackage) {
//             formData.append("remove_emoji", "1");
//         }

//         // New gallery images
//         newImages.forEach((file) => {
//             formData.append("images[]", file);
//         });

//         // Existing gallery images to keep (only relevant on edit)
//         existingImages.forEach((img) => {
//             formData.append("existing_images[]", img.id);
//         });

//         // Itineraries
//         itineraries.forEach((row, index) => {
//             formData.append(`itineraries[${index}][day]`, row.day);
//             formData.append(`itineraries[${index}][title]`, row.title);
//             if (row.description) {
//                 formData.append(
//                     `itineraries[${index}][description]`,
//                     row.description,
//                 );
//             }
//         });

//         try {
//             setSubmitting(true);

//             if (editingPackage) {
//                 await handleUpdate(formData, editingPackage.id);
//             } else {
//                 await handleCreate(formData);
//             }

//             closeForm();
//         } catch (error) {
//             console.log("Error saving data", error);
//             if (error?.response?.status === 422) {
//                 setErrors(error.response.data.errors ?? {});
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div
//                 className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col overflow-hidden"
//                 style={{ maxHeight: "calc(100vh - 2.5rem)" }}
//             >
//                 {/* Header */}
//                 <div className="relative px-6 py-5 border-b border-gray-100 flex-shrink-0">
//                     <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide mb-1">
//                                 {editingPackage ? "Editing" : "New package"}
//                             </p>
//                             <h2 className="text-xl font-bold text-gray-900">
//                                 {editingPackage
//                                     ? editingPackage.title || "Edit Package"
//                                     : "Add New Package"}
//                             </h2>
//                         </div>
//                         <button
//                             type="button"
//                             onClick={closeForm}
//                             className="p-2 -mr-2 -mt-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
//                         >
//                             <X size={20} />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Body */}
//                 <form
//                     id="package-form"
//                     onSubmit={handleSubmit}
//                     className="overflow-y-auto px-6 py-6 space-y-8"
//                 >
//                     {/* Overview */}
//                     <section>
//                         <SectionHeading
//                             icon={MapPin}
//                             title="Overview"
//                             subtitle="Core details shown on the package card"
//                         />

//                         <div className="space-y-4">
//                             {/* Title — full width, on its own */}
//                             <Field
//                                 label="Title"
//                                 required
//                                 error={errors.title?.[0]}
//                             >
//                                 <input
//                                     type="text"
//                                     name="title"
//                                     placeholder="e.g. Everest Base Camp Trek"
//                                     value={packageForm.title}
//                                     onChange={handleChange}
//                                     className={inputCls}
//                                     required
//                                 />
//                             </Field>

//                             {/* Category + Destination — same row */}
//                             <div className="flex flex-col sm:flex-row gap-4">
//                                 <div className="flex-1">
//                                     <Field label="Category">
//                                         <IconInput
//                                             icon={Tag}
//                                             type="text"
//                                             name="category"
//                                             placeholder="e.g. Adventure"
//                                             value={packageForm.category}
//                                             onChange={handleChange}
//                                         />
//                                     </Field>
//                                 </div>
//                                 <div className="flex-1">
//                                     <Field
//                                         label="Destination"
//                                         required
//                                         error={errors.destination_id?.[0]}
//                                     >
//                                         <div className="relative">
//                                             <MapPin
//                                                 size={15}
//                                                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                                             />
//                                             <select
//                                                 name="destination_id"
//                                                 value={
//                                                     packageForm.destination_id
//                                                 }
//                                                 onChange={handleChange}
//                                                 className={`${iconInputCls} appearance-none bg-gray-50/60`}
//                                                 required
//                                             >
//                                                 <option value="" disabled>
//                                                     Select a destination
//                                                 </option>
//                                                 {destinations.map(
//                                                     (destination) => (
//                                                         <option
//                                                             key={
//                                                                 destination.id
//                                                             }
//                                                             value={
//                                                                 destination.id
//                                                             }
//                                                         >
//                                                             {destination.title}
//                                                         </option>
//                                                     ),
//                                                 )}
//                                             </select>
//                                         </div>
//                                     </Field>
//                                 </div>
//                             </div>

//                             {/* Days / People / Resort / Price — unchanged */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <Field label="Days" required>
//                                     <IconInput
//                                         icon={Calendar}
//                                         type="text"
//                                         name="days"
//                                         placeholder="e.g. 12"
//                                         value={packageForm.days}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </Field>

//                                 <Field label="People" required>
//                                     <IconInput
//                                         icon={Users}
//                                         type="text"
//                                         name="people"
//                                         placeholder="e.g. 2–10"
//                                         value={packageForm.people}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </Field>

//                                 <Field label="Resort">
//                                     <input
//                                         type="text"
//                                         name="resort"
//                                         placeholder="Optional"
//                                         value={packageForm.resort}
//                                         onChange={handleChange}
//                                         className={inputCls}
//                                     />
//                                 </Field>

//                                 <Field
//                                     label="Price"
//                                     required
//                                     error={errors.price?.[0]}
//                                 >
//                                     <IconInput
//                                         icon={DollarSign}
//                                         type="number"
//                                         step="0.01"
//                                         name="price"
//                                         placeholder="0.00"
//                                         value={packageForm.price}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </Field>
//                             </div>

//                             {/* Icon image — its own row, redesigned */}
//                             <div className="flex">
//                                 <div className="flex-1">
//                                     <Field
//                                         label="Icon Image"
//                                         hint="Small icon shown on the package card"
//                                         error={errors.emoji?.[0]}
//                                     >
//                                         <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-3 bg-gray-50/40">
//                                             <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
//                                                 {emojiPreview ? (
//                                                     <img
//                                                         src={emojiPreview}
//                                                         alt="Package icon"
//                                                         className="w-full h-full object-cover"
//                                                     />
//                                                 ) : (
//                                                     <ImagePlus
//                                                         size={20}
//                                                         className="text-gray-300"
//                                                     />
//                                                 )}
//                                             </div>

//                                             <div className="flex items-center gap-2">
//                                                 <label className="px-3.5 py-1.5 rounded-full border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-colors">
//                                                     {emojiPreview
//                                                         ? "Change"
//                                                         : "Upload image"}
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         onChange={
//                                                             handleEmojiChange
//                                                         }
//                                                         className="hidden"
//                                                     />
//                                                 </label>

//                                                 {emojiPreview && (
//                                                     <button
//                                                         type="button"
//                                                         onClick={clearEmoji}
//                                                         className="px-3.5 py-1.5 rounded-full text-xs font-medium text-rose-500 hover:bg-rose-50 transition-colors"
//                                                     >
//                                                         Remove
//                                                     </button>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </Field>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Description */}
//                     <section>
//                         <SectionHeading
//                             icon={FileText}
//                             title="Description"
//                             subtitle="Longer copy shown on the package detail page"
//                         />
//                         <div className={quillWrapperCls}>
//                             <ReactQuill
//                                 theme="snow"
//                                 value={packageForm.description}
//                                 onChange={handleQuillChange("description")}
//                                 modules={quillModules}
//                                 formats={quillFormats}
//                                 placeholder="Tell travelers what makes this package worth booking..."
//                             />
//                         </div>
//                     </section>

//                     {/* Includes */}
//                     <section>
//                         <SectionHeading
//                             icon={CheckCircle2}
//                             title="What's included"
//                             subtitle="Everything covered by the price"
//                         />
//                         <div className={quillWrapperCls}>
//                             <ReactQuill
//                                 theme="snow"
//                                 value={packageForm.includes}
//                                 onChange={handleQuillChange("includes")}
//                                 modules={quillModules}
//                                 formats={quillFormats}
//                                 placeholder="Accommodation, guide, permits..."
//                             />
//                         </div>
//                     </section>

//                     {/* Excludes */}
//                     <section>
//                         <SectionHeading
//                             icon={XCircle}
//                             title="What's excluded"
//                             subtitle="Costs travelers should plan for separately"
//                         />
//                         <div className={quillWrapperCls}>
//                             <ReactQuill
//                                 theme="snow"
//                                 value={packageForm.excludes}
//                                 onChange={handleQuillChange("excludes")}
//                                 modules={quillModules}
//                                 formats={quillFormats}
//                                 placeholder="Flights, insurance, tips..."
//                             />
//                         </div>
//                     </section>

//                     {/* Itinerary */}
//                     <section>
//                         <SectionHeading
//                             icon={RouteIcon}
//                             title="Itinerary"
//                             subtitle="Day-by-day plan"
//                             action={
//                                 <button
//                                     type="button"
//                                     onClick={addItineraryRow}
//                                     className="text-xs font-medium flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-full px-3 py-1.5 transition-colors"
//                                 >
//                                     <Plus size={13} /> Add day
//                                 </button>
//                             }
//                         />

//                         <div className="space-y-3">
//                             {itineraries.map((row, index) => (
//                                 <div
//                                     key={index}
//                                     className="flex gap-3 group"
//                                 >
//                                     <div className="flex flex-col items-center pt-1">
//                                         <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
//                                             {row.day || index + 1}
//                                         </div>
//                                         {index < itineraries.length - 1 && (
//                                             <div className="w-px flex-1 bg-gray-200 mt-1" />
//                                         )}
//                                     </div>

//                                     <div className="flex-1 border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/40 group-hover:border-gray-300 transition-colors">
//                                         <div className="flex gap-2 items-start">
//                                             <input
//                                                 type="number"
//                                                 min={1}
//                                                 placeholder="Day"
//                                                 value={row.day}
//                                                 onChange={(e) =>
//                                                     handleItineraryChange(
//                                                         index,
//                                                         "day",
//                                                         e.target.value,
//                                                     )
//                                                 }
//                                                 className="w-16 border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
//                                                 required
//                                             />
//                                             <input
//                                                 type="text"
//                                                 placeholder="Title — e.g. Arrival in Kathmandu"
//                                                 value={row.title}
//                                                 onChange={(e) =>
//                                                     handleItineraryChange(
//                                                         index,
//                                                         "title",
//                                                         e.target.value,
//                                                     )
//                                                 }
//                                                 className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
//                                                 required
//                                             />
//                                             {itineraries.length > 1 && (
//                                                 <button
//                                                     type="button"
//                                                     onClick={() =>
//                                                         removeItineraryRow(
//                                                             index,
//                                                         )
//                                                     }
//                                                     className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
//                                                 >
//                                                     <Trash2 size={16} />
//                                                 </button>
//                                             )}
//                                         </div>
//                                         <div className={quillWrapperClsSm}>
//                                             <ReactQuill
//                                                 theme="snow"
//                                                 value={row.description}
//                                                 onChange={(value) =>
//                                                     handleItineraryChange(
//                                                         index,
//                                                         "description",
//                                                         value,
//                                                     )
//                                                 }
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 placeholder="Description (optional)"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>

//                     {/* Gallery Images */}
//                     <section>
//                         <SectionHeading
//                             icon={Images}
//                             title="Gallery"
//                             subtitle="Photos shown on the package page"
//                         />

//                         {(existingImages.length > 0 || newImages.length > 0) && (
//                             <div className="flex flex-wrap gap-2 mb-3">
//                                 {existingImages.map((img) => (
//                                     <div
//                                         key={`existing-${img.id}`}
//                                         className="relative"
//                                     >
//                                         <img
//                                             src={`/storage/${img.image}`}
//                                             alt="Package"
//                                             className="w-20 h-20 object-cover rounded-lg border border-gray-200"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 removeExistingImage(img.id)
//                                             }
//                                             className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 border border-gray-100 text-gray-500 hover:text-rose-500"
//                                         >
//                                             <X size={12} />
//                                         </button>
//                                     </div>
//                                 ))}
//                                 {newImages.map((file, index) => (
//                                     <div
//                                         key={`new-${index}`}
//                                         className="relative"
//                                     >
//                                         <img
//                                             src={URL.createObjectURL(file)}
//                                             alt="New upload"
//                                             className="w-20 h-20 object-cover rounded-lg border-2 border-indigo-200"
//                                         />
//                                         <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">
//                                             new
//                                         </span>
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 removeNewImage(index)
//                                             }
//                                             className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 border border-gray-100 text-gray-500 hover:text-rose-500"
//                                         >
//                                             <X size={12} />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         <label className="flex items-center justify-center gap-2 w-full border border-dashed border-gray-300 rounded-xl px-3 py-4 text-sm text-gray-500 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 hover:text-indigo-600 transition-colors">
//                             <ImagePlus size={16} />
//                             Click to upload images, or drag and drop
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 multiple
//                                 onChange={handleImageChange}
//                                 className="hidden"
//                             />
//                         </label>
//                         {errors.images && (
//                             <p className="text-xs text-rose-500 mt-1">
//                                 {errors.images[0]}
//                             </p>
//                         )}
//                     </section>
//                 </form>

//                 {/* Footer */}
//                 <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex-shrink-0">
//                     <button
//                         type="button"
//                         onClick={closeForm}
//                         className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-white transition-colors"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         form="package-form"
//                         disabled={submitting}
//                         className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm shadow-indigo-200 flex items-center gap-2"
//                     >
//                         {submitting && (
//                             <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                         )}
//                         {submitting
//                             ? "Saving..."
//                             : editingPackage
//                               ? "Update Package"
//                               : "Create Package"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddPackageForm;