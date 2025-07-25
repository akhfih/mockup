"use client"

import axios from "axios"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
import { Loader2 } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Ticket {
    id: number;
    trouble_ticket: string;
    description: string;
    start_tt: string;
    end_tt: string;
    malfunction_start: string;
    malfunction_end: string;
    status: string;
    parking: string;
    total_parking: string;
    suspend: string;
    total_suspend: string;
    mttr_all: string;
    mttr_pt_hs: string;
    root_cause: string;
    rfo: string;
    link_id: string;
    site_id: string;
    region: string;
    week: string;
    priority: string;
    region_new: string;
    sla_new: string;
    sla_2h_2: string;
    sla_4h_2: string;
    z: string;
    roh: string;
    request_meet: string;
    month: string;
    related_ismt: string;
    date: string;
    cause_code: string;
    reason: string;
    rca: string;
    customer_name: string;
    sla_before: string;
    ismt_meet_all: string;
    link_type: string;
    related_tt_partner: string;
    class_: string;
    problem_category: string;
    takeout: string;
}

interface Meta {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
}

export interface TicketsTableRef {
    reloadData: () => void;
}

interface TicketsTableProps {
    linkType?: 'all' | 'enterprise' | 'wholesale';
    customerName?: string;
    linkId?: string;
    statusFilter?: string;
}

