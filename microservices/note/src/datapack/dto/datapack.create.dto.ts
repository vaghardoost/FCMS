export default interface DatapackCreateDto {
  namespace: string
  author: string
  content: Array<any>
  title: string
  env?: any
}
