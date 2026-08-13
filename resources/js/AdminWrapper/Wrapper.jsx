// import React, { useState, useEffect } from "react";
// import NavBar from "./NavBar";
// import SideBar from "./SideBar";

// const Wrapper = ({ children, pageTitle = "Dashboard" }) => {
//     const [isMobileOpen, setIsMobileOpen] = useState(false);
//     const [isCollapsed, setIsCollapsed] = useState(() => {
//         if (typeof window === "undefined") return false;
//         return window.localStorage.getItem("sidebar-collapsed") === "true";
//     });

//     const SIDEBAR_WIDTH = isCollapsed ? 68 : 256;

//     const toggleMobile = () => setIsMobileOpen((prev) => !prev);
//     const toggleCollapse = () => setIsCollapsed((prev) => !prev);

//     // Sync CSS variable so the fixed navbar knows how far to inset
//     useEffect(() => {
//         const width = window.innerWidth >= 1024 ? SIDEBAR_WIDTH : 0;
//         document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
//     }, [SIDEBAR_WIDTH]);

//     useEffect(() => {
//         const handleResize = () => {
//             const width = window.innerWidth >= 1024 ? SIDEBAR_WIDTH : 0;
//             document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
//             if (window.innerWidth >= 1024) setIsMobileOpen(false);
//         };
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, [SIDEBAR_WIDTH]);

//     useEffect(() => {
//         window.localStorage.setItem("sidebar-collapsed", String(isCollapsed));
//     }, [isCollapsed]);

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50">
//             <NavBar onMenuToggle={toggleMobile} pageTitle={pageTitle} />

//             <SideBar
//                 isMobileOpen={isMobileOpen}
//                 onMobileToggle={toggleMobile}
//                 isCollapsed={isCollapsed}
//                 onToggleCollapse={toggleCollapse}
//             />

//             <main
//                 className="min-h-screen pt-16 transition-all duration-300 ease-in-out"
//                 style={{ marginLeft: `${SIDEBAR_WIDTH}px` }}
//             >
//                 <div className="p-4 lg:p-6">
//                     <div style={{ animation: "pageIn 0.25s ease-out" }}>
//                         {children}
//                     </div>
//                 </div>
//             </main>

//             <style>{`
//                 @media (max-width: 1023px) {
//                     main { margin-left: 0 !important; }
//                 }
//                 @keyframes pageIn {
//                     from { opacity: 0; transform: translateY(6px); }
//                     to   { opacity: 1; transform: translateY(0); }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default Wrapper;

import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import NavBar from "./NavBar";
import SideBar, { NAV_ITEMS } from "./SideBar";

const Wrapper = ({ children, pageTitle }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.localStorage.getItem("sidebar-collapsed") === "true";
    });

    const { url } = usePage();
    const currentPath = "/" + url.split("/")[1];
    const activeNavItem = NAV_ITEMS.find((item) => item.href === currentPath);
    const resolvedTitle = pageTitle || activeNavItem?.label || "Dashboard";

    const SIDEBAR_WIDTH = isCollapsed ? 68 : 256;

    const toggleMobile = () => setIsMobileOpen((prev) => !prev);
    const toggleCollapse = () => setIsCollapsed((prev) => !prev);

    // Sync CSS variable so the fixed navbar knows how far to inset
    useEffect(() => {
        const width = window.innerWidth >= 1024 ? SIDEBAR_WIDTH : 0;
        document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
    }, [SIDEBAR_WIDTH]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth >= 1024 ? SIDEBAR_WIDTH : 0;
            document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
            if (window.innerWidth >= 1024) setIsMobileOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [SIDEBAR_WIDTH]);

    useEffect(() => {
        window.localStorage.setItem("sidebar-collapsed", String(isCollapsed));
    }, [isCollapsed]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50">
            <NavBar onMenuToggle={toggleMobile} pageTitle={resolvedTitle} />

            <SideBar
                isMobileOpen={isMobileOpen}
                onMobileToggle={toggleMobile}
                isCollapsed={isCollapsed}
                onToggleCollapse={toggleCollapse}
            />

            <main
                className="min-h-screen bg-[#FAF8F5] pt-16 transition-all duration-300 ease-in-out"
                style={{ marginLeft: `${SIDEBAR_WIDTH}px` }}
            >
                <div className="p-4 lg:p-6 ">
                    <div style={{ animation: "pageIn 0.25s ease-out" }}>
                        {children}
                    </div>
                </div>
            </main>

            <style>{`
                @media (max-width: 1023px) {
                    main { margin-left: 0 !important; }
                }
                @keyframes pageIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Wrapper;