const TicketsTable = forwardRef<TicketsTableRef, TicketsTableProps>(
    ({ linkType = 'all', customerName = '', linkId = '', statusFilter = 'all' }, ref) => {
        const [tickets, setTickets] = useState<Ticket[]>([])
        const [meta, setMeta] = useState<Meta>({
            page: 1,
            page_size: 10,
            total_items: 0,
            total_pages: 1
        })
        const [search, setSearch] = useState("")
        // Removed internal filter state, now using props only
        const [loading, setLoading] = useState(false)

        // Get unique values for filter options
        // Removed statusOptions state
        // const [regionOptions, setRegionOptions] = useState<string[]>([])
        // Page input state for direct navigation
        const [pageInput, setPageInput] = useState(meta.page);
        useEffect(() => {
            setPageInput(meta.page);
        }, [meta.page]);

        const fetchTickets = async (page = 1, resetPage = false) => {
            try {
                setLoading(true)
                const currentPage = resetPage ? 1 : page
                const response = await axios.get(`${API_BASE_URL}/tickets`, {
                    params: {
                        page: currentPage,
                        page_size: meta.page_size,
                        search: search || undefined,
                        status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
                        link_id: linkId || undefined,
                        link_type: linkType && linkType !== "all" ? (linkType === 'enterprise' ? 'ENTERPRISE' : linkType === 'wholesale' ? 'WHOLESALE' : undefined) : undefined,
                        customer_name: customerName || undefined,
                    }
                })

                setTickets(response.data.data)
                setMeta(response.data.meta)

                if (resetPage) {
                    setMeta(prev => ({ ...prev, page: 1 }))
                }
            } catch (error) {
                console.error("Gagal mengambil data tiket:", error)
            } finally {
                setLoading(false)
            }
        }

        // Removed fetchFilterOptions and all related code

        // Expose reload function to parent component
        useImperativeHandle(ref, () => ({
            reloadData: () => {
                fetchTickets(meta.page)
            }
        }))

        useEffect(() => {
            fetchTickets(meta.page)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [meta.page, meta.page_size, linkType, customerName, linkId, statusFilter])

        // Removed fetchFilterOptions effect

        const handleSearch = () => {
            fetchTickets(1, true)
        }

        // Removed handleFilterChange


        // Removed clearFilters

        function generatePagination(current: number, total: number): (number | "...")[] {
            const delta = 1 // halaman di sekitar yang sedang aktif
            const range: (number | "...")[] = []
            const left = Math.max(2, current - delta)
            const right = Math.min(total - 1, current + delta)

            range.push(1) // halaman pertama

            if (left > 2) {
                range.push("...")
            }

            for (let i = left; i <= right; i++) {
                range.push(i)
            }

            if (right < total - 1) {
                range.push("...")
            }

            if (total > 1) {
                range.push(total) // halaman terakhir
            }

            return range
        }


        return (
            <div className="space-y-4 rounded-lg shadow-md p-10 bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396]">
                {/* Search and Filters */}
                <div className="space-y-4">
                    {/* Search Row */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search tickets by number, description, or customer name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} disabled={loading} className=" text-white bg-[#164396]">
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </div>

                    {/* Filters Row removed, all filter UI is now in parent */}

                    {/* Results Info */}
                    <div className="text-sm text-gray-300 mb-2">
                        Showing {tickets.length} of {meta.total_items} tickets
                        {(search || (statusFilter && statusFilter !== "all") || (linkId || (linkType && linkType !== "all"))) &&
                            " (filtered)"
                        }
                    </div>
                </div>

                {/* Table */}
                <div className="relative">
                    {loading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                    )}
                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <div className="w-full overflow-x-auto">
                            <Table className="min-w-[3000px]">
                                <TableHeader className="bg-gray-800">
                                    <TableRow>
                                        <TableHead className="min-w-[120px]">Trouble Ticket</TableHead>
                                        <TableHead className="min-w-[120px]">Description</TableHead>
                                        <TableHead className="min-w-[120px]">Start</TableHead>
                                        <TableHead className="min-w-[120px]">End</TableHead>
                                        <TableHead className="min-w-[120px]">Malfunction Start</TableHead>
                                        <TableHead className="min-w-[120px]">Malfunction End</TableHead>
                                        <TableHead className="min-w-[120px]">Status</TableHead>
                                        <TableHead className="min-w-[120px]">Parking</TableHead>
                                        <TableHead className="min-w-[120px]">Total Parking</TableHead>
                                        <TableHead className="min-w-[120px]">Suspend</TableHead>
                                        <TableHead className="min-w-[120px]">Total Suspend</TableHead>
                                        <TableHead className="min-w-[120px]">MTTR ALL</TableHead>
                                        <TableHead className="min-w-[120px]">MTTR PT. HS</TableHead>
                                        <TableHead className="min-w-[120px]">Root Cause</TableHead>
                                        <TableHead className="min-w-[120px]">RFO</TableHead>
                                        <TableHead className="min-w-[120px]">Link ID</TableHead>
                                        <TableHead className="min-w-[120px]">Site ID</TableHead>
                                        <TableHead className="min-w-[120px]">Region</TableHead>
                                        <TableHead className="min-w-[120px]">Week</TableHead>
                                        <TableHead className="min-w-[120px]">Priority</TableHead>
                                        <TableHead className="min-w-[120px]">Region New</TableHead>
                                        <TableHead className="min-w-[120px]">SLA New</TableHead>
                                        <TableHead className="min-w-[120px]">SLA 2H_2</TableHead>
                                        <TableHead className="min-w-[120px]">SLA 4H_2</TableHead>
                                        <TableHead className="min-w-[120px]">Z</TableHead>
                                        <TableHead className="min-w-[120px]">ROH</TableHead>
                                        <TableHead className="min-w-[120px]">Request MEET</TableHead>
                                        <TableHead className="min-w-[120px]">Month</TableHead>
                                        <TableHead className="min-w-[120px]">Related ISMT</TableHead>
                                        <TableHead className="min-w-[120px]">Date</TableHead>
                                        <TableHead className="min-w-[120px]">Cause Code</TableHead>
                                        <TableHead className="min-w-[120px]">Reason</TableHead>
                                        <TableHead className="min-w-[120px]">RCA</TableHead>
                                        <TableHead className="min-w-[120px]">Customer Name</TableHead>
                                        <TableHead className="min-w-[120px]">SLA BEFORE</TableHead>
                                        <TableHead className="min-w-[120px]">ISMT MEET ALL</TableHead>
                                        <TableHead className="min-w-[120px]">Link Type</TableHead>
                                        <TableHead className="min-w-[120px]">Related TT Partnerr</TableHead>
                                        <TableHead className="min-w-[120px]">Class</TableHead>
                                        <TableHead className="min-w-[120px]">Problem Category</TableHead>
                                        <TableHead className="min-w-[120px]">Takeout</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tickets.map(ticket => (
                                        <TableRow key={ticket.id}>
                                            <TableCell>{ticket.trouble_ticket}</TableCell>
                                            <TableCell>{ticket.description}</TableCell>
                                            <TableCell>{ticket.start_tt.replace("T", " ")}</TableCell>
                                            <TableCell>{ticket.end_tt ? ticket.end_tt.replace("T", " ") : "-"}</TableCell>
                                            <TableCell>{ticket.malfunction_start ? ticket.malfunction_start.replace("T", " ") : "-"}</TableCell>
                                            <TableCell>{ticket.malfunction_end ? ticket.malfunction_end.replace("T", " ") : "-"}</TableCell>
                                            <TableCell>{ticket.status ? ticket.status.replace("T", " ") : "-"}</TableCell>
                                            <TableCell>{ticket.parking ? ticket.parking.replace("T", " ") : "-"}</TableCell>
                                            <TableCell>{ticket.total_parking}</TableCell>
                                            <TableCell>{ticket.suspend ? ticket.suspend : "-"}</TableCell>
                                            <TableCell>{ticket.total_suspend ? ticket.suspend : "-"}</TableCell>
                                            <TableCell>{ticket.mttr_all ? ticket.mttr_all : "-"}</TableCell>
                                            <TableCell>{ticket.mttr_pt_hs ? ticket.mttr_pt_hs : "-"}</TableCell>
                                            <TableCell>{ticket.root_cause ? ticket.root_cause : "-"}</TableCell>
                                            <TableCell>{ticket.rfo ? ticket.rfo : "-"}</TableCell>
                                            <TableCell>{ticket.link_id ? ticket.link_id : "-"}</TableCell>
                                            <TableCell>{ticket.site_id ? ticket.site_id : "-"}</TableCell>
                                            <TableCell>{ticket.region ? ticket.region : "-"}</TableCell>
                                            <TableCell>{ticket.week ? ticket.week : "-"}</TableCell>
                                            <TableCell>{ticket.priority ? ticket.priority : "-"}</TableCell>
                                            <TableCell>{ticket.region_new ? ticket.region_new : "-"}</TableCell>
                                            <TableCell>{ticket.sla_new ? ticket.sla_new : "-"}</TableCell>
                                            <TableCell>{ticket.sla_2h_2 ? ticket.sla_2h_2 : "-"}</TableCell>
                                            <TableCell>{ticket.sla_4h_2 ? ticket.sla_4h_2 : "-"}</TableCell>
                                            <TableCell>{ticket.z ? ticket.z : "-"}</TableCell>
                                            <TableCell>{ticket.roh ? ticket.roh : "-"}</TableCell>
                                            <TableCell>{ticket.request_meet ? ticket.request_meet : "-"}</TableCell>
                                            <TableCell>{ticket.month ? ticket.month : "-"}</TableCell>
                                            <TableCell>{ticket.related_ismt ? ticket.related_ismt : "-"}</TableCell>
                                            <TableCell>{ticket.date ? ticket.date : "-"}</TableCell>
                                            <TableCell>{ticket.cause_code ? ticket.cause_code : "-"}</TableCell>
                                            <TableCell>{ticket.reason ? ticket.reason : "-"}</TableCell>
                                            <TableCell>{ticket.rca ? ticket.rca : "-"}</TableCell>
                                            <TableCell>{ticket.customer_name ? ticket.customer_name : "-"}</TableCell>
                                            <TableCell>{ticket.sla_before ? ticket.sla_before : "-"}</TableCell>
                                            <TableCell>{ticket.ismt_meet_all ? ticket.ismt_meet_all : "-"}</TableCell>
                                            <TableCell>{ticket.link_type ? ticket.link_type : "-"}</TableCell>
                                            <TableCell>{ticket.related_tt_partner ? ticket.related_tt_partner : "-"}</TableCell>
                                            <TableCell>{ticket.class_ ? ticket.class_ : "-"}</TableCell>
                                            <TableCell>{ticket.problem_category ? ticket.problem_category : "-"}</TableCell>
                                            <TableCell>{ticket.takeout ? ticket.takeout : "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="w-full flex justify-between items-center pt-4 flex-wrap gap-4">
                    <div className="text-sm text-gray-300">
                        Page {meta.page} of {meta.total_pages}
                    </div>

                    <div className="flex justify-center items-center gap-2 flex-wrap">
                        {/* Previous */}
                        <Button
                            variant="outline"
                            disabled={meta.page === 1 || loading}
                            onClick={() => setMeta(prev => ({ ...prev, page: prev.page - 1 }))}
                        >
                            Previous
                        </Button>

                        {/* Page Input */}
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                if (pageInput >= 1 && pageInput <= meta.total_pages && pageInput !== meta.page) {
                                    setMeta(prev => ({ ...prev, page: pageInput }));
                                }
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="number"
                                min={1}
                                max={meta.total_pages}
                                value={pageInput}
                                onChange={e => setPageInput(Number(e.target.value))}
                                className="w-16 px-2 py-1 rounded border border-gray-400 bg-transparent text-white"
                                style={{ textAlign: "center" }}
                            />
                            <Button
                                type="submit"
                                className="flex-1 text-white bg-[#164396]"
                                disabled={pageInput === meta.page || pageInput < 1 || pageInput > meta.total_pages}
                            >
                                Go
                            </Button>
                        </form>

                        {/* Page Number Buttons with Ellipsis */}
                        {generatePagination(meta.page, meta.total_pages).map((item, idx) =>
                            typeof item === "number" ? (
                                <Button
                                    key={idx}
                                    variant={meta.page === item ? "default" : "outline"}
                                    className="w-10 p-0"
                                    disabled={loading}
                                    onClick={() => setMeta(prev => ({ ...prev, page: item }))}
                                >
                                    {item}
                                </Button>
                            ) : (
                                <span key={idx} className="px-2 text select-none">…</span>
                            )
                        )}

                        {/* Next */}
                        <Button
                            variant="outline"
                            disabled={meta.page === meta.total_pages || loading}
                            onClick={() => setMeta(prev => ({ ...prev, page: prev.page + 1 }))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        )
    })

TicketsTable.displayName = "TicketsTable"

export default TicketsTable
