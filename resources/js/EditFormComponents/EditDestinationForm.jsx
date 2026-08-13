// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useForm, Controller } from "react-hook-form";
// import {
//     X,
//     ImagePlus,
//     Images,
//     FileText,
//     Star,
//     DollarSign,
//     Tag,
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

// const emptyDestinationForm = {
//     title: "",
//     description: "",
//     rating: "",
//     price: "",
// };

// const MAX_IMAGE_SIZE_MB = 5;
// const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

// const formatFileSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)}MB`;

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

// const quillWrapperCls =
//     "rounded-lg border border-gray-200 overflow-hidden bg-white " +
//     "[&_.ql-toolbar]:bg-gray-50/80 [&_.ql-toolbar]:border-gray-200 " +
//     "[&_.ql-container]:border-none " +
//     "[&_.ql-editor]:h-[140px] [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:text-sm";

// const IconInput = React.forwardRef(({ icon: Icon, ...props }, ref) => (
//     <div className="relative">
//         <Icon
//             size={15}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//         />
//         <input ref={ref} {...props} className={iconInputCls} />
//     </div>
// ));

// /* ---------- main component ---------- */

// const EditDestinationForm = ({
//     showForm,
//     editingDestination,
//     setShowForm,
//     setEditingDestination,
//     setReloadTrigger,
//     handleUpdate,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [newImages, setNewImages] = useState([]);
//     const [existingImages, setExistingImages] = useState([]);
//     const [imageError, setImageError] = useState(null);
//     const [serverErrors, setServerErrors] = useState({});
//       const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const {
//         register,
//         control,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm({
//         defaultValues: emptyDestinationForm,
//     });

//     // Populate form when editing target changes
//     useEffect(() => {
//         if (editingDestination) {
//             reset({
//                 title: editingDestination.title ?? "",
//                 description: editingDestination.description ?? "",
//                 rating:
//                     editingDestination.rating === null ||
//                     editingDestination.rating === undefined
//                         ? ""
//                         : editingDestination.rating,
//                 price:
//                     editingDestination.price === null ||
//                     editingDestination.price === undefined
//                         ? ""
//                         : editingDestination.price,
//             });
//             setExistingImages(editingDestination.images ?? []);
//         } else {
//             reset(emptyDestinationForm);
//             setExistingImages([]);
//         }

//         setNewImages([]);
//         setImageError(null);
//         setServerErrors({});
//     }, [editingDestination, reset]);

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files ?? []);
//         if (!files.length) return;

//         const oversized = files.filter(
//             (file) => file.size > MAX_IMAGE_SIZE_BYTES,
//         );
//         const accepted = files.filter(
//             (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
//         );

//         if (oversized.length) {
//             const names = oversized
//                 .map((file) => `${file.name} (${formatFileSize(file.size)})`)
//                 .join(", ");
//             setImageError(
//                 `${oversized.length} image${oversized.length > 1 ? "s" : ""} exceeded the ${MAX_IMAGE_SIZE_MB}MB limit and ${oversized.length > 1 ? "were" : "was"} not added: ${names}.`,
//             );
//         } else {
//             setImageError(null);
//         }

//         if (accepted.length) {
//             setNewImages((prev) => [...prev, ...accepted]);
//         }

//         e.target.value = "";
//     };

//     const removeNewImage = (index) => {
//         setNewImages((prev) => prev.filter((_, i) => i !== index));
//     };

//     const removeExistingImage = (id) => {
//         setExistingImages((prev) => prev.filter((img) => img.id !== id));
//     };

//     const closeForm = () => {
//         setShowForm(false);
//         setEditingDestination(null);
//         reset(emptyDestinationForm);
//         setExistingImages([]);
//         setNewImages([]);
//         setImageError(null);
//         setServerErrors({});
//     };

//     const onSubmit = async (data) => {
//         if (imageError) return;

//         setServerErrors({});

//         const formData = new FormData();
//         formData.append("title", data.title);

//         if (data.description) formData.append("description", data.description);
//         if (data.price !== "" && data.price !== null && data.price !== undefined) {
//             formData.append("price", data.price);
//         }
//         if (data.rating !== "" && data.rating !== null && data.rating !== undefined) {
//             formData.append("rating", data.rating);
//         }

//         newImages.forEach((file) => {
//             formData.append("images[]", file);
//         });

//         existingImages.forEach((img) => {
//             formData.append("existing_images[]", img.id);
//         });

