import Link from "next/link";
import React from "react";
import { Placeholder } from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import { initialTickets } from "@/data";
import { TicketItem } from "@/features/ticket/components/ticket-item";
import { ticketsPath } from "@/paths";


type TicketsPageProps = {
    params: {
        ticketId: string;
    };
};

const TicketsPage = async ({ params }: TicketsPageProps) => {
    const {ticketId} = await params;
    const ticket = initialTickets.find((ticket) => ticket.id === ticketId);

    if (!ticket) {
        return (
            <div className="flex-1 flex">
                <Placeholder
                    label="Ticket not found"
                    button={
                        <Button asChild variant="outline">
                            <Link href={ticketsPath()}>Go to tickets</Link>
                        </Button>
                    } />
                <Placeholder
                    label="Ticket not found"
                    />
            </div>
        )

    }
    return (
        <div className="flex justify-center animate-fade-in-from-top">
            <TicketItem ticket={ticket} isDetail />
        </div>
    )
}

export default TicketsPage;