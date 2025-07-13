"use client"

import axios from "axios"
import { Loader2 } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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

const TicketsTable = forwardRef<TicketsTableRef>((props, ref) => {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [meta, setMeta] = useState<Meta>({
        page: 1,
        page_size: 10,
        total_items: 0,
        total_pages: 1
    })
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [regionFilter, setRegionFilter] = useState("")
    const [linkIdFilter, setLinkIdFilter] = useState("")
    const [linkTypeFilter, setLinkTypeFilter] = useState("")
    const [loading, setLoading] = useState(false)

    // Get unique values for filter options
    const [statusOptions, setStatusOptions] = useState<string[]>([])
    // const [regionOptions, setRegionOptions] = useState<string[]>([])
    const [linkTypeOptions, setLinkTypeOptions] = useState<string[]>([])

    const fetchTickets = async (page = 1, resetPage = false) => {
        try {
            setLoading(true)
            const currentPage = resetPage ? 1 : page
            const response = await axios.get('http://127.0.0.1:8000/tickets', {
                params: {
                    page: currentPage,
                    page_size: meta.page_size,
                    search: search || undefined,
                    status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
                    region: regionFilter && regionFilter !== "all" ? regionFilter : undefined,
                    link_id: linkIdFilter || undefined,
                    link_type: linkTypeFilter && linkTypeFilter !== "all" ? linkTypeFilter : undefined
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

    const fetchFilterOptions = () => {
        // Hardcoded filter options based on requirements
        const hardcodedStatus = [
            "Closed",
            "In Progress",
            "Request Parking",
            "Resolved Partial by Partner"
        ]

        const hardcodedLinkType = [
            "ENTERPRISE",
            "ENTERPRISE INFRA",
            "WHOLESALE"
        ]

        // Extract unique regions from current tickets (keep this dynamic)
        // const uniqueRegion = [...new Set(tickets.map(t => t.region).filter(Boolean))]

        setStatusOptions(hardcodedStatus)
        // setRegionOptions(uniqueRegion)
        setLinkTypeOptions(hardcodedLinkType)
    }

    // Expose reload function to parent component
    useImperativeHandle(ref, () => ({
        reloadData: () => {
            fetchTickets(meta.page)
        }
    }))

    useEffect(() => {
        fetchTickets(meta.page)
    }, [meta.page, meta.page_size])

    useEffect(() => {
        fetchFilterOptions()
    }, [tickets])

    const handleSearch = () => {
        fetchTickets(1, true)
    }

    const handleFilterChange = () => {
        fetchTickets(1, true)
    }

    const handlePageSizeChange = (newPageSize: string) => {
        setMeta(prev => ({
            ...prev,
            page_size: parseInt(newPageSize),
            page: 1
        }))
    }

    const clearFilters = () => {
        setSearch("")
        setStatusFilter("all")
        setRegionFilter("all")
        setLinkIdFilter("")
        setLinkTypeFilter("all")
        fetchTickets(1, true)
    }

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
                    <Button onClick={handleSearch} disabled={loading} className=" text-white">
                        {loading ? "Searching..." : "Search"}
                    </Button>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {/* Page Size */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Items per page</label>
                        <Select value={meta.page_size.toString()} onValueChange={handlePageSizeChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Status</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                {statusOptions.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Region Filter */}
                    {/* <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Region</label>
                        <Select value={regionFilter} onValueChange={setRegionFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Regions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                {regionOptions.map(region => (
                                    <SelectItem key={region} value={region}>{region}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div> */}

                    {/* Link ID Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Link ID</label>
                        <Input
                            className="w-full"
                            placeholder="Filter by Link ID"
                            value={linkIdFilter}
                            onChange={(e) => setLinkIdFilter(e.target.value)}
                        />
                    </div>

                    {/* Link Type Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Link Type</label>
                        <Select value={linkTypeFilter} onValueChange={setLinkTypeFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Link Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Link Types</SelectItem>
                                {linkTypeOptions.map(linkType => (
                                    <SelectItem key={linkType} value={linkType}>{linkType}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Apply and Clear Filters */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white invisible">Actions</label>
                        <div className="flex gap-2">
                            <Button onClick={handleFilterChange} disabled={loading} className="flex-1 text-white">
                                {loading ? "Applying..." : "Apply"}
                            </Button>
                            <Button variant="outline" onClick={clearFilters} className="flex-1">
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="text-sm text-gray-300">
                    Showing {tickets.length} of {meta.total_items} tickets
                    {(search || (statusFilter && statusFilter !== "all") || (regionFilter && regionFilter !== "all") || linkIdFilter || (linkTypeFilter && linkTypeFilter !== "all")) &&
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
                <Table>
                    <TableHeader className="bg-gray-800">
                        <TableRow>
                            <TableHead>Trouble Ticket</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Start</TableHead>
                            <TableHead>End</TableHead>
                            <TableHead>Malfunction Start</TableHead>
                            <TableHead>Malfunction End</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Parking</TableHead>
                            <TableHead>Total Parking</TableHead>
                            <TableHead>Suspend</TableHead>
                            <TableHead>Total Suspend</TableHead>
                            <TableHead>MTTR ALL</TableHead>
                            <TableHead>MTTR PT. HS</TableHead>
                            <TableHead>Root Cause</TableHead>
                            <TableHead>RFO</TableHead>
                            <TableHead>Link ID</TableHead>
                            <TableHead>Site ID</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Week</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Region New</TableHead>
                            <TableHead>SLA New</TableHead>
                            <TableHead>SLA 2H_2</TableHead>
                            <TableHead>SLA 4H_2</TableHead>
                            <TableHead>Z</TableHead>
                            <TableHead>ROH</TableHead>
                            <TableHead>Request MEET</TableHead>
                            <TableHead>Month</TableHead>
                            <TableHead>Related ISMT</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Cause Code</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>RCA</TableHead>
                            <TableHead>Customer Name</TableHead>
                            <TableHead>SLA BEFORE</TableHead>
                            <TableHead>ISMT MEET ALL</TableHead>
                            <TableHead>Link Type</TableHead>
                            <TableHead>Related TT Partnerr</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Problem Category</TableHead>
                            <TableHead>Takeout</TableHead>

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
                            <span key={idx} className="px-2 text-muted-foreground select-none">…</span>
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
