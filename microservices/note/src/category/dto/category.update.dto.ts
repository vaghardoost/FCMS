import { CreateCatDto } from './category.create.dto';

export interface UpdateCatDto extends CreateCatDto {
  id: string;
}
