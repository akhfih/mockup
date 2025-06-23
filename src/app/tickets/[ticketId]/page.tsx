import Link from "next/link";
import { Placeholder } from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import { initialTickets } from "@/data";
import { ticketsPath } from "@/paths";


type TicketsPageProps = {
    params: {
        ticketId: string;
    };
};

const TicketsPage = async ({ params }: TicketsPageProps) => {
    const { ticketId } = await params
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
        <div>
            <div>{ticket.status}</div>
            <h2 className="text-lg">{ticket?.title}</h2>
            <p className="text-sm">{ticket?.content}</p>
        </div>
    )
}

export default TicketsPage;