//         try {
//             setSubmitting(true);
//             await handleUpdate(formData, editingDestination.id);
//             closeForm();
//         } catch (error) {
//             console.log("Error updating destination", error);
//             if (error?.response?.status === 422) {
//                 setServerErrors(error.response.data.errors ?? {});
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (!showForm || !editingDestination) return null;

//     return (
//         <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div
//                 className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col overflow-hidden"
//                 style={{ maxHeight: "calc(100vh - 2.5rem)" }}
//             >
//                 {/* Header */}
//                 <div className="relative px-6 py-5 border-b border-gray-100 flex-shrink-0">
//                     <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide mb-1">
//                                 Editing
//                             </p>
//                             <h2 className="text-xl font-bold text-gray-900">
//                                 {editingDestination.title || "Edit Destination"}
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
//                     id="edit-destination-form"
//                     onSubmit={handleSubmit(onSubmit)}
//                     className="overflow-y-auto px-6 py-6 space-y-8"
//                 >
//                     {/* Overview */}
//                     <section>
//                         <SectionHeading
//                             icon={Tag}
//                             title="Overview"
//                             subtitle="Core details shown on the destination card"
//                         />

//                         <div className="space-y-4">
//                             <Field
//                                 label="Title"
//                                 required
//                                 error={errors.title?.message || serverErrors.title?.[0]}
//                             >
//                                 <input
//                                     type="text"
//                                     placeholder="e.g. Pokhara"
//                                     className={inputCls}
//                                     {...register("title", {
//                                         required: "Title is required.",
//                                     })}
//                                 />
//                             </Field>

//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <Field
//                                     label="Price"
//                                     error={errors.price?.message || serverErrors.price?.[0]}
//                                     hint="Optional"
//                                 >
//                                     <IconInput
//                                         icon={DollarSign}
//                                         type="number"
//                                         step="0.01"
//                                         min="0"
//                                         placeholder="0.00"
//                                         {...register("price", {
//                                             min: { value: 0, message: "Price can't be negative." },
//                                         })}
//                                     />
//                                 </Field>

//                                 <Field
//                                     label="Rating"
//                                     error={errors.rating?.message || serverErrors.rating?.[0]}
//                                     hint="Optional, 0–5"
//                                 >
//                                     <IconInput
//                                         icon={Star}
//                                         type="number"
//                                         step="0.1"
//                                         min="0"
//                                         max="5"
//                                         placeholder="e.g. 4.5"
//                                         {...register("rating", {
//                                             min: { value: 0, message: "Minimum rating is 0." },
//                                             max: { value: 5, message: "Maximum rating is 5." },
//                                         })}
//                                     />
//                                 </Field>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Description */}
//                     <section>
//                         <SectionHeading
//                             icon={FileText}
//                             title="Description"
//                             subtitle="Longer copy shown on the destination detail page"
//                         />
//                         <div className={quillWrapperCls}>
//                             <Controller
//                                 name="description"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={field.value}
//                                         onChange={field.onChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         placeholder="Tell travelers what makes this destination worth visiting..."
//                                     />
//                                 )}
//                             />
//                         </div>
//                         {(errors.description?.message || serverErrors.description?.[0]) && (
//                             <p className="text-xs text-rose-500 mt-1">
//                                 {errors.description?.message || serverErrors.description?.[0]}
//                             </p>
//                         )}
//                     </section>

//                     {/* Images */}
//                     <section>
//                         <SectionHeading
//                             icon={Images}
//                             title="Gallery"
//                             subtitle="Photos shown on the destination page"
//                         />

//                         {(existingImages.length > 0 || newImages.length > 0) && (
//                             <div className="flex flex-wrap gap-2 mb-3">
//                                 {existingImages.map((img) => (
//                                     <div key={`existing-${img.id}`} className="relative">
//                                         <img
//                                             src={`${imgurl}/${img.image}`}
//                                             alt="Destination"
//                                             className="w-20 h-20 object-cover rounded-lg border border-gray-200"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => removeExistingImage(img.id)}
//                                             className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 border border-gray-100 text-gray-500 hover:text-rose-500"
//                                         >
//                                             <X size={12} />
//                                         </button>
//                                     </div>
//                                 ))}
//                                 {newImages.map((file, index) => (
//                                     <div key={`new-${index}`} className="relative">
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
//                                             onClick={() => removeNewImage(index)}
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
//                                 accept="image/png,image/jpeg,image/jpg,image/webp"
//                                 onChange={handleImageChange}
//                                 className="hidden"
//                             />
//                         </label>
//                         <p className="text-xs text-gray-400 mt-1">
//                             Max {MAX_IMAGE_SIZE_MB}MB per image.
//                         </p>
//                         {(imageError || serverErrors.images?.[0]) && (
//                             <p className="text-xs text-rose-500 mt-1">
//                                 {imageError || serverErrors.images?.[0]}
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
//                         form="edit-destination-form"
//                         disabled={submitting}
//                         className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm shadow-indigo-200 flex items-center gap-2"
//                     >
//                         {submitting && (
//                             <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                         )}
//                         {submitting ? "Updating..." : "Update Destination"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditDestinationForm;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import {
    X,
    ImagePlus,
    Images,
    FileText,
    Star,
    DollarSign,
    Tag,
    RefreshCw,
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

