export interface AppConfig{
    name:string
    port:number
    jwt:{
        secret:string
        ttl:number
    }
    kafka:{
        brokers:string[]
        consumer:string
    }
}