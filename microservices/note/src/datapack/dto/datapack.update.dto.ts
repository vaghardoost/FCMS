export default interface DatapackUpdateDto {
  id: string;
  namespace: string
  content?: Array<any>
  title?: string
  env?: any
}