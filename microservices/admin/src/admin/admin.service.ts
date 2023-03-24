import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AdminModel } from './admin.model';
import { Code, HeaderCode, MicroserviceRes, Result } from '../app.result';
import { AdminDto } from './dto/admin.dto';
import { createHash } from 'crypto';
import { AdminCreateDto } from './dto/admin.create.dto';
import { Role } from './admin.role';
import { RedisAdminService } from 'src/redis/redis.service.admin';
import { AdminInquiryDto } from './dto/admin.inquiry.dto';

@Injectable()
export class AdminService implements OnModuleInit {

  constructor(
    @InjectModel('Admin') private adminModel: Model<AdminModel>,
    private readonly redis: RedisAdminService,
  ) { }

  async onModuleInit() { await this.reload() }

  public async reload(): Promise<MicroserviceRes<any>> {
    this.redis.clear();
    const admins = await this.adminModel.find({}).lean();
    for (const admin of admins) {
      await this.redis.setUser(admin._id.toString(), admin);
    }
    return {
      header: { code: HeaderCode.SUCCESS },
      response: { code: Code.Reload, success: true },
    };
  }

  public async setup(dto: AdminDto): Promise<Result<AdminModel>> {
    const adminExists = await this.redis.isAnyAdminExists();
    if (!adminExists) {
      return await this.create({ ...dto, role: Role.Manager, });
    }
    return {
      code: Code.Create,
      success: false,
    };
  }

  public async create(dto: AdminCreateDto): Promise<Result<AdminModel>> {
    const unExists = await this.redis.checkUsername(dto.username);
    if (unExists) {
      return { code: Code.Create, success: false };
    }
    const adminModel: AdminModel = {
      password: createHash('sha256').update(dto.password).digest('hex'),
      role: dto.role,
      username: dto.username,
    };
    const model = new this.adminModel(adminModel);
    const { _id, username, role } = await model.save();
    await this.redis.setUser(_id.toString(), adminModel);
    return {
      code: Code.Create, success: true,
      payload: { id: _id.toString(), username: username, role: role }
    };
  }

  public async inquiry(dto: AdminInquiryDto) {
    const { username } = dto;
    const admin = await this.redis.checkUsername(username);
    return (admin)
      ? this.successResult(Code.Inquiry, admin)
      : this.faildResult(Code.Inquiry)
  }

  private successResult(code: number, payload?: any): Result<any> {
    return {
      code: code,
      success: true,
      payload: payload
    }
  }

  private faildResult(code: number): Result<any> {
    return {
      code: code,
      success: false
    }
  }

}
