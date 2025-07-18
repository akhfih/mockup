"use client"


import { useRef } from "react"
import { FileUploader } from "@/components/file-uploader"
import { ProtectedRoute } from "@/components/protected-route"
import TicketsTable, { TicketsTableRef } from "@/components/tickets-table";
import { useAuth } from '@/contexts/AuthContext';

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

    return (
        <div className="m-10">
            {user?.role === 'admin' && (
                <FileUploader onUploadSuccess={handleUploadSuccess} />
            )}
            <div>
                <TicketsTable ref={ticketsTableRef} />
            </div>
        </div>
    )
}

export default HomePage;
