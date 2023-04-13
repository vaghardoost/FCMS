export default interface TicketPushDto {
  id: string;
  from: string;
  content: string;
  attachment?: string;
}