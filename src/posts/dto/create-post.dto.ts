import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @IsNotEmpty()
  paragraphs: string[];

  @IsOptional()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}
