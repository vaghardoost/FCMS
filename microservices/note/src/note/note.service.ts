import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteModel } from './note.model';
import { RedisNoteService } from '../redis/note.redis.service';
import { NoteUpdateDto } from './dto/note.update.dto';
import { Code, Result, ServiceError } from '../app.result';
import { NoteCreateDto } from './dto/note.create.dto';
import { NoteDeleteDto } from './dto/note.delete.dto';
import { NoteFindDto } from './dto/note.find.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel('note') private readonly noteModel: Model<NoteModel>,
    private readonly redisService: RedisNoteService,
  ) { }

  async refreshRedis(): Promise<Result<number>> {
    const allNotes = await this.noteModel.find<NoteModel>({}).lean();
    await this.redisService.refresh(allNotes);
    return this.successResult(Code.RefreshRedis, 'system refresh successful');
  }

  async create(dto: NoteCreateDto): Promise<Result<NoteModel>> {
    const note: NoteModel = { ...dto, tag: dto.tag ?? [] };
    try {
      const model = new this.noteModel(note);
      await model.save();
      await this.redisService.setNote(model._id.toString(), note);
      return this.successResult(Code.CreateNote, 'new note', { note, id: model._id });
    } catch (error) {
      console.error('internal error', error);
      return ServiceError;
    }
  }

  async list({ namespace }: { namespace: string }): Promise<Result<NoteModel[]>> {
    const result = await this.redisService.getAllNotes(namespace);
    return this.successResult(Code.NoteList, 'note list', result);
  }

  async get({ id, namespace }: NoteFindDto): Promise<Result<any>> {
    try {
      const redisResult = await this.redisService.getNote(id, namespace);
      if (redisResult) {
        return this.successResult(Code.GetNote, 'note founded', redisResult);
      }
      const mongoResult = await this.noteModel.findById<NoteModel>({ _id: id, namespace: namespace }).lean();
      if (mongoResult) {
        await this.redisService.saveExpireable(id, mongoResult);
        const redisResult = await this.redisService.getNote(id, namespace);
        return this.successResult(Code.GetNote, 'note founded', redisResult);
      }
      return this.faildResult(Code.GetNote, 'note not founded')
    } catch (error) {
      console.error('internal error', error);
      return ServiceError;
    }
  }

  async update(dto: NoteUpdateDto): Promise<Result<NoteModel>> {
    try {
      const result: NoteModel = await this.noteModel.findOneAndUpdate<NoteModel>({ _id: dto.id, namespace: dto.namespace }, dto, { new: true }).lean();
      if (result) {
        this.redisService.setNote(dto.id, result);
        return this.successResult(Code.NoteUpdate, 'successful update', result);
      }
      return this.faildResult(Code.NoteUpdate, 'failed update');
    } catch (error) {
      console.error('internal error', error);
      return ServiceError;
    }
  }

  async delete({ id, namespace }: NoteDeleteDto): Promise<Result<NoteModel>> {
    try {
      const result = await this.noteModel.findOneAndDelete({ _id: id, namespace: namespace }, { new: true }).lean();
      if (result) {
        this.redisService.deleteNote(id);
        return this.successResult(Code.NoteDelete, 'note deleted', result);
      }
      return this.faildResult(Code.NoteDelete, 'delete note failed');
    } catch (error) {
      console.error('internal error', error);
      return ServiceError;
    }
  }

  private successResult(code: number, message: string, payload?: any): Result<any> {
    return {
      code: code,
      message: message,
      success: true,
      payload: payload
    }
  }

  private faildResult(code: number, message: string): Result<any> {
    return {
      code: code,
      message: message,
      success: false
    }
  }
}
