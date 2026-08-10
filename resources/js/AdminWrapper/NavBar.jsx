import React, { useState, useRef, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { Menu, UserCircle, ChevronDown, LogOut } from "lucide-react";

const NavBar = ({ onMenuToggle, pageTitle = "Dashboard" }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const { auth } = usePage().props;
    const user = auth?.user;
    const firstName = (user?.name || "Coach").split(" ")[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, []);

    const toggleUserMenu = () => {
        setIsUserMenuOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            await axios.post(route("logout"));
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/login";
        }
    };

    return (
        <nav className="fixed right-0 top-0 z-30 flex h-16 items-center border-b border-slate-100 bg-white/80 px-4 backdrop-blur-md transition-all duration-300 sm:px-6"
            style={{ left: "var(--sidebar-width, 0px)" }}
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuToggle}
                        className="rounded-lg p-2 transition-colors duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 lg:hidden"
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-5 w-5 text-slate-600" />
                    </button>

                    <div>
                        <p className="text-sm font-medium leading-tight text-teal-600">
                            Welcome back, {firstName}
                            <span className="ml-1">👋</span>
                        </p>
                        <h1 className="text-xl font-bold leading-tight text-slate-800">
                            {pageTitle}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative border-l border-slate-200 pl-3" ref={userMenuRef}>
                        <button
                            onClick={toggleUserMenu}
                            className="flex items-center space-x-2 rounded-lg p-1.5 transition-colors duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                        >
                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-teal-100">
                                {user?.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name || "User"}
                                        className="h-full w-full object-cover"
                                        onError={(e) => (e.target.style.display = "none")}
                                    />
                                ) : (
                                    <UserCircle className="h-5 w-5 text-teal-600" />
                                )}
                            </div>

                            <span className="hidden text-sm font-semibold text-slate-700 sm:block">
                                {user?.name || "Guest"}
                            </span>

                            <ChevronDown
                                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                                    isUserMenuOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute right-0 z-40 mt-2 w-64 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                                <div className="border-b border-slate-100 px-4 py-3">
                                    <p className="truncate text-sm font-medium text-slate-800">
                                        {user?.name || "Guest"}
                                    </p>
                                    <p className="mt-1 truncate text-sm text-slate-500">
                                        {user?.email || ""}
                                    </p>
                                </div>
                                <div className="border-t border-slate-100 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                                    >
                                        <LogOut className="mr-3 h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;