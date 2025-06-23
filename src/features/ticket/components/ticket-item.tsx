import { LucideSquareArrowOutUpRight } from "lucide-react";
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ticketPath } from "@/paths"
import { TICKET_ICONS } from "../constants"
import { Ticket } from "../types";

type TicketItemProps = {
    ticket: Ticket;
};

const TicketItem = ({ ticket }: TicketItemProps) => {
    const detailButton = (
        <Button variant="outline" size="icon" asChild>
            <Link href={ticketPath(ticket.id)}>
                <LucideSquareArrowOutUpRight className="h-4 w-4" />
            </Link>
        </Button>
    )
    return (
        <div className="w-full max-w-[420px] flex gap-x-1">
            <Card key={ticket.id} className="w-full">
                <CardHeader>
                    <CardTitle className="flex gap-x-2">
                        <span className="">{TICKET_ICONS[ticket.status]}</span>
                        <span className="truncate">{ticket.title}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <span className="line-clamp-3 whitespace-break-spaces">{ticket.content}</span>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-y-1">
                {detailButton}                
            </div>
        </div>
    )
}

export { TicketItem };