import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X } from "lucide-react";
import {
    LayoutGrid,
    Users,
    MessageCircle,
    BarChart2,
    Calendar,
    Wallet,
    ArrowLeftRight,
    GraduationCap,
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/destination", label: "Destination", icon: MessageCircle },
    { href: "/package", label: "Package", icon: Users },
    { href: "/statistic", label: "Statistic", icon: BarChart2 },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/finance", label: "Finance", icon: Wallet },
];



const SideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url } = usePage();
    const currentPath = "/" + url.split("/")[1];

    const isActive = (href) => currentPath === href;

    const renderLink = ({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
            <Link
                key={href}
                href={href}
                title={isCollapsed ? label : ""}
                className={`
                    relative flex items-center gap-3 rounded-xl transition-all duration-200 group
                    ${isCollapsed ? "justify-center p-2.5" : "px-4 py-2.5"}
                    ${
                        active
                            ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-sm shadow-teal-500/30"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    }
                `}
            >
                <Icon size={18} strokeWidth={2} className="flex-shrink-0" />

                {!isCollapsed && (
                    <span className="text-sm font-medium">{label}</span>
                )}

                {isCollapsed && (
                    <div className="pointer-events-none absolute left-full z-50 ml-3 translate-x-1 whitespace-nowrap rounded-lg border border-slate-700/10 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-50 opacity-0 shadow-lg transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100">
                        {label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent border-r-slate-800" />
                    </div>
                )}
            </Link>
        );
    };

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-sm lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            <aside
                className={`
                    fixed left-0 top-0 z-50 flex h-screen flex-col bg-white transition-all duration-300 ease-in-out
                    ${isCollapsed ? "w-[68px]" : "w-64"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                <div
                    className={`flex h-16 flex-shrink-0 items-center px-4 ${
                        isCollapsed ? "justify-center" : "justify-between"
                    }`}
                >
                    {!isCollapsed && (
                        <Link
                            href="/dashboard"
                            className="text-xl font-bold tracking-tight text-slate-800"
                        >
                            CoachPro
                        </Link>
                    )}

                    {isCollapsed ? (
                        <button
                            onClick={onToggleCollapse}
                            title="Expand sidebar"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-all duration-200 hover:scale-110 hover:border-teal-300 hover:shadow-md"
                        >
                            <Menu className="h-3.5 w-3.5" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={onToggleCollapse}
                                title="Collapse sidebar"
                                className="hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-all duration-200 hover:scale-110 hover:border-teal-300 hover:shadow-md lg:flex"
                            >
                                <Menu className="h-3.5 w-3.5" />
                            </button>
                            <button
                                onClick={onMobileToggle}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:scale-110 hover:shadow-md lg:hidden"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                <nav
                    className={`flex flex-1 flex-col gap-1.5 overflow-y-auto overflow-x-hidden py-2 ${
                        isCollapsed ? "px-2" : "px-4"
                    }`}
                    style={{ scrollbarWidth: "none" }}
                >
                    {NAV_ITEMS.map(renderLink)}
                </nav>

                <div className={`${isCollapsed ? "mx-2" : "mx-4"} border-t border-slate-200`} />

               
            </aside>
        </>
    );
};

export default SideBar;