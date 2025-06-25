
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const tickets = [
    {

        title: "Ticket 1",
        content: "Description for ticket 1",
        status: "DONE" as const
    },
    {
        title: "Ticket 2",
        content: "Description for ticket 2",
        status: "OPEN" as const
    },
    {
        title: "Ticket 3",
        content: "Description for ticket 3",
        status: "IN_PROGRESS" as const
    },
];

const seed = async () => {
    // for (const ticket of tickets) {
    //     await prisma.ticket.create({
    //         data: ticket,
    //     });
    // }

    // const promise = tickets.map(ticket => {
    //     return prisma.ticket.create({
    //         data: ticket,
    //     });
    // }
    // );

    // await Promise.all(promise);
    const t0 = performance.now();
    console.log("DB Seed: Start");

    await prisma.ticket.deleteMany({});
    await prisma.ticket.createMany({
        data: tickets,
    });

    const t1 = performance.now();
    console.log(`DB Seed: End in ${t1 - t0} milliseconds`);
}

seed();