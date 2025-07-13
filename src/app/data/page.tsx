"use client"

import { useRef } from "react"
import { FileUploader } from "@/components/file-uploader"
import TicketsTable, { TicketsTableRef } from "@/components/tickets-table";

const HomePage = () => {
    const ticketsTableRef = useRef<TicketsTableRef>(null)

    const handleUploadSuccess = () => {
        // Reload the tickets table when upload is successful
        if (ticketsTableRef.current) {
            ticketsTableRef.current.reloadData()
        }
    }

    return (
        <div className="m-10">
            <FileUploader onUploadSuccess={handleUploadSuccess} />
            <div className="mt-10">
                <TicketsTable ref={ticketsTableRef} />
            </div>
        </div>
    )
}

export default HomePage;
