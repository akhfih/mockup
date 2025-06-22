
type TicketsPageProps = {
    params: {
        ticketId: string;
    };
};

const TicketsPage = ({ params } : TicketsPageProps) => {
    return <h2 className="text-lg">Tickets Page {params.ticketId}</h2>
}

export default TicketsPage;