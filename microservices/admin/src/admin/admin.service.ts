import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AdminModel } from './admin.model';
import { Code, HeaderCode, MicroserviceRes, Result } from '../app.result';
import { AdminDto } from './dto/admin.dto';
import { createHash } from 'crypto';
import { AdminCreateDto } from './dto/admin.create.dto';
import { Role } from './admin.role';

@Injectable()
export class AdminService implements OnModuleInit {
  private indexID = 0;

  constructor(
    @InjectModel('Admin') private adminModel: Model<AdminModel>,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    this.adminModel
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .then((doc) => {
        if (doc.length > 0) this.indexID = doc[0]['id'];
      });
    await this.reload();
  }

  public async reload(): Promise<MicroserviceRes<any>> {
    const admins = await this.adminModel.find<AdminModel>({}, { _id: 0 });
    const result = [];
    for (const admin of admins) {
      result.push(await this.redisService.addUser(admin['id'], admin));
    }
    return {
      header: { code: HeaderCode.SUCCESS },
      response: { code: Code.Reload, success: true, payload: result },
    };
  }

  public async setup(dto: AdminDto): Promise<Result<AdminModel>> {
    await this.reload();
    const adminExists = await this.redisService.isAnyAdminExists();
    if (!adminExists) {
      return await this.create({ ...dto, role: Role.Manager });
    }
    return {
      code: Code.Create,
      success: false,
    };
  }

  public async create(dto: AdminCreateDto): Promise<Result<AdminModel>> {
    const unExists = await this.redisService.checkUsername(dto.username);
    if (unExists) {
      return {
        code: Code.Create,
        success: false,
      };
    }
    const adminModel: AdminModel = {
      id: ++this.indexID,
      password: this.hash(dto.password),
      role: dto.role,
      username: dto.username,
    };
    const model = new this.adminModel(adminModel);
    const { id, username, role } = await model.save();
    await this.redisService.addUser(id, adminModel);
    return {
      code: Code.Create,
      success: true,
      payload: { id: id, username: username, role: role },
    };
  }

  public async inquiry(dto: AdminDto): Promise<MicroserviceRes<any>> {
    const { username, password } = dto;
    const hash = this.hash(password);
    const admin = await this.redisService.checkUsername(username);
    let result = false;
    if (admin) {
      result = admin.password === hash;
    }
    return {
      header: {
        code: result ? HeaderCode.SUCCESS : HeaderCode.NOT_EXISTS,
      },
    };
  }

  private hash(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }
}
