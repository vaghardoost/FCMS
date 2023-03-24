import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { NoteModel } from './note.model';
import { RedisNoteService } from '../redis/redis.service.note.';
import { NoteUpdateDto } from './dto/note.update.dto';
import { Code, Result, ServiceError } from '../app.result';
import { NoteCreateDto } from './dto/note.create.dto';
import { NoteDeleteDto } from './dto/note.delete.dto';

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
      await this.redisService.addOrUpdate(model._id.toString(), note);
      return this.successResult(Code.CreateNote, 'new note', { note, id: model._id });
    } catch (error) {
      console.error('internal error', error);
      return ServiceError;
    }
  }

  async list(): Promise<Result<NoteModel[]>> {
    const result = await this.redisService.getAllNotes();
    return this.successResult(Code.NoteList, 'note list', result);
  }

  async get(id: string): Promise<Result<any>> {
    try {
      const redisResult = await this.redisService.getNote(id);
      if (redisResult) {
        return this.successResult(Code.GetNote, 'note founded', redisResult);
      }
      const mongoResult = await this.noteModel.findById<NoteModel>({ _id: id }, { _id: 0 }).lean();
      if (mongoResult) {
        await this.redisService.putOnRedis(id, mongoResult);
        const redisResult = await this.redisService.getNote(id);
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
      const result: NoteModel = await this.noteModel.findOneAndUpdate<NoteModel>({ _id: dto.id }, dto, { projection: { _id: 0 } }).lean();
      if (result) {
        const updatedResult: NoteModel = { ...result, ...dto };
        await this.redisService.addOrUpdate(dto.id, updatedResult);
        return this.successResult(Code.NoteUpdate, 'successful update', updatedResult);
      }
      return this.faildResult(Code.NoteUpdate, 'failed update');
    } catch (error) {
      console.error('internal error', error);
      return ServiceError;
    }
  }

  async delete(dto: NoteDeleteDto): Promise<Result<NoteModel>> {
    try {
      const result = await this.noteModel.findOneAndDelete({ _id: dto.id }, { projection: { _id: 0 } }).lean();
      if (result) {
        await this.redisService.deleteNote(dto.id);
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
