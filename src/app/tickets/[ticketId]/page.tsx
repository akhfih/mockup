import Link from "next/link";
import React from "react";
import { Placeholder } from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import { TicketItem } from "@/features/ticket/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { ticketsPath } from "@/paths";


// type TicketsPageProps = {
//     params: Promise<{
//         ticketId: string;
//     }>;
// };

const TicketsPage = async (props: { params: Promise<{ ticketId: string }> }) => {
    const params = await props.params;
    const ticket = await getTicket(params.ticketId);

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