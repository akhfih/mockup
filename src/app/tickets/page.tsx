import Link from "next/link";
import { initialTickets } from "@/data";
import { ticketPath } from "@/paths";

const TICKET_ICONS = {
    OPEN: "O",
    DONE: "X",
    IN_PROGRESS: "<",
}
const TicketsPage = () => {
    return (
        <div>
            {initialTickets.map((ticket) => (
                <div key={ticket.id}>
                    <div className="text-sm">{TICKET_ICONS[ticket.status]}</div>
                    <h2>{ticket.title}</h2>
                    <Link href={ticketPath(ticket.id)} className="text-sm underline">View </Link>
                </div>
    
            ))}
        </div>
    )
}

export default TicketsPage;