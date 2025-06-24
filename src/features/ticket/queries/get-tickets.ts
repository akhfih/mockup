import { initialTickets } from '@/data';
import { Ticket } from '../types';

export const getTickets = async (): Promise<Ticket[]> => {

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

    // throw new Error('Failed to fetch tickets'); // Placeholder for future implementation

    return new Promise((resolve) => {
        resolve(initialTickets);
    });
};