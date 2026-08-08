// import AddPackageForm from "@/AddFormComponents/AddPackageForm";
// import React from "react";

// const Package = () => {
//     const [allPackages, setAllPackages] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingPackage, setEditingPackage] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the package data
//     useEffect(() => {
//         const fetchPackages = async () => {
//             try {
//                 const response = await axios.get(route("ourpackages.index"));
//                 setAllPackages(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchPackages();
//     }, [reloadTrigger]);

//     // For delete the package
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourpackages.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (packages) => {
//         setEditingPackage(packages);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourpackages.update", { id }),
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
//             console.log("Error updating package", error);
//             throw error;
//         }
//     };

//     return (
//         <div>
//             <div className="mb-8 flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                         Package Management
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

//             <AddPackageForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingPackage={editingPackage}
//                 setEditingPackage={setEditingPackage}
//                 handleUpdate={handleUpdate}
//             />
//         </div>
//     );
// };

// export default Package;


import AddPackageForm from "@/AddFormComponents/AddPackageForm";
import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

const Package = () => {
    const [allPackages, setAllPackages] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // For fetching the package data
    useEffect(() => {
        const fetchPackages = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourpackage.index"), {
                    params: { page: currentPage },
                });

                // PackageController::index returns { status, message, data: <paginator> }
                const paginator = response.data.data;

                setAllPackages(paginator.data ?? []);
                setPagination(paginator);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, [reloadTrigger, currentPage]);

    // For delete the package
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this package? This cannot be undone.")) {
            return;
        }

        setDeletingId(id);

        try {
            await axios.delete(route("ourpackage.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error deleting package", error);
        } finally {
            setDeletingId(null);
        }
    };

    // handle edit
    const handleEdit = (pkg) => {
        setEditingPackage(pkg);
        setShowForm(true);
    };

    // Handle update after edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourpackage.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating package", error);
            throw error;
        }
    };

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        Package Management
                    </h1>
                </div>
                <button
                    onClick={() => {
                        setEditingPackage(null);
                        setShowForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                                    Package
                                </th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                                    Destination
                                </th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                                    Days
                                </th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                                    People
                                </th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                                    Price
                                </th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        Loading packages...
                                    </td>
                                </tr>
                            )}

                            {!loading && allPackages.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No packages found. Create your first one.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                allPackages.map((pkg) => (
                                    <tr
                                        key={pkg.id}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {pkg.emoji || pkg.images?.[0]?.image ? (
                                                    <img
                                                        src={`/storage/${
                                                            pkg.emoji ?? pkg.images[0].image
                                                        }`}
                                                        alt={pkg.title}
                                                        className="w-10 h-10 rounded-lg object-cover border"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                                                        🏝️
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {pkg.title}
                                                    </p>
                                                    {pkg.category && (
                                                        <p className="text-xs text-gray-500">
                                                            {pkg.category}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {pkg.destination?.title ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {pkg.days}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {pkg.people}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            ${pkg.price}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(pkg)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pkg.id)}
                                                    disabled={deletingId === pkg.id}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.last_page > 1 && (
                    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Page {pagination.current_page} of {pagination.last_page} (
                            {pagination.total} total)
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                                }
                                disabled={pagination.current_page === 1}
                                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, pagination.last_page)
                                    )
                                }
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <AddPackageForm
                showForm={showForm}
                setShowForm={setShowForm}
                setReloadTrigger={setReloadTrigger}
                editingPackage={editingPackage}
                setEditingPackage={setEditingPackage}
                handleUpdate={handleUpdate}
            />
        </div>
    );
};

export default Package;
