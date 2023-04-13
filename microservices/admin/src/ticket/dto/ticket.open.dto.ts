export default interface TicketOpenDto {
  title: string;
  namespace: string;
  admin: string;
  message: {
    from: string;
    content: string;
    attachment?: string;
  }
}