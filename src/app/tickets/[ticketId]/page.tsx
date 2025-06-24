
import { notFound } from "next/navigation";
import React from "react";
import { TicketItem } from "@/features/ticket/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";


const TicketsPage = async (props: { params: Promise<{ ticketId: string }> }) => {
    const params = await props.params;
    const ticket = await getTicket(params.ticketId);

    if (!ticket) {
        notFound();

    }
    return (
        <div className="flex justify-center animate-fade-in-from-top">
            <TicketItem ticket={ticket} isDetail />
        </div>
    )
}

export default TicketsPage;