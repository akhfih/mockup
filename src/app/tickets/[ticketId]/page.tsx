import { initialTickets } from "@/data";


type TicketsPageProps = {
    params: {
        ticketId: string;
    };
};

const TicketsPage = ({ params }: TicketsPageProps) => {
    const ticket = initialTickets.find((ticket) => ticket.id.toString() === params.ticketId);

    if (!ticket) {
        return <div className="text-red-500">Ticket not found</div>;
    }
    return (
        <div>
            <h2 className="text-lg">{ticket?.title}</h2>
            <p className="text-sm">{ticket?.content}</p>
        </div>
    )
}

export default TicketsPage;