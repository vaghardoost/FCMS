import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteModel } from './note.model';
import { RedisNoteService } from '../redis/redis.service.note.';
import { NoteUpdateDto } from './dto/note.update.dto';
import { Code, Result, ServiceError } from '../app.result';
import { NoteCreateDto } from './dto/note.create.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel('note') private readonly noteModel: Model<NoteModel>,
    private readonly redisService: RedisNoteService,
  ) {}

  async refreshRedis(): Promise<Result<number>> {
    const allNotes = await this.noteModel
      .find<NoteModel>({}, { _id: 0 })
      .lean();
    const result = await this.redisService.refresh(allNotes);
    return {
      code: Code.RefreshRedis,
      message: 'refresh note on redis',
      success: true,
      payload: result,
    };
  }

  async create(dto: NoteCreateDto): Promise<Result<NoteModel>> {
    const note: NoteModel = {
      ...dto,
      id: randomUUID(),
      tag: dto.tag ?? [],
      createAt: Date.now().toString(),
    };
    try {
      const model = new this.noteModel(note);
      await model.save();
      await this.redisService.addOrUpdate(note);
    } catch (error) {
      console.error('internal error',error);
      return ServiceError;
    }
    return {
      code: Code.CreateNote,
      message:'note has been saved',
      success: true,
      payload: note,
    };
  }

  async list(): Promise<Result<NoteModel[]>> {
    const result = await this.redisService.getAllNotes();
    return {
      code: Code.NoteList,
      message: 'all note list',
      success: true,
      payload: result,
    };
  }

  async get(id: string): Promise<Result<any>> {
    const redisResult = await this.redisService.getNote(id);
    if (redisResult) {
      return {
        code: Code.GetNote,
        success: true,
        message: 'find note',
        payload: redisResult,
      };
    }
    const mongoResult = await this.noteModel
      .findOne<NoteModel>({ id: id }, { _id: 0 })
      .lean();
    if (mongoResult) {
      await this.redisService.putOnRedis(mongoResult);
      return {
        code: Code.GetNote,
        success: true,
        message: 'find a note',
        payload: mongoResult,
      };
    }
    return {
      code: Code.GetNote,
      success: false,
      message: 'this note with this id not founded',
    };
  }

  async update(noteUpdateDto: NoteUpdateDto): Promise<Result<NoteModel>> {
    try {
      const result: NoteModel = await this.noteModel
        .findOneAndUpdate<NoteModel>({ id: noteUpdateDto.id }, noteUpdateDto, {
          projection: { _id: 0 },
        }).lean();
        if (result) {
          const updatedResult: NoteModel = {
            ...result,
            ...noteUpdateDto,
          };
          await this.redisService.addOrUpdate(updatedResult);
          return {
            code: Code.NoteUpdate,
            message: 'note updated',
            success: true,
            payload: updatedResult,
          };
        }
        return {
          code: Code.NoteUpdate,
          message: 'note not founded',
          success: false,
        };
    } catch (error) {
      console.error('internal error',error);
      return ServiceError;
    }
  }

  async delete(id: string): Promise<Result<NoteModel>> {
    try {
      const result = await this.noteModel.findOneAndDelete(
        { id: id },
        { projection: { _id: 0 }, lean: true },
      );
      if (result) {
        await this.redisService.deleteNote(id);
        return {
          code: Code.NoteDelete,
          message: 'note deleted',
          success: true,
          payload: result,
        };
      }
      return {
        code: Code.NoteDelete,
        message: 'note note founded',
        success: false,
      };
    } catch (error) {
      console.error('internal error',error);
      return ServiceError;
    }
  }
}