const emptyDestinationForm = {
    title: "",
    description: "",
    rating: "",
    price: "",
};

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const formatFileSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)}MB`;

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

const quillWrapperCls =
    "rounded-lg border border-gray-200 overflow-hidden bg-white " +
    "[&_.ql-toolbar]:bg-gray-50/80 [&_.ql-toolbar]:border-gray-200 " +
    "[&_.ql-container]:border-none " +
    "[&_.ql-editor]:h-[140px] [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:text-sm";

const IconInput = React.forwardRef(({ icon: Icon, ...props }, ref) => (
    <div className="relative">
        <Icon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input ref={ref} {...props} className={iconInputCls} />
    </div>
));

/* ---------- main component ---------- */

const EditDestinationForm = ({
    showForm,
    editingDestination,
    setShowForm,
    setEditingDestination,
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [imageError, setImageError] = useState(null);
    const [serverErrors, setServerErrors] = useState({});
    const fileInputRef = useRef(null);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: emptyDestinationForm,
    });

    // Populate form when editing target changes
    useEffect(() => {
        if (editingDestination) {
            reset({
                title: editingDestination.title ?? "",
                description: editingDestination.description ?? "",
                rating:
                    editingDestination.rating === null ||
                    editingDestination.rating === undefined
                        ? ""
                        : editingDestination.rating,
                price:
                    editingDestination.price === null ||
                    editingDestination.price === undefined
                        ? ""
                        : editingDestination.price,
            });
            // Falls back to the first item of a legacy `images` relation
            // if the record hasn't been migrated to a single `image` field yet.
            setExistingImage(
                editingDestination.image ??
                    editingDestination.images?.[0]?.image ??
                    null,
            );
        } else {
            reset(emptyDestinationForm);
            setExistingImage(null);
        }

        setNewImage(null);
        setImageError(null);
        setServerErrors({});
    }, [editingDestination, reset]);

    // Selecting a file ALWAYS replaces whatever image (new or existing)
    // was showing before — never accumulates into a list.
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            setImageError(
                `${file.name} (${formatFileSize(file.size)}) exceeded the ${MAX_IMAGE_SIZE_MB}MB limit and was not added.`,
            );
        } else {
            setImageError(null);
            setNewImage(file);
        }

        e.target.value = "";
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        setNewImage(null);
        setExistingImage(null);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingDestination(null);
        reset(emptyDestinationForm);
        setExistingImage(null);
        setNewImage(null);
        setImageError(null);
        setServerErrors({});
    };

    const onSubmit = async (data) => {
        if (imageError) return;

        setServerErrors({});

        const formData = new FormData();
        formData.append("title", data.title);

        if (data.description) formData.append("description", data.description);
        if (data.price !== "" && data.price !== null && data.price !== undefined) {
            formData.append("price", data.price);
        }
        if (data.rating !== "" && data.rating !== null && data.rating !== undefined) {
            formData.append("rating", data.rating);
        }

        if (newImage) {
            formData.append("image", newImage);
        }

        // Tells the backend the image was cleared and not replaced.
        formData.append("remove_image", !newImage && !existingImage ? "1" : "0");

        try {
            setSubmitting(true);
            await handleUpdate(formData, editingDestination.id);
            closeForm();
        } catch (error) {
            console.log("Error updating destination", error);
            if (error?.response?.status === 422) {
                setServerErrors(error.response.data.errors ?? {});
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (!showForm || !editingDestination) return null;

    const previewSrc = newImage
        ? URL.createObjectURL(newImage)
        : existingImage
        ? `${imgurl}/${existingImage}`
        : null;

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col overflow-hidden"
                style={{ maxHeight: "calc(100vh - 2.5rem)" }}
            >
                {/* Header */}
                <div className="relative px-6 py-5 border-b border-gray-100 flex-shrink-0">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide mb-1">
                                Editing
                            </p>
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingDestination.title || "Edit Destination"}
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
                    id="edit-destination-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="overflow-y-auto px-6 py-6 space-y-8"
                >
                    {/* Overview */}
                    <section>
                        <SectionHeading
                            icon={Tag}
                            title="Overview"
                            subtitle="Core details shown on the destination card"
                        />

                        <div className="space-y-4">
                            <Field
                                label="Title"
                                required
                                error={errors.title?.message || serverErrors.title?.[0]}
                            >
                                <input
                                    type="text"
                                    placeholder="e.g. Pokhara"
                                    className={inputCls}
                                    {...register("title", {
                                        required: "Title is required.",
                                    })}
                                />
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field
                                    label="Price"
                                    error={errors.price?.message || serverErrors.price?.[0]}
                                    hint="Optional"
                                >
                                    <IconInput
                                        icon={DollarSign}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        {...register("price", {
                                            min: { value: 0, message: "Price can't be negative." },
                                        })}
                                    />
                                </Field>

                                <Field
                                    label="Rating"
                                    error={errors.rating?.message || serverErrors.rating?.[0]}
                                    hint="Optional, 0–5"
                                >
                                    <IconInput
                                        icon={Star}
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        placeholder="e.g. 4.5"
                                        {...register("rating", {
                                            min: { value: 0, message: "Minimum rating is 0." },
                                            max: { value: 5, message: "Maximum rating is 5." },
                                        })}
                                    />
                                </Field>
                            </div>
                        </div>
                    </section>

                    {/* Description */}
                    <section>
                        <SectionHeading
                            icon={FileText}
                            title="Description"
                            subtitle="Longer copy shown on the destination detail page"
                        />
                        <div className={quillWrapperCls}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        theme="snow"
                                        value={field.value}
                                        onChange={field.onChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Tell travelers what makes this destination worth visiting..."
                                    />
                                )}
                            />
                        </div>
                        {(errors.description?.message || serverErrors.description?.[0]) && (
                            <p className="text-xs text-rose-500 mt-1">
                                {errors.description?.message || serverErrors.description?.[0]}
                            </p>
                        )}
                    </section>

                    {/* Image */}
                    <section>
                        <SectionHeading
                            icon={Images}
                            title="Image"
                            subtitle="Photo shown on the destination page"
                        />

                        {/* Hidden input stays mounted so we can re-trigger it even
                            when an image is already showing (replace flow). */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {previewSrc ? (
                            <div className="flex items-center gap-4">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <img
                                        src={previewSrc}
                                        alt={newImage ? "New upload" : "Destination"}
                                        className={`w-24 h-24 object-cover rounded-lg border ${
                                            newImage
                                                ? "border-2 border-indigo-200"
                                                : "border-gray-200"
                                        }`}
                                    />
                                    {newImage && (
                                        <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                                            new
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 border border-gray-100 text-gray-500 hover:text-rose-500"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>

                                {/* Always-visible replace control — picking a
                                    file here swaps the image directly. */}
                                <button
                                    type="button"
                                    onClick={openFilePicker}
                                    className="flex items-center gap-2 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 hover:border-indigo-400 hover:bg-indigo-50/40 hover:text-indigo-600 transition-colors"
                                >
                                    <RefreshCw size={16} />
                                    Replace image
                                </button>
                            </div>
                        ) : (
                            <label
                                onClick={(e) => {
                                    e.preventDefault();
                                    openFilePicker();
                                }}
                                className="flex items-center justify-center gap-2 w-full border border-dashed border-gray-300 rounded-xl px-3 py-4 text-sm text-gray-500 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 hover:text-indigo-600 transition-colors"
                            >
                                <ImagePlus size={16} />
                                Click to upload an image, or drag and drop
                            </label>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            Max {MAX_IMAGE_SIZE_MB}MB.
                        </p>
                        {(imageError || serverErrors.image?.[0]) && (
                            <p className="text-xs text-rose-500 mt-1">
                                {imageError || serverErrors.image?.[0]}
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
                        form="edit-destination-form"
                        disabled={submitting}
                        className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm shadow-indigo-200 flex items-center gap-2"
                    >
                        {submitting && (
                            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        )}
                        {submitting ? "Updating..." : "Update Destination"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditDestinationForm;
