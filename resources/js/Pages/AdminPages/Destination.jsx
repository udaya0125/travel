// import AddDestinationForm from "@/AddFormComponents/AddDestinationForm";
// import React from "react";

// const Destination = () => {
//     const [allDestinations, setAllDestinations] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingDestination, setEditingDestination] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the Destination data
//     useEffect(() => {
//         const fetchDestinations = async () => {
//             try {
//                 const response = await axios.get(route("ourdestinations.index"));
//                 setAllDestinations(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchDestinations();
//     }, [reloadTrigger]);

//     // For delete the Destination
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourdestinations.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (destination) => {
//         setEditingDestination(destination);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourdestinations.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating destination", error);
//             throw error;
//         }
//     };
//     return (
//         <div>
//             <div className="mb-8 flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                         Destination 
//                     </h1>
//                 </div>
//                 <button
//                     onClick={() => setShowForm(true)}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             <AddDestinationForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingDestination={editingDestination}
//                 setEditingDestination={setEditingDestination}
//                 handleUpdate={handleUpdate}
//             />
//         </div>
//     );
// };

// export default Destination;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import AddDestinationForm from "@/AddFormComponents/AddDestinationForm";
import Wrapper from "@/AdminWrapper/Wrapper";
import EditDestinationForm from "@/EditFormComponents/EditDestinationForm";

const Destination = () => {
    const [allDestinations, setAllDestinations] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingDestination, setEditingDestination] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // For fetching the Destination data
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourdestinations.index"));
                setAllDestinations(response.data.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, [reloadTrigger]);

    // For delete the Destination
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this destination?")) {
            return;
        }

        try {
            await axios.delete(route("ourdestinations.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (destination) => {
        setEditingDestination(destination);
        setShowEditForm(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourdestinations.update", { id }),
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        setReloadTrigger((prev) => !prev);
        return response.data;
    };

    return (
        <>
        <Wrapper>
        <div className="bg-[#FAF8F5] -m-6 p-6 min-h-screen">
            <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <span className="inline-flex items-center border border-[#D7CDC2] rounded-full px-4 py-1.5 text-[10px] sm:text-xs font-medium tracking-[1.5px] uppercase text-[#3A2D26]">
                        destinations
                    </span>
                    <h1 className="mt-3 text-2xl lg:text-3xl font-medium text-[#3A2D26]">
                        Manage Destinations
                    </h1>
                </div>
                <button
                    onClick={() => {
                        setShowAddForm(true);
                    }}
                    className="px-5 py-2.5 flex items-center gap-2 bg-[#79824E] text-white rounded-full text-sm font-medium hover:bg-[#6e7647] transition-all duration-300 w-fit"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* Destinations grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {loading ? (
                    <p className="text-[#433833] col-span-full">Loading destinations...</p>
                ) : allDestinations.length === 0 ? (
                    <p className="text-[#433833] col-span-full">No destinations found.</p>
                ) : (
                    allDestinations.map((destination) => (
                        <div
                            key={destination.id}
                            className="group relative overflow-hidden rounded-2xl h-[300px] xs:h-[340px] sm:h-[360px] md:h-[400px] cursor-pointer"
                        >
                            {/* Image */}
                            {destination.images?.[0]?.image ? (
                                <img
                                    src={`/storage/${destination.images[0].image}`}
                                    alt={destination.title}
                                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#D8D0C6] to-[#C5BCB0]" />
                            )}

                            {/* Default gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                            {/* Price pill */}
                            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-[#3A2D26] text-xs font-medium px-3 py-1 rounded-full">
                                ${destination.price}
                            </div>

                            {/* Rating pill */}
                            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white/90 backdrop-blur text-[#3A2D26] text-xs font-medium px-3 py-1 rounded-full">
                                <Star size={12} className="text-[#79824E]" fill="currentColor" />
                                {destination.rating}
                            </div>

                            {/* Title + description */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                                <h3 className="text-white text-lg sm:text-xl font-medium mb-2">
                                    {destination.title}
                                </h3>
                                <p className="text-white/90 text-xs sm:text-sm leading-relaxed line-clamp-2">
                                    {destination.description}
                                </p>
                            </div>

                            {/* Hover overlay — admin actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 flex items-center justify-center gap-3 transition duration-500 group-hover:opacity-100 z-20">
                                <button
                                    onClick={() => handleEdit(destination)}
                                    className="flex items-center gap-2 bg-white text-[#3A2D26] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#79824E] hover:text-white transition-colors duration-300"
                                >
                                    <Pencil size={14} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(destination.id)}
                                    className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 hover:text-white transition-colors duration-300"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AddDestinationForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
            />

            <EditDestinationForm
                showForm={showEditForm}
                editingDestination={editingDestination}
                setShowForm={setShowEditForm}
                setEditingDestination={setEditingDestination}
                setReloadTrigger={setReloadTrigger}
                handleUpdate={handleUpdate}
            />
        </div>
        </Wrapper>
        </>
    );
};

export default Destination;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, Pencil, Trash2, Star } from "lucide-react";
// import AddDestinationForm from "@/AddFormComponents/AddDestinationForm";
// import Wrapper from "@/AdminWrapper/Wrapper";

// const Destination = () => {
//     const [allDestinations, setAllDestinations] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingDestination, setEditingDestination] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [loading, setLoading] = useState(true);

//     // For fetching the Destination data
//     useEffect(() => {
//         const fetchDestinations = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(route("ourdestinations.index"));
//                 setAllDestinations(response.data.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDestinations();
//     }, [reloadTrigger]);

//     // For delete the Destination
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this destination?")) {
//             return;
//         }

//         try {
//             await axios.delete(route("ourdestinations.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (destination) => {
//         setEditingDestination(destination);
//         setShowForm(true);
//     };

//     // Handle update after the edit
//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourdestinations.update", { id }),
//             formData,
//             {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             },
//         );
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//     };

//     return (
//         <>
//         <Wrapper>
//         <div className="bg-[#FAF8F5] -m-6 p-6 min-h-screen">
//             <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
//                 <div>
//                     <span className="inline-flex items-center border border-[#D7CDC2] rounded-full px-4 py-1.5 text-[10px] sm:text-xs font-medium tracking-[1.5px] uppercase text-[#3A2D26]">
//                         destinations
//                     </span>
//                     <h1 className="mt-3 text-2xl lg:text-3xl font-medium text-[#3A2D26]">
//                         Manage Destinations
//                     </h1>
//                 </div>
//                 <button
//                     onClick={() => {
//                         setEditingDestination(null);
//                         setShowForm(true);
//                     }}
//                     className="px-5 py-2.5 flex items-center gap-2 bg-[#79824E] text-white rounded-full text-sm font-medium hover:bg-[#6e7647] transition-all duration-300 w-fit"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* Destinations grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
//                 {loading ? (
//                     <p className="text-[#433833] col-span-full">Loading destinations...</p>
//                 ) : allDestinations.length === 0 ? (
//                     <p className="text-[#433833] col-span-full">No destinations found.</p>
//                 ) : (
//                     allDestinations.map((destination) => (
//                         <div
//                             key={destination.id}
//                             className="group relative overflow-hidden rounded-2xl h-[300px] xs:h-[340px] sm:h-[360px] md:h-[400px] cursor-pointer"
//                         >
//                             {/* Image */}
//                             {destination.images?.[0]?.image ? (
//                                 <img
//                                     src={`/storage/${destination.images[0].image}`}
//                                     alt={destination.title}
//                                     className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
//                                 />
//                             ) : (
//                                 <div className="absolute inset-0 bg-gradient-to-br from-[#D8D0C6] to-[#C5BCB0]" />
//                             )}

//                             {/* Default gradient */}
//                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

//                             {/* Price pill */}
//                             <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-[#3A2D26] text-xs font-medium px-3 py-1 rounded-full">
//                                 ${destination.price}
//                             </div>

//                             {/* Rating pill */}
//                             <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white/90 backdrop-blur text-[#3A2D26] text-xs font-medium px-3 py-1 rounded-full">
//                                 <Star size={12} className="text-[#79824E]" fill="currentColor" />
//                                 {destination.rating}
//                             </div>

//                             {/* Title + description */}
//                             <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
//                                 <h3 className="text-white text-lg sm:text-xl font-medium mb-2">
//                                     {destination.title}
//                                 </h3>
//                                 <p className="text-white/90 text-xs sm:text-sm leading-relaxed line-clamp-2">
//                                     {destination.description}
//                                 </p>
//                             </div>

//                             {/* Hover overlay — admin actions */}
//                             <div className="absolute inset-0 bg-black/60 opacity-0 flex items-center justify-center gap-3 transition duration-500 group-hover:opacity-100 z-20">
//                                 <button
//                                     onClick={() => handleEdit(destination)}
//                                     className="flex items-center gap-2 bg-white text-[#3A2D26] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#79824E] hover:text-white transition-colors duration-300"
//                                 >
//                                     <Pencil size={14} />
//                                     Edit
//                                 </button>
//                                 <button
//                                     onClick={() => handleDelete(destination.id)}
//                                     className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 hover:text-white transition-colors duration-300"
//                                 >
//                                     <Trash2 size={14} />
//                                     Delete
//                                 </button>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>

//             <AddDestinationForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingDestination={editingDestination}
//                 setEditingDestination={setEditingDestination}
//                 handleUpdate={handleUpdate}
//             />
//         </div>
//         </Wrapper>
//         </>
//     );
// };

// export default Destination;
