import { Injectable } from '@nestjs/common';
import { ConfigModel } from './config.model';
import { readFileSync } from 'fs';

@Injectable()
export class ConfigService {
  public readonly config: ConfigModel;
  constructor() {
    const data = readFileSync('config.json', { encoding: 'utf-8' });
    this.config = JSON.parse(data);
  }
}
