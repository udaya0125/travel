import React from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Inbox,
} from 'lucide-react'

/**
 * MyTable — shared data table for admin CRUD pages.
 *
 * Design notes:
 * - Header row is a quiet uppercase label row; the active sort column gets a
 *   1px indigo underline instead of a shaded background, so sort state reads
 *   as a small structural signal rather than decoration.
 * - Rows use a hairline divider (no zebra striping) and a soft indigo wash
 *   on hover, matching the indigo-600 accent already used for the primary
 *   "Create" action across the admin panel.
 * - Pagination lives in a footer bar: left side reports the visible range,
 *   right side holds page-size + page controls. Buttons disable cleanly
 *   rather than hiding, so the control layout never shifts between pages.
 *
 * Props
 * - columns: react-table columns array (Header, accessor, optional Cell, optional disableSortBy)
 * - data: array of row objects
 * - loading: bool — shows a lightweight skeleton instead of rows
 * - emptyMessage: string shown when data is empty and not loading
 * - pageSizeOptions: number[] (default [5, 10, 20, 50])
 * - initialPageSize: number (default 10)
 */
const MyTable = ({
    columns,
    data,
    loading = false,
    emptyMessage = 'Nothing here yet.',
    pageSizeOptions = [5, 10, 20, 50],
    initialPageSize = 10,
}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: initialPageSize },
        },
        useSortBy,
        usePagination,
    )

    const rangeStart = data.length === 0 ? 0 : pageIndex * pageSize + 1
    const rangeEnd = Math.min((pageIndex + 1) * pageSize, data.length)

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table {...getTableProps()} className="w-full text-left border-collapse">
                    <thead>
                        {headerGroups.map((headerGroup) => {
                            const { key: hgKey, ...hgProps } = headerGroup.getHeaderGroupProps()
                            return (
                                <tr key={hgKey} {...hgProps} className="bg-gray-50/80">
                                    {headerGroup.headers.map((column) => {
                                        const { key: colKey, ...colProps } = column.getHeaderProps(
                                            column.getSortByToggleProps(),
                                        )
                                        const isSorted = column.isSorted
                                        return (
                                            <th
                                                key={colKey}
                                                {...colProps}
                                                className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 select-none ${
                                                    column.disableSortBy ? '' : 'cursor-pointer'
                                                } ${column.id === 'actions' ? 'text-right' : ''}`}
                                            >
                                                <span
                                                    className={`inline-flex items-center gap-1.5 pb-0.5 ${
                                                        isSorted ? 'border-b-2 border-indigo-500 text-gray-700' : ''
                                                    } ${column.id === 'actions' ? 'flex-row-reverse' : ''}`}
                                                >
                                                    {column.render('Header')}
                                                    {!column.disableSortBy &&
                                                        (isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <ChevronDown size={13} className="text-indigo-500" />
                                                            ) : (
                                                                <ChevronUp size={13} className="text-indigo-500" />
                                                            )
                                                        ) : (
                                                            <ChevronsUpDown size={13} className="text-gray-300" />
                                                        ))}
                                                </span>
                                            </th>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </thead>

                    <tbody {...getTableBodyProps()}>
                        {loading &&
                            Array.from({ length: pageSize }).map((_, i) => (
                                <tr key={`skeleton-${i}`} className="border-b border-gray-100 last:border-0">
                                    {columns.map((col, j) => (
                                        <td key={j} className="px-5 py-4">
                                            <div className="h-3 rounded bg-gray-100 animate-pulse w-3/4" />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {!loading && page.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-5 py-16">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <Inbox size={28} strokeWidth={1.5} />
                                        <p className="text-sm">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            page.map((row) => {
                                prepareRow(row)
                                const { key: rowKey, ...rowProps } = row.getRowProps()
                                return (
                                    <tr
                                        key={rowKey}
                                        {...rowProps}
                                        className="border-b border-gray-100 last:border-0 hover:bg-indigo-50/40 transition-colors"
                                    >
                                        {row.cells.map((cell) => {
                                            const { key: cellKey, ...cellProps } = cell.getCellProps()
                                            return (
                                                <td
                                                    key={cellKey}
                                                    {...cellProps}
                                                    className={`px-5 py-3.5 text-sm text-gray-700 ${
                                                        cell.column.id === 'actions' ? 'text-right' : ''
                                                    }`}
                                                >
                                                    {cell.render('Cell')}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                <p className="text-xs text-gray-500">
                    {data.length === 0
                        ? 'No rows'
                        : `Showing ${rangeStart}–${rangeEnd} of ${data.length}`}
                </p>

                <div className="flex items-center gap-4">
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size} / page
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
                        >
                            <ChevronsLeft size={15} />
                        </button>
                        <button
                            onClick={previousPage}
                            disabled={!canPreviousPage}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
                        >
                            <ChevronLeft size={15} />
                        </button>

                        <span className="text-xs text-gray-500 px-2 tabular-nums">
                            Page {pageOptions.length === 0 ? 0 : pageIndex + 1} of {pageOptions.length}
                        </span>

                        <button
                            onClick={nextPage}
                            disabled={!canNextPage}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
                        >
                            <ChevronRight size={15} />
                        </button>
                        <button
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
                        >
                            <ChevronsRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyTable