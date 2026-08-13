// import Wrapper from '@/AdminWrapper/Wrapper';
// import React, { useEffect, useState } from 'react'
// import axios from 'axios';
// import { Loader2, RefreshCw, Globe, Clock } from 'lucide-react';

// const ActivityLog = () => {
//     const [allActivity, setAllActivity] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [reloadTrigger, setReloadTrigger] = useState(false);

//     // For fetching the activity logs
//     useEffect(() => {
//         const fetchActivity = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourlogs.index"));
//                 setAllActivity(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchActivity();
//     }, [reloadTrigger]);

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleString('en-US', {
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     };

//     return (
//         <div>
//             <Wrapper>
//                 <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-xl font-semibold text-gray-800">Activity Log</h2>
//                     <button
//                         onClick={() => setReloadTrigger(prev => !prev)}
//                         className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
//                     >
//                         <RefreshCw size={16} />
//                         Refresh
//                     </button>
//                 </div>

//                 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//                     {loading ? (
//                         <div className="flex items-center justify-center py-16 text-gray-400">
//                             <Loader2 className="animate-spin mr-2" size={20} />
//                             Loading activity...
//                         </div>
//                     ) : allActivity.length === 0 ? (
//                         <div className="text-center py-16 text-gray-400">
//                             No activity recorded yet.
//                         </div>
//                     ) : (
//                         <table className="w-full text-sm">
//                             <thead>
//                                 <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-500">
//                                     <th className="px-4 py-3 font-medium">User</th>
//                                     <th className="px-4 py-3 font-medium">Activity</th>
//                                     <th className="px-4 py-3 font-medium">IP Address</th>
//                                     <th className="px-4 py-3 font-medium">Time</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {allActivity.map((log) => (
//                                     <tr key={log.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition">
//                                         <td className="px-4 py-3 text-gray-700 font-medium">{log.name}</td>
//                                         <td className="px-4 py-3 text-gray-600">{log.title}</td>
//                                         <td className="px-4 py-3 text-gray-500">
//                                             <span className="inline-flex items-center gap-1">
//                                                 <Globe size={14} />
//                                                 {log.ip_address || '—'}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-3 text-gray-500">
//                                             <span className="inline-flex items-center gap-1">
//                                                 <Clock size={14} />
//                                                 {formatDate(log.created_at)}
//                                             </span>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//             </Wrapper>
//         </div>
//     )
// }

// export default ActivityLog


import Wrapper from "@/AdminWrapper/Wrapper";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { RefreshCw, Globe, Clock } from "lucide-react";
import MyTable from "./MyTable";

const ActivityLog = () => {
    const [allActivity, setAllActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(false);

    // For fetching the activity logs
    useEffect(() => {
        const fetchActivity = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourlogs.index"));
                setAllActivity(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [reloadTrigger]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                Header: "User",
                accessor: "name",
                Cell: ({ value }) => (
                    <span className="text-gray-700 font-medium">{value}</span>
                ),
            },
            {
                Header: "Activity",
                accessor: "title",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{value}</span>
                ),
            },
            {
                Header: "IP Address",
                accessor: "ip_address",
                Cell: ({ value }) => (
                    <span className="inline-flex items-center gap-1 text-gray-500">
                        <Globe size={14} />
                        {value || "—"}
                    </span>
                ),
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
        ],
        [],
    );

    return (
        <div>
            <Wrapper>
                <div className="flex items-center justify-between mb-6">
                     <h2 className="inline-flex items-center border border-[#D7CDC2] rounded-full px-4 py-1.5 text-[10px] sm:text-xs font-medium tracking-[1.5px] uppercase text-[#3A2D26]">
                            Activity Log
                        </h2>
                    <button
                        onClick={() => setReloadTrigger((prev) => !prev)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                <MyTable
                    columns={columns}
                    data={allActivity}
                    loading={loading}
                    emptyMessage="No activity recorded yet."
                />
            </Wrapper>
        </div>
    );
};

export default ActivityLog;
