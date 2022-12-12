import { Injectable } from '@nestjs/common';
import { readFileSync } from "fs";
import { AppConfig } from './config.model';

@Injectable()
export class ConfigService {
    public readonly config:AppConfig;

    constructor(){
        const data:string = readFileSync("config.json",{encoding:"utf-8"});
        this.config  = JSON.parse(data);
    }
    
}
