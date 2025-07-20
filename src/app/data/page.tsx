"use client"


import { Loader2 } from "lucide-react";
import { useRef, useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { ProtectedRoute } from "@/components/protected-route"
import TicketsTable, { TicketsTableRef } from "@/components/tickets-table-tanstack";
import { AsyncPaginateSelect } from "@/components/ui/AsyncPaginateSelect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { createLoadOptions } from '@/lib/asyncPaginateHelpers';

const HomePage = () => {
    return (
        <ProtectedRoute>
            <DataPageContent />
        </ProtectedRoute>
    );
};

const DataPageContent = () => {
    const ticketsTableRef = useRef<TicketsTableRef>(null)
    const { user } = useAuth();

    const handleUploadSuccess = () => {
        // Reload the tickets table when upload is successful
        if (ticketsTableRef.current) {
            ticketsTableRef.current.reloadData()
        }
    }

    // Filter states
    const [linkType, setLinkType] = useState<'enterprise' | 'wholesale' | 'all'>('all');
    const [customerName, setCustomerName] = useState('');
    const [linkId, setLinkId] = useState('');
    const [status, setStatus] = useState('all');
    const [filterLoading, setFilterLoading] = useState(false);

    const handleApply = () => {
        setFilterLoading(true);
        if (ticketsTableRef.current) {
            ticketsTableRef.current.reloadData();
        }
        setTimeout(() => setFilterLoading(false), 500); // fake loading for UX
    };

    const handleReset = () => {
        setLinkType('all');
        setCustomerName('');
        setLinkId('');
        setStatus('all');
        setTimeout(() => handleApply(), 0);
    };

    const isFilterActive = linkType !== 'all' || customerName || linkId || status !== 'all';

    return (
        <div className="m-10 space-y-4">
            {user?.role === 'admin' && (
                <FileUploader onUploadSuccess={handleUploadSuccess} />
            )}
            {/* Filter Section */}
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="space-y-2 min-w-[180px]">
                    <Label htmlFor="link-type" className="text-sm font-medium">Link Type</Label>
                    <Select value={linkType} onValueChange={(value: 'enterprise' | 'wholesale' | 'all') => setLinkType(value)}>
                        <SelectTrigger className="w-full min-w-[180px] bg-background">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Link Types</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                            <SelectItem value="wholesale">Partnership</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 min-w-[180px]">
                    <Label htmlFor="customer-name" className="text-sm font-medium">Customer Name</Label>
                    <AsyncPaginateSelect
                        value={customerName ? { label: customerName, value: customerName } : null}
                        onChange={(option) => setCustomerName(option ? option.value : '')}
                        loadOptions={createLoadOptions<{ label: string; value: string }>('http://localhost:8000/search/customer-name')}
                        placeholder="Customer Name"
                        debounceTimeout={400}
                    />
                </div>
                <div className="space-y-2 min-w-[180px]">
                    <Label htmlFor="link-id" className="text-sm font-medium">Link ID</Label>
                    <AsyncPaginateSelect
                        key={customerName || 'no-customer'}
                        value={linkId ? { label: linkId, value: linkId } : null}
                        onChange={(option) => setLinkId(option ? option.value : '')}
                        loadOptions={async (inputValue, loadedOptions, additional) => {
                            const axios = (await import('axios')).default;
                            const page = (additional && typeof additional === 'object' && typeof (additional as { page?: number }).page === 'number')
                                ? (additional as { page: number }).page
                                : 1;
                            let params: Record<string, string | number>;
                            if (customerName && customerName.trim() !== '') {
                                params = {
                                    page: page,
                                    page_size: 10,
                                    q: inputValue || '',
                                    customer_name: customerName
                                };
                            } else {
                                params = {
                                    page: page,
                                    page_size: 10,
                                    q: inputValue || '',
                                };
                            }
                            const res = await axios.get('http://localhost:8000/search/link-id', { params });
                            const data = res.data;
                            const hasMore = typeof data.has_more !== 'undefined'
                                ? data.has_more
                                : (data.results && data.results.length === 10);
                            return {
                                options: data.results || [],
                                hasMore,
                                additional: { page: page + 1 },
                            };
                        }}
                        placeholder="Link ID"
                        debounceTimeout={400}
                    />
                </div>
                <div className="space-y-2 min-w-[180px]">
                    <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full min-w-[180px] bg-background">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Request Parking">Request Parking</SelectItem>
                            <SelectItem value="Resolved Partial by Partner">Resolved Partial by Partner</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col justify-end min-w-[120px] gap-2">

                    <Button onClick={handleApply} disabled={filterLoading} className="text-white bg-[#164396] flex items-center justify-center min-w-20">
                        {filterLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>

                </div>
                <div className="flex flex-col justify-end min-w-[120px] gap-2">

                    {isFilterActive && (
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    )}

                </div>


            </div>
            <div>
                <TicketsTable
                    ref={ticketsTableRef}
                    linkType={linkType}
                    customerName={customerName}
                    linkId={linkId}
                    statusFilter={status}
                />
            </div>
        </div>
    )
}

export default HomePage;
