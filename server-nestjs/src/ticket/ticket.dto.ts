export class CreateTicketDto {
  subject: string;
  description: string;
  status: string;
}

export class UpdateTicketDto {
  subject?: string;
  description?: string;
  status?: string;
}
