import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export default class FindOneParams {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;
}
