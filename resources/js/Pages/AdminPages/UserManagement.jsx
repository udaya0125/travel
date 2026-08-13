// import Wrapper from '@/AdminWrapper/Wrapper'
// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import { Plus, Pencil, Trash2 } from 'lucide-react'
// import AddUserForm from '@/AddFormComponents/AddUserForm'

// const UserManagement = () => {
//     const [allUser, setAllUser] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the user data
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await axios.get(route("ourusers.index"));
//                 setAllUser(response.data.users);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchUser();
//     }, [reloadTrigger]);

//     // For delete the user
//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this user?")) return;
//         try {
//             const response = await axios.delete(
//                 route("ourusers.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (user) => {
//         setEditingUser(user);
//         setShowForm(true);
//     };

//     // Handle update after the edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourusers.update", { id }),
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
//             console.log("Error updating user", error);
//             throw error;
//         }
//     };

//     return (
//         <div>
//             <Wrapper>
//                 <div className="mb-8 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                             User Management
//                         </h1>
//                     </div>
//                     <button
//                         onClick={() => {
//                             setEditingUser(null);
//                             setShowForm(true);
//                         }}
//                         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                     >
//                         <Plus size={18} />
//                         <span>Create</span>
//                     </button>
//                 </div>

//                 <div className="bg-white rounded-xl shadow overflow-hidden">
//                     <table className="w-full text-left">
//                         <thead className="bg-gray-50 border-b">
//                             <tr>
//                                 <th className="px-4 py-3 text-sm font-semibold text-gray-600">Name</th>
//                                 <th className="px-4 py-3 text-sm font-semibold text-gray-600">Email</th>
//                                 <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-right">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {allUser.map((user) => (
//                                 <tr key={user.id} className="border-b last:border-0">
//                                     <td className="px-4 py-3">{user.name}</td>
//                                     <td className="px-4 py-3">{user.email}</td>
//                                     <td className="px-4 py-3">
//                                         <div className="flex justify-end gap-2">
//                                             <button
//                                                 onClick={() => handleEdit(user)}
//                                                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                                             >
//                                                 <Pencil size={16} />
//                                             </button>
//                                             <button
//                                                 onClick={() => handleDelete(user.id)}
//                                                 className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
//                                             >
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                             {allUser.length === 0 && (
//                                 <tr>
//                                     <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
//                                         No users found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 <AddUserForm
//                     showForm={showForm}
//                     setShowForm={setShowForm}
//                     setReloadTrigger={setReloadTrigger}
//                     editingUser={editingUser}
//                     setEditingUser={setEditingUser}
//                     handleUpdate={handleUpdate}
//                 />
//             </Wrapper>
//         </div>
//     )
// }

// export default UserManagement

import Wrapper from "@/AdminWrapper/Wrapper";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AddUserForm from "@/AddFormComponents/AddUserForm";
import MyTable from "./MyTable";

const UserManagement = () => {
    const [allUser, setAllUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // For fetching the user data
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourusers.index"));
                setAllUser(response.data.users);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [reloadTrigger]);

    // For delete the user
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const response = await axios.delete(
                route("ourusers.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (user) => {
        setEditingUser(user);
        setShowForm(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourusers.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating user", error);
            throw error;
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Created At",
                accessor: "created_at",
                Cell: ({ value }) => (
                    <span className="text-gray-400">
                        {new Date(value).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                ),
            },
            {
                Header: "Created Time",
                accessor: "created_at_time",
                Cell: ({ row }) => (
                    <span className="text-gray-400">
                        {new Date(row.original.created_at).toLocaleTimeString(
                            "en-US",
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                            },
                        )}
                    </span>
                ),
            },
            {
                Header: "Actions",
                id: "actions",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <div>
            <Wrapper>
                <div className="mb-8 flex justify-between items-center">
                    <div>
                         <h2 className="inline-flex items-center border border-[#D7CDC2] rounded-full px-4 py-1.5 text-[10px] sm:text-xs font-medium tracking-[1.5px] uppercase text-[#3A2D26]">
                            User Management
                        </h2>
                    </div>
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setShowForm(true);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                <MyTable
                    columns={columns}
                    data={allUser}
                    loading={loading}
                    emptyMessage="No users found."
                />

                <AddUserForm
                    showForm={showForm}
                    setShowForm={setShowForm}
                    setReloadTrigger={setReloadTrigger}
                    editingUser={editingUser}
                    setEditingUser={setEditingUser}
                    handleUpdate={handleUpdate}
                />
            </Wrapper>
        </div>
    );
};

export default UserManagement;
