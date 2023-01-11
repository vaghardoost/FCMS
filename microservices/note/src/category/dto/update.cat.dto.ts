import { CreateCatDto } from './create.cat.dto';

export interface UpdateCatDto extends CreateCatDto {
  id: string;
}
