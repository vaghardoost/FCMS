# FCMS
**(Farhang CMS) is a backend system base on microservice architecture written with nestjs framework** 

In this backend system , use a **REST API GATE** for communication  and another rest api for upload and download files as **FILE CDN**

the microservices (*if they need*) has own api routes (*as controller*) inside gate and with this they can work

every part of this system *(api gates or microservices)* has a `config.json` file and you according to the conditions you have and service set data for starting

it is recommend for execute that use **docker** and **docker-compose** but if you don't like docker *(that I suggest you think more)* you can run that with node js compiler

## Microservices
every microservice has a purpose here and it's could be need another microservice for example **file gate** need admin microservice and it's necessary.or note service *(in another repository)* need admin microservice.

every microservice in Readme.md file has a guide table. for every part run `npm install` to download reqirement library

wip for a microservice or somthing that mean **(work in progress)**
## Rocmmends

for this system you need some anther system and execute that
  - Node Js (compiler)
  - Apache Kafka (message broker)
  - MongoDB (database of some microservices)
  - Redis (cache database)

Name|Role|Link|Icon
---|---|---|---
Node.js|compiler|<a href="https://nodejs.org/">https://nodejs.org/</a>|<img src="nodejs.png" width="100"/>
Apache Kafka|message broker|<a href="https://kafka.apache.org/">https://kafka.apache.org</a>|<img src="kafka.png" width="100"/>
MongoDB|database|<a href="https://www.mongodb.com/docs/">https://www.mongodb.com/docs/</a>|<img src="mongodb.png" width="100"/>
Redis|cache database|<a href="https://redis.io/">https://redis.io</a>|<img src="redis.svg" width="100"/>

clone or fork this. I will be very happy , if you tell me your opinion about this system with <a href="https://telegram.me/vaghardoost">my telegram account</a>

this system create by **farhang vaghardoost** **(فرهنگ وقردوست)**

#زن_زندگی_آزادی
