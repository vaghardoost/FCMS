export default interface TicketModel {
  id?: string;
  namespace: string;
  admin: string;
  open: boolean;
  title: string;
  messages: {
    from: string;
    content: string;
    attachment?: string;
  }[]
}
