import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { existsSync, mkdirSync, statSync } from "fs";
import { join } from "path";
import { Code } from "src/app.result";
import { Result } from "src/app.result";

@Injectable()
export default class AdminService {

  constructor(private readonly configService: ConfigService) { }

  createNamespace(namespace: string): Result<boolean> {
    const list = [
      this.configService.get<string>('PHOTO_PATH'),
      this.configService.get<string>('AUDIO_PATH'),
      this.configService.get<string>('VIDEO_PATH'),
      this.configService.get<string>('DOC_PATH'),
    ]

    list.forEach(dir => {
      const exists = existsSync(dir);
      const directory = join('file', namespace, dir)
      if (!exists) {
        mkdirSync(directory, { recursive: true });
      }
    });

    return {
      code: Code.CreateNamespace,
      success: true
    }
  }

  metadata(namespace: string): Result<number> {
    const stats = statSync(`file/${namespace}`, { throwIfNoEntry: false });
    return {
      code: Code.Storage,
      success: true,
      payload: stats.size
    }
  }

}