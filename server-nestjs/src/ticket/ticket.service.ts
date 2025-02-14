import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto, UpdateTicketDto } from './ticket.dto';

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: string;
}

@Injectable()
export class TicketService {
  private tickets: Ticket[] = [
    { id: 1, subject: 'Login Issue', description: 'Cannot login to system', status: 'open' },
    { id: 2, subject: 'Payment Error', description: 'Payment gateway not working', status: 'open' },
  ];

  findAll(): Ticket[] {
    return this.tickets;
  }

  findOne(id: number): Ticket {
    const ticket = this.tickets.find((t) => t.id === id);
    if (!ticket) {
      throw new NotFoundException(`Ticket #${id} not found`);
    }
    return ticket;
  }

  create(dto: CreateTicketDto): Ticket {
    const id = this.tickets.length
      ? this.tickets[this.tickets.length - 1].id + 1
      : 1;
    const newTicket: Ticket = { id, ...dto };
    this.tickets.push(newTicket);
    return newTicket;
  }

  update(id: number, dto: UpdateTicketDto): Ticket {
    const ticket = this.findOne(id);
    const updatedTicket = { ...ticket, ...dto };
    this.tickets = this.tickets.map((t) => (t.id === id ? updatedTicket : t));
    return updatedTicket;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.tickets = this.tickets.filter((t) => t.id !== id);
    return { deleted: true };
  }
}
