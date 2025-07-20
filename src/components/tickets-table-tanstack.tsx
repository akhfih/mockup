"use client"

import {
    ColumnDef,
    ColumnResizeMode,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import axios from "axios"
import {
    ArrowUpDown,
    Copy as CopyIcon,
    Loader2,
    Settings
} from "lucide-react"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

interface Ticket {
    id: string | number
    trouble_ticket: string
    description: string
    start_tt: string
    end_tt: string
    malfunction_start: string
    malfunction_end: string
    status: string
    parking: string
    total_parking: string
    suspend: string
    total_suspend: string
    mttr_all: string
    mttr_pt_hs: string
    root_cause: string
    rfo: string
    link_id: string
    site_id: string
    region: string
    week: string
    priority: string
    region_new: string
    sla_new: string
    sla_2h_2: string
    sla_4h_2: string
    z: string
    roh: string
    request_meet: string
    month: string
    related_ismt: string
    date: string
    cause_code: string
    reason: string
    rca: string
    customer_name: string
    sla_before: string
    ismt_meet_all: string
    link_type: string
    related_tt_partner: string
    class_: string
    problem_category: string
    takeout: string
    title?: string
    updated_at?: string
    created_at?: string
    assigned_to?: string
    [key: string]: string | number | undefined
}

export type TicketsTableRef = {
    reloadData: () => void;
}

interface TicketsTableProps {
    baseUrl?: string;
    urlEndpoint?: string;
    linkType?: 'all' | 'enterprise' | 'wholesale';
    customerName?: string;
    linkId?: string;
    statusFilter?: string;
}

const TicketsTable = forwardRef<TicketsTableRef, TicketsTableProps>(
    ({
        baseUrl = API_BASE_URL,
        urlEndpoint = "/tickets",
        linkType = 'all',
        customerName = '',
        linkId = '',
        statusFilter = 'all'
    }, ref) => {
        const [data, setData] = useState<Ticket[]>([])
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState("")
        const [globalFilter, setGlobalFilter] = useState<string>("")
        const [sorting, setSorting] = useState<SortingState>([])
        const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
        const [columnSizing, setColumnSizing] = useState({})
        const [rowSelection, setRowSelection] = useState({})
        const [meta, setMeta] = useState({
            page: 1,
            page_size: 10,
            total_items: 0,
            total_pages: 1
        })

        // Load column visibility and sizing from localStorage
        useEffect(() => {
            try {
                const savedVisibility = localStorage.getItem("ticketsTableColumnVisibility")
                const savedSizing = localStorage.getItem("ticketsTableColumnSizing")

                if (savedVisibility) {
                    setColumnVisibility(JSON.parse(savedVisibility))
                }

                if (savedSizing) {
                    setColumnSizing(JSON.parse(savedSizing))
                }
            } catch (err) {
                console.error("Error loading table preferences:", err)
            }
        }, [])

        // Save column visibility and sizing to localStorage when they change
        useEffect(() => {
            try {
                localStorage.setItem("ticketsTableColumnVisibility", JSON.stringify(columnVisibility))
            } catch (err) {
                console.error("Error saving column visibility:", err)
            }
        }, [columnVisibility])

        useEffect(() => {
            try {
                localStorage.setItem("ticketsTableColumnSizing", JSON.stringify(columnSizing))
            } catch (err) {
                console.error("Error saving column sizing:", err)
            }
        }, [columnSizing])

        const columns = useMemo<ColumnDef<Ticket>[]>(() => [
            {
                accessorKey: "trouble_ticket",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Trouble Ticket
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                size: 120,
            },
            {
                accessorKey: "description",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Description
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                size: 200,
            },
            {
                accessorKey: "start_tt",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Start
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("start_tt") as string
                    return value ? value.replace("T", " ") : "-"
                },
                size: 120,
            },
            {
                accessorKey: "end_tt",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            End
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("end_tt") as string
                    return value ? value.replace("T", " ") : "-"
                },
                size: 120,
            },
            {
                accessorKey: "malfunction_start",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Malfunction Start
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("malfunction_start") as string
                    return value ? value.replace("T", " ") : "-"
                },
                size: 120,
            },
            {
                accessorKey: "malfunction_end",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Malfunction End
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("malfunction_end") as string
                    return value ? value.replace("T", " ") : "-"
                },
                size: 120,
            },
            {
                accessorKey: "status",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Status
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                size: 100,
            },
            {
                accessorKey: "parking",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Parking
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("parking") as string
                    return value ? value.replace("T", " ") : "-"
                },
                size: 120,
            },
            {
                accessorKey: "total_parking",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Total Parking
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                size: 120,
            },
            {
                accessorKey: "suspend",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Suspend
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("suspend") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "total_suspend",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Total Suspend
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("total_suspend") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "mttr_all",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            MTTR ALL
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("mttr_all") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "mttr_pt_hs",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            MTTR PT. HS
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("mttr_pt_hs") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "root_cause",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Root Cause
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("root_cause") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "link_id",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Link ID
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("link_id") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "site_id",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Site ID
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("site_id") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "region",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Region
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("region") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "week",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Week
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("week") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "priority",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Priority
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("priority") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "region_new",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Region New
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("region_new") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "sla_new",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            SLA New
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("sla_new") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "sla_2h_2",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            SLA 2H_2
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("sla_2h_2") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "sla_4h_2",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            SLA 4H_2
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("sla_4h_2") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "z",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Z
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("z") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "roh",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            ROH
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("roh") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "request_meet",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Request MEET
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("request_meet") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "month",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Month
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("month") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "related_ismt",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Related ISMT
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("related_ismt") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "date",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("date") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "cause_code",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Cause Code
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("cause_code") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "reason",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Reason
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("reason") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "rca",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            RCA
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("rca") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "customer_name",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Customer Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("customer_name") as string
                    return value || "-"
                },
                size: 150,
            },
            {
                accessorKey: "sla_before",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            SLA BEFORE
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("sla_before") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "ismt_meet_all",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            ISMT MEET ALL
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("ismt_meet_all") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "link_type",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Link Type
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("link_type") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "related_tt_partner",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Related TT Partner
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("related_tt_partner") as string
                    return value || "-"
                },
                size: 150,
            },
            {
                accessorKey: "class_",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Class
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("class_") as string
                    return value || "-"
                },
                size: 120,
            },
            {
                accessorKey: "problem_category",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Problem Category
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("problem_category") as string
                    return value || "-"
                },
                size: 150,
            },
            {
                accessorKey: "takeout",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Takeout
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const value = row.getValue("takeout") as string
                    return value || "-"
                },
                size: 120,
            },
        ], [])

        const fetchData = async (page = 1, resetPage = false) => {
            setLoading(true)
            setError("")
            try {
                const currentPage = resetPage ? 1 : page
                const response = await axios.get(`${baseUrl}${urlEndpoint}`, {
                    params: {
                        page: currentPage,
                        page_size: meta.page_size,
                        search: globalFilter || undefined,
                        status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
                        link_id: linkId || undefined,
                        link_type: linkType && linkType !== "all" ? (linkType === 'enterprise' ? 'ENTERPRISE' : linkType === 'wholesale' ? 'WHOLESALE' : undefined) : undefined,
                        customer_name: customerName || undefined,
                    }
                })

                setData(response.data.data || response.data)

                // If the API returns pagination metadata
                if (response.data.meta) {
                    setMeta(response.data.meta)
                }

                if (resetPage) {
                    setMeta(prev => ({ ...prev, page: 1 }))
                }
            } catch (error) {
                console.error("Error fetching data:", error)
                setError("Failed to fetch data. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        useImperativeHandle(ref, () => ({
            reloadData: () => {
                fetchData(meta.page)
            }
        }))

        useEffect(() => {
            fetchData(meta.page)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [meta.page, meta.page_size, linkType, customerName, linkId, statusFilter])

        const table = useReactTable({
            data,
            columns,
            state: {
                sorting,
                globalFilter,
                columnVisibility,
                columnSizing,
                rowSelection,
            },
            enableColumnResizing: true,
            columnResizeMode: "onChange" as ColumnResizeMode,
            onColumnSizingChange: setColumnSizing,
            onColumnVisibilityChange: setColumnVisibility,
            onSortingChange: setSorting,
            onGlobalFilterChange: setGlobalFilter,
            onRowSelectionChange: setRowSelection,
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
        })

        return (
            <div className="space-y-4 rounded-lg shadow-md p-10 bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396]">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="Search..."
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="max-w-sm"
                        />
                        <Button
                            onClick={() => fetchData(1, true)}
                            variant="outline"
                        >
                            Search
                        </Button>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                <Settings className="h-4 w-4 mr-2" />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table.getAllColumns()
                                .filter((column) => column.id !== "select")
                                .map((column) => {
                                    // Get the column header label from the column definition
                                    let headerLabel = column.columnDef.header;
                                    if (typeof headerLabel === "function") {
                                        // For the dropdown menu, we'll just use column.id instead of trying to render the header
                                        headerLabel = column.id.charAt(0).toUpperCase() + column.id.slice(1).replace(/_/g, ' ');
                                    } else if (typeof headerLabel !== 'string') {
                                        headerLabel = column.id;
                                    }
                                    return (
                                        <DropdownMenuItem key={column.id}>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                />
                                                <span>{typeof headerLabel === "string" ? headerLabel : column.id}</span>
                                            </div>
                                        </DropdownMenuItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>


                <div className="rounded-md border">
                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <div className="w-full overflow-x-auto">
                            <Table className="relative min-w-[3000px]">
                                <TableHeader className="bg-gray-800">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead
                                                    key={header.id}
                                                    style={{
                                                        width: header.getSize(),
                                                        position: "relative",
                                                    }}
                                                    className="min-w-[120px]"
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    {header.column.getCanResize() && (
                                                        <div
                                                            onMouseDown={header.getResizeHandler()}
                                                            onTouchStart={header.getResizeHandler()}
                                                            className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-gray-300 opacity-0 hover:opacity-100 ${header.column.getIsResizing() ? "bg-blue-500 opacity-100" : ""}`}
                                                        />
                                                    )}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                <div className="flex justify-center items-center">
                                                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                                    Loading...
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : error ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                                                {error}
                                            </TableCell>
                                        </TableRow>
                                    ) : table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                            >
                                                {row.getVisibleCells().map((cell) => {
                                                    // Use cell.getValue() for the raw value, and flexRender for rendering
                                                    const rawValue = cell.getValue();
                                                    const rendered = flexRender(cell.column.columnDef.cell, cell.getContext());
                                                    if (typeof rawValue === 'string' && rawValue !== '-') {
                                                        // Format value for hover: replace 'T' with space if it looks like an ISO date
                                                        let hoverValue = rawValue;
                                                        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(rawValue)) {
                                                            hoverValue = rawValue.replace('T', ' ');
                                                        }
                                                        return (
                                                            <TableCell
                                                                key={cell.id}
                                                                style={{
                                                                    width: cell.column.getSize(),
                                                                    maxWidth: cell.column.getSize(),
                                                                }}
                                                                className="overflow-hidden text-ellipsis whitespace-nowrap"
                                                            >
                                                                <HoverCard>
                                                                    <HoverCardTrigger asChild>
                                                                        <span className="cursor-pointer block overflow-hidden text-ellipsis whitespace-nowrap max-w-full">{rendered}</span>
                                                                    </HoverCardTrigger>
                                                                    <HoverCardContent className="max-w-xs break-words flex flex-row items-start gap-2">
                                                                        <span className="whitespace-pre-line break-words flex-1" style={{ wordBreak: 'break-word' }}>{hoverValue}</span>
                                                                        <button
                                                                            type="button"
                                                                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                                                                            title="Copy"
                                                                            onClick={() => navigator.clipboard.writeText(hoverValue)}
                                                                        >
                                                                            <CopyIcon className="w-4 h-4" />
                                                                        </button>
                                                                    </HoverCardContent>
                                                                </HoverCard>
                                                            </TableCell>
                                                        );
                                                    } else {
                                                        return (
                                                            <TableCell
                                                                key={cell.id}
                                                                style={{
                                                                    width: cell.column.getSize(),
                                                                    maxWidth: cell.column.getSize(),
                                                                }}
                                                                className="overflow-hidden text-ellipsis whitespace-nowrap"
                                                            >
                                                                {rendered}
                                                            </TableCell>
                                                        );
                                                    }
                                                })}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>


                <div className="flex items-center justify-end space-x-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                            Page {meta.page} of {meta.total_pages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (meta.page > 1) {
                                    setMeta(prev => ({ ...prev, page: prev.page - 1 }))
                                }
                            }}
                            disabled={meta.page === 1 || loading}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (meta.page < meta.total_pages) {
                                    setMeta(prev => ({ ...prev, page: prev.page + 1 }))
                                }
                            }}
                            disabled={meta.page === meta.total_pages || loading}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
)

TicketsTable.displayName = "TicketsTable"

export default TicketsTable
