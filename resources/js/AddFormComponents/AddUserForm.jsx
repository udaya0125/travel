import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { X, Eye, EyeOff } from 'lucide-react'

const AddUserForm = ({
    showForm,
    setShowForm,
    setReloadTrigger,
    editingUser,
    setEditingUser,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    // Use Effect
    useEffect(() => {
        if (editingUser) {
            setUserForm({
                name: editingUser.name ?? "",
                email: editingUser.email ?? "",
                password: "",
                password_confirmation: "",
            });
        } else {
            setUserForm({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
            });
        }
        setErrors({});
    }, [editingUser]);

    // Handle Create User
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourusers.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating user", error);
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();
        for (const key in userForm) {
            if (userForm[key] !== null && userForm[key] !== "") {
                formData.append(key, userForm[key]);
            }
        }

        try {
            setSubmitting(true);

            if (editingUser) {
                await handleUpdate(formData, editingUser.id);
            } else {
                await handleCreate(formData);
            }

            setUserForm({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
            });
            setShowForm(false);
            setEditingUser(null);
        } catch (error) {
            if (error?.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            }
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingUser(null);
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingUser ? "Edit User" : "Add New User"}
                    </h2>
                    <button
                        onClick={closeForm}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={userForm.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1">{errors.name[0]}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email[0]}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password {editingUser && (
                                <span className="text-gray-400 font-normal">
                                    (leave blank to keep current)
                                </span>
                            )}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={userForm.password}
                                onChange={handleChange}
                                required={!editingUser}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-600 mt-1">{errors.password[0]}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={userForm.password_confirmation}
                                onChange={handleChange}
                                required={!editingUser || userForm.password !== ""}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
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
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : editingUser ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddUserForm