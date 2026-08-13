import Wrapper from "@/AdminWrapper/Wrapper";
import { Link } from "@inertiajs/react";
import { FaMountain, FaHiking, FaRunning, FaUsers } from "react-icons/fa";
import { MdCategory, MdOutlineCategory } from "react-icons/md";
import React from "react";

const Dashboard = () => {
    const cards = [
        {
            title: "Destination",
            breadcrumb: "Destination",
            icon: MdCategory,
            link: "/destination",
        },
        {
            title: "Package",
            breadcrumb: "Package",
            icon: MdOutlineCategory,
            link: "/package",
        },
        {
            title: "Activity Log",
            breadcrumb: "Activity Log",
            icon: FaMountain,
            link: "/activity-logs",
        },
        // {
        //     title: "Trekking",
        //     breadcrumb: "Trekking",
        //     icon: FaHiking,
        //     link: "/trekking",
        // },
        // {
        //     title: "Activities",
        //     breadcrumb: "Activities",
        //     icon: FaRunning,
        //     link: "/activities",
        // },
        // {
        //     title: "User Management",
        //     breadcrumb: "User Management",
        //     icon: FaUsers,
        //     link: "/user-management",
        // },
    ];

    return (
        <>
            <Wrapper>
                <div className="">
                    <h2 className="inline-flex items-center mb-10 border border-[#D7CDC2] rounded-full px-4 py-1.5 text-[10px] sm:text-xs font-medium tracking-[1.5px] uppercase text-[#3A2D26]">
                           Dashboard
                        </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map((card, index) => {
                            const Icon = card.icon;

                            return (
                                <Link
                                    key={index}
                                    href={card.link}
                                    className="block"
                                >
                                    <div className="bg-white rounded-2xl p-6 min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
                                        {/* Card Top Breadcrumb */}
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="text-xl font-semibold text-gray-800">
                                                Home
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                | {card.breadcrumb}
                                            </span>
                                        </div>

                                        {/* Card Content */}
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
                                                <Icon className="w-7 h-7 text-gray-700" size={28} />
                                            </div>

                                            <h3 className="text-lg font-medium text-gray-800">
                                                {card.title}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </Wrapper>
        </>
    );
};

export default Dashboard;