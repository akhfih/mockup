"use client"

import axios from "axios"
import { useEffect, useState } from "react"
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

export default function TicketsTable() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [meta, setMeta] = useState<Meta>({
        page: 1,
        page_size: 10,
        total_items: 0,
        total_pages: 1
    })
    const [search, setSearch] = useState("")

    const fetchTickets = async (page = 1) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/tickets', {
                params: {
                    page,
                    page_size: meta.page_size,
                    search
                }
            })

            setTickets(response.data.data)
            // console.log("DATA: " + response.data.)
            setMeta(response.data.meta)
        } catch (error) {
            console.error("Gagal mengambil data tiket:", error)
        }
    }

    useEffect(() => {
        fetchTickets(meta.page)
    }, [meta.page])

    const handleSearch = () => {
        setMeta(prev => ({ ...prev, page: 1 }))
        fetchTickets(1)
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
            {/* Search */}
            <div className="flex gap-2">
                <Input
                    placeholder="Cari tiket atau deskripsi"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Cari</Button>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
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

            {/* Pagination */}
            <div className="w-full flex justify-center items-center gap-2 pt-4 flex-wrap">
                {/* Previous */}
                <Button
                    variant="outline"
                    disabled={meta.page === 1}
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
                    disabled={meta.page === meta.total_pages}
                    onClick={() => setMeta(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                    Next
                </Button>
            </div>


        </div>
    )
